const express = require('express');
const { Blockchain, Transaction, AILayer } = require('./blockchain'); // Importing necessary classes

const app = express();
const port = 3000;

app.use(express.json()); // Middleware to parse JSON

// Initialize blockchain and AI Layer
const aiLayer = new AILayer();
const myCoin = new Blockchain(aiLayer);

// API Routes

// Create a new transaction
app.post('/transaction', (req, res) => {
    const { from, to, amount } = req.body;

    if (!from || !to || typeof amount !== 'number') {
        return res.status(400).json({ error: 'Invalid transaction format' });
    }

    const transaction = new Transaction(from, to, amount);
    myCoin.createTransaction(transaction);
    res.json({ message: 'Transaction added', transaction });
});

// Mine pending transactions
app.post('/mine', (req, res) => {
    const { minerAddress } = req.body;

    if (!minerAddress) {
        return res.status(400).json({ error: 'Miner address is required' });
    }

    myCoin.minePendingTransactions(minerAddress);
    res.json({
        message: 'Mining complete',
        newBlock: myCoin.getLatestBlock(),
        balances: myCoin.recalculateBalances(),
        energyUsage: myCoin.getEnergyUsage(),
    });
});

// Get blockchain data
app.get('/chain', (req, res) => {
    res.json(myCoin.chain);
});

// Get balances
app.get('/balances', (req, res) => {
    res.json(myCoin.recalculateBalances());
});

// Deploy smart contract
app.post('/deploy-contract', (req, res) => {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Invalid contract code' });
    }

    const contractAddress = myCoin.deploySmartContract(code);
    res.json({ message: 'Smart contract deployed', contractAddress });
});

// Execute smart contract
app.post('/execute-contract', (req, res) => {
    const { contractAddress, args } = req.body;

    if (!contractAddress || !Array.isArray(args)) {
        return res.status(400).json({ error: 'Invalid request format' });
    }

    myCoin.executeSmartContract(contractAddress, ...args);
    res.json({ message: 'Smart contract executed', contractAddress });
});

// Start the server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
