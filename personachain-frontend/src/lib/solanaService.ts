import {
  Connection,
  PublicKey,
  Transaction,
  SystemProgram,
  LAMPORTS_PER_SOL,
} from '@solana/web3.js';

// CARV Testnet Configuration
export const CARV_RPC_URL = 'https://rpc.testnet.carv.io/rpc';
export const CARV_CONNECTION = new Connection(CARV_RPC_URL, 'confirmed');

// Your Program ID
export const PROGRAM_ID = new PublicKey('BguLb2CYbxZMfs9sXaYi6eXRrKuTRpNgdGuPmTMDsqNh');

// NFT Mint Cost (0.01 SOL in lamports)
export const MINT_COST = 0.01 * LAMPORTS_PER_SOL;

// ============ SVG NFT Generator ============
export interface PersonalityNFTData {
  personality: string;
  nickname: string;
  rarity: string;
  color: string;
}

export const generateNFTSVG = (data: PersonalityNFTData): string => {
  const { personality, nickname, rarity } = data;

  const rarityColors: Record<string, string> = {
    'Very Rare': '#a855f7',
    'Rare': '#3b82f6',
    'Common': '#eab308',
  };

  const bgColor = rarityColors[rarity] || '#a855f7';

  return `
    <svg viewBox="0 0 400 500" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="bgGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:0.2" />
          <stop offset="100%" style="stop-color:${bgColor};stop-opacity:0.1" />
        </linearGradient>
        <linearGradient id="textGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:${bgColor};stop-opacity:1" />
          <stop offset="100%" style="stop-color:#fff;stop-opacity:1" />
        </linearGradient>
      </defs>

      <rect width="400" height="500" fill="#0a0e17" stroke="${bgColor}" stroke-width="3"/>
      <rect width="400" height="500" fill="url(#bgGradient)"/>

      <circle cx="50" cy="50" r="30" fill="${bgColor}" opacity="0.1"/>
      <circle cx="350" cy="450" r="40" fill="${bgColor}" opacity="0.1"/>

      <text x="200" y="60" font-size="24" font-weight="bold" text-anchor="middle" fill="#fff">
        PersonaChain NFT
      </text>

      <text x="200" y="150" font-size="72" font-weight="bold" text-anchor="middle" fill="url(#textGradient)">
        ${personality}
      </text>

      <text x="200" y="220" font-size="18" text-anchor="middle" fill="#cbd5e1">
        ${nickname.substring(0, 20)}
      </text>

      <rect x="100" y="260" width="200" height="50" rx="8" fill="${bgColor}" opacity="0.2" stroke="${bgColor}" stroke-width="2"/>
      <text x="200" y="292" font-size="16" font-weight="bold" text-anchor="middle" fill="${bgColor}">
        ${rarity}
      </text>

      <line x1="50" y1="350" x2="350" y2="350" stroke="${bgColor}" stroke-width="1" opacity="0.3"/>
      
      <text x="200" y="400" font-size="12" text-anchor="middle" fill="#94a3b8">
        Powered by PersonaChain
      </text>

      <text x="200" y="430" font-size="11" text-anchor="middle" fill="#64748b">
        CARV Testnet • Solana Based
      </text>

      <text x="200" y="470" font-size="10" text-anchor="middle" fill="#475569" font-family="monospace">
        Dynamic NFT • Unique Identity
      </text>
    </svg>
  `;
};

// ============ Convert SVG to Base64 ============
export const svgToBase64 = (svg: string): string => {
  const encodedSvg = encodeURIComponent(svg);
  return `data:image/svg+xml,${encodedSvg}`;
};

// ============ Create NFT Metadata ============
export const createNFTMetadata = (data: PersonalityNFTData) => {
  const svg = generateNFTSVG(data);
  const base64Image = svgToBase64(svg);

  return {
    name: `PersonaChain ${data.personality}`,
    symbol: 'PERSONA',
    description: `Your unique MBTI personality NFT on CARV Testnet. Nickname: ${data.nickname}. Rarity: ${data.rarity}. Type: ${data.personality}`,
    image: base64Image,
    attributes: [
      {
        trait_type: 'Personality Type',
        value: data.personality,
      },
      {
        trait_type: 'Nickname',
        value: data.nickname,
      },
      {
        trait_type: 'Rarity',
        value: data.rarity,
      },
      {
        trait_type: 'Collection',
        value: 'PersonaChain NFT',
      },
      {
        trait_type: 'Network',
        value: 'CARV Testnet',
      },
    ],
    properties: {
      files: [
        {
          uri: base64Image,
          type: 'image/svg+xml',
        },
      ],
      category: 'image',
    },
  };
};

// ============ Mint NFT Function (Simplified) ============
export const mintPersonalityNFT = async (
  walletAddress: string,
  personalityType: string,
  nickname: string,
  rarity: string,
  color: string
): Promise<{
  success: boolean;
  txId?: string;
  error?: string;
}> => {
  try {
    if (!window.backpack) {
      throw new Error('Backpack wallet not found. Please install Backpack extension.');
    }

    const provider = window.backpack;

    const connection = CARV_CONNECTION;
    const pubkey = new PublicKey(walletAddress);

    // Get recent blockhash
    const { blockhash } = await connection.getLatestBlockhash();

    // Create transaction
    const transaction = new Transaction({
      recentBlockhash: blockhash,
      feePayer: pubkey,
    });

    // Add instruction to send to program
    const instruction = SystemProgram.transfer({
      fromPubkey: pubkey,
      toPubkey: PROGRAM_ID,
      lamports: MINT_COST,
    });

    transaction.add(instruction);

    // Sign and send transaction
    const signed = await provider.signTransaction(transaction);
    const txId = await connection.sendRawTransaction(signed.serialize());

    // Wait for confirmation
    await connection.confirmTransaction(txId, 'confirmed');

    console.log('✅ NFT Minted! TX:', txId);

    return {
      success: true,
      txId,
    };
  } catch (error) {
    console.error('❌ NFT Mint Error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
};

// ============ Get NFT Balance ============
export const getNFTBalance = async (walletAddress: string): Promise<number> => {
  try {
    const connection = CARV_CONNECTION;
    const pubkey = new PublicKey(walletAddress);

    const balance = await connection.getBalance(pubkey);
    return balance / LAMPORTS_PER_SOL;
  } catch (error) {
    console.error('❌ Error fetching balance:', error);
    return 0;
  }
};

// Type augmentation for Phantom wallet
declare global {
  interface Window {
    solana?: {
      isPhantom?: boolean;
      publicKey?: PublicKey;
      isConnected: boolean;
      connect: () => Promise<{ publicKey: PublicKey }>;
      disconnect: () => Promise<void>;
      signTransaction: (transaction: Transaction) => Promise<Transaction>;
      signAllTransactions: (transactions: Transaction[]) => Promise<Transaction[]>;
      signMessage: (message: Uint8Array) => Promise<{ signature: Uint8Array; publicKey: PublicKey }>;
    };
  }
}

export default {
  generateNFTSVG,
  svgToBase64,
  createNFTMetadata,
  mintPersonalityNFT,
  getNFTBalance,
  CARV_CONNECTION,
  PROGRAM_ID,
  MINT_COST,
};