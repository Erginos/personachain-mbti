'use client';

import { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function SuccessContent() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get('wallet');

  return (
    <div className="text-center p-8">
      <h1 className="text-4xl font-bold mb-4">🎉 Success!</h1>
      <p className="text-lg mb-4">Your personality assessment has been saved!</p>
      {wallet && (
        <p className="text-gray-600 mb-4">
          Wallet: <span className="font-mono">{wallet.slice(0, 6)}...{wallet.slice(-6)}</span>
        </p>
      )}
      <a href="/" className="text-blue-600 underline">
        Back to Home
      </a>
    </div>
  );
}

export default function SuccessPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SuccessContent />
    </Suspense>
  );
}