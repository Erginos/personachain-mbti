'use client';

import { useEffect, useState } from 'react';

interface PortfolioNFT {
  nickname: string;
  personality: string;
  walletAddress: string;
}

export default function OurPortfolio() {
  const [nfts, setNfts] = useState<PortfolioNFT[]>([]);

  useEffect(() => {
    // Load minted NFTs from localStorage
    try {
      const saved = localStorage.getItem('minedNFTs');
      if (saved) {
        const parsed = JSON.parse(saved);
        setNfts(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error('Error loading NFTs:', error);
    }
  }, []);

  // Duplicate NFTs for infinite scroll effect
  const displayNfts = [...nfts, ...nfts, ...nfts];

  const personalityColors: { [key: string]: { bg: string; border: string; text: string } } = {
    'INTJ': { bg: 'from-purple-600 to-indigo-600', border: 'border-purple-400', text: 'text-purple-300' },
    'INTP': { bg: 'from-blue-600 to-cyan-600', border: 'border-blue-400', text: 'text-blue-300' },
    'ENTJ': { bg: 'from-red-600 to-pink-600', border: 'border-red-400', text: 'text-red-300' },
    'ENTP': { bg: 'from-orange-600 to-yellow-600', border: 'border-orange-400', text: 'text-orange-300' },
    'INFJ': { bg: 'from-green-600 to-emerald-600', border: 'border-green-400', text: 'text-green-300' },
    'INFP': { bg: 'from-pink-600 to-rose-600', border: 'border-pink-400', text: 'text-pink-300' },
    'ENFJ': { bg: 'from-teal-600 to-cyan-600', border: 'border-teal-400', text: 'text-teal-300' },
    'ENFP': { bg: 'from-yellow-600 to-amber-600', border: 'border-yellow-400', text: 'text-yellow-300' },
    'ISTJ': { bg: 'from-slate-600 to-gray-600', border: 'border-slate-400', text: 'text-slate-300' },
    'ISFJ': { bg: 'from-violet-600 to-purple-600', border: 'border-violet-400', text: 'text-violet-300' },
    'ESTJ': { bg: 'from-blue-700 to-indigo-700', border: 'border-blue-500', text: 'text-blue-400' },
    'ESFJ': { bg: 'from-pink-700 to-rose-700', border: 'border-pink-500', text: 'text-pink-400' },
    'ISTP': { bg: 'from-cyan-600 to-blue-600', border: 'border-cyan-400', text: 'text-cyan-300' },
    'ISFP': { bg: 'from-green-500 to-teal-500', border: 'border-green-400', text: 'text-green-300' },
    'ESTP': { bg: 'from-red-500 to-orange-500', border: 'border-red-400', text: 'text-red-300' },
    'ESFP': { bg: 'from-purple-500 to-pink-500', border: 'border-purple-400', text: 'text-purple-300' },
  };

  return (
    <section className="w-full py-20 px-4 bg-slate-900">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl md:text-5xl font-bold mb-12 text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          Hall of Personalities
        </h2>

        <p className="text-center text-slate-400 text-lg mb-16 max-w-2xl mx-auto">
          Meet our community members who have minted their personality NFTs. Each one is unique and permanent on the Solana blockchain.
        </p>

        {/* Auto-scrolling carousel */}
        <div className="relative overflow-hidden rounded-xl bg-slate-800/50 border border-slate-700 py-8">
          <style>{`
            @keyframes scroll {
              0% {
                transform: translateX(0);
              }
              100% {
                transform: translateX(-33.333%);
              }
            }
            
            .scrolling-carousel {
              animation: scroll 20s linear infinite;
            }
            
            .scrolling-carousel:hover {
              animation-play-state: paused;
            }
          `}</style>

          <div className="scrolling-carousel flex gap-6 px-4 whitespace-nowrap">
            {displayNfts.length > 0 ? (
              displayNfts.map((nft, idx) => {
                const colors = personalityColors[nft.personality] || {
                  bg: 'from-slate-600 to-slate-500',
                  border: 'border-slate-400',
                  text: 'text-slate-300',
                };

                return (
                  <div
                    key={idx}
                    className={`flex-shrink-0 w-72 h-96 bg-gradient-to-br ${colors.bg} rounded-2xl border-2 ${colors.border} p-6 flex flex-col justify-between transform transition cursor-not-allowed opacity-70 hover:opacity-100`}
                  >
                    {/* Lock indicator */}
                    <div className="absolute top-4 right-4 text-2xl">🔒</div>

                    {/* Content */}
                    <div>
                      <h3 className="text-sm font-bold text-slate-200 opacity-75">Personality Type</h3>
                      <p className={`text-5xl font-extrabold ${colors.text} mt-2 tracking-wider`}>
                        {nft.personality}
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-xs text-slate-300 opacity-75">Nickname</p>
                        <p className="text-sm font-bold text-white truncate">{nft.nickname || 'Anonymous'}</p>
                      </div>

                      <div className="bg-black/30 rounded-lg p-3">
                        <p className="text-xs text-slate-300 opacity-75">Wallet Address</p>
                        <p className="text-xs font-mono text-slate-200 truncate">
                          {nft.walletAddress.slice(0, 6)}...{nft.walletAddress.slice(-4)}
                        </p>
                      </div>

                      <div className="pt-2 text-center text-xs text-slate-400">
                        🎯 Locked & Permanent
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex-shrink-0 w-full h-96 flex items-center justify-center text-center">
                <div>
                  <p className="text-slate-400 text-lg">No NFTs minted yet</p>
                  <p className="text-slate-500 text-sm">Be the first to mint your personality NFT!</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-8 mt-16">
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-4xl font-bold text-purple-400">{nfts.length}</div>
            <p className="text-slate-400 mt-2">Minted Personalities</p>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-4xl font-bold text-pink-400">{new Set(nfts.map(n => n.personality)).size}</div>
            <p className="text-slate-400 mt-2">Unique Types</p>
          </div>
          <div className="text-center p-6 bg-slate-800/50 rounded-lg border border-slate-700">
            <div className="text-4xl font-bold text-blue-400">♾️</div>
            <p className="text-slate-400 mt-2">Permanent NFTs</p>
          </div>
        </div>
      </div>
    </section>
  );
}