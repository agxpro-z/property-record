# Running the property-network

You can use the `./network.sh` script to stand up the property-network. The property-network has five peer organizations with one peer each and a single node raft ordering service. You can also use the `./network.sh` script to create channels and deploy chaincode. For more information, see [Using the Fabric test network](https://hyperledger-fabric.readthedocs.io/en/latest/test_network.html).

```bash
./network.sh up
```

To create a channel use:

```bash
./network.sh createChannel -ca
```

To restart a running network use:

```bash
./network.sh restart
```

If you are planning to run the property-network with consensus type BFT then please pass `-bft` flag as input to the `network.sh` script when creating the channel. Note that currently this does not yet support the use of consensus type BFT and CA together.
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
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C property-channel -n property-cc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt" --peerAddresses localhost:12051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt" --peerAddresses localhost:13051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt" -c '{"function":"InitLedger","Args":[]}'
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
[{"AppraisedValue":100000000000,"District":"Interstellar","ID":"LAND-0001-2024","Owner":"Alpha","OwnerContact":"9001100100","OwnerId":"OWNER-001","Pin":"000000","Size":500,"State":"Unknown","Type":"Private Property","docType":"asset"},{"AppraisedValue":20000000,"District":"Warangal","ID":"LAND-0002-2024","Owner":"Beta","OwnerContact":"9001100101","OwnerId":"OWNER-002","Pin":"506004","Size":750,"State":"Telangana","Type":"Plot","docType":"asset"},{"AppraisedValue":30000000,"District":"Indore","ID":"LAND-0003-2024","Owner":"Gamma","OwnerContact":"9001100102","OwnerId":"OWNER-003","Pin":"452001","Size":1200,"State":"Madhya Pradesh","Type":"Agricultural Land","docType":"asset"},{"AppraisedValue":50000000,"District":"Lucknow","ID":"LAND-0004-2024","Owner":"Delta","OwnerContact":"9001100103","OwnerId":"OWNER-004","Pin":"226001","Size":2000,"State":"Uttar Pradesh","Type":"Commercial Property","docType":"asset"},{"AppraisedValue":18000000,"District":"Hyderabad","ID":"LAND-0005-2024","Owner":"Epsilon","OwnerContact":"9001100104","OwnerId":"OWNER-005","Pin":"500001","Size":600,"State":"Telangana","Type":"Residential Plot","docType":"asset"}]
```

### Asset transfer

```bash
peer chaincode invoke -o localhost:7050 --ordererTLSHostnameOverride orderer.example.com --tls --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" -C property-channel -n property-cc --peerAddresses localhost:7051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" --peerAddresses localhost:9051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" --peerAddresses localhost:11051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org3.example.com/peers/peer0.org3.example.com/tls/ca.crt"  --peerAddresses localhost:12051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org4.example.com/peers/peer0.org4.example.com/tls/ca.crt"  --peerAddresses localhost:13051 --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org5.example.com/peers/peer0.org5.example.com/tls/ca.crt" -c '{"function":"TransferAsset","Args":["LAND-0005-2024", "Zeta", "OWNER-006", "9001100105", "12000000"]}'
```
