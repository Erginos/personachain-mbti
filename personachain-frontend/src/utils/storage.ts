export interface MintedNFT {
  walletAddress: string;
  personality: string;
  mintedAt: string;
  txId: string;
  network: string;
}

export function hasMinted() {
  // ... rest of code
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

export function clearMintedNFTs() {
  localStorage.removeItem(MINTED_NFTS_KEY);
}

export function hasMinted(): MintedNFT | null {
  const minted = getMintedNFTs();
  return minted.length > 0 ? minted[minted.length - 1] : null;
}
