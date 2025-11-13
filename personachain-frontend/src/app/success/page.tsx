'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { getMintedNFTs } from '@/utils/storage';
import { getMockNFTs } from '@/config/devMode';

function SuccessContent() {
  const searchParams = useSearchParams();
  const wallet = searchParams.get('wallet');
  const devMode = searchParams.get('devMode') === 'true';
  const [nftData, setNftData] = useState<any>(null);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (wallet) {
      if (devMode) {
        const mockNFTs = getMockNFTs();
        const latestNFT = mockNFTs[mockNFTs.length - 1];
        if (latestNFT) {
          setNftData(latestNFT);
        }
      } else {
        const nfts = getMintedNFTs();
        const latestNFT = nfts[nfts.length - 1];
        if (latestNFT) {
          setNftData(latestNFT);
        }
      }
    }
  }, [wallet, devMode]);

  // UPDATED: Temperament-based color grouping
  const personalityColors: { [key: string]: { main: string; light: string; dark: string } } = {
    // GREEN GROUP: INFP, ENFP, INFJ, ENFJ (NF - Idealists)
    'INFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    'ENFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    'INFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
    'ENFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },

    // PURPLE GROUP: INTJ, ENTJ, INTP, ENTP (NT - Rationals)
    'INTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    'ENTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    'INTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
    'ENTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },

    // BLUE GROUP: ISTJ, ESTJ, ISFJ, ESFJ (SJ - Guardians)
    'ISTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    'ESTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    'ISFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
    'ESFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },

    // YELLOW GROUP: ESFP, ISFP, ESTP, ISTP (SP - Artisans)
    'ESFP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
    'ISFP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
    'ESTP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
    'ISTP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
  };

  // UPDATED: Better personality descriptions
  const PERSONALITY_DESCRIPTIONS: { [key: string]: string } = {
    'INTJ': 'Strategic, logical, and independent. Prefers planning and systems.',
    'INTP': 'Analytical, thoughtful, and innovative. Enjoys intellectual exploration.',
    'ENTJ': 'Bold, decisive, and strategic leader. Natural organizer.',
    'ENTP': 'Inventive, analytical, and debater. Loves exploring ideas.',
    'INFJ': 'Compassionate, intuitive, and principled. Seeks meaning and connection.',
    'INFP': 'Idealistic, empathetic, and value-driven.',
    'ENFJ': 'Charismatic, inspirational leader who brings out potential in others.',
    'ENFP': 'Enthusiastic, creative, and spontaneous. Loves new experiences.',
    'ISTJ': 'Responsible, reliable, and methodical. Values duty and tradition.',
    'ISFJ': 'Protective, caring, and conscientious. Dedicated helper.',
    'ESTJ': 'Practical, organized leader. Efficient and results-oriented.',
    'ESFJ': 'Loyal, supportive, and sociable. Natural team player.',
    'ISTP': 'Logical, practical, and independent problem-solver.',
    'ISFP': 'Sensitive, artistic, and compassionate. Values authenticity.',
    'ESTP': 'Bold, energetic, and resourceful. Enjoys action and excitement.',
    'ESFP': 'Outgoing, spontaneous, and entertaining. Loves being the center of attention.',
  };

  const color = nftData ? personalityColors[nftData.personality] || { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' } : { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientY - rect.top - rect.height / 2) / 10;
    const y = (e.clientX - rect.left - rect.width / 2) / 10;
    setRotation({ x, y });
  };

  const handleMouseLeave = () => {
    setRotation({ x: 0, y: 0 });
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e17',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          width: '500px',
          height: '500px',
          background: `radial-gradient(circle, ${color.main}15, transparent)`,
          borderRadius: '50%',
          top: '-150px',
          left: '-150px',
          animation: 'float 12s ease-in-out infinite',
        }}></div>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, #a855f710, transparent)',
          borderRadius: '50%',
          bottom: '-100px',
          right: '-100px',
          animation: 'float 15s ease-in-out infinite reverse',
        }}></div>
      </div>

      {/* Main Content Container - FULL WIDTH */}
      <div style={{
        position: 'relative',
        zIndex: 1,
        maxWidth: '1400px',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '2rem',
      }}>
        {/* Success Header - CENTERED */}
        <div style={{
          textAlign: 'center',
          marginBottom: '1rem',
        }}>
          <div style={{
            fontSize: '3.5rem',
            marginBottom: '1rem',
            animation: 'bounce 1s ease-in-out infinite',
          }}>
            🎉
          </div>
          
          <h1 style={{
            fontSize: '3rem',
            fontWeight: '800',
            marginBottom: '0.5rem',
            color: '#fff',
          }}>
            Success!
          </h1>

          <p style={{
            fontSize: '1.125rem',
            color: '#cbd5e1',
            marginTop: '0.5rem',
            lineHeight: '1.6',
          }}>
            Your personality NFT has been minted on the blockchain
          </p>
        </div>

        {/* NFT Card + Info Grid - LEFT/RIGHT */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '3rem',
          width: '100%',
          alignItems: 'start',
        }}>
          {/* Left: NFT Card */}
          {nftData && (
            <div
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              style={{
                perspective: '1200px',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '350px',
                aspectRatio: '1/1.3',
                transformStyle: 'preserve-3d',
                transform: `rotateX(${rotation.x}deg) rotateY(${rotation.y}deg)`,
                transition: 'transform 0.1s linear',
              }}>
                <img
                  src={nftData.nftImage}
                  alt={nftData.personality}
                  style={{
                      width: '100%',
                      height: '100%',
                      borderRadius: '16px',
                      objectFit: 'contain',
                      boxShadow: `0 20px 60px ${color.main}30, 0 0 80px ${color.main}20`,  // ✅ color is available here
                  }}
                />
              </div>
            </div>
          )}

          {/* Right: Info & Buttons */}
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            justifyContent: 'start',
          }}>
            {/* Transaction Details */}
            {nftData && (
              <div style={{
                background: 'rgba(0, 0, 0, 0.3)',
                border: `1px solid ${color.main}20`,
                borderRadius: '12px',
                padding: '2rem',
                backdropFilter: 'blur(10px)',
              }}>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '2rem',
                  marginBottom: '2rem',
                }}>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '0.75rem',
                    }}>
                      Type
                    </p>
                    <p style={{
                      fontSize: '1.5rem',
                      color: color.main,
                      fontWeight: '700',
                    }}>
                      {nftData.personality}
                    </p>
                  </div>
                  <div>
                    <p style={{
                      fontSize: '0.75rem',
                      color: '#94a3b8',
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      marginBottom: '0.75rem',
                    }}>
                      Nickname
                    </p>
                    <p style={{
                      fontSize: '1.25rem',
                      color: '#e2e8f0',
                      fontWeight: '600',
                    }}>
                      {nftData.nickname}
                    </p>
                  </div>
                </div>

                <div style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Description
                  </p>
                  <p style={{
                    fontSize: '0.95rem',
                    color: '#cbd5e1',
                    lineHeight: '1.5',
                  }}>
                    {PERSONALITY_DESCRIPTIONS[nftData.personality] || 'A unique personality type.'}
                  </p>
                </div>

                <div style={{
                  background: 'rgba(0, 0, 0, 0.4)',
                  borderRadius: '8px',
                  padding: '1.5rem',
                  marginBottom: '1.5rem',
                }}>
                  <p style={{
                    fontSize: '0.75rem',
                    color: '#94a3b8',
                    marginBottom: '0.75rem',
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                  }}>
                    Transaction ID
                  </p>
                  <p style={{
                    fontFamily: 'monospace',
                    fontSize: '0.85rem',
                    color: '#cbd5e1',
                    wordBreak: 'break-all',
                  }}>
                    {nftData.txId}
                  </p>
                </div>

                <button
                  onClick={() => {
                    navigator.clipboard.writeText(nftData.txId);
                    alert('Transaction ID copied!');
                  }}
                  style={{
                    width: '100%',
                    padding: '1rem',
                    background: `${color.main}20`,
                    border: `1px solid ${color.main}40`,
                    color: color.main,
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '0.95rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = `${color.main}30`;
                    e.currentTarget.style.borderColor = color.main;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = `${color.main}20`;
                    e.currentTarget.style.borderColor = `${color.main}40`;
                  }}
                >
                  📋 Copy Transaction ID
                </button>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
            }}>
              {nftData && (
                <a
                  href={`https://explorer.solana.com/tx/${nftData.txId}?cluster=custom&customUrl=https%3A%2F%2Frpc.testnet.carv.io%2Frpc`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    padding: '1rem',
                    background: `linear-gradient(135deg, ${color.main}, ${color.dark})`,
                    color: 'white',
                    borderRadius: '8px',
                    textDecoration: 'none',
                    fontWeight: '700',
                    transition: 'all 0.3s ease',
                    textAlign: 'center',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '1rem',
                    boxShadow: `0 10px 30px ${color.main}30`,
                  }}
                  onMouseEnter={(e) => {
                    (e.target as any).style.transform = 'translateY(-3px)';
                    (e.target as any).style.boxShadow = `0 15px 40px ${color.main}50`;
                  }}
                  onMouseLeave={(e) => {
                    (e.target as any).style.transform = 'translateY(0)';
                    (e.target as any).style.boxShadow = `0 10px 30px ${color.main}30`;
                  }}
                >
                  🔍 View on Explorer
                </a>
              )}

              <a
                href="/"
                style={{
                  padding: '1rem',
                  background: 'transparent',
                  border: '2px solid #c8a882',
                  color: '#c8a882',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => {
                  (e.target as any).style.background = 'rgba(200, 168, 130, 0.15)';
                  (e.target as any).style.boxShadow = '0 0 30px rgba(200, 168, 130, 0.3)';
                  (e.target as any).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as any).style.background = 'transparent';
                  (e.target as any).style.boxShadow = 'none';
                  (e.target as any).style.transform = 'translateY(0)';
                }}
              >
                🏠 Back to Home
              </a>

              <a
                href="/assessment"
                style={{
                  padding: '1rem',
                  background: 'transparent',
                  border: '2px solid #3b82f6',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  textDecoration: 'none',
                  fontWeight: '700',
                  transition: 'all 0.3s ease',
                  textAlign: 'center',
                  cursor: 'pointer',
                  fontSize: '1rem',
                }}
                onMouseEnter={(e) => {
                  (e.target as any).style.background = 'rgba(59, 130, 246, 0.15)';
                  (e.target as any).style.boxShadow = '0 0 30px rgba(59, 130, 246, 0.3)';
                  (e.target as any).style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  (e.target as any).style.background = 'transparent';
                  (e.target as any).style.boxShadow = 'none';
                  (e.target as any).style.transform = 'translateY(0)';
                }}
              >
                🔄 Take Another Assessment
              </a>
            </div>
          </div>
        </div>

        {/* SMALL Gradient Bar at BOTTOM */}
        <div style={{
          width: '100%',
          height: '40px',
          background: `linear-gradient(90deg, rgba(255,255,255,0.1) 0%, ${color.main} 100%)`,
          borderRadius: '8px',
          boxShadow: `0 0 20px ${color.main}30`,
          marginTop: '2rem',
        }}></div>

        {/* Footer */}
        <p style={{
          fontSize: '0.95rem',
          color: '#94a3b8',
          textAlign: 'center',
          marginTop: '1rem',
          maxWidth: '100%',
        }}>
          Your personality badge NFT is now permanently stored on the Solana blockchain! 🚀
        </p>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-15px); }
        }

        @media (max-width: 1024px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}

export default function SuccessPage({ searchParams }) {
  const { wallet, personality, nickname } = searchParams;
  const [mintStatus, setMintStatus] = useState('pending');

  useEffect(() => {
    (async () => {
      try {
        // Start minting asynchronously (without blocking)
        await startMintTransaction({ wallet, personality, nickname });
        setMintStatus('minted');
      } catch {
        setMintStatus('failed');
      }
    })();
  }, []);

  return (
    <div>
      {mintStatus === 'pending' && <p>Minting in progress, please wait...</p>}
      {mintStatus === 'minted' && <p>Mint successful! 🎉</p>}
      {mintStatus === 'failed' && <p>Mint failed. Please try again later.</p>}
    </div>
  );
}