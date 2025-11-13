export interface NFTGeneratorParams {
  personality: string;
  nickname: string;
  walletAddress: string;
  network?: string;
}

export interface PersonalityColorSet {
  main: string;
  light: string;
  dark: string;
  gradient1: string;
  gradient2: string;
}

// UPDATED: Temperament-based color grouping (matches Assessment)
const personalityColors: { [key: string]: PersonalityColorSet } = {
  // GREEN GROUP: INFP, ENFP, INFJ, ENFJ (NF - Idealists)
  'INFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d', gradient1: '#22c55e', gradient2: '#15803d' },
  'ENFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d', gradient1: '#22c55e', gradient2: '#15803d' },
  'INFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d', gradient1: '#22c55e', gradient2: '#15803d' },
  'ENFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d', gradient1: '#22c55e', gradient2: '#15803d' },

  // PURPLE GROUP: INTJ, ENTJ, INTP, ENTP (NT - Rationals)
  'INTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce', gradient1: '#a855f7', gradient2: '#7e22ce' },
  'ENTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce', gradient1: '#a855f7', gradient2: '#7e22ce' },
  'INTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce', gradient1: '#a855f7', gradient2: '#7e22ce' },
  'ENTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce', gradient1: '#a855f7', gradient2: '#7e22ce' },

  // BLUE GROUP: ISTJ, ESTJ, ISFJ, ESFJ (SJ - Guardians)
  'ISTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af', gradient1: '#3b82f6', gradient2: '#1e40af' },
  'ESTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af', gradient1: '#3b82f6', gradient2: '#1e40af' },
  'ISFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af', gradient1: '#3b82f6', gradient2: '#1e40af' },
  'ESFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af', gradient1: '#3b82f6', gradient2: '#1e40af' },

  // YELLOW GROUP: ESFP, ISFP, ESTP, ISTP (SP - Artisans)
  'ESFP': { main: '#eab308', light: '#facc15', dark: '#a16207', gradient1: '#eab308', gradient2: '#a16207' },
  'ISFP': { main: '#eab308', light: '#facc15', dark: '#a16207', gradient1: '#eab308', gradient2: '#a16207' },
  'ESTP': { main: '#eab308', light: '#facc15', dark: '#a16207', gradient1: '#eab308', gradient2: '#a16207' },
  'ISTP': { main: '#eab308', light: '#facc15', dark: '#a16207', gradient1: '#eab308', gradient2: '#a16207' },
};

export async function generateNFTImage(params: NFTGeneratorParams): Promise<string> {
  const { personality, nickname, walletAddress, network = 'CARV SVM' } = params;
  const colors = personalityColors[personality] || personalityColors['INTJ'];

  // Create canvas - 3D card proportions (4:5 ratio)
  const width = 400;
  const height = 550;
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;

  // 1. BACKGROUND GRADIENT
  const bgGradient = ctx.createLinearGradient(0, 0, width, height);
  bgGradient.addColorStop(0, '#0f1419');
  bgGradient.addColorStop(0.5, '#1a2a3a');
  bgGradient.addColorStop(1, '#0a0e17');
  ctx.fillStyle = bgGradient;
  ctx.fillRect(0, 0, width, height);

  // 2. CARD BACKGROUND (Dark navy with color accent)
  const cardX = 30;
  const cardY = 50;
  const cardW = 340;
  const cardH = 450;
  const cardRadius = 16;

  // Draw rounded card
  ctx.fillStyle = 'rgba(15, 20, 25, 0.9)';
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.fill();

  // Card border glow with pink accent
  ctx.strokeStyle = colors.main + '60';
  ctx.lineWidth = 2;
  roundRect(ctx, cardX, cardY, cardW, cardH, cardRadius);
  ctx.stroke();

  // 3. TOP ACCENT LINE (Color gradient)
  const topLineHeight = 6;
  const accentGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
  accentGrad.addColorStop(0, colors.gradient1);
  accentGrad.addColorStop(1, colors.gradient2);
  ctx.fillStyle = accentGrad;
  roundRect(ctx, cardX, cardY, cardW, topLineHeight, [cardRadius, cardRadius, 0, 0]);
  ctx.fill();

  // 4. PERSONALITY TYPE (LARGE CENTER)
  ctx.font = 'bold 72px Arial, sans-serif';
  ctx.fillStyle = colors.main;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = colors.main + '80';
  ctx.shadowBlur = 20;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 0;
  ctx.fillText(personality, width / 2, 160);
  ctx.shadowColor = 'transparent';

  // 5. PERSONALITY LABEL
  ctx.font = 'normal 12px Arial, sans-serif';
  ctx.fillStyle = '#94a3b8';
  ctx.textAlign = 'center';
  ctx.fillText('PERSONALITY TYPE', width / 2, 200);

  // 6. NICKNAME
  ctx.font = 'bold 18px Arial, sans-serif';
  ctx.fillStyle = '#e2e8f0';
  const displayNickname = nickname.substring(0, 20);
  ctx.fillText(displayNickname, width / 2, 250);

  // 7. DIVIDER LINE
  ctx.strokeStyle = colors.main + '40';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(cardX + 20, 280);
  ctx.lineTo(cardX + cardW - 20, 280);
  ctx.stroke();

  // 8. COLLECTION INFO
  ctx.font = 'bold 11px Arial, sans-serif';
  ctx.fillStyle = colors.main;
  ctx.textAlign = 'left';
  ctx.fillText('PERSONACHAIN COLLECTION', cardX + 20, 320);

  ctx.font = 'normal 10px Arial, sans-serif';
  ctx.fillStyle = '#cbd5e1';
  ctx.fillText(network, cardX + 20, 340);

  // 9. WALLET ADDRESS (shortened)
  ctx.font = 'normal 9px monospace';
  ctx.fillStyle = '#94a3b8';
  const shortWallet = walletAddress.slice(0, 8) + '...' + walletAddress.slice(-6);
  ctx.fillText(shortWallet, cardX + 20, 365);

  // 10. FOOTER TEXT
  ctx.font = 'normal 8px Arial, sans-serif';
  ctx.fillStyle = '#64748b';
  ctx.textAlign = 'center';
  ctx.fillText('🔗 Verified on Solana Blockchain', width / 2, 410);

  // 11. DECORATIVE ELEMENTS
  // Gradient circles (subtle background)
  const circleGrad = ctx.createRadialGradient(width, 0, 0, width, 0, 300);
  circleGrad.addColorStop(0, colors.main + '10');
  circleGrad.addColorStop(1, colors.main + '00');
  ctx.fillStyle = circleGrad;
  ctx.beginPath();
  ctx.arc(width, 0, 300, 0, Math.PI * 2);
  ctx.fill();

  // Convert to data URL
  return canvas.toDataURL('image/png');
}

// Helper function to draw rounded rectangles
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number | number[]
) {
  if (typeof r === 'number') {
    r = { tl: r, tr: r, br: r, bl: r };
  } else {
    r = { tl: r[0], tr: r[1], br: r[2], bl: r[3] };
  }

  ctx.beginPath();
  ctx.moveTo(x + r.tl, y);
  ctx.lineTo(x + w - r.tr, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r.tr);
  ctx.lineTo(x + w, y + h - r.br);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r.br, y + h);
  ctx.lineTo(x + r.bl, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r.bl);
  ctx.lineTo(x, y + r.tl);
  ctx.quadraticCurveTo(x, y, x + r.tl, y);
  ctx.closePath();
}