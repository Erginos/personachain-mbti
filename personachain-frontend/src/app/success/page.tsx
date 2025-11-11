'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { MintedNFT, hasMinted } from '@/utils/storage';
import Link from 'next/link';
import { generateNFTImage } from '@/utils/nftGenerator';

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const walletAddress = searchParams.get('wallet');
  const [minted, setMinted] = useState<MintedNFT | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!walletAddress) {
      router.push('/');
      return;
    }

    const data = hasMinted(walletAddress);
    if (!data) {
      router.push('/assessment');
      return;
    }

    setMinted(data);
    setLoading(false);
  }, [walletAddress, router]);

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600">Loading your certificate...</p>
        </div>
      </main>
    );
  }

  if (!minted) {
    return null;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <div className="mb-6">
            <div className="text-6xl mb-4">🎉</div>
            <h1 className="text-4xl font-bold mb-2 text-green-600">Congratulations!</h1>
            <p className="text-gray-600">Your personality NFT has been minted successfully</p>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-8 mb-8">
            <p className="text-gray-600 mb-4">Your NFT Preview</p>
            <div className="flex justify-center mb-6">
              <img 
                src={generateNFTImage(minted.personality)} 
                alt={minted.personality}
                className="w-48 h-48 rounded-lg border-2 border-blue-600 shadow-lg"
              />
            </div>
            <div className="mb-6">
              <p className="text-gray-600 mb-2">Personality Type</p>
              <p className="text-6xl font-extrabold text-blue-600">{minted.personality}</p>
            </div>

            <div className="border-t border-gray-200 pt-6 space-y-4">
              <div>
                <p className="text-sm text-gray-600">Wallet Address</p>
                <p className="font-mono text-sm break-all">{walletAddress}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Minted On</p>
                <p className="text-sm">{new Date(minted.mintedAt).toLocaleDateString()}</p>
              </div>
              {minted.txId && (
                <div>
                  <p className="text-sm text-gray-600">Transaction ID</p>
                  <a
                    href={`https://explorer.solana.com/tx/${minted.txId}?cluster=testnet`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 hover:underline text-sm break-all"
                  >
                    {minted.txId.slice(0, 20)}...
                  </a>
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/assessment?retake=true">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
                Retake Assessment
              </button>
            </Link>
            <Link href="/">
              <button className="px-8 py-3 border rounded-lg hover:bg-gray-100">
                Back to Home
              </button>
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}