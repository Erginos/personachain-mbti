export interface NFTMetadata {
  name: string;
  symbol: string;
  description: string;
  image: string;
  attributes: Array<{
    trait_type: string;
    value: string;
  }>;
}

const PERSONALITY_COLORS: { [key: string]: string } = {
  'INTJ': '#2E1A47',
  'INTP': '#1B3A6B',
  'ENTJ': '#4A1A1A',
  'ENTP': '#1A4A3A',
  'INFJ': '#3A1A4A',
  'INFP': '#1A3A6B',
  'ENFJ': '#4A3A1A',
  'ENFP': '#1A4A2A',
  'ISTJ': '#2A1A3A',
  'ISFJ': '#1A2A5A',
  'ESTJ': '#3A2A1A',
  'ESFJ': '#1A3A2A',
  'ISTP': '#2A2A1A',
  'ISFP': '#1A2A3A',
  'ESTP': '#3A1A2A',
  'ESFP': '#2A3A1A',
};

export function generateNFTImage(personality: string): string {
  const color = PERSONALITY_COLORS[personality] || '#1A1A2E';
  
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1000" height="1000" viewBox="0 0 1000 1000">
      <!-- Background -->
      <rect width="1000" height="1000" fill="${color}"/>
      
      <!-- Gradient overlay -->
      <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:0.1" />
          <stop offset="100%" style="stop-color:#000000;stop-opacity:0.2" />
        </linearGradient>
      </defs>
      <rect width="1000" height="1000" fill="url(#grad)"/>
      
      <!-- Border -->
      <rect x="20" y="20" width="960" height="960" fill="none" stroke="#ffffff" stroke-width="4" opacity="0.3"/>
      
      <!-- Personality Type (Large) -->
      <text x="500" y="450" font-family="Arial, sans-serif" font-size="180" font-weight="bold" 
            text-anchor="middle" fill="#ffffff" opacity="0.9">
        ${personality}
      </text>
      
      <!-- Label -->
      <text x="500" y="650" font-family="Arial, sans-serif" font-size="40" 
            text-anchor="middle" fill="#ffffff" opacity="0.7">
        PersonaChain NFT
      </text>
      
      <!-- Beta Badge -->
      <rect x="650" y="850" width="300" height="100" rx="20" fill="#FFD700" opacity="0.8"/>
      <text x="800" y="920" font-family="Arial, sans-serif" font-size="48" font-weight="bold" 
            text-anchor="middle" fill="#000000">
        BETA
      </text>
    </svg>
  `;

  // Convert SVG to base64
  const base64 = Buffer.from(svg).toString('base64');
  return `data:image/svg+xml;base64,${base64}`;
}

export function generateNFTMetadata(walletAddress: string, personality: string): NFTMetadata {
  const imageDataUrl = generateNFTImage(personality);

  return {
    name: `PersonaChain ${personality}`,
    symbol: 'PERSONA',
    description: `Your MBTI Personality Type: ${personality}. Minted on PersonaChain - A Web3 personality assessment NFT platform.`,
    image: imageDataUrl,
    attributes: [
      { trait_type: 'Type', value: personality },
      { trait_type: 'Owner', value: walletAddress.slice(0, 6) + '...' + walletAddress.slice(-4) },
      { trait_type: 'Version', value: 'Beta' },
      { trait_type: 'Dimension 1', value: personality[0] },
      { trait_type: 'Dimension 2', value: personality[1] },
      { trait_type: 'Dimension 3', value: personality[2] },
      { trait_type: 'Dimension 4', value: personality[3] },
    ],
  };
}