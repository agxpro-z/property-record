/*
 * SPDX-License-Identifier: Apache-2.0
 */

import { logger } from './logger';
import passport from 'passport';
import { NextFunction, Request, Response } from 'express';
import { HeaderAPIKeyStrategy } from 'passport-headerapikey';
import { StatusCodes, getReasonPhrase } from 'http-status-codes';
import * as config from './config';
import jwt from 'jsonwebtoken';

const { UNAUTHORIZED } = StatusCodes;

export const fabricAPIKeyStrategy: HeaderAPIKeyStrategy =
  new HeaderAPIKeyStrategy(
    { header: 'X-API-Key', prefix: '' },
    false,
    function (apikey, done) {
      logger.debug({ apikey }, 'Checking X-API-Key');
      if (apikey === config.org1ApiKey) {
        const user = config.mspIdOrg1;
        logger.debug('User set to %s', user);
        done(null, user);
      } else if (apikey === config.org2ApiKey) {
        const user = config.mspIdOrg2;
        logger.debug('User set to %s', user);
        done(null, user);
      } else {
        logger.debug({ apikey }, 'No valid X-API-Key');
        return done(null, false);
      }
    }
  );

export const authenticateApiKey = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  passport.authenticate(
    'headerapikey',
    { session: true },
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (err: any, user: Express.User, _info: any) => {
      if (err)
        return next(err);

      if (req.cookies.session_token === undefined && !user) {
        return res.status(401).json({
          status: getReasonPhrase(UNAUTHORIZED),
          reason: 'NO_SESSION or NO_VALID_APIKEY',
          timestamp: new Date().toISOString(),
        });
      } else if (req.cookies.session_token !== undefined) {
        try {
          const data = jwt.verify(req.cookies.session_token, config.jwtSecret);
          req.user = (data as { email: string; iat: number })['email'];
        } catch (error) {
          req.user = undefined;
          return res.status(401).json({
            status: getReasonPhrase(UNAUTHORIZED),
            reason: 'INVALID_SESSION',
            timestamp: new Date().toISOString(),
          });
        }
      } else {
        req.logIn(user, { session: false }, async (err) => {
          if (err) {
            return next(err);
          }
        });
      }
      return next();
    }
  )(req, res, next);
};
