// Import required modules
const { Blockchain, Transaction, AILayer } = require('./blockchain');

// Initialize AI Layer
const aiLayer = new AILayer();

// Initialize Blockchain with AI Layer
const myBlockchain = new Blockchain(aiLayer);

// Example Usage
myBlockchain.createTransaction(new Transaction('address1', 'address2', 30));
myBlockchain.minePendingTransactions('miner-address');

console.log('Balance of miner:', myBlockchain.getBalance('miner-address'));
