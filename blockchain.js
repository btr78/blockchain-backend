// blockchain.js
const crypto = require('crypto');
const cryptoRandomString = require('crypto-random-string');

/**
 * AI Layer class
 */
class AILayer {
  /**
   * Analyze the network and suggest a difficulty level
   * @param {Blockchain} blockchain - The blockchain to analyze
   * @returns {Object} - An object containing the suggested difficulty level
   */
  analyzeNetwork(blockchain) {
    const avgBlockTime = blockchain.chain.length > 1
      ? (blockchain.chain[blockchain.chain.length - 1].timestamp - blockchain.chain[blockchain.chain.length - 2].timestamp)
      : 0;
    let suggestedDifficulty = blockchain.difficulty;
    if (avgBlockTime > 2000) suggestedDifficulty--;
    else if (avgBlockTime < 1000) suggestedDifficulty++;
    return { suggestedDifficulty: Math.max(1, suggestedDifficulty) };
  }

  /**
   * Detect fraudulent transactions
   * @param {Transaction[]} transactions - The transactions to analyze
   * @returns {Transaction[]} - An array of fraudulent transactions
   */
  detectFraudulentTransactions(transactions) {
    return transactions.filter(tx => tx.amount <= 0);
  }
}

/**
 * Block class
 */
class Block {
  /**
   * Constructor
   * @param {number} index - The block index
   * @param {number} timestamp - The block timestamp
   * @param {Transaction[]} transactions - The block transactions
   * @param {string} previousHash - The previous block hash
   */
  constructor(index, timestamp, transactions, previousHash = '') {
    this.index = index;
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.nonce = 0;
    this.hash = this.calculateHash();
  }

  /**
   * Calculate the block hash
   * @returns {string} - The block hash
   */
  calculateHash() {
    return crypto.createHash('sha256')
      .update(this.index + this.timestamp + JSON.stringify(this.transactions) + this.previousHash + this.nonce)
      .digest('hex');
  }

  /**
   * Mine the block
   * @param {number} difficulty - The mining difficulty
   */
  mineBlock(difficulty) {
    while (!this.hash.startsWith('0'.repeat(difficulty))) {
      this.nonce++;
      this.hash = this.calculateHash();
    }
    console.log(`Block mined: ${this.hash}`);
  }
}

/**
 * Transaction class
 */
class Transaction {
  /**
   * Constructor
   * @param {string} from - The sender address
   * @param {string} to - The recipient address
   * @param {number} amount - The transaction amount
   */
  constructor(from, to, amount) {
    this.from = from;
    this.to = to;
    this.amount = amount;
  }
}

/**
 * Blockchain class
 */
class Blockchain {
  /**
   * Constructor
   * @param {AILayer} aiLayer - The AI layer instance
   */
  constructor(aiLayer) {
    this.chain = [this.createGenesisBlock()];
    this.difficulty = 4;
    this.pendingTransactions = [];
    this.miningReward = 50;
    this.aiLayer = aiLayer;
    this.balances = {};
  }

  /**
   * Create the genesis block
   * @returns {Block} - The genesis block
   */
  createGenesisBlock() {
    return new Block(0, Date.now(), [], '0');
  }

  /**
   * Get the latest block
   * @returns {Block} - The latest block
   */
  getLatestBlock() {
    return this.chain[this.chain.length - 1];
  }

  /**
   * Mine pending transactions
   * @param {string} rewardAddress - The reward address
   */
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
