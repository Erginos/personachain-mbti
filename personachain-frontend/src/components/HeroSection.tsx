'use client';

import Link from 'next/link';
import { useWallet } from '@solana/wallet-adapter-react';

export default function HeroSection() {
  const { connected } = useWallet();

  return (
    <section className="min-h-screen w-full flex flex-col items-center justify-center text-center px-4 py-20 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Background animation */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl animate-pulse animation-delay-2000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto">
        <h1 className="text-6xl md:text-7xl font-extrabold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-blue-500 animate-fade-in">
          PersonaChain
        </h1>

        <h2 className="text-2xl md:text-4xl font-bold mb-4 text-purple-200">
          Discover Your Personality NFT
        </h2>

        <p className="text-lg md:text-xl text-slate-300 mb-8 leading-relaxed max-w-2xl mx-auto">
          Take our MBTI personality test and mint your unique NFT on the Solana blockchain. Discover who you truly are, and carry your personality with you forever.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
          <Link
            href="/assessment"
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-purple-500/50 transition transform hover:scale-105 text-lg"
          >
            Take the Assessment 🚀
          </Link>

          <a
            href="https://explorer.solana.com/?cluster=custom&customUrl=https%3A%2F%2Frpc.testnet.carv.io%2Frpc"
            target="_blank"
            rel="noopener noreferrer"
            className="px-8 py-4 border-2 border-purple-400 text-purple-300 font-bold rounded-lg hover:bg-purple-400/10 transition"
          >
            View on Explorer 🔗
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 max-w-2xl mx-auto mt-16">
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
            <div className="text-3xl font-bold text-purple-400">∞</div>
            <div className="text-sm text-slate-400">Personalities</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
            <div className="text-3xl font-bold text-pink-400">16</div>
            <div className="text-sm text-slate-400">MBTI Types</div>
          </div>
          <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg border border-purple-500/20">
            <div className="text-3xl font-bold text-blue-400">On-Chain</div>
            <div className="text-sm text-slate-400">Permanent</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 text-slate-400 animate-bounce">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}