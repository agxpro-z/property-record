# Property record sample

The property record sample demonstrates:

- Connecting a client application to a Fabric blockchain network.
- Submitting smart contract transactions to update ledger state.
- Evaluating smart contract transactions to query ledger state.
- Handling errors in transaction invocation.

## About the source code

This source code includes smart contract and application code. This project shows create, read, update, transfer and delete of an property record.

For a more detailed walk-through of the application code and client API usage, refer to the [Running a Fabric Application tutorial](https://hyperledger-fabric.readthedocs.io/en/latest/write_first_app.html) in the main Hyperledger Fabric documentation.

### Application

Follow the execution flow in the client application code, and corresponding output on running the application. Pay attention to the sequence of:

- Transaction invocations (console output like "**--> Submit Transaction**" and "**--> Evaluate Transaction**").
- Results returned by transactions (console output like "**\*\*\* Result**").

### Smart Contract

The smart contract (in folder `chaincode-typescript`) implements the following functions to support the application:

- CreateAsset
- ReadAsset
- UpdateAsset
- DeleteAsset
- TransferAsset

Note that the property record transfer implemented by the smart contract is a simplified scenario, without ownership validation, meant only to demonstrate how to invoke transactions.

## Running the smart contract

The Fabric property network is used to deploy and run this project. Follow these steps in order:

1. Create the test network and a channel (from the `property-network` folder).

   ```
   ./network.sh up createChannel -c property-channel -ca
   ```

2. Deploy the smart contract implementations (from the `property-network` folder).

   ```shell
   ./network.sh deployCC -ccn property-cc -ccp ../property-record/chaincode-typescript/
   ```

## Clean up

When you are finished, you can bring down the property network (from the `property-network` folder). The command will remove all the nodes of the property network, and delete any ledger data that you created.

```shell
./network.sh down
```
