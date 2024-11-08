# Property Record

Property record system for storing land records using hyperledger fabric.

## Setting up property-network

This is a quick guide to setup the network. The detailed guide can be viewed in the respected sections.

### Prerequisite

Install the following packages for your respected platform.

- `git` - For download source code from github.
- `curl` - For interacting with the backend server.
- `docker` - For deploying fabric images.
- `jq` - For parsing json.

### Downloading source code, docker images and binaries

To get the install script:

```shell
curl -sSLO https://raw.githubusercontent.com/agxpro-z/property-record/main/install.sh && chmod +x install.sh
```

Choosing the components and downloading, initials of the components can be used to shorten the command:

- `docker` to use Docker to download the Fabric container images.
- `binary` to download Fabric binaries.
- `source` to clone the property-record source code.

To pull the docker containers and clone the source code repo, run the following command:

```shell
./install.sh d s b
```

**Note:** This command will clone the sources in the same directory.

### Bringing up the property network

You can find the scripts to bring up the network in the `property-network` directory for **property-record** repository.

Change directory to property-network:

```shell
cd property-record/property-network
```

To start the network, use the following command. This will quickly start the network for usage.

```shell
./network.sh up createChannel -ca
./network.sh addOrgs
```

### Deploying the chaincode to the network

To deploy the chaincode to the network, use the following command.

```shell
./network.sh deployCC -ccn property-cc -ccp ../property-record/chaincode-typescript/
```

Now network is ready for usage.

## Setting up REST API server

This is a quick guide to setup REST API for the network. The detailed guide can be found in the `property-record/rest-api-typescript` directory.

**Note:** `Node.js` >=v16 is required for things to work correctly. Working `MongoDb` URI is also needed.

### Starting the server

Change directory to `rest-api-typescript` and use the following commands to setup the server:

Install dependencies

```shell
npm install
```

Build the REST server

```shell
npm run build
```

Generate `.env` template file for the server:

```shell
PROPERTY_NETWORK_HOME=$(pwd)/../../property-network npm run generateEnv
```

Add `MONGO_URI` and `JWT_SECRET` to the `.env`.

Start a Redis server (Redis is used to store the queue of submitted transactions)

```shell
export REDIS_PASSWORD=$(uuidgen)
npm run start:redis
```

**Note:** If `uuidgen` is not installed then you can use any custom password for Redis.

Start the REST server.

```shell
npm run start:dev
```

Now you're ready to start the Front-end webapp to interact with the network.

## Setting up Frontend webapp

Goto the the frontend webapp directory which is located at the same directory level as `property-record` named as `property-record-webapp`.

Install dependencies

```shell
npm install
```

Start the frontend webapp

```shell
npm run dev
```

Now open [localhost:3000](http://localhost:300) in any browser to use the network.
