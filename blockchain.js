// blockchain.js

const crypto = require('crypto');

// AI Layer
class AILayer {
    analyzeNetwork(blockchain) {
        const avgBlockTime = blockchain.chain.length > 1 ? 
            (blockchain.chain[blockchain.chain.length - 1].timestamp - blockchain.chain[blockchain.chain.length - 2].timestamp) : 0;

        let suggestedDifficulty = blockchain.difficulty;
        if (avgBlockTime > 2000) suggestedDifficulty--;
        else if (avgBlockTime < 1000) suggestedDifficulty++;

        return { suggestedDifficulty: Math.max(1, suggestedDifficulty) };
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
        return crypto.createHash('sha256')
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
        this.balances = {};
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
            console.log('Fraudulent transactions removed:', fraudulentTransactions);
            this.pendingTransactions = this.pendingTransactions.filter(tx => !fraudulentTransactions.includes(tx));
        }

        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );

        const analysis = this.aiLayer.analyzeNetwork(this);
        this.difficulty = analysis.suggestedDifficulty;

        console.log(`Mining with difficulty: ${this.difficulty}`);
        block.mineBlock(this.difficulty);
        this.chain.push(block);

        this.pendingTransactions = [new Transaction(null, rewardAddress, this.miningReward)];
    }

    createTransaction(transaction) {
        if (transaction.amount <= 0) {
            console.log('Transaction amount must be greater than zero.');
            return;
        }
        this.pendingTransactions.push(transaction);
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
}

// Export classes
module.exports = { Blockchain, Block, Transaction, AILayer };
