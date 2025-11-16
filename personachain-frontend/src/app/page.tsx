'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { getNFTGallery, NFTGalleryData } from '@/lib/firebase';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nfts, setNfts] = useState<(NFTGalleryData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 20 - 10,
        y: (e.clientY / window.innerHeight) * 20 - 10,
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Fetch NFT Gallery
  useEffect(() => {
    const fetchNFTs = async () => {
      setLoading(true);
      const galleryNFTs = await getNFTGallery(50);
      setNfts(galleryNFTs);
      setLoading(false);
    };
    fetchNFTs();
  }, []);

  return (
    <div className="page-wrapper" style={{
      background: '#0a0e17',
      color: '#cbd5e1',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* HERO SECTION */}
      <section className="hero-section" id="hero" style={{
        position: 'relative',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem 0',
        overflow: 'hidden',
      }}>
        {/* Animated Background */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}>
          {/* Moving Orbs */}
          <div style={{
            position: 'absolute',
            width: '500px',
            height: '500px',
            background: 'radial-gradient(circle, rgba(168, 85, 247, 0.2) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '-100px',
            left: '-100px',
            animation: 'float 12s ease-in-out infinite',
            transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
            transition: 'transform 0.3s ease',
          }}></div>

          <div style={{
            position: 'absolute',
            width: '400px',
            height: '400px',
            background: 'radial-gradient(circle, rgba(59, 130, 246, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            bottom: '-50px',
            right: '-50px',
            animation: 'float 15s ease-in-out infinite reverse',
            transform: `translate(${-mousePos.x}px, ${-mousePos.y}px)`,
            transition: 'transform 0.3s ease',
          }}></div>

          <div style={{
            position: 'absolute',
            width: '350px',
            height: '350px',
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
            borderRadius: '50%',
            top: '50%',
            right: '-100px',
            animation: 'float 18s ease-in-out infinite',
            transform: `translate(${mousePos.x * 0.5}px, ${mousePos.y * 0.5}px)`,
            transition: 'transform 0.3s ease',
          }}></div>
        </div>
          
        {/* Hero Content */}
        <div className="hero-content" style={{
          position: 'relative',
          zIndex: 1,
          textAlign: 'center',
          maxWidth: '800px',
          margin: '0 auto',
          padding: '2rem',
        }}>
          <h1 className="hero-title" style={{
            fontSize: '4rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#ffffff',
            animation: 'slideDown 0.8s ease-out',
          }}>
            PersonaChain
          </h1>

          <h2 className="hero-subtitle" style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'slideUp 0.8s ease-out',
          }}>
            Discover Your Personality On-Chain
          </h2>

          <p className="hero-description" style={{
            fontSize: '1.125rem',
            color: '#cbd5e1',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            animation: 'fadeIn 1s ease-out 0.2s both',
          }}>
            Take our assessment, mint your personality NFT, and join the Web3 community of personalities.
          </p>

          {/* CTA Buttons */}
          <div style={{
            marginTop: '2.5rem',
            display: 'flex',
            gap: '1.5rem',
            justifyContent: 'center',
            flexWrap: 'wrap',
            animation: 'fadeIn 1s ease-out 0.4s both',
          }}>
            <Link href="/assessment" style={{
              display: 'inline-block',
              padding: '14px 36px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: 'white',
              borderRadius: '10px',
              fontWeight: '700',
              textDecoration: 'none',
              fontSize: '1rem',
              border: 'none',
              cursor: 'pointer',
              transition: 'all 0.3s ease',
              boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-3px)';
              e.currentTarget.style.boxShadow = '0 15px 45px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.3)';
            }}
            >
              Test Your Personality 🚀
            </Link>

            <a href="https://explorer.solana.com/?cluster=custom&customUrl=https%3A%2F%2Frpc.testnet.carv.io%2Frpc"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-block',
                padding: '14px 36px',
                border: '2px solid #c8a882',
                color: '#c8a882',
                borderRadius: '10px',
                fontWeight: '700',
                textDecoration: 'none',
                fontSize: '1rem',
                background: 'transparent',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 168, 130, 0.15)';
                e.currentTarget.style.boxShadow = '0 0 30px rgba(200, 168, 130, 0.3)';
                e.currentTarget.style.transform = 'translateY(-3px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.boxShadow = 'none';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              View Explorer 🔗
            </a>
          </div>
        </div>
      </section>

      {/* OUR HISTORY SECTION */}
      <section className="section our-history" style={{
        padding: '6rem 2rem',
        background: '#0f1419',
        position: 'relative',
      }}>
        <div className="container" style={{
          maxWidth: '1200px',
          margin: '0 auto',
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
          }}>
            <span style={{
              color: '#c8a882',
              fontSize: '0.875rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              OUR HISTORY
            </span>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginTop: '1rem',
              color: '#fff',
              marginBottom: '1rem',
            }}>
              Building the Future of Digital Identity
            </h2>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #c8a882, transparent)',
              margin: '0 auto',
            }}></div>
          </div>

          {/* Content Grid */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '4rem',
            alignItems: 'center',
            maxWidth: '1200px',
            margin: '0 auto',
          }}>
            {/* Left */}
            <div>
              <h3 style={{
                fontSize: '2rem',
                fontWeight: '600',
                color: 'white',
                marginBottom: '1.5rem',
              }}>
                PersonaChain: Psychology Meets Blockchain
              </h3>

              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.8',
                marginBottom: '1.5rem',
              }}>
                We combine MBTI personality science with Solana blockchain to create something unprecedented: permanent, immutable personality NFTs.
              </p>

              <p style={{
                color: '#cbd5e1',
                fontSize: '1rem',
                lineHeight: '1.8',
                marginBottom: '2rem',
              }}>
                Your personality is uniquely valuable. When you complete our assessment, you mint an NFT that represents your true self - forever recorded on the Solana blockchain.
              </p>

              <button style={{
                padding: '10px 24px',
                border: '2px solid #c8a882',
                background: 'transparent',
                color: '#c8a882',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(200, 168, 130, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
              }}
              >
                Our Mission
              </button>
            </div>

            {/* Right */}
            <div style={{
              height: '400px',
              background: 'linear-gradient(135deg, rgba(168, 85, 247, 0.1) 0%, rgba(59, 130, 246, 0.1) 100%)',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              backdropFilter: 'blur(10px)',
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🧬</div>
                <h4 style={{ color: '#a855f7', fontSize: '1.5rem', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Your Digital DNA
                </h4>
                <p style={{ color: '#94a3b8' }}>Immutable. Permanent. Yours Forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HALL OF PERSONALITIES SECTION - AUTO SCROLL */}
      <section className="section hall-of-personalities" style={{
        padding: '6rem 2rem',
        background: '#0a0e17',
        position: 'relative',
      }}>
        <div className="container" style={{
          maxWidth: '1400px',
          margin: '0 auto',
        }}>
          {/* Section Header */}
          <div style={{
            textAlign: 'center',
            marginBottom: '4rem',
          }}>
            <span style={{
              color: '#c8a882',
              fontSize: '0.875rem',
              letterSpacing: '2px',
              textTransform: 'uppercase',
            }}>
              OUR WORK
            </span>
            <h2 style={{
              fontSize: '3rem',
              fontWeight: '700',
              marginTop: '1rem',
              color: '#fff',
              marginBottom: '1rem',
            }}>
              Hall of Personalities
            </h2>
            <p style={{
              fontSize: '1.125rem',
              color: '#94a3b8',
              marginTop: '1rem',
            }}>
              Discover all PersonaChain NFTs minted by the community
            </p>
            <div style={{
              width: '60px',
              height: '3px',
              background: 'linear-gradient(90deg, transparent, #c8a882, transparent)',
              margin: '2rem auto 0',
            }}></div>
          </div>

          {/* AUTO-SCROLL CAROUSEL */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#94a3b8',
            }}>
              <p>Loading gallery...</p>
            </div>
          )}

          {!loading && nfts.length > 0 && (
            <div style={{
              position: 'relative',
              overflow: 'hidden',
              background: 'linear-gradient(90deg, rgba(10, 14, 23, 0.8) 0%, transparent 10%, transparent 90%, rgba(10, 14, 23, 0.8) 100%)',
              borderRadius: '12px',
              padding: '2rem 0',
            }}>
              {/* Carousel Wrapper */}
              <div style={{
                display: 'flex',
                animation: 'scroll-left 25s linear infinite',
                gap: '2rem',
                paddingRight: '2rem',
                paddingLeft: '2rem',
              }}>
                {/* Duplicate NFTs for seamless infinite loop */}
                {[...nfts, ...nfts].map((nft, idx) => (
                  <div
                    key={`${nft.id}-${idx}`}
                    style={{
                      minWidth: '220px',
                      flexShrink: 0,
                      background: '#1f2937',
                      border: '1px solid rgba(168, 85, 247, 0.2)',
                      borderRadius: '12px',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      cursor: 'default',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* NFT Image */}
                    <div style={{
                      width: '100%',
                      aspectRatio: '1',
                      overflow: 'hidden',
                      background: '#111827',
                    }}>
                      <img
                        src={nft.nftImage}
                        alt={nft.nickname}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                        }}
                      />
                    </div>

                    {/* Info */}
                    <div style={{ padding: '1.5rem' }}>
                      <h3 style={{
                        fontSize: '1.125rem',
                        fontWeight: 'bold',
                        marginBottom: '0.5rem',
                        color: '#fff',
                        wordBreak: 'break-word',
                      }}>
                        {nft.nickname}
                      </h3>
                      <p style={{
                        fontSize: '0.875rem',
                        color: '#a855f7',
                        fontWeight: '600',
                        marginBottom: '0.75rem',
                      }}>
                        {nft.personality}
                      </p>
                      <p style={{
                        fontSize: '0.75rem',
                        color: '#64748b',
                      }}>
                        {new Date(nft.mintedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {!loading && nfts.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#94a3b8',
            }}>
              <p style={{ fontSize: '1.125rem' }}>
                No NFTs minted yet. Be the first! 🎨
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '3rem 2rem',
        background: '#0a0e17',
        borderTop: '1px solid rgba(200, 168, 130, 0.1)',
        color: '#94a3b8',
        textAlign: 'center',
      }}>
        <p>© 2025 PersonaChain. Built on Solana | CARV SVM Testnet</p>
      </footer>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes scroll-left {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
          
          h1 {
            font-size: 2.5rem !important;
          }
          
          h2 {
            font-size: 1.75rem !important;
          }
        }
      `}</style>
    </div>
  );
}