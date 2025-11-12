import { Program, AnchorProvider } from '@coral-xyz/anchor';
import { PublicKey, Connection } from '@solana/web3.js';
import { PERSONA_NFT_PROGRAM_ID, CARV_RPC } from '@/config/programs';

export async function mintPersonalityNFT(
  wallet: any,
  personalityType: string
) {
  try {
    const connection = new Connection(CARV_RPC, 'confirmed');
    
    // Get program
    const programId = new PublicKey(PERSONA_NFT_PROGRAM_ID);
    
    // Send transaction
    const tx = await wallet.signTransaction(/* transaction */);
    const signature = await connection.sendRawTransaction(tx.serialize());
    
    await connection.confirmTransaction(signature);
    
    return signature;
  } catch (error) {
    console.error('Mint error:', error);
    throw error;
  }
}
