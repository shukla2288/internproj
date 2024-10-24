const { exec } = require('child_process');
const util = require('util');
const readline = require('readline');

const execPromise = util.promisify(exec);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// Function to prompt user input
const askQuestion = (question) => {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
};

// Main function to run the selected command
async function runCommand() {
  const commandType = await askQuestion(
    'Enter the command type (Create, Query, Update, Transfer): '
  );

  let command;
  switch (commandType.toLowerCase()) {
    case 'create':
      const assetId = await askQuestion('Enter asset ID: ');
      const owner = await askQuestion('Enter asset owner: ');
      const description = await askQuestion('Enter asset description: ');
      const value = await askQuestion('Enter asset value: ');

      command = `peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls --cafile /home/saumy/Desktop/fabric-samples/test-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem \
        --channelID mychannel --name basic \
        --peerAddresses localhost:7051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem \
        --peerAddresses localhost:9051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem \
        -c '{"function":"CreateAsset","Args":["${assetId}","${owner}","${description}","${value}"]}'`;
      break;

    case 'query':
      const queryAssetId = await askQuestion('Enter asset ID to query: ');
      command = `peer chaincode query --channelID mychannel --name basic \
        --tls --cafile /home/saumy/Desktop/fabric-samples/test-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem \
        --peerAddresses localhost:7051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem \
        -c '{"function":"QueryAsset","Args":["${queryAssetId}"]}'`;
      break;

    case 'update':
      const updateAssetId = await askQuestion('Enter asset ID to update: ');
      const updatedDescription = await askQuestion('Enter new description: ');
      const updatedValue = await askQuestion('Enter new value: ');

      command = `peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls --cafile /home/saumy/Desktop/fabric-samples/test-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem \
        --channelID mychannel --name basic \
        --peerAddresses localhost:7051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem \
        --peerAddresses localhost:9051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem \
        -c '{"function":"UpdateAsset","Args":["${updateAssetId}","${updatedDescription}","${updatedValue}"]}'`;
      break;

    case 'transfer':
      const transferAssetId = await askQuestion('Enter asset ID to transfer: ');
      const newOwner = await askQuestion('Enter new owner: ');

      command = `peer chaincode invoke -o localhost:7050 \
        --ordererTLSHostnameOverride orderer.example.com \
        --tls --cafile /home/saumy/Desktop/fabric-samples/test-network/organizations/ordererOrganizations/example.com/tlsca/tlsca.example.com-cert.pem \
        --channelID mychannel --name basic \
        --peerAddresses localhost:7051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org1.example.com/tlsca/tlsca.org1.example.com-cert.pem \
        --peerAddresses localhost:9051 --tlsRootCertFiles /home/saumy/Desktop/fabric-samples/test-network/organizations/peerOrganizations/org2.example.com/tlsca/tlsca.org2.example.com-cert.pem \
        -c '{"function":"TransferAsset","Args":["${transferAssetId}","${newOwner}"]}'`;
      break;

    default:
      console.log('Invalid command type. Please enter Create, Query, Update, or Transfer.');
      rl.close();
      return;
  }

  // Execute the command
  try {
    console.log(`Running command: ${commandType.charAt(0).toUpperCase() + commandType.slice(1)}`);
    const { stdout, stderr } = await execPromise(command);
    console.log('Output:', stdout);
    if (stderr) {
      console.error('Error:', stderr);
    }
  } catch (error) {
    console.error(`Error executing ${commandType}:`, error);
  } finally {
    rl.close();
  }
}

runCommand();
