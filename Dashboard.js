import React, { useEffect, useState } from 'react';
import { getBalances } from '../api';

const Dashboard = () => {
    const [balances, setBalances] = useState({});

    useEffect(() => {
        const fetchBalances = async () => {
            const data = await getBalances();
            setBalances(data);
        };
        fetchBalances();
    }, []);

    return (
        <div>
            <h2>Dashboard</h2>
            <ul>
                {Object.entries(balances).map(([address, balance]) => (
                    <li key={address}>
                        {address}: {balance} tokens
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Dashboard;