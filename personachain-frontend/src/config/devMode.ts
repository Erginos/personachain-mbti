// src/config/devMode.ts
// Mock/Development Mode for Testing

export const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === 'true';

export interface MockNFTData {
  walletAddress: string;
  personality: string;
  nickname: string;
  mintedAt: string;
  txId: string;
  network: string;
  nftImage?: string;
}

// Mock transaction storage (localhost only)
const mockNFTsKey = 'mockNFTs_PersonaChain';

export function saveMockNFT(data: MockNFTData) {
  if (typeof window === 'undefined') return;
  
  const existing = JSON.parse(localStorage.getItem(mockNFTsKey) || '[]');
  existing.push(data);
  localStorage.setItem(mockNFTsKey, JSON.stringify(existing));
  
  console.log('✓ Mock NFT saved (DEV MODE)', data);
}

export function getMockNFTs(): MockNFTData[] {
  if (typeof window === 'undefined') return [];
  
  return JSON.parse(localStorage.getItem(mockNFTsKey) || '[]');
}

export function clearMockNFTs() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(mockNFTsKey);
  console.log('✓ All mock NFTs cleared');
}

// Generate fake transaction ID (for testing)
export function generateMockTxId(): string {
  return 'mock_' + Math.random().toString(36).substring(2, 15) + 
         Math.random().toString(36).substring(2, 15);
}