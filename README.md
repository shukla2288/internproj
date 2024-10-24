# Hyperledger Fabric Test Network and Node.js Application

This repository provides a guide to set up a Hyperledger Fabric test network and to run a Node.js application that interacts with the network. 

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Clone Hyperledger Fabric Samples](#step-1-clone-hyperledger-fabric-samples)
3. [Start the Test Network](#step-2-start-the-test-network)
4. [Deploy Chaincode](#step-3-deploy-chaincode)
5. [Setting Up Node.js Application](#step-4-setting-up-nodejs-application)
6. [Running the Node.js Application](#step-5-running-the-nodejs-application)
7. [Conclusion](#conclusion)
8. [References](#references)

## Prerequisites

Ensure you have the following software installed on your machine:

- **Docker**: [Docker installation guide](https://docs.docker.com/get-docker/)
- **Docker Compose**: Comes with Docker Desktop; verify installation using `docker-compose --version`.
- **Go** (version 1.18 or higher): [Go installation](https://golang.org/doc/install)
- **Node.js** (version 14.x or higher): [Node.js installation](https://nodejs.org/en/download/)
- **npm**: Comes with Node.js; verify installation using `npm --version`.

## Step 1: Clone Hyperledger Fabric Samples

Clone the Hyperledger Fabric samples repository:

```bash
git clone https://github.com/hyperledger/fabric-samples.git
cd fabric-samples/test-network
```

## Step 2: Start the Test Network

To start the Hyperledger Fabric test network, run the following command:

```bash
./network.sh up createChannel -ca
```

This command will:
- Start the network with 2 organizations and 2 peers.
- Create a channel named `mychannel`.

### Verify the Network

Check if the network is running by listing the Docker containers:

```bash
docker ps
```

You should see containers for the peers and the orderer.

## Step 3: Deploy Chaincode

Deploy your chaincode to the network. For example, to deploy a chaincode named `basic`, run:

```bash
./network.sh deployCC -ccn basic -ccp ../chaincode/asset-transfer -ccl go
```

### Verify Chaincode Deployment

After deployment, you can query the installed chaincode:

```bash
peer lifecycle chaincode queryinstalled
```

## Step 4: Setting Up Node.js Application

### Create a Node.js Application

1. Create a new directory for your Node.js application:

```bash
mkdir my-node-app
cd my-node-app
```

2. Initialize a new Node.js project:

```bash
npm init -y
```

3. Install the Hyperledger Fabric SDK for Node.js:

```bash
npm install fabric-network
```

### Sample Code for Node.js Application

Create an `index.js` file in your project directory with the following code:

```javascript
const { Gateway, Wallets } = require('fabric-network');
const path = require('path');
const fs = require('fs');
const yaml = require('js-yaml');

async function main() {
    const ccpPath = path.resolve(__dirname, '..', 'fabric-samples', 'test-network', 'organizations', 'peerOrganizations', 'org1.example.com', 'connection-org1.yaml');
    const ccp = yaml.load(fs.readFileSync(ccpPath, 'utf8'));

    const walletPath = path.join(process.cwd(), 'wallet');
    const wallet = await Wallets.newFileSystemWallet(walletPath);

    const gateway = new Gateway();
    await gateway.connect(ccp, { wallet, identity: 'user1', discovery: { enabled: true, asLocalhost: true } });

    const network = await gateway.getNetwork('mychannel');
    const contract = network.getContract('basic');

    // Example of invoking a transaction
    const result = await contract.submitTransaction('CreateAsset', 'asset1', 'owner1', 'description', '100');
    console.log(`Transaction has been submitted, result is: ${result.toString()}`);

    // Example of querying an asset
    const queryResult = await contract.evaluateTransaction('QueryAsset', 'asset1');
    console.log(`Asset details: ${queryResult.toString()}`);

    await gateway.disconnect();
}

main().catch(console.error);
```

### Update the Wallet

Before running your application, ensure you have the required identities in your wallet. You may need to follow the setup for creating a wallet and adding users. Refer to the Fabric SDK documentation for more details.

## Step 5: Running the Node.js Application

1. Ensure your Hyperledger Fabric network is running.

2. Start your Node.js application:

```bash
node index.js
```

## Conclusion

This guide provides the necessary steps to set up a Hyperledger Fabric test network and a Node.js application to interact with it. You can expand upon this foundation by adding more functionality to your chaincode and client application.

## References

- [Hyperledger Fabric Documentation](https://hyperledger-fabric.readthedocs.io/en/latest/)
- [Fabric SDK for Node.js](https://hyperledger.github.io/fabric-sdk-node/release-2.2/)
