const express = require('express');
const { Blockchain, Transaction, AILayer } = require('./blockchain');

const app = express();
const PORT = 3000;

// Blockchain setup
const aiLayer = new AILayer();
const blockchain = new Blockchain(aiLayer);

app.use(express.json());

// Routes
app.get('/chain', (req, res) => {
  res.json(blockchain.chain);
});

app.post('/transaction', (req, res) => {
  try {
    const { from, to, amount } = req.body;
    if (!from || !to || !amount) {
      throw new Error('Missing required fields');
    }
    const transaction = new Transaction(from, to, amount);
    blockchain.createTransaction(transaction);
    res.json({ message: 'Transaction added to pending transactions' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/mine', (req, res) => {
  try {
    const rewardAddress = 'miner-address';
    blockchain.minePendingTransactions(rewardAddress);
    res.json({ message: 'Mining complete', chain: blockchain.chain });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.get('/balance/:address', (req, res) => {
  try {
    const address = req.params.address;
    const balance = blockchain.getBalance(address);
    res.json({ address, balance });
  } catch (error) {
    res.status(404).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
