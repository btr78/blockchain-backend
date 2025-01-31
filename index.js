// Deployment-Ready Blockchain Code
// Includes: Security Audits, Performance Tests, Deployment Pipeline

import { Blockchain, Transaction, SmartContract, AILayer, generateKeyPair, sign, verify } from './blockchain';
import assert from 'assert';
import fs from 'fs';

// --- Security Enhancements ---
class SecurityLayer {
  static isBlacklisted(address, blockchain) {
    return blockchain.blacklist.has(address);
  }

  static enforceBlacklist(transaction, blockchain) {
    if (SecurityLayer.isBlacklisted(transaction.from, blockchain) || SecurityLayer.isBlacklisted(transaction.to, blockchain)) {
      throw new Error('❌ Transaction blocked! Address is blacklisted.');
    }
  }
}

// --- Test Cases ---
(async () => {
  const aiLayer = new AILayer();
  const blockchain = new Blockchain(aiLayer);

  console.log('Running Security & Performance Tests...');

  // Test Key Pair Generation
  const keyPair = generateKeyPair();
  assert(keyPair.publicKey && keyPair.privateKey, 'Key pair generation failed.');
  console.log('✔ Key Pair Generation Test Passed');

  // Test Transaction Creation and Validation
  const tx = new Transaction(keyPair.publicKey, 'recipient', 50);
  await tx.generateId();
  tx.signTransaction(keyPair.privateKey);
  SecurityLayer.enforceBlacklist(tx, blockchain);
  assert(tx.validate(blockchain), 'Transaction validation failed.');
  console.log('✔ Transaction Validation Test Passed');

  // Test Block Mining
  const initialBalance = blockchain.getBalanceOfAddress(keyPair.publicKey) || 0;
  blockchain.addTransaction(tx);
  blockchain.minePendingTransactions(keyPair.publicKey);
  const newBalance = blockchain.getBalanceOfAddress(keyPair.publicKey);
  assert(newBalance > initialBalance, 'Mining reward not credited.');
  console.log('✔ Mining Reward Test Passed');

  // Test Fraudulent Transaction Detection
  const fraudulentTx = new Transaction('fraudster', 'recipient', -100);
  blockchain.addTransaction(fraudulentTx);
  const fraudDetected = aiLayer.detectFraudulentTransactions(blockchain.pendingTransactions);
  assert(fraudDetected.length > 0, 'Fraudulent transaction not detected.');
  console.log('✔ Fraudulent Transaction Detection Test Passed');

  console.log('All Security & Performance Tests Passed!');
})();

// --- Performance Benchmarks ---
(async () => {
  console.log('Running Performance Benchmarks...');
  const blockchain = new Blockchain(new AILayer());
  console.time('Transaction Validation');
  for (let i = 0; i < 1000; i++) {
    const keyPair = generateKeyPair();
    const tx = new Transaction(keyPair.publicKey, 'recipient', 10);
    await tx.generateId();
    tx.signTransaction(keyPair.privateKey);
    SecurityLayer.enforceBlacklist(tx, blockchain);
    assert(tx.validate(blockchain));
  }
  console.timeEnd('Transaction Validation');

  console.time('Block Mining');
  const block = new Block(1, Date.now(), [], '0');
  block.mineBlock(blockchain.difficulty);
  console.timeEnd('Block Mining');
})();

// --- Dockerfile for Deployment ---
const dockerfileContent = `
# Use Node.js LTS as the base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 3000

# Run the application
CMD ["node", "server.js"]
`;
fs.writeFileSync('Dockerfile', dockerfileContent);
console.log('✔ Dockerfile created for deployment');

// --- Deployment Pipeline ---
const ciConfigContent = `
name: Node.js CI

on:
  push:
    branches:
      - main

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install dependencies
        run: npm install
      - name: Run tests
        run: npm test
      - name: Build Docker image
        run: docker build -t my-blockchain-app .
      - name: Push to Docker Hub
        env:
          DOCKER_USERNAME: ${{ secrets.DOCKER_USERNAME }}
          DOCKER_PASSWORD: ${{ secrets.DOCKER_PASSWORD }}
        run: |
          echo $DOCKER_PASSWORD | docker login -u $DOCKER_USERNAME --password-stdin
          docker tag my-blockchain-app $DOCKER_USERNAME/my-blockchain-app:latest
          docker push $DOCKER_USERNAME/my-blockchain-app:latest
`;
fs.writeFileSync('.github/workflows/ci.yml', ciConfigContent);
console.log('✔ CI/CD pipeline configured with GitHub Actions');
