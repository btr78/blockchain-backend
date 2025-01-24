const { Blockchain, Transaction } = require('./blockchain');

test('Transaction creation', () => {
    const transaction = new Transaction('sender', 'receiver', 100);
    expect(transaction).toHaveProperty('amount', 100);
});
