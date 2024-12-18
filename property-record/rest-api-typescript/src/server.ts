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
import { usersRouter } from './users.router';
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

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
  app.use(express.static(path.join(__dirname, 'public')));

  // define passport startegy
  passport.use(fabricAPIKeyStrategy);

  // initialize passport js
  app.use(passport.initialize());

  app.use(cookieParser());

  if (process.env.NODE_ENV === 'development') {
    app.use(cors({
      origin: process.env.CLIENT_URL!,
      credentials: true,
    }));
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
  app.use('/api/users', usersRouter);
  app.get('/api', authenticateApiKey, (_req, res) => {
    res.status(StatusCodes.OK).json({
      status: getReasonPhrase(StatusCodes.OK),
      timestamp: new Date().toISOString(),
    });
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
