/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * This is the main entrypoint for the sample REST server, which is responsible
 * for connecting to the Fabric network and setting up a job queue for
 * processing submit transactions
 */

import * as config from './config';
import {
  createGateway,
  createWallet,
  getContracts,
  getNetwork,
} from './fabric';
import {
  initJobQueue,
  initJobQueueScheduler,
  initJobQueueWorker,
} from './jobs';
import { logger } from './logger';
import { createServer } from './server';
import { isMaxmemoryPolicyNoeviction } from './redis';
import { Queue, QueueScheduler, Worker } from 'bullmq';

let jobQueue: Queue | undefined;
let jobQueueWorker: Worker | undefined;
let jobQueueScheduler: QueueScheduler | undefined;

async function main() {
  logger.info('Checking Redis config');
  if (!(await isMaxmemoryPolicyNoeviction())) {
    throw new Error(
      'Invalid redis configuration: redis instance must have the setting maxmemory-policy=noeviction'
    );
  }

  logger.info('Creating REST server');
  const app = await createServer();

  logger.info('Connecting to Fabric network with org1 mspid');
  const wallet = await createWallet(app);
  app.locals.wallet = wallet;

  logger.info('Connecting to Fabric network');
  const gatewayOrg1 = await createGateway(
    app.locals['Org1CCP'],
    config.mspIdOrg1,
    wallet
  );
  const networkOrg1 = await getNetwork(gatewayOrg1);
  const contractsOrg1 = await getContracts(networkOrg1);

  app.locals[config.mspIdOrg1] = contractsOrg1;

  logger.info('Connecting to Fabric network with org2 mspid');
  const gatewayOrg2 = await createGateway(
    app.locals['Org2CCP'],
    config.mspIdOrg2,
    wallet
  );
  const networkOrg2 = await getNetwork(gatewayOrg2);
  const contractsOrg2 = await getContracts(networkOrg2);

  app.locals[config.mspIdOrg2] = contractsOrg2;

  logger.info('Connecting to Fabric network with org3 mspid');
  const gatewayOrg3 = await createGateway(
    app.locals['Org3CCP'],
    config.mspIdOrg3,
    wallet
  );
  const networkOrg3 = await getNetwork(gatewayOrg3);
  const contractsOrg3 = await getContracts(networkOrg3);

  app.locals[config.mspIdOrg3] = contractsOrg3;

  logger.info('Connecting to Fabric network with org4 mspid');
  const gatewayOrg4 = await createGateway(
    app.locals['Org4CCP'],
    config.mspIdOrg4,
    wallet
  );
  const networkOrg4 = await getNetwork(gatewayOrg4);
  const contractsOrg4 = await getContracts(networkOrg4);

  app.locals[config.mspIdOrg4] = contractsOrg4;

  logger.info('Connecting to Fabric network with org5 mspid');
  const gatewayOrg5 = await createGateway(
    app.locals['Org5CCP'],
    config.mspIdOrg5,
    wallet
  );
  const networkOrg5 = await getNetwork(gatewayOrg5);
  const contractsOrg5 = await getContracts(networkOrg5);

  app.locals[config.mspIdOrg5] = contractsOrg5;

  logger.info('Initialising submit job queue');
  jobQueue = initJobQueue();
  jobQueueWorker = initJobQueueWorker(app);
  if (config.submitJobQueueScheduler === true) {
    logger.info('Initialising submit job queue scheduler');
    jobQueueScheduler = initJobQueueScheduler();
  }
  app.locals.jobq = jobQueue;

  logger.info('Starting REST server');
  app.listen(config.port, () => {
    logger.info('REST server started on port: %d', config.port);
  });
}

main().catch(async (err) => {
  logger.error({ err }, 'Unxepected error');

  if (jobQueueScheduler != undefined) {
    logger.debug('Closing job queue scheduler');
    await jobQueueScheduler.close();
  }

  if (jobQueueWorker != undefined) {
    logger.debug('Closing job queue worker');
    await jobQueueWorker.close();
  }

  if (jobQueue != undefined) {
    logger.debug('Closing job queue');
    await jobQueue.close();
  }
});
