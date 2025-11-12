'use client';

import { useWallet } from '@/context/WalletContext';

export default function WalletConnect() {
  const { walletPubkey, connectWallet, disconnectWallet } = useWallet();

  return (
    <div className="p-4">
      {!walletPubkey ? (
        <button
          onClick={connectWallet}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
        >
          Connect Wallet
        </button>
      ) : (
        <div className="bg-green-100 p-4 rounded-lg">
          <p className="text-sm text-gray-600">Connected Wallet:</p>
          <p className="font-mono font-bold break-all">{walletPubkey}</p>
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
