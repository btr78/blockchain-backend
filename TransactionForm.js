import React, { useState } from 'react';
import { createTransaction } from '../api';

const TransactionForm = () => {
    const [form, setForm] = useState({ from: '', to: '', amount: 0 });

    const handleSubmit = async (e) => {
        e.preventDefault();
        await createTransaction(form);
        alert('Transaction created!');
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    return (
        <div>
            <h2>Create Transaction</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="from"
                    placeholder="From Address"
                    value={form.from}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="to"
                    placeholder="To Address"
                    value={form.to}
                    onChange={handleChange}
                />
                <input
                    type="number"
                    name="amount"
                    placeholder="Amount"
                    value={form.amount}
                    onChange={handleChange}
                />
                <button type="submit">Send</button>
            </form>
        </div>
    );
};

export default TransactionForm;