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
    const { from, to, amount } = req.body;
    const transaction = new Transaction(from, to, amount);
    blockchain.createTransaction(transaction);
    res.json({ message: 'Transaction added to pending transactions.' });
});

app.get('/mine', (req, res) => {
    const rewardAddress = 'miner-address';
    blockchain.minePendingTransactions(rewardAddress);
    res.json({ message: 'Mining complete.', chain: blockchain.chain });
});

app.get('/balance/:address', (req, res) => {
    const balance = blockchain.getBalance(req.params.address);
    res.json({ address: req.params.address, balance });
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
