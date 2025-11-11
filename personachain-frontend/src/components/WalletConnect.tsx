'use client';

import { useState, useEffect } from 'react';

export default function WalletConnect() {
  const [account, setAccount] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined' && (window as any).ethereum) {
      console.log('Ethereum provider detected');
    }
  }, []);

  const connectWallet = async () => {
    try {
      const provider = (window as any).ethereum;
      if (!provider) {
        alert('Please install MetaMask or a Web3 wallet');
        return;
      }

      const accounts = await provider.request({
        method: 'eth_requestAccounts',
      });
      setAccount(accounts[0]);
      console.log('Connected account:', accounts[0]);
    } catch (error) {
      console.error('Wallet connection failed:', error);
    }
  };

  const disconnectWallet = () => {
    setAccount(null);
  };

  return (
    <div className="p-4">
      {!account ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Connected Wallet:</p>
          <p className="font-mono font-bold break-all">{account}</p>
          <button
            onClick={disconnectWallet}
            className="mt-3 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Disconnect
          </button>
        </div>
      )}
    </div>
  );
}
