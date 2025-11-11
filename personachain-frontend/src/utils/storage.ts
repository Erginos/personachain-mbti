export interface MintedNFT {
  walletAddress: string;
  personality: string;
  mintedAt: string;
  txId?: string;  // Add this line
  mint?: string;
  network: string;  // ADD THIS LINE
}

export const MINTED_NFTS_KEY = 'personachain_minted_nfts';

export function saveMintedNFT(nft: MintedNFT) {
  const existing = getMintedNFTs();
  const updated = [...existing, nft];
  localStorage.setItem(MINTED_NFTS_KEY, JSON.stringify(updated));
}

export function getMintedNFTs(): MintedNFT[] {
  if (typeof window === 'undefined') return [];
  const data = localStorage.getItem(MINTED_NFTS_KEY);
  return data ? JSON.parse(data) : [];
}

export function hasMinted(walletAddress: string): MintedNFT | null {
  const minted = getMintedNFTs();
  return minted.find(nft => nft.walletAddress === walletAddress) || null;
}

export function clearMintedNFTs() {
  localStorage.removeItem(MINTED_NFTS_KEY);
}