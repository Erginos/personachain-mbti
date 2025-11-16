'use client';

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';

interface WalletContextType {
  isConnected: boolean;
  walletAddress: string;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

const getProvider = () => {
  if (typeof window === 'undefined') return null;
  const backpack = (window as any).backpack;
  const phantom = (window as any).solana;
  return backpack || phantom;
};

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState('');

  useEffect(() => {
    const checkConnection = () => {
      try {
        const provider = getProvider();
        if (provider && provider.isConnected && provider.publicKey) {
          const address = provider.publicKey.toString();
          setWalletAddress(address);
          setIsConnected(true);
          console.log('✅ Wallet auto-connected:', address);
        }
      } catch (error) {
        console.log('Wallet not auto-connected');
      }
    };
    const timer = setTimeout(checkConnection, 500);
    return () => clearTimeout(timer);
  }, []);

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        alert('No compatible wallet detected. Please install Backpack or Phantom.');
        return;
      }
      let resp = null;
      if (provider.connect) {
        resp = await provider.connect();
      }
      const pubkey = (resp && resp.publicKey)
        ? resp.publicKey.toString()
        : provider.publicKey
        ? provider.publicKey.toString()
        : null;
      if (!pubkey) {
        alert('Wallet connected but no public key returned. Try again.');
        return;
      }
      setWalletAddress(pubkey);
      setIsConnected(true);
      console.log('✅ Wallet connected:', pubkey);
    } catch (err: any) {
      console.error('❌ Connect error:', err);
      alert('Wallet connection failed: ' + (err?.message || err));
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (provider && provider.disconnect) {
        await provider.disconnect();
      }
      setWalletAddress('');
      setIsConnected(false);
      console.log('✅ Wallet disconnected');
    } catch (err: any) {
      console.error('❌ Disconnect error:', err);
      alert('Wallet disconnect failed: ' + (err?.message || err));
    }
  };

  return (
    <WalletContext.Provider
      value={{
        isConnected,
        walletAddress,
        connectWallet,
        disconnectWallet,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
};

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}
