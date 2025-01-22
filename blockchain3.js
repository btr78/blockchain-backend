// Import required libraries
const crypto = require('crypto');

// AI Layer
class AILayer {
    constructor() {
        this.networkData = [];
    }

    analyzeNetwork(blockchain) {
        const avgBlockTime = blockchain.chain.length > 1 ? 
            (blockchain.chain[blockchain.chain.length - 1].timestamp - blockchain.chain[blockchain.chain.length - 2].timestamp) : 0;

        let suggestedDifficulty = blockchain.difficulty;
        if (avgBlockTime > 2000) suggestedDifficulty--;
        else if (avgBlockTime < 1000) suggestedDifficulty++;

        return {
            suggestedDifficulty: Math.max(1, suggestedDifficulty),
        };
    }

    detectFraudulentTransactions(transactions) {
        return transactions.filter(tx => tx.amount <= 0);
    }
}

// Block Class
class Block {
    constructor(index, timestamp, transactions, previousHash = '') {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.nonce = 0;
        this.hash = this.calculateHash();
    }

    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
            .digest('hex');
    }

    mineBlock(difficulty) {
        while (!this.hash.startsWith('0'.repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
        console.log(`Block mined: ${this.hash}`);
    }
}

// Transaction Class
class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

// Blockchain Class
class Blockchain {
    constructor(aiLayer) {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4;
        this.pendingTransactions = [];
        this.miningReward = 50;
        this.aiLayer = aiLayer;
        this.energyUsage = 0;
        this.balances = {};
        this.smartContracts = [];
    }

    createGenesisBlock() {
        return new Block(0, Date.now(), [], '0');
    }

    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    minePendingTransactions(rewardAddress) {
        if (this.pendingTransactions.length === 0) {
            console.log('No transactions to mine.');
            return;
        }

        const fraudulentTransactions = this.aiLayer.detectFraudulentTransactions(this.pendingTransactions);
        if (fraudulentTransactions.length > 0) {
            console.log('Fraudulent transactions detected and removed:', fraudulentTransactions);
            this.pendingTransactions = this.pendingTransactions.filter(tx => !fraudulentTransactions.includes(tx));
        }

        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        const aiAnalysis = this.aiLayer.analyzeNetwork(this);
        this.difficulty = aiAnalysis.suggestedDifficulty;

        console.log(`Mining with difficulty: ${this.difficulty}`);
        block.mineBlock(this.difficulty);
        this.energyUsage += block.nonce * 10;
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, rewardAddress, this.miningReward)
        ];
    }

    createTransaction(transaction) {
        if (this.validateTransaction(transaction)) {
            this.pendingTransactions.push(transaction);
        } else {
            console.log('Transaction rejected.');
        }
    }

    validateTransaction(transaction) {
        if (!transaction.from || !transaction.to || transaction.amount <= 0) return false;

        const senderBalance = this.getBalance(transaction.from);
        return senderBalance >= transaction.amount;
    }

    getBalance(address) {
        let balance = 0;
        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.from === address) balance -= tx.amount;
                if (tx.to === address) balance += tx.amount;
            }
        }
        return balance;
    }

    deploySmartContract(code) {
        const address = `contract-${this.smartContracts.length}`;
        this.smartContracts.push({ address, code });
        return address;
    }

    executeSmartContract(address, ...args) {
        const contract = this.smartContracts.find(c => c.address === address);
        if (!contract) return console.log('Smart contract not found.');

        try {
            eval(contract.code)(...args);
        } catch (e) {
            console.error('Error executing contract:', e);
        }
    }
}

// Example Usage
const aiLayer = new AILayer();
const myBlockchain = new Blockchain(aiLayer);

// Adding a transaction
myBlockchain.createTransaction(new Transaction('Alice', 'Bob', 50));
myBlockchain.minePendingTransactions('miner1');

console.log('Balances:', {
    Alice: myBlockchain.getBalance('Alice'),
    Bob: myBlockchain.getBalance('Bob'),
    miner1: myBlockchain.getBalance('miner1')
});
