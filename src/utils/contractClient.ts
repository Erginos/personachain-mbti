// Simplified contract client without problematic imports

const PROGRAM_ID = 'BguLb2CYbxZMfs9sXaYi6eXRrKuTRpNgdGuPmTMDsqNh';

export async function mintPersonalityNFT(
  walletAddress: string,
  personalityType: string,
  name: string,
  symbol: string,
  uri: string,
  provider: any
): Promise<string> {
  try {
    console.log('Attempting to mint:', {
      walletAddress,
      personalityType,
      name,
      symbol,
    });

    // For now, simulate the transaction
    // In production, this would call your Anchor program
    
    // Generate a fake transaction ID
    const txId = 'tx_' + Math.random().toString(36).substr(2, 20);
    
    console.log('Mock transaction created:', txId);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    return txId;
  } catch (error) {
    console.error('Minting error:', error);
    throw error;
  }
}

export async function getProvider(wallet: any): Promise<any> {
  return {
    wallet,
    connection: null,
  };
}