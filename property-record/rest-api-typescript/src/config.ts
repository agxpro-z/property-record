/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The sample REST server can be configured using the environment variables
 * documented below
 *
 * In a local development environment, these variables can be loaded from a
 * .env file by starting the server with the following command:
 *
 *   npm start:dev
 *
 * The scripts/generateEnv.sh script can be used to generate a suitable .env
 * file for the Fabric Test Network
 */

import * as env from 'env-var';

export const ORG1 = 'Org1';
export const ORG2 = 'Org2';
export const ORG3 = 'Org3';
export const ORG4 = 'Org4';
export const ORG5 = 'Org5';

export const JOB_QUEUE_NAME = 'submit';

/**
 * Log level for the REST server
 */
export const logLevel = env
  .get('LOG_LEVEL')
  .default('info')
  .asEnum(['fatal', 'error', 'warn', 'info', 'debug', 'trace', 'silent']);

/**
 * The port to start the REST server on
 */
export const port = env
  .get('PORT')
  .default('5000')
  .example('5000')
  .asPortNumber();

/**
 * The type of backoff to use for retrying failed submit jobs
 */
export const submitJobBackoffType = env
  .get('SUBMIT_JOB_BACKOFF_TYPE')
  .default('fixed')
  .asEnum(['fixed', 'exponential']);

/**
 * Backoff delay for retrying failed submit jobs in milliseconds
 */
export const submitJobBackoffDelay = env
  .get('SUBMIT_JOB_BACKOFF_DELAY')
  .default('3000')
  .example('3000')
  .asIntPositive();

/**
 * The total number of attempts to try a submit job until it completes
 */
export const submitJobAttempts = env
  .get('SUBMIT_JOB_ATTEMPTS')
  .default('5')
  .example('5')
  .asIntPositive();

/**
 * The maximum number of submit jobs that can be processed in parallel
 */
export const submitJobConcurrency = env
  .get('SUBMIT_JOB_CONCURRENCY')
  .default('5')
  .example('5')
  .asIntPositive();

/**
 * The number of completed submit jobs to keep
 */
export const maxCompletedSubmitJobs = env
  .get('MAX_COMPLETED_SUBMIT_JOBS')
  .default('1000')
  .example('1000')
  .asIntPositive();

/**
 * The number of failed submit jobs to keep
 */
export const maxFailedSubmitJobs = env
  .get('MAX_FAILED_SUBMIT_JOBS')
  .default('1000')
  .example('1000')
  .asIntPositive();

/**
 * Whether to initialise a scheduler for the submit job queue
 * There must be at least on queue scheduler to handle retries and you may want
 * more than one for redundancy
 */
export const submitJobQueueScheduler = env
  .get('SUBMIT_JOB_QUEUE_SCHEDULER')
  .default('true')
  .example('true')
  .asBoolStrict();

/**
 * Whether to convert discovered host addresses to be 'localhost'
 * This should be set to 'true' when running a docker composed fabric network on the
 * local system, e.g. using the test network; otherwise should it should be 'false'
 */
export const asLocalhost = env
  .get('AS_LOCAL_HOST')
  .default('true')
  .example('true')
  .asBoolStrict();

/**
 * MongoDB connection string
 */
export const mongoUri = env
  .get('MONGO_URI')
  .required()
  .example('mongodb://localhost:27017')
  .asString();

/**
 * JWT secret for signing and verifying tokens
 */
export const jwtSecret = env
  .get('JWT_SECRET')
  .required()
  .example('secret')
  .asString();

  /**
   * Client URL for CORS
   */
  export const clientUrl = env
    .get('CLIENT_URL')
    .required()
    .example('http://localhost:3000')
    .asString();

/**
 * The Org1 MSP ID
 */
export const mspIdOrg1 = env
  .get('HLF_MSP_ID_ORG1')
  .default(`${ORG1}MSP`)
  .example(`${ORG1}MSP`)
  .asString();

/**
 * The Org2 MSP ID
 */
export const mspIdOrg2 = env
  .get('HLF_MSP_ID_ORG2')
  .default(`${ORG2}MSP`)
  .example(`${ORG2}MSP`)
  .asString();

/**
 * The Org3 MSP ID
 */
export const mspIdOrg3 = env
  .get('HLF_MSP_ID_ORG3')
  .default(`${ORG3}MSP`)
  .example(`${ORG3}MSP`)
  .asString();

/**
 * The Org4 MSP ID
 */
export const mspIdOrg4 = env
  .get('HLF_MSP_ID_ORG4')
  .default(`${ORG4}MSP`)
  .example(`${ORG4}MSP`)
  .asString();

/**
 * The Org5 MSP ID
 */
export const mspIdOrg5 = env
  .get('HLF_MSP_ID_ORG5')
  .default(`${ORG5}MSP`)
  .example(`${ORG5}MSP`)
  .asString();

/**
 * Name of the channel which the basic asset sample chaincode has been installed on
 */
export const channelName = env
  .get('HLF_CHANNEL_NAME')
  .default('property-channel')
  .example('property-channel')
  .asString();

/**
 * Name used to install the basic asset sample
 */
export const chaincodeName = env
  .get('HLF_CHAINCODE_NAME')
  .default('property-cc')
  .example('property-cc')
  .asString();

/**
 * The transaction submit timeout in seconds for commit notification to complete
 */
export const commitTimeout = env
  .get('HLF_COMMIT_TIMEOUT')
  .default('300')
  .example('300')
  .asIntPositive();

/**
 * The transaction submit timeout in seconds for the endorsement to complete
 */
export const endorseTimeout = env
  .get('HLF_ENDORSE_TIMEOUT')
  .default('30')
  .example('30')
  .asIntPositive();

/**
 * The transaction query timeout in seconds
 */
export const queryTimeout = env
  .get('HLF_QUERY_TIMEOUT')
  .default('3')
  .example('3')
  .asIntPositive();

/**
 * The Org1 connection profile JSON
 */
export const connectionProfileOrg1 = env
  .get('HLF_CONNECTION_PROFILE_ORG1')
  .required()
  .example(
    '{"name":"test-network-org1","version":"1.0.0","client":{"organization":"Org1" ... }'
  )
  .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org1 identity to evaluate and submit transactions
 */
export const certificateOrg1 = env
  .get('HLF_CERTIFICATE_ORG1')
  .required()
  .example(
    '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
  )
  .asString();

/**
 * Private key for an Org1 identity to evaluate and submit transactions
 */
export const privateKeyOrg1 = env
  .get('HLF_PRIVATE_KEY_ORG1')
  .required()
  .example(
    '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  )
  .asString();

/**
 * The Org2 connection profile JSON
 */
export const connectionProfileOrg2 = env
  .get('HLF_CONNECTION_PROFILE_ORG2')
  .required()
  .example(
    '{"name":"test-network-org2","version":"1.0.0","client":{"organization":"Org2" ... }'
  )
  .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org2 identity to evaluate and submit transactions
 */
export const certificateOrg2 = env
  .get('HLF_CERTIFICATE_ORG2')
  .required()
  .example(
    '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
  )
  .asString();

/**
 * Private key for an Org2 identity to evaluate and submit transactions
 */
export const privateKeyOrg2 = env
  .get('HLF_PRIVATE_KEY_ORG2')
  .required()
  .example(
    '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  )
  .asString();

/**
 * The Org3 connection profile JSON
 */
export const connectionProfileOrg3 = env
  .get('HLF_CONNECTION_PROFILE_ORG3')
  .required()
  .example(
    '{"name":"test-network-org3","version":"1.0.0","client":{"organization":"Org3" ... }'
  )
  .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org3 identity to evaluate and submit transactions
 */
export const certificateOrg3 = env
  .get('HLF_CERTIFICATE_ORG3')
  .required()
  .example(
    '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
  )
  .asString();

/**
 * Private key for an Org3 identity to evaluate and submit transactions
 */
export const privateKeyOrg3 = env
  .get('HLF_PRIVATE_KEY_ORG3')
  .required()
  .example(
    '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  )
  .asString();

/**
 * The Org4 connection profile JSON
 */
export const connectionProfileOrg4 = env
  .get('HLF_CONNECTION_PROFILE_ORG4')
  .required()
  .example(
    '{"name":"test-network-org4","version":"1.0.0","client":{"organization":"Org4" ... }'
  )
  .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org4 identity to evaluate and submit transactions
 */
export const certificateOrg4 = env
  .get('HLF_CERTIFICATE_ORG4')
  .required()
  .example(
    '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
  )
  .asString();

/**
 * Private key for an Org4 identity to evaluate and submit transactions
 */
export const privateKeyOrg4 = env
  .get('HLF_PRIVATE_KEY_ORG4')
  .required()
  .example(
    '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  )
  .asString();

/**
 * The Org5 connection profile JSON
 */
export const connectionProfileOrg5 = env
  .get('HLF_CONNECTION_PROFILE_ORG5')
  .required()
  .example(
    '{"name":"test-network-org5","version":"1.0.0","client":{"organization":"Org5" ... }'
  )
  .asJsonObject() as Record<string, unknown>;

/**
 * Certificate for an Org5 identity to evaluate and submit transactions
 */
export const certificateOrg5 = env
  .get('HLF_CERTIFICATE_ORG5')
  .required()
  .example(
    '"-----BEGIN CERTIFICATE-----\\n...\\n-----END CERTIFICATE-----\\n"'
  )
  .asString();

/**
 * Private key for an Org5 identity to evaluate and submit transactions
 */
export const privateKeyOrg5 = env
  .get('HLF_PRIVATE_KEY_ORG5')
  .required()
  .example(
    '"-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"'
  )
  .asString();

/**
 * The host the Redis server is running on
 */
export const redisHost = env
  .get('REDIS_HOST')
  .default('localhost')
  .example('localhost')
  .asString();

/**
 * The port the Redis server is running on
 */
export const redisPort = env
  .get('REDIS_PORT')
  .default('6379')
  .example('6379')
  .asPortNumber();

/**
 * Username for the Redis server
 */
export const redisUsername = env
  .get('REDIS_USERNAME')
  .example('fabric')
  .asString();

/**
 * Password for the Redis server
 */
export const redisPassword = env.get('REDIS_PASSWORD').asString();

/**
 * API key for Org1
 * Specify this API key with the X-Api-Key header to use the Org1 connection profile and credentials
 */
export const org1ApiKey = env
  .get('ORG1_APIKEY')
  .required()
  .example('123')
  .asString();

/**
 * API key for Org2
 * Specify this API key with the X-Api-Key header to use the Org2 connection profile and credentials
 */
export const org2ApiKey = env
  .get('ORG2_APIKEY')
  .required()
  .example('456')
  .asString();

/**
 * API key for Org3
 * Specify this API key with the X-Api-Key header to use the Org3 connection profile and credentials
 */
export const org3ApiKey = env
  .get('ORG3_APIKEY')
  .required()
  .example('789')
  .asString();

/**
 * API key for Org4
 */
export const org4ApiKey = env
  .get('ORG4_APIKEY')
  .required()
  .example('101')
  .asString();

/**
 * API key for Org5
 */
export const org5ApiKey = env
  .get('ORG5_APIKEY')
  .required()
  .example('112')
  .asString();
