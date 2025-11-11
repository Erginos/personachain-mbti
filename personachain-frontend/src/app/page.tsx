'use client';

import Link from 'next/link';

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md p-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-blue-600">PersonaChain</h1>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto p-8">
        <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
          <h2 className="text-3xl font-bold mb-4">
            Discover Your Personality On-Chain
          </h2>
          <p className="text-gray-600 text-lg mb-6">
            Take our assessment, mint your personality NFT, and join the Web3 community of personalities.
          </p>
          <Link href="/assessment">
            <button className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700">
              Test Your Personality
            </button>
          </Link>
        </div>
      </div>
    </main>
  );
}
