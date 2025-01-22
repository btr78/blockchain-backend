const { Blockchain, Block, Transaction, AILayer } = require('./blockchain');

// Initialize AI Layer and Blockchain
const aiLayer = new AILayer();
const blockchain = new Blockchain(aiLayer);

// Add some transactions
console.log('Creating transactions...');
blockchain.createTransaction(new Transaction('address1', 'address2', 50));
blockchain.createTransaction(new Transaction('address2', 'address1', 30));

// Mine transactions
console.log('Starting mining...');
blockchain.minePendingTransactions('miner-address');

// Display balances
console.log(`Balance of miner: ${blockchain.getBalance('miner-address')}`);
console.log('All balances:', {
    address1: blockchain.getBalance('address1'),
    address2: blockchain.getBalance('address2'),
    miner: blockchain.getBalance('miner-address'),
});
