'use client';

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { getNFTGallery, NFTGalleryData } from '@/lib/firebase';

export default function Home() {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nfts, setNfts] = useState<(NFTGalleryData & { id: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  // Mouse tracking for animated background
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
      const galleryNFTs = await getNFTGallery(10);
      setNfts(galleryNFTs);
      setLoading(false);
    };
    fetchNFTs();
  }, []);

  // Pagination handlers with transition
  const handleNextPage = () => {
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev + 1) % nfts.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  const handlePrevPage = () => {
    setIsTransitioning(true);
    setCurrentPage((prev) => (prev - 1 + nfts.length) % nfts.length);
    setTimeout(() => setIsTransitioning(false), 300);
  };

  // Swipe handlers
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    setTouchEnd(e.changedTouches[0].clientX);
    handleSwipe();
  };

  const handleSwipe = () => {
    if (!touchStart || !touchEnd) return;
    
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > 50;
    const isRightSwipe = distance < -50;

    if (isLeftSwipe) {
      handleNextPage();
    } else if (isRightSwipe) {
      handlePrevPage();
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrevPage();
      if (e.key === 'ArrowRight') handleNextPage();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const currentNFT = nfts[currentPage];

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
        {/* Animated Background Orbs */}
        <div style={{
          position: 'absolute',
          inset: 0,
          zIndex: 0,
          pointerEvents: 'none',
        }}>
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
          <h1 style={{
            fontSize: 'clamp(2rem, 8vw, 4rem)',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#ffffff',
            animation: 'slideDown 0.8s ease-out',
            margin: 0,
          }}>
            PersonaChain
          </h1>

          <h2 style={{
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
            fontWeight: '700',
            marginBottom: '2rem',
            background: 'linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #3b82f6 100%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            animation: 'slideUp 0.8s ease-out',
            margin: 0,
          }}>
            Discover Your Personality On-Chain
          </h2>

          <p style={{
            fontSize: 'clamp(1rem, 3vw, 1.125rem)',
            color: '#cbd5e1',
            marginBottom: '2.5rem',
            lineHeight: '1.6',
            animation: 'fadeIn 1s ease-out 0.2s both',
            margin: 0,
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
      <section style={{
        padding: '6rem 2rem',
        background: '#0f1419',
        position: 'relative',
      }}>
        <div style={{
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
              fontSize: 'clamp(1.75rem, 6vw, 3rem)',
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
                <p style={{ color: '#94a3b8', margin: 0 }}>Immutable. Permanent. Yours Forever.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* HALL OF PERSONALITIES SECTION */}
      <section className="hallOfPersonalities">
        <div className="hallContainer">
          {/* Section Header */}
          <div className="hallHeader">
            <span className="hallSubtitle">OUR WORK</span>
            <h2 className="hallTitle">Hall of Personalities</h2>
            <p className="hallDescription">
              Discover all PersonaChain NFTs minted by the community
            </p>
            <div className="hallDivider"></div>
          </div>

          {/* DESKTOP - Auto-scroll carousel */}
          {!loading && nfts.length > 0 && (
            <div className="carouselWrapper carouselDesktop">
              <div className="carouselTrack">
                {[...nfts, ...nfts].map((nft, idx) => (
                  <div
                    key={`${nft.id}-${idx}`}
                    className="carouselCard"
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                      e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <div className="carouselImage">
                      <img src={nft.nftImage} alt={nft.nickname} />
                    </div>
                    <div className="carouselInfo">
                      <h3 className="carouselNickname">{nft.nickname}</h3>
                      <p className="carouselPersonality">{nft.personality}</p>
                      <p className="carouselDate">
                        {new Date(nft.mintedAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* MOBILE - Paginated cards with swipe support */}
          {!loading && nfts.length > 0 && currentNFT && (
            <div 
              className="carouselMobile"
              ref={carouselRef}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              style={{ cursor: 'grab', userSelect: 'none', position: 'relative' }}
            >
              <div className="paginationCard" style={{
                opacity: isTransitioning ? 0 : 1,
                transition: 'opacity 0.3s ease-in-out, transform 0.3s ease-in-out',
                transform: isTransitioning ? 'scale(0.95)' : 'scale(1)',
              }}>
                <div className="carouselImage">
                  <img src={currentNFT.nftImage} alt={currentNFT.nickname} />
                </div>
                <div className="carouselInfo">
                  <h3 className="carouselNickname">{currentNFT.nickname}</h3>
                  <p className="carouselPersonality">{currentNFT.personality}</p>
                  <p className="carouselDate">
                    {new Date(currentNFT.mintedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Pagination Controls - SIDE BY SIDE */}
              <div style={{
                display: 'flex',
                gap: '1rem',
                justifyContent: 'center',
                alignItems: 'center',
                flexWrap: 'wrap',
                marginTop: '1.5rem',
              }}>
                <button 
                  className="paginationBtn" 
                  onClick={handlePrevPage}
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    flex: '0 0 auto',
                  }}
                >
                  ← Previous
                </button>
                <span style={{
                  color: '#cbd5e1',
                  fontSize: '0.875rem',
                  minWidth: '70px',
                  textAlign: 'center',
                  flex: '0 0 auto',
                }}>
                  {currentPage + 1} / {nfts.length}
                </span>
                <button 
                  className="paginationBtn" 
                  onClick={handleNextPage}
                  style={{ 
                    padding: '0.75rem 1.5rem',
                    fontSize: '0.875rem',
                    flex: '0 0 auto',
                  }}
                >
                  Next →
                </button>
              </div>

              {/* Swipe hint */}
              <p style={{
                fontSize: '0.75rem',
                color: '#64748b',
                textAlign: 'center',
                marginTop: '0.75rem',
              }}>
                Swipe left/right or use arrow keys 👆
              </p>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div style={{
              textAlign: 'center',
              padding: '4rem 2rem',
              color: '#94a3b8',
            }}>
              <p>Loading gallery...</p>
            </div>
          )}

          {/* Empty State */}
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
        <p style={{ margin: 0 }}>© 2025 PersonaChain. Built on Solana | CARV SVM Testnet</p>
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
          from { opacity: 0; }
          to { opacity: 1; }
        }

        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }

        /* Mobile optimizations */
        @media (max-width: 767px) {
          div[style*="gridTemplateColumns: '1fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}