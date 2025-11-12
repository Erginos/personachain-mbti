export interface MintedNFT {
  walletAddress: string;
  personality: string;
  mintedAt: string;
  txId: string;
  network: string;
} 

export function saveMintedNFT(nft: MintedNFT): void {
  const nfts = getMintedNFTs();
  nfts.push(nft);
  localStorage.setItem('mintedNFTs', JSON.stringify(nfts));
}


export function getMintedNFTs(): MintedNFT[] {
  const data = localStorage.getItem('mintedNFTs');
  return data ? JSON.parse(data) : [];
}


// ONLY ONE hasMinted function!
export function hasMinted(): MintedNFT | null {
  const minted = getMintedNFTs();
  return minted.length > 0 ? minted[minted.length - 1] : null;
}

