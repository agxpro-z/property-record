# Propert Record REST API

REST server to demonstrate property/land record registration using Hyperledger Fabric.

The REST API is only intended to work with the [property-record](https://github.com/agxpro-z/property-record).

## Overview

The primary aim of this project is to show how to register land and property using Hyperledger Fabric to prevent double registration and forgery.

The following sections describe the structure of the sample, or [skip to the usage section](#usage) to try it out first.

### Property network connections

The project creates 5 long lived connections to a Fabric network in order to submit and evaluate transactions using different identities.

The connections are made when the application starts and are retained for the life of the REST server.

### Property-record REST API

While the basic property-record transfer chaincode maps well to an `/api/assets` REST API, response times when submitting transactions to a Fabric network are problematic for REST APIs.

A common approach to handle long running operations in REST APIs is to immediately return `202 ACCEPTED`, with the operation being represented by another resource, namely a `job` in this sample.

Jobs are used for submitting transactions to create, update, delete, or transfer an asset.
The `202 ACCEPTED` response includes a `jobId` which can be used with the `/api/jobs` endpoint to get the results of the create, update, delete, or transfer request.

Jobs are not used to get assets, because evaluating transactions is typically much faster.

Related files:
- [src/assets.router.ts](src/assets.router.ts)
  Defines the main `/api/assets` endpoint.
- [src/fabric.ts](src/fabric.ts)
  All the sample code which interacts with the Fabric network via the Fabric SDK.
- [src/jobs.router.ts](src/jobs.router.ts)
  Defines the `/api/jobs` endpoint for getting job status.
- [src/jobs.ts](src/jobs.ts)
  Job queue implementation details.
- [src/transactions.router.ts](src/transactions.router.ts)
  Defines the `/api/transactions` endpoint for getting transaction status.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [property network connections](#property-network-connections) section above.

### REST server

The remaining files are related to the REST server aspects of the project, rather than Fabric itself:

- [src/auth.ts](src/auth.ts)
  Basic and Session API key authentication strategy used for the project.
- [src/config.ts](src/config.ts)
  Descriptions of all the available configuration environment variables.
- [src/jobs.ts](src/jobs.ts)
  Job queue implementation details.
- [src/logger.ts](src/logger.ts)
  Logging implementation details.
- [src/redis.ts](src/redis.ts)
  Redis implementation details.
- [src/server.ts](src/server.ts)
  Express server implementation details.

**Note:** If you are not specifically interested in REST APIs, you should only need to look at the files in the [property network connections](#property-network-connections) section above.

## Usage

To build and start the REST server, you'll need to [download and install an LTS version of node](https://nodejs.org/en/download/)

Clone the `property-record` repository and change to the `property-record/property-record/rest-api-typescript` directory before running the following commands

**Note:** these instructions should work with the main branch of `property-record`

Install dependencies

```shell
npm install
```

Build the REST server

```shell
npm run build
```

Create a `.env` file to configure the server for the test network (make sure PROPERTY_NETWORK_HOME is set to the fully qualified `property-network` directory)

```shell
PROPERTY_NETWORK_HOME=$(pwd)/../../property-network npm run generateEnv
```

MongoDb and JWT setup

Add the MongoDb URI and JWT secret in the `.env` file to store users in the database and to authenticate users using sessions.

```shell
MONGO_URI="mongodb://localhost:27017"
JWT_SECRET=secret
```

**Note:** see [src/config.ts](src/config.ts) for details of configuring the sample

Start a Redis server (Redis is used to store the queue of submit transactions)

```shell
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis
```

Start the sample REST server

```shell
npm run start:dev
```

<!-- ### Docker image

It's also possible to use the [published docker image](https://github.com/hyperledger/fabric-samples/pkgs/container/fabric-rest-sample) to run the sample

Clone the `property-record` repository and change to the `property-record/property-record/rest-api-typescript` directory before running the following commands

Create a `.env` file to configure the server for the test network (make sure `PROPERTY_NETWORK_HOME` is set to the fully qualified `property-network` directory and `AS_LOCAL_HOST` is set to `false` so that the server works inside the Docker Compose network)

```shell
PROPERTY_NETWORK_HOME=$(pwd)/../../property-network AS_LOCAL_HOST=false npm run generateEnv
```

**Note:** see [src/config.ts](src/config.ts) for details of configuring the sample

Start the REST server and Redis server

```shell
export REDIS_PASSWORD=$(uuidgen)
docker-compose up -d
``` -->

## REST API demo

If everything went well, you can now open a new terminal and try out some property transfer REST calls!

The examples below require a `PROPERTY_APIKEY` environment variable which must be set to an API key from the `.env` file created above.

For example, to use the ORG1_APIKEY...

```
PROPERTY_APIKEY=$(grep ORG1_APIKEY .env | cut -d '=' -f 2-)
```

### Get all assets...

```shell
curl --header "X-Api-Key: ${PROPERTY_APIKEY}" http://localhost:5000/api/assets
```

You should see all the available assets, for example

```
[{"AppraisedValue":100000000000,"District":"Interstellar","ID":"LAND-0001-2024","Owner":"Alpha","OwnerContact":"9001100100","OwnerId":"OWNER-001","Pin":"000000","Size":500,"State":"Unknown","Type":"Private Property","docType":"asset"},{"AppraisedValue":20000000,"District":"Warangal","ID":"LAND-0002-2024","Owner":"Beta","OwnerContact":"9001100101","OwnerId":"OWNER-002","Pin":"506004","Size":750,"State":"Telangana","Type":"Plot","docType":"asset"},{"AppraisedValue":30000000,"District":"Indore","ID":"LAND-0003-2024","Owner":"Gamma","OwnerContact":"9001100102","OwnerId":"OWNER-003","Pin":"452001","Size":1200,"State":"Madhya Pradesh","Type":"Agricultural Land","docType":"asset"},{"AppraisedValue":50000000,"District":"Lucknow","ID":"LAND-0004-2024","Owner":"Delta","OwnerContact":"9001100103","OwnerId":"OWNER-004","Pin":"226001","Size":2000,"State":"Uttar Pradesh","Type":"Commercial Property","docType":"asset"},{"AppraisedValue":12000000,"District":"Hyderabad","ID":"LAND-0005-2024","Owner":"Zeta","OwnerContact":"9001100105","OwnerId":"OWNER-006","Pin":"500001","Size":600,"State":"Telangana","Type":"Residential Plot","docType":"asset"}]
```

### Check whether an asset exists...

```shell
curl --include --header "X-Api-Key: ${PROPERTY_APIKEY}" --request OPTIONS http://localhost:5000/api/assets/[assetId]
```

### Create an asset...

```shell
curl --include --header "Content-Type: application/json" --header "X-Api-Key: ${PROPERTY_APIKEY}" --request POST --data '{"ID":"LAND-0006-2024","Type":"Land","Size":5100,"Owner":"Eta","OwnerId":"OWNER-008","OwnerContact":"9001100106","State":"Telangana","City":"Warangal","Pin":"506004","AppraisedValue":1010000}' http://localhost:5000/api/assets
```

The response should include a `jobId` which you can use to check the job status in next step

```
{"status":"Accepted","jobId":"1","timestamp":"2021-10-22T16:27:09.426Z"}
```

### Read an asset...

```shell
curl --header "X-Api-Key: ${PROPERTY_APIKEY}" http://localhost:5000/api/assets/LAND-0001-2024
```

You should see the newly created asset, for example

```
{"AppraisedValue":100000000000,"District":"Interstellar","ID":"LAND-0001-2024","Owner":"Alpha","OwnerContact":"9001100100","OwnerId":"OWNER-001","Pin":"000000","Size":500,"State":"Unknown","Type":"Private Property","docType":"asset"}
```

### Update an asset...

```shell
curl --include --header "Content-Type: application/json" --header "X-Api-Key: ${PROPERTY_APIKEY}" --request PUT --data '{"ID":"LAND-0003-2024","Type":"Land","Size":4000,"Owner":"Theta","OwnerId":"OWNER-009","OwnerContact":"9001100108","State":"Madhya Pradesh","City":"Indore","Pin":"452001","AppraisedValue":101000}' http://localhost:5000/api/assets/LAND-0003-2024
```

### Transfer an asset...

```shell
curl --include --header "Content-Type: application/json" --header "X-Api-Key: ${PROPERTY_APIKEY}" --request PATCH --data '[{"op":"replace","path":"/Owner","value":"Ankit","ownerId":"OWNER-008","ownerContact":"9001100110","appraisedValue":1101000}]' http://localhost:5000/api/assets/LAND-0003-2024
```

### Delete an asset...

```shell
curl --include --header "X-Api-Key: ${PROPERTY_APIKEY}" --request DELETE http://localhost:5000/api/assets/LAND-0004-2024
```

### Read job status...

```shell
curl --header "X-Api-Key: ${PROPERTY_APIKEY}" http://localhost:3000/api/jobs/__job_id__
```

The response should include a list of `transactionIds` which you can use to check the transaction status in next step, for example

```
{"jobId":"1","transactionIds":["1dd35c2e5d840fec1dccc6e8cfce886c660c103de3e7b93dd774d04f39eef82a"],"transactionPayload":""}
```

There may be more transaction IDs if the job was retried

### Read transaction status...

```shell
curl --header "X-Api-Key: ${PROPERTY_APIKEY}" http://localhost:3000/api/transactions/__transaction_id__
```

The response will show the validation code of the transaction, for example

```
{"transactionId":"1dd35c2e5d840fec1dccc6e8cfce886c660c103de3e7b93dd774d04f39eef82a","validationCode":"VALID"}
```

Alternatively, you will get a 404 not found response if the transaction was not committed
