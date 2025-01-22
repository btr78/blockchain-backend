import React, { useState } from 'react';
import { deploySmartContract, executeSmartContract } from '../api';

const SmartContracts = () => {
    const [code, setCode] = useState('');
    const [contractAddress, setContractAddress] = useState('');
    const [args, setArgs] = useState('');

    const handleDeploy = async () => {
        const result = await deploySmartContract(code, 'deployer-address');
        setContractAddress(result.address);
        alert(`Smart contract deployed at: ${result.address}`);
    };

    const handleExecute = async () => {
        await executeSmartContract(contractAddress, args);
        alert('Smart contract executed!');
    };

    return (
        <div>
            <h2>Smart Contracts</h2>
            <textarea
                placeholder="Smart Contract Code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
            />
            <button onClick={handleDeploy}>Deploy</button>
            {contractAddress && (
                <>
                    <h3>Contract Address: {contractAddress}</h3>
                    <input
                        type="text"
                        placeholder="Arguments"
                        value={args}
                        onChange={(e) => setArgs(e.target.value)}
                    />
                    <button onClick={handleExecute}>Execute</button>
                </>
            )}
        </div>
    );
};

export default SmartContracts;