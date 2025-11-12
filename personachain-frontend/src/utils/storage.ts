export interface MintedNFT {
  walletAddress: string;
  personality: string;
  mintedAt: string;
  txId: string;
  network: string;
}

export function saveMintedNFT(nft: MintedNFT): void {
  // ...
}

export function getMintedNFTs(): MintedNFT[] {
  // ...
}

// ONLY ONE hasMinted function!
export function hasMinted(): MintedNFT | null {
  const minted = getMintedNFTs();
  return minted.length > 0 ? minted[minted.length - 1] : null;
}
