'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMintedNFTs } from '@/utils/storage';

function SuccessContent() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get('wallet');
  const [nftData, setNftData] = useState<any>(null);

  useEffect(() => {
    if (wallet) {
      const nfts = getMintedNFTs();
      const latestNFT = nfts[nfts.length - 1];
      if (latestNFT) {
        setNftData(latestNFT);
      }
    }
  }, [wallet]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center">
        <div className="mb-6">
          <div className="text-6xl mb-4">🎉</div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Success!</h1>
          <p className="text-gray-600">Your personality badge has been created</p>
        </div>

        {nftData && (
          <div className="mb-6 p-4 bg-gray-50 rounded-xl">
            <div className="mb-4">
              <h2 className="text-2xl font-bold text-blue-600 mb-2">{nftData.personality}</h2>
              <div className="w-full h-64 bg-gradient-to-br from-blue-400 to-purple-500 rounded-lg flex items-center justify-center">
                <div className="text-white text-center">
                  <div className="text-5xl font-bold">{nftData.personality}</div>
                  <div className="text-sm mt-2">Your Personality Badge</div>
                </div>
              </div>
            </div>
            
            <div className="text-left space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Transaction:</span>
                <span className="font-mono text-xs">{nftData.txId.slice(0, 12)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Network:</span>
                <span className="font-semibold">{nftData.network}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Minted:</span>
                <span className="text-xs">{new Date(nftData.mintedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </div>
        )}

        {wallet && (
          <div className="mb-6 p-3 bg-gray-100 rounded-lg">
            <p className="text-xs text-gray-600 mb-1">Connected Wallet</p>
            <p className="font-mono text-sm font-bold text-gray-900">{wallet.slice(0, 8)}...{wallet.slice(-8)}</p>
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => {
              if (nftData) {
                navigator.clipboard.writeText(nftData.txId);
                alert('Transaction ID copied!');
              }
            }}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
          >
            Copy TX ID
          </button>

          <a href="/" className="w-full bg-gray-200 text-gray-900 py-2 rounded-lg hover:bg-gray-300 transition block">
            Take Another Assessment
          </a>
        </div>

        <p className="text-xs text-gray-500 mt-6">Your personality badge NFT is now on {nftData?.network || 'Solana'}! 🚀</p>
      </div>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gradient-to-br from-purple-900 to-indigo-900 flex items-center justify-center">
        <div className="text-white text-2xl">Loading...</div>
      </div>
    }>
      <SuccessContent />
    </Suspense>
  );
}
