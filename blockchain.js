// Import the crypto module
const crypto = require('crypto');

// Blockchain class
class Blockchain {
    constructor() {
        this.chain = [this.createGenesisBlock()];
        this.difficulty = 4; // Default difficulty level
        this.pendingTransactions = [];
        this.miningReward = 50; // Reward for mining a block
        this.balances = {};
    }

    // Create the genesis block
    createGenesisBlock() {
        return new Block(0, Date.now(), [], "0");
    }

    // Get the latest block
    getLatestBlock() {
        return this.chain[this.chain.length - 1];
    }

    // Mine pending transactions
    minePendingTransactions(rewardAddress) {
        const block = new Block(
            this.chain.length,
            Date.now(),
            this.pendingTransactions,
            this.getLatestBlock().hash
        );
        block.mineBlock(this.difficulty);

        console.log(`Block mined: ${block.hash}`);
        this.chain.push(block);

        this.pendingTransactions = [
            new Transaction(null, rewardAddress, this.miningReward)
        ];
    }

    // Create a new transaction
    createTransaction(transaction) {
        this.pendingTransactions.push(transaction);
    }

    // Get balance for an address
    getBalance(address) {
        let balance = 0;

        for (const block of this.chain) {
            for (const tx of block.transactions) {
                if (tx.from === address) {
                    balance -= tx.amount;
                }
                if (tx.to === address) {
                    balance += tx.amount;
                }
            }
        }

        return balance;
    }
}

// Block class
class Block {
    constructor(index, timestamp, transactions, previousHash = "") {
        this.index = index;
        this.timestamp = timestamp;
        this.transactions = transactions;
        this.previousHash = previousHash;
        this.hash = this.calculateHash();
        this.nonce = 0;
    }

    // Calculate the hash for the block
    calculateHash() {
        return crypto
            .createHash('sha256')
            .update(
                this.index +
                this.timestamp +
                JSON.stringify(this.transactions) +
                this.previousHash +
                this.nonce
            )
            .digest('hex');
    }

    // Mine the block with a specific difficulty
    mineBlock(difficulty) {
        while (!this.hash.startsWith("0".repeat(difficulty))) {
            this.nonce++;
            this.hash = this.calculateHash();
        }
    }
}

// Transaction class
class Transaction {
    constructor(from, to, amount) {
        this.from = from;
        this.to = to;
        this.amount = amount;
    }
}

// Export the Blockchain, Block, and Transaction classes
module.exports = { Blockchain, Block, Transaction };
