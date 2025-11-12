'use client';

import React, { createContext, useState, useContext, ReactNode } from 'react';

interface WalletContextType {
  walletPubkey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [walletPubkey, setWalletPubkey] = useState<string | null>(null);

  const getProvider = () => {
    const win = window as any;
    if (win.solana) return win.solana;
    if (win.backpack) return win.backpack;
    if (win.xnft && win.xnft.solana) return win.xnft.solana;
    return null;
  };

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
      setWalletPubkey(pubkey);
    } catch (err: any) {
      console.error('connect error', err);
      alert('Wallet connection failed: ' + (err?.message || err));
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (provider && provider.disconnect) await provider.disconnect();
      setWalletPubkey(null);
    } catch (err) {
      console.error('disconnect error', err);
    }
  };

  return (
    <WalletContext.Provider value={{ walletPubkey, connectWallet, disconnectWallet }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within WalletProvider');
  }
  return context;
}