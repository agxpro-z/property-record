import express, { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import FabricCAServices from 'fabric-ca-client';
import { Wallet, X509Identity } from 'fabric-network';
import { User } from './models/users';
import jwt from 'jsonwebtoken';

export const usersRouter = express.Router();

// Login a user
usersRouter.post('/login', async (req: Request, res: Response) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    console.log(`User not found: ${email}`);
    return res.status(404).json({
      status: 'NOT_FOUND',
      message: 'User not found',
    });
  }

  bcrypt.compare(password, user.password as string, (err, result) => {
    if (err)
      return res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to compare passwords',
      });

    if (result) {
      const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET as string);
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 10),
      });
      res.send(user);
    } else {
      res.status(401).json({
        status: 'UNAUTHORIZED',
        message: 'Invalid password',
      });
    }
  });
});

// Logout a user
usersRouter.post('/logout', async (_req: Request, res: Response) => {
  res.clearCookie('session_token');
  res.send('Logged out');
});

// Register a new user
usersRouter.post('/register', async (req: Request, res: Response) => {
  const { firstName, lastName, email, password, org }: {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    org: string
  } = req.body;
  const wallet = req.app.locals.wallet as Wallet;

  const user = await User.findOne({ email });
  if (user) {
    console.log(`User already exists: ${email}`);
    return res.status(400).json({
      status: 'BAD_REQUEST',
      message: `User already exists: ${email}`,
    });
  }

  bcrypt.genSalt(10, (err, salt) => {
    if (err)
      return res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: 'Failed to generate salt',
      });

    bcrypt.hash(password, salt, async (err, hash) => {
      if (err)
        return res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: 'Failed to hash password',
        });

      // Create a new user in the database
      await User.create({
        firstName,
        lastName,
        email,
        password: hash,
        orgId: org,
        mspId: org + 'MSP',
      });

      // Save the user in the wallet.
      try {
        const userIdentity = await wallet.get(email);
        if (userIdentity) {
          console.log(
            `An identity for the user ${email} already exists in the wallet`
          );
          return res.status(400).json({
            status: 'BAD_REQUEST',
            message: 'An identity for the user already exists in the wallet',
          });
        }

        const adminIdentity = await wallet.get(org + "MSP");
        if (!adminIdentity) {
          console.log(
            'An identity for the admin user does not exist in the wallet'
          );
          console.log('Run the enrollAdmin.ts application before retrying');
          return res.status(500).json({
            status: 'INTERNAL_SERVER_ERROR',
            message: 'An identity for the admin user does not exist in the wallet',
          });
        }

        const provider = wallet.getProviderRegistry().getProvider(adminIdentity.type);
        const adminUser = await provider.getUserContext(adminIdentity, org + "MSP");

        const caURL = res.app.locals[org + "CCP"].certificateAuthorities[`ca.${org.toLowerCase()}.example.com`].url;
        const ca = new FabricCAServices(caURL);

        const secret = await ca.register(
          {
            affiliation: `${org.toLowerCase()}.department1`,
            enrollmentID: email,
            enrollmentSecret: hash,
            role: 'client',
          },
          adminUser
        );

        const enrollment = await ca.enroll({
          enrollmentID: email,
          enrollmentSecret: secret,
        });

        const userIdentityX509: X509Identity = {
          credentials: {
            certificate: enrollment.certificate,
            privateKey: enrollment.key.toBytes(),
          },
          mspId: org + 'MSP',
          type: 'X.509',
        };

        await wallet.put(email, userIdentityX509);
        console.log(
          `Successfully registered and enrolled user ${email} and imported it into the wallet`
        );
      } catch (error) {
        console.error(`Failed to register user ${email}: ${error}`);
        res.status(500).json({
          status: 'INTERNAL_SERVER_ERROR',
          message: `Failed to register user ${email}`,
        });
      }

      const sessionToken = jwt.sign({ email }, process.env.JWT_SECRET as string);
      res.cookie('session_token', sessionToken, {
        httpOnly: true,
        // secure: process.env.NODE_ENV === 'production',
        // sameSite: 'strict',
        expires: new Date(Date.now() + 1000 * 60 * 10),
      });

      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
      });
    });
  });
});
