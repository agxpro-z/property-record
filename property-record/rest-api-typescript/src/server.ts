/*
 * SPDX-License-Identifier: Apache-2.0
 */

import express, { Application, NextFunction, Request, Response } from 'express';
import helmet from 'helmet';
import { getReasonPhrase, StatusCodes } from 'http-status-codes';
import passport from 'passport';
import pinoMiddleware from 'pino-http';
import { assetsRouter } from './assets.router';
import { authenticateApiKey, fabricAPIKeyStrategy } from './auth';
import { healthRouter } from './health.router';
import { jobsRouter } from './jobs.router';
import { logger } from './logger';
import { transactionsRouter } from './transactions.router';
import { Wallet, X509Identity } from 'fabric-network';
import cors from 'cors';
import FabricCAServices from 'fabric-ca-client';
import * as config from './config';

const { BAD_REQUEST, INTERNAL_SERVER_ERROR, NOT_FOUND } = StatusCodes;

export const createServer = async (): Promise<Application> => {
  const app = express();

  app.use(
    pinoMiddleware({
      logger,
      customLogLevel: function customLogLevel(res, err) {
        if (
          res.statusCode >= BAD_REQUEST &&
          res.statusCode < INTERNAL_SERVER_ERROR
        ) {
          return 'warn';
        }

        if (res.statusCode >= INTERNAL_SERVER_ERROR || err) {
          return 'error';
        }

        return 'debug';
      },
    })
  );

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // define passport startegy
  passport.use(fabricAPIKeyStrategy);

  // initialize passport js
  app.use(passport.initialize());

  if (process.env.NODE_ENV === 'development') {
    app.use(cors());
  }

  if (process.env.NODE_ENV === 'test') {
    // TBC
  }

  if (process.env.NODE_ENV === 'production') {
    app.use(helmet());
  }

  app.use('/', healthRouter);
  app.use('/api/assets', authenticateApiKey, assetsRouter);
  app.use('/api/jobs', authenticateApiKey, jobsRouter);
  app.use('/api/transactions', authenticateApiKey, transactionsRouter);

  app.post('/api/register', async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const wallet = app.locals.wallet as Wallet;

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

      const adminIdentity = await wallet.get(config.mspIdOrg5);
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
      const adminUser = await provider.getUserContext(adminIdentity, config.mspIdOrg5);

      const caURL = app.locals['Org5CCP'].certificateAuthorities['ca.org5.example.com'].url;
      const ca = new FabricCAServices(caURL);

      const secret = await ca.register(
        {
          affiliation: 'org5.department1',
          enrollmentID: email,
          enrollmentSecret: password,
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
        mspId: config.mspIdOrg5,
        type: 'X.509',
      };

      await wallet.put(email, userIdentityX509);
      console.log(
        `Successfully registered and enrolled user ${email} and imported it into the wallet`
      );

      res.status(200).json({
        status: 'OK',
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Failed to register user ${email}: ${error}`);
      res.status(500).json({
        status: 'INTERNAL_SERVER_ERROR',
        message: `Failed to register user ${email}`,
      });
    }
  });

  // For everything else
  app.use((_req, res) =>
    res.status(NOT_FOUND).json({
      status: getReasonPhrase(NOT_FOUND),
      timestamp: new Date().toISOString(),
    })
  );

  // Print API errors
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    logger.error(err);
    return res.status(INTERNAL_SERVER_ERROR).json({
      status: getReasonPhrase(INTERNAL_SERVER_ERROR),
      timestamp: new Date().toISOString(),
    });
  });

  return app;
};
