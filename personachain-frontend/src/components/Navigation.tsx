'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useWallet } from '@/context/WalletContext';

interface NavItem {
  label: string;
  href: string;
  icon?: string;
}

const navItems: NavItem[] = [
  { label: 'My NFTs', href: '/my-nfts'},
  { label: 'Gallery', href: '/gallery'},
];

export default function Navigation() {
  const { isConnected, walletAddress, connectWallet, disconnectWallet } = useWallet();
  const [navBg, setNavBg] = useState('rgba(10, 14, 23, 0.7)');
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setNavBg('rgba(10, 14, 23, 0.7)');
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        background: navBg,
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(168, 85, 247, 0.2)',
        padding: '1rem 2rem',
        transition: 'all 0.3s ease',
      }}
    >
      <div
        style={{
          maxWidth: '1400px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        {/* Branding - Text Only */}
        <Link
          href="/"
          style={{
            textDecoration: 'none',
            cursor: 'pointer',
          }}
        >
          <span
            style={{
              fontSize: '1.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            PersonaChain
          </span>
        </Link>

        {/* Navigation Links */}
        <div
          style={{
            display: 'flex',
            gap: '2rem',
            alignItems: 'center',
            flex: 1,
            marginLeft: '3rem',
          }}
        >
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  padding: '0.75rem 1.25rem',
                  borderRadius: '8px',
                  color: isActive ? '#fff' : '#cbd5e1',
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(126, 34, 206, 0.3))'
                    : 'transparent',
                  border: isActive
                    ? '1px solid rgba(168, 85, 247, 0.5)'
                    : '1px solid rgba(168, 85, 247, 0.1)',
                  transition: 'all 0.3s ease',
                  fontWeight: isActive ? '600' : '500',
                  cursor: 'pointer',
                  fontSize: '0.95rem',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.background = 'rgba(168, 85, 247, 0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.borderColor = 'rgba(168, 85, 247, 0.1)';
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                {item.icon} {item.label}
              </Link>
            );
          })}
        </div>

        {/* Wallet Button */}
        <button
          onClick={isConnected ? disconnectWallet : connectWallet}
          style={{
            padding: '0.75rem 1.5rem',
            background: isConnected
              ? 'linear-gradient(135deg, rgba(34, 197, 94, 0.3), rgba(21, 128, 61, 0.3))'
              : 'linear-gradient(135deg, rgba(168, 85, 247, 0.3), rgba(126, 34, 206, 0.3))',
            border: isConnected
              ? '1px solid rgba(34, 197, 94, 0.5)'
              : '1px solid rgba(168, 85, 247, 0.5)',
            borderRadius: '8px',
            color: '#fff',
            fontWeight: '600',
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            fontSize: '0.9rem',
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(168, 85, 247, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = 'none';
          }}
        >
          {isConnected
            ? `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`
            : '🎒 Connect Backpack'}
        </button>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div {
            flex-direction: column !important;
            gap: 1rem !important;
          }
        }
      `}</style>
    </nav>
  );
}