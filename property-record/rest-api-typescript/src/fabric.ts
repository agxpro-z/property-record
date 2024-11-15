/*
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Contract,
  DefaultEventHandlerStrategies,
  DefaultQueryHandlerStrategies,
  Gateway,
  GatewayOptions,
  Network,
  Transaction,
  Wallet,
  Wallets,
  X509Identity,
} from 'fabric-network';
import * as protos from 'fabric-protos';
import Long from '../node_modules/long';
import * as config from './config';
import { handleError } from './errors';
import { logger } from './logger';
import path from 'path';
import fs from 'fs';
import FabricCAServices from 'fabric-ca-client';
import { Application } from 'express';

/**
 * Creates a file system wallet to hold credentials for an Org1, Org2, Org3
 * Org4 and Org5 admin
 *
 * In this sample there is a single admin for each MSP ID to demonstrate how
 * a client app might submit transactions for different users
 *
 * Alternatively a REST server could use its own identity for all transactions,
 * or it could use credentials supplied in the REST requests
 */
export const createWallet = async (app: Application): Promise<Wallet> => {
  const walletPath = path.join(process.cwd(), 'wallet');
  const wallet = await Wallets.newFileSystemWallet(walletPath);

  // Org1
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'property-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    app.locals['Org1CCP'] = ccp;

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org1.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(config.mspIdOrg1);
    if (identity) {
      throw new Error(`An identity for the admin user "${config.mspIdOrg1}" already exists in the wallet`);
    }

    console.log(`Enrolling admin user "${config.mspIdOrg1}"`);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.mspIdOrg1,
      type: 'X.509',
    };
    await wallet.put(config.mspIdOrg1, x509Identity);
    console.log(`Successfully enrolled admin user "${config.mspIdOrg1}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user "${config.mspIdOrg1}": ${error}`);
  }

  // Org2
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'property-network', 'organizations', 'peerOrganizations', 'org2.example.com', 'connection-org2.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    app.locals['Org2CCP'] = ccp;

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org2.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(config.mspIdOrg2);
    if (identity) {
      throw new Error(`An identity for the admin user "${config.mspIdOrg2}" already exists in the wallet`);
    }

    console.log(`Enrolling admin user "${config.mspIdOrg2}"`);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.mspIdOrg2,
      type: 'X.509',
    };
    await wallet.put(config.mspIdOrg2, x509Identity);
    console.log(`Successfully enrolled admin user "${config.mspIdOrg2}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user "${config.mspIdOrg2}": ${error}`);
  }

  // Org3
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'property-network', 'organizations', 'peerOrganizations', 'org3.example.com', 'connection-org3.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    app.locals['Org3CCP'] = ccp;

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org3.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(config.mspIdOrg3);
    if (identity) {
      throw new Error(`An identity for the admin user "${config.mspIdOrg3}" already exists in the wallet`);
    }

    console.log(`Enrolling admin user "${config.mspIdOrg3}"`);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.mspIdOrg3,
      type: 'X.509',
    };
    await wallet.put(config.mspIdOrg3, x509Identity);
    console.log(`Successfully enrolled admin user "${config.mspIdOrg3}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user "${config.mspIdOrg3}": ${error}`);
  }

  // Org4
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'property-network', 'organizations', 'peerOrganizations', 'org4.example.com', 'connection-org4.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    app.locals['Org4CCP'] = ccp;

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org4.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(config.mspIdOrg4);
    if (identity) {
      throw new Error(`An identity for the admin user "${config.mspIdOrg4}" already exists in the wallet`);
    }

    console.log(`Enrolling admin user "${config.mspIdOrg4}"`);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.mspIdOrg4,
      type: 'X.509',
    };
    await wallet.put(config.mspIdOrg4, x509Identity);
    console.log(`Successfully enrolled admin user "${config.mspIdOrg4}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user "${config.mspIdOrg4}": ${error}`);
  }

  // Org5
  try {
    // Load the network configuration
    const ccpPath = path.resolve(__dirname, '..', '..', '..', 'property-network', 'organizations', 'peerOrganizations', 'org5.example.com', 'connection-org5.json');
    const ccp = JSON.parse(fs.readFileSync(ccpPath, 'utf8'));
    app.locals['Org5CCP'] = ccp;

    // Create a new CA client for interacting with the CA.
    const caInfo = ccp.certificateAuthorities['ca.org5.example.com'];
    const caTLSCACerts = caInfo.tlsCACerts.pem;
    const ca = new FabricCAServices(caInfo.url, { trustedRoots: caTLSCACerts, verify: true }, caInfo.caName);

    // Check to see if we've already enrolled the admin user.
    const identity = await wallet.get(config.mspIdOrg5);
    if (identity) {
      throw new Error(`An identity for the admin user "${config.mspIdOrg5}" already exists in the wallet`);
    }

    console.log(`Enrolling admin user "${config.mspIdOrg5}"`);

    // Enroll the admin user, and import the new identity into the wallet.
    const enrollment = await ca.enroll({ enrollmentID: 'admin', enrollmentSecret: 'adminpw' });
    const x509Identity: X509Identity = {
      credentials: {
        certificate: enrollment.certificate,
        privateKey: enrollment.key.toBytes(),
      },
      mspId: config.mspIdOrg5,
      type: 'X.509',
    };
    await wallet.put(config.mspIdOrg5, x509Identity);
    console.log(`Successfully enrolled admin user "${config.mspIdOrg5}" and imported it into the wallet`);
  } catch (error) {
    console.error(`Failed to enroll admin user "${config.mspIdOrg5}": ${error}`);
  }

  return wallet;
};

/**
 * Create a Gateway connection
 *
 * Gateway instances can and should be reused rather than connecting to submit every transaction
 */
export const createGateway = async (
  connectionProfile: Record<string, unknown>,
  identity: string,
  wallet: Wallet
): Promise<Gateway> => {
  logger.debug({ connectionProfile, identity }, 'Configuring gateway');

  const gateway = new Gateway();

  const options: GatewayOptions = {
    wallet,
    identity,
    discovery: { enabled: true, asLocalhost: config.asLocalhost },
    eventHandlerOptions: {
      commitTimeout: config.commitTimeout,
      endorseTimeout: config.endorseTimeout,
      strategy: DefaultEventHandlerStrategies.PREFER_MSPID_SCOPE_ANYFORTX,
    },
    queryHandlerOptions: {
      timeout: config.queryTimeout,
      strategy:
        DefaultQueryHandlerStrategies.PREFER_MSPID_SCOPE_ROUND_ROBIN,
    },
  };

  await gateway.connect(connectionProfile, options);

  return gateway;
};

/**
 * Get the network which the asset transfer sample chaincode is running on
 *
 * In addion to getting the contract, the network will also be used to
 * start a block event listener
 */
export const getNetwork = async (gateway: Gateway): Promise<Network> => {
  const network = await gateway.getNetwork(config.channelName);
  return network;
};

/**
 * Get the asset transfer sample contract and the qscc system contract
 *
 * The system contract is used for the liveness REST endpoint
 */
export const getContracts = async (
  network: Network
): Promise<{ assetContract: Contract; qsccContract: Contract }> => {
  const assetContract = network.getContract(config.chaincodeName);
  const qsccContract = network.getContract('qscc');
  return { assetContract, qsccContract };
};

/**
 * Evaluate a transaction and handle any errors
 */
export const evatuateTransaction = async (
  contract: Contract,
  transactionName: string,
  ...transactionArgs: string[]
): Promise<Buffer> => {
  const transaction = contract.createTransaction(transactionName);
  const transactionId = transaction.getTransactionId();
  logger.trace({ transaction }, 'Evaluating transaction');

  try {
    const payload = await transaction.evaluate(...transactionArgs);
    logger.trace(
      { transactionId: transactionId, payload: payload.toString() },
      'Evaluate transaction response received'
    );
    return payload;
  } catch (err) {
    throw handleError(transactionId, err);
  }
};

/**
 * Submit a transaction and handle any errors
 */
export const submitTransaction = async (
  transaction: Transaction,
  ...transactionArgs: string[]
): Promise<Buffer> => {
  logger.trace({ transaction }, 'Submitting transaction');
  const txnId = transaction.getTransactionId();

  try {
    const payload = await transaction.submit(...transactionArgs);
    logger.trace(
      { transactionId: txnId, payload: payload.toString() },
      'Submit transaction response received'
    );
    return payload;
  } catch (err) {
    throw handleError(txnId, err);
  }
};

/**
 * Get the validation code of the specified transaction
 */
export const getTransactionValidationCode = async (
  qsccContract: Contract,
  transactionId: string
): Promise<string> => {
  const data = await evatuateTransaction(
    qsccContract,
    'GetTransactionByID',
    config.channelName,
    transactionId
  );

  const processedTransaction =
    protos.protos.ProcessedTransaction.decode(data);
  const validationCode =
    protos.protos.TxValidationCode[processedTransaction.validationCode];

  logger.debug({ transactionId }, 'Validation code: %s', validationCode);
  return validationCode;
};

/**
 * Get the current block height
 *
 * This example of using a system contract is used for the liveness REST
 * endpoint
 */
export const getBlockHeight = async (
  qscc: Contract
): Promise<number | Long> => {
  const data = await qscc.evaluateTransaction(
    'GetChainInfo',
    config.channelName
  );
  const info = protos.common.BlockchainInfo.decode(data);
  const blockHeight = info.height;

  logger.debug('Current block height: %d', blockHeight);
  return blockHeight;
};
