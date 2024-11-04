# Running the property-network network

You can use the `./network.sh` script to stand up a simple Fabric test network. The test network has two peer organizations with one peer each and a single node raft ordering service. You can also use the `./network.sh` script to create channels and deploy chaincode. For more information, see [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html). The test network is being introduced in Fabric v2.0 as the long term replacement for the `first-network` sample.

```bash
./network.sh up
```

To create a channel use:

```bash
./network.sh createChannel
```

To restart a running network use:

```bash
./network.sh restart
```

If you are planning to run the test network with consensus type BFT then please pass `-bft` flag as input to the `network.sh` script when creating the channel. Note that currently this sample does not yet support the use of consensus type BFT and CA together.
That is to create a network use:

```bash
./network.sh up -bft
```

To create a channel use:

```bash
./network.sh createChannel -bft
```

To restart a running network use:

```bash
./network.sh restart -bft
```

Note that running the createChannel command will start the network, if it is not already running.

Before you can deploy the test network, you need to follow the instructions to [Install the Samples, Binaries and Docker Images](https://hyperledger-fabric.readthedocs.io/en/latest/install.html) in the Hyperledger Fabric documentation.

## Using the Peer commands

The `setOrgEnv.sh` script can be used to set up the environment variables for the organizations, this will help to be able to use the `peer` commands directly.

First, ensure that the peer binaries are on your path, and the Fabric Config path is set assuming that you're in the `property-network` directory.

```bash
 export PATH=$PATH:$(realpath ../bin)
 export FABRIC_CFG_PATH=$(realpath ../config)
```

You can then set up the environment variables for each organization. The `./setOrgEnv.sh` command is designed to be run as follows.

```bash
export $(./setOrgEnv.sh Org2 | xargs)
```

(Note bash v4 is required for the scripts.)

You will now be able to run the `peer` commands in the context of Org2. If a different command prompt, you can run the same command with Org1 instead.
The `setOrgEnv` script outputs a series of `<name>=<value>` strings. These can then be fed into the export command for your current shell.

### Initializing the ledger with assets
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C property-channel -n property-cc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
```

If successful, you should see output similar to the following example:
```shell
-> INFO 001 Chaincode invoke successful. result: status:200
```

### Querying the list of all assets
```bash
peer chaincode query -C property-channel -n property-cc -c '{"Args":["GetAllAssets"]}'
```

If successful, you should see the following output:
```shell
[{"AppraisedValue":1500000,"City":"Warangal","ID":"LAND-00123-2024","Owner":"Ravi Kumar","OwnerContact":"9876543210","OwnerId":"OWNER-001","Pin":"506004","Size":500,"State":"Telangana","Type":"Land","docType":"asset"},{"AppraisedValue":2000000,"City":"Warangal","ID":"LAND-00124-2024","Owner":"Anjali Rao","OwnerContact":"9123456780","OwnerId":"OWNER-002","Pin":"506004","Size":750,"State":"Telangana","Type":"Plot","docType":"asset"},{"AppraisedValue":3000000,"City":"Warangal","ID":"LAND-00125-2024","Owner":"Sunil Verma","OwnerContact":"9988776655","OwnerId":"OWNER-003","Pin":"506004","Size":1200,"State":"Telangana","Type":"Agricultural Land","docType":"asset"},{"AppraisedValue":5000000,"City":"Warangal","ID":"LAND-00126-2024","Owner":"Priya Singh","OwnerContact":"9876123456","OwnerId":"OWNER-004","Pin":"506004","Size":2000,"State":"Telangana","Type":"Commercial Property","docType":"asset"},{"AppraisedValue":1800000,"City":"Warangal","ID":"LAND-00127-2024","Owner":"Kiran Choudhary","OwnerContact":"9988773344","OwnerId":"OWNER-005","Pin":"506004","Size":600,"State":"Telangana","Type":"Residential Plot","docType":"asset"}]
```

### Asset transfer
```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C property-channel -n property-cc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["LAND-00129-2024", "Ankit", "OWNER-069", "9988696969", "1200000"]}'
```

## Chaincode-as-a-service

To learn more about how to use the improvements to the Chaincode-as-a-service please see this [tutorial](./property-network/../CHAINCODE_AS_A_SERVICE_TUTORIAL.md). It is expected that this will move to augment the tutorial in the [Hyperledger Fabric ReadTheDocs](https://hyperledger-fabric.readthedocs.io/en/release-2.4/cc_service.html)


## Podman

*Note - podman support should be considered experimental but the following has been reported to work with podman 4.1.1 on Mac. If you wish to use podman a LinuxVM is recommended.*

Fabric's `install-fabric.sh` script has been enhanced to support using `podman` to pull down images and tag them rather than docker. The images are the same, just pulled differently. Simply specify the 'podman' argument when running the `install-fabric.sh` script.

Similarly, the `network.sh` script has been enhanced so that it can use `podman` and `podman-compose` instead of docker. Just set the environment variable `CONTAINER_CLI` to `podman` before running the `network.sh` script:

```bash
CONTAINER_CLI=podman ./network.sh up
````

As there is no Docker-Daemon when using podman, only the `./network.sh deployCCAAS` command will work. Following the Chaincode-as-a-service Tutorial above should work.


