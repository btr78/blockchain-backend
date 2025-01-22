import React from 'react';
import Dashboard from './components/Dashboard';
import TransactionForm from './components/TransactionForm';
import SmartContracts from './components/SmartContracts';

const App = () => {
    return (
        <div>
            <h1>Blockchain Dashboard</h1>
            <Dashboard />
            <TransactionForm />
            <SmartContracts />
        </div>
    );
};

export default App;
