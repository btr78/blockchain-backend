import axios from 'axios';

const API_BASE = 'http://localhost:3000'; // Replace with your server URL

export const getBalances = async () => {
    const response = await axios.get(`${API_BASE}/balances`);
    return response.data;
};

export const createTransaction = async (transaction) => {
    const response = await axios.post(`${API_BASE}/transactions`, transaction);
    return response.data;
};

export const deploySmartContract = async (code, deployer) => {
    const response = await axios.post(`${API_BASE}/smart-contracts/deploy`, {
        code,
        deployer,
    });
    return response.data;
};

export const executeSmartContract = async (address, args) => {
    const response = await axios.post(`${API_BASE}/smart-contracts/execute`, {
        address,
        args,
    });
    return response.data;
};