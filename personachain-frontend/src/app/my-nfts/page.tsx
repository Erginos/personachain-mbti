'use client';

import { useState, useEffect } from 'react';
import { useWallet } from '@/context/WalletContext';
import { getNFTsByWallet, getNFTGallery, getGalleryStats } from '@/lib/firebase';
import { getNFTBalance } from '@/lib/solanaService';

interface NFTData {
  id: string;
  walletAddress: string;
  personality: string;
  nickname: string;
  txId: string;
  nftImage: string;
  mintedAt: string;
  network: string;
}

interface PersonalityStats {
  totalNFTs: number;
  personalityCount: Record<string, number>;
}

export default function MyNFTsPage() {
  const { isConnected, walletAddress, connectWallet } = useWallet();
  
  const [userNFTs, setUserNFTs] = useState<NFTData[]>([]);
  const [allNFTs, setAllNFTs] = useState<NFTData[]>([]);
  const [stats, setStats] = useState<PersonalityStats>({ totalNFTs: 0, personalityCount: {} });
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(false);
  const [tab, setTab] = useState<'my-nfts' | 'gallery'>('my-nfts');
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    loadGalleryData();
  }, []);

  useEffect(() => {
    if (isConnected && walletAddress) {
      loadUserNFTs();
      loadBalance();
    }
  }, [isConnected, walletAddress]);

  const loadUserNFTs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Loading NFTs for:', walletAddress);
      const nfts = await getNFTsByWallet(walletAddress);
      console.log('✅ NFTs loaded:', nfts);
      setUserNFTs(nfts as NFTData[]);
    } catch (error) {
      console.error('❌ Error loading user NFTs:', error);
      setMessage({ type: 'error', text: 'Failed to load NFTs' });
    } finally {
      setLoading(false);
    }
  };

  const loadGalleryData = async () => {
    try {
      const gallery = await getNFTGallery(20);
      setAllNFTs(gallery as NFTData[]);
      const galleryStats = await getGalleryStats();
      setStats(galleryStats as PersonalityStats);
    } catch (error) {
      console.error('Error loading gallery:', error);
    }
  };

  const loadBalance = async () => {
    try {
      const bal = await getNFTBalance(walletAddress);
      setBalance(bal);
    } catch (error) {
      console.error('Error loading balance:', error);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e17',
      color: '#cbd5e1',
      padding: '2rem 1rem',
      paddingTop: '6rem',
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
      }}>
        {/* Header */}
        <div style={{
          marginBottom: '2rem',
        }}>
          <h1 style={{
            fontSize: '2.5rem',
            fontWeight: 'bold',
            background: 'linear-gradient(135deg, #a855f7, #ec4899)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            margin: 0,
            marginBottom: '0.5rem',
          }}>
            My NFTs
          </h1>
          <p style={{ color: '#94a3b8', margin: 0 }}>
            Your PersonaChain NFTs on CARV Testnet
          </p>
        </div>

        {/* Message */}
        {message.text && (
          <div style={{
            padding: '1rem',
            borderRadius: '8px',
            marginBottom: '1.5rem',
            background: message.type === 'success' ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
            border: message.type === 'success' ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(239, 68, 68, 0.5)',
            color: message.type === 'success' ? '#22c55e' : '#ef4444',
          }}>
            {message.text}
          </div>
        )}

        {/* NOT CONNECTED STATE */}
        {!isConnected ? (
          <div style={{
            textAlign: 'center',
            padding: '4rem 2rem',
            background: 'rgba(168, 85, 247, 0.05)',
            borderRadius: '12px',
            border: '1px dashed rgba(168, 85, 247, 0.2)',
          }}>
            <h2 style={{ color: '#cbd5e1', marginBottom: '1rem' }}>
              Connect your wallet to view your NFTs 🔗
            </h2>
            <button
              onClick={connectWallet}
              style={{
                padding: '1rem 2rem',
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                fontWeight: '600',
                cursor: 'pointer',
                fontSize: '1rem',
              }}
            >
              🎒 Connect Backpack Wallet
            </button>
          </div>
        ) : (
          <>
            {/* Balance Info */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
              marginBottom: '2rem',
            }}>
              <div style={{
                background: 'rgba(168, 85, 247, 0.1)',
                border: '1px solid rgba(168, 85, 247, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <p style={{ color: '#a855f7', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  Wallet Balance
                </p>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                  {balance.toFixed(4)} SOL
                </h3>
              </div>

              <div style={{
                background: 'rgba(59, 130, 246, 0.1)',
                border: '1px solid rgba(59, 130, 246, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <p style={{ color: '#60a5fa', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  Your NFTs
                </p>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                  {userNFTs.length}
                </h3>
              </div>

              <div style={{
                background: 'rgba(236, 72, 153, 0.1)',
                border: '1px solid rgba(236, 72, 153, 0.3)',
                borderRadius: '8px',
                padding: '1rem',
              }}>
                <p style={{ color: '#ec4899', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                  Total NFTs
                </p>
                <h3 style={{ color: '#fff', margin: 0, fontSize: '1.5rem' }}>
                  {stats.totalNFTs}
                </h3>
              </div>
            </div>

            {/* Tabs */}
            <div style={{
              display: 'flex',
              gap: '1rem',
              marginBottom: '2rem',
              borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
              flexWrap: 'wrap',
            }}>
              {(['my-nfts', 'gallery'] as const).map((tabName) => (
                <button
                  key={tabName}
                  onClick={() => setTab(tabName)}
                  style={{
                    padding: '0.75rem 1.5rem',
                    background: tab === tabName ? 'rgba(168, 85, 247, 0.2)' : 'transparent',
                    border: 'none',
                    borderBottom: tab === tabName ? '2px solid #a855f7' : 'none',
                    color: tab === tabName ? '#fff' : '#cbd5e1',
                    cursor: 'pointer',
                    fontWeight: tab === tabName ? '600' : '500',
                    transition: 'all 0.3s ease',
                    fontSize: '0.95rem',
                  }}
                  onMouseEnter={(e) => {
                    if (tab !== tabName) {
                      e.currentTarget.style.color = '#fff';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (tab !== tabName) {
                      e.currentTarget.style.color = '#cbd5e1';
                    }
                  }}
                >
                  {tabName === 'my-nfts' && '📁 My NFTs'}
                  {tabName === 'gallery' && '🎭 Gallery'}
                </button>
              ))}
            </div>

            {/* TAB 1: My NFTs */}
            {tab === 'my-nfts' && (
              <div>
                {loading ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8' }}>Loading your NFTs...</p>
                ) : userNFTs.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem 1rem',
                    background: 'rgba(168, 85, 247, 0.05)',
                    borderRadius: '12px',
                  }}>
                    <p style={{ fontSize: '1.125rem', color: '#cbd5e1' }}>
                      You don't have any NFTs yet. Complete the Assessment to mint your first NFT! 🚀
                    </p>
                  </div>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                    gap: '1.5rem',
                  }}>
                    {userNFTs.map((nft) => (
                      <div
                        key={nft.id}
                        style={{
                          background: 'rgba(31, 41, 55, 0.5)',
                          border: '1px solid rgba(168, 85, 247, 0.2)',
                          borderRadius: '12px',
                          overflow: 'hidden',
                          transition: 'all 0.3s ease',
                          cursor: 'pointer',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-5px)';
                          e.currentTarget.style.boxShadow = '0 15px 35px rgba(168, 85, 247, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)';
                          e.currentTarget.style.boxShadow = 'none';
                        }}
                      >
                        <img
                          src={nft.nftImage}
                          alt={nft.personality}
                          style={{
                            width: '100%',
                            height: '250px',
                            objectFit: 'cover',
                            background: '#1f2937',
                          }}
                        />
                        <div style={{ padding: '1rem' }}>
                          <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>
                            {nft.personality}
                          </h3>
                          <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                            {nft.nickname}
                          </p>
                          <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                            {new Date(nft.mintedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: Gallery */}
            {tab === 'gallery' && (
              <div>
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
                  gap: '1.5rem',
                }}>
                  {allNFTs.map((nft) => (
                    <div
                      key={nft.id}
                      style={{
                        background: 'rgba(31, 41, 55, 0.5)',
                        border: '1px solid rgba(168, 85, 247, 0.2)',
                        borderRadius: '12px',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-5px)';
                        e.currentTarget.style.boxShadow = '0 15px 35px rgba(168, 85, 247, 0.15)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = 'none';
                      }}
                    >
                      <img
                        src={nft.nftImage}
                        alt={nft.personality}
                        style={{
                          width: '100%',
                          height: '250px',
                          objectFit: 'cover',
                          background: '#1f2937',
                        }}
                      />
                      <div style={{ padding: '1rem' }}>
                        <h3 style={{ color: '#fff', margin: '0 0 0.5rem 0' }}>
                          {nft.personality}
                        </h3>
                        <p style={{ color: '#cbd5e1', fontSize: '0.875rem', margin: 0, marginBottom: '0.5rem' }}>
                          {nft.nickname}
                        </p>
                        <p style={{ color: '#94a3b8', fontSize: '0.75rem', margin: 0 }}>
                          {nft.walletAddress.substring(0, 6)}...{nft.walletAddress.substring(38)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}