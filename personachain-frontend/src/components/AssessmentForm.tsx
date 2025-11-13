'use client';

import { useRouter } from 'next/navigation';
import { saveMintedNFT } from '@/utils/storage';
import { CARV_RPC } from '@/config/programs';
import { PublicKey, Connection, Transaction, SystemProgram } from '@solana/web3.js';
import { useState, useEffect } from 'react';

// NFT Generation imports
import { generateNFTImage } from '@/utils/nftGenerator';
import { DEV_MODE, saveMockNFT, generateMockTxId } from '@/config/devMode';

interface Question {
  id: number;
  text: string;
  dim: 'EI' | 'SN' | 'TF' | 'JP';
  polarity: 1 | -1;
}

const QUESTIONS: Question[] = [
  // ENERGY: EXTROVERSION vs INTROVERSION (EI)
  { id: 1, text: 'At parties or social events, do you feel energized and happy?', dim: 'EI', polarity: 1 },
  { id: 2, text: 'After spending time with many people, do you need time alone to rest?', dim: 'EI', polarity: -1 },
  { id: 3, text: 'Do you like to start conversations with new people?', dim: 'EI', polarity: 1 },
  { id: 4, text: 'Do you prefer small group meetings or talking one-on-one with people?', dim: 'EI', polarity: -1 },
  // INFORMATION: SENSING vs INTUITION (SN)
  { id: 5, text: 'Do you focus on facts and details you can see now?', dim: 'SN', polarity: 1 },
  { id: 6, text: 'Do you prefer real, practical things instead of ideas and theories?', dim: 'SN', polarity: 1 },
  { id: 7, text: 'When learning something new, do you like step-by-step instructions?', dim: 'SN', polarity: 1 },
  { id: 8, text: 'Do you like to think about the future and imagine new possibilities?', dim: 'SN', polarity: -1 },
  // DECISION: THINKING vs FEELING (TF)
  { id: 9, text: 'When making decisions, do you use logic and facts?', dim: 'TF', polarity: 1 },
  { id: 10, text: 'Do you find it easy to tell someone they did something wrong?', dim: 'TF', polarity: 1 },
  { id: 11, text: 'When making decisions, do you think about how it will affect people?', dim: 'TF', polarity: -1 },
  { id: 12, text: 'Do you trust feelings and gut instinct more than cold logic?', dim: 'TF', polarity: -1 },
  // STRUCTURE: JUDGING vs PERCEIVING (JP)
  { id: 13, text: 'Do you like to plan and organize before starting something?', dim: 'JP', polarity: 1 },
  { id: 14, text: 'When you have choices, do you like to decide quickly?', dim: 'JP', polarity: 1 },
  { id: 15, text: 'Do you prefer to finish work early or do things at the last minute?', dim: 'JP', polarity: 1 },
  { id: 16, text: 'Do you like to keep your schedule flexible to try new things?', dim: 'JP', polarity: -1 },
];

const PERSONALITY_DESCRIPTIONS: { [key: string]: string } = {
  'INTJ': 'Strategic, logical, and independent. Prefers planning and systems.',
  'INTP': 'Analytical, thoughtful, and innovative. Enjoys intellectual exploration.',
  'ENTJ': 'Bold, decisive, and strategic leader. Natural organizer.',
  'ENTP': 'Inventive, analytical, and debater. Loves exploring ideas.',
  'INFJ': 'Compassionate, intuitive, and principled. Seeks meaning and connection.',
  'INFP': 'Idealistic, empathetic, and value-driven.',
  'ENFJ': 'Charismatic, inspirational leader who brings out potential in others.',
  'ENFP': 'Enthusiastic, creative, and spontaneous. Loves new experiences.',
  'ISTJ': 'Responsible, reliable, and methodical. Values duty and tradition.',
  'ISFJ': 'Protective, caring, and conscientious. Dedicated helper.',
  'ESTJ': 'Practical, organized leader. Efficient and results-oriented.',
  'ESFJ': 'Loyal, supportive, and sociable. Natural team player.',
  'ISTP': 'Logical, practical, and independent problem-solver.',
  'ISFP': 'Sensitive, artistic, and compassionate. Values authenticity.',
  'ESTP': 'Bold, energetic, and resourceful. Enjoys action and excitement.',
  'ESFP': 'Outgoing, spontaneous, and entertaining. Loves being the center of attention.',
};

const personalityColors: { [key: string]: { main: string; light: string; dark: string } } = {
  // GREEN GROUP: INFP, ENFP, INFJ, ENFJ (NF - Idealists)
  'INFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
  'ENFP': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
  'INFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },
  'ENFJ': { main: '#22c55e', light: '#4ade80', dark: '#15803d' },

  // PURPLE GROUP: INTJ, ENTJ, INTP, ENTP (NT - Rationals)
  'INTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
  'ENTJ': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
  'INTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },
  'ENTP': { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' },

  // BLUE GROUP: ISTJ, ESTJ, ISFJ, ESFJ (SJ - Guardians)
  'ISTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
  'ESTJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
  'ISFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },
  'ESFJ': { main: '#3b82f6', light: '#60a5fa', dark: '#1e40af' },

  // YELLOW GROUP: ESFP, ISFP, ESTP, ISTP (SP - Artisans)
  'ESFP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
  'ISFP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
  'ESTP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
  'ISTP': { main: '#eab308', light: '#facc15', dark: '#a16207' },
};

const getProvider = () => {
  const win = window as any;
  if (win.solana) return win.solana;
  if (win.backpack) return win.backpack;
  if (win.xnft && win.xnft.solana) return win.xnft.solana;
  return null;
};

export default function AssessmentForm() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [walletPubkey, setWalletPubkey] = useState<string | null>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [nickname, setNickname] = useState('');

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 15 - 7.5,
        y: (e.clientY / window.innerHeight) * 15 - 7.5,
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleAnswer = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
    } else {
      calculateResult(nextAnswers);
    }
  };

  const calculateResult = (allAnswers: number[]) => {
    const scores = { E: 0, I: 0, S: 0, N: 0, T: 0, F: 0, J: 0, P: 0 };
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      const score = allAnswers[i];
      if (q.dim === 'EI') {
        if (q.polarity === 1) { scores.E += score; } else { scores.I += Math.abs(score); }
      } else if (q.dim === 'SN') {
        if (q.polarity === 1) { scores.S += score; } else { scores.N += Math.abs(score); }
      } else if (q.dim === 'TF') {
        if (q.polarity === 1) { scores.T += score; } else { scores.F += Math.abs(score); }
      } else if (q.dim === 'JP') {
        if (q.polarity === 1) { scores.J += score; } else { scores.P += Math.abs(score); }
      }
    }
    const type =
      (scores.E >= scores.I ? 'E' : 'I') +
      (scores.S >= scores.N ? 'S' : 'N') +
      (scores.T >= scores.F ? 'T' : 'F') +
      (scores.J >= scores.P ? 'J' : 'P');
    setResult(type);
  };

  const connectWallet = async () => {
    try {
      const provider = getProvider();
      if (!provider) {
        alert('No compatible wallet detected. Please install Backpack or Phantom.');
        return;
      }
      let resp = null;
      if (provider.connect) {
        resp = await provider.connect();
      }
      const pubkey = (resp && resp.publicKey)
        ? resp.publicKey.toString()
        : provider.publicKey
        ? provider.publicKey.toString()
        : null;
      if (!pubkey) {
        alert('Wallet connected but no public key returned. Try again.');
        return;
      }
      setWalletPubkey(pubkey);
    } catch (err: any) {
      console.error('connect error', err);
      alert('Wallet connection failed: ' + (err?.message || err));
    }
  };

  const disconnectWallet = async () => {
    try {
      const provider = getProvider();
      if (provider && provider.disconnect) await provider.disconnect();
      setWalletPubkey(null);
    } catch (err) {
      console.error('disconnect error', err);
    }
  };

  const renderContent = () => {
    if (!result) {
      if (!walletPubkey) {
        return (
          <div style={{
            textAlign: 'center',
            padding: '3rem 1rem',
            animation: 'fadeIn 0.8s ease-out',
          }}>
            <h1 style={{
              fontSize: '2rem',
              fontWeight: 'bold',
              marginBottom: '1rem',
              color: '#fff',
            }}>
              Welcome — Connect Your Solana Wallet
            </h1>
            <p style={{
              marginBottom: '2rem',
              color: '#cbd5e1',
              fontSize: '1rem',
            }}>
              Please connect a Solana wallet (Backpack or Phantom recommended).
            </p>
            <div style={{
              display: 'flex',
              gap: '1rem',
              justifyContent: 'center',
              flexWrap: 'wrap',
            }}>
              <button
                style={{
                  padding: '14px 36px',
                  background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                  boxShadow: '0 10px 30px rgba(168, 85, 247, 0.3)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-3px)';
                  e.currentTarget.style.boxShadow = '0 15px 45px rgba(168, 85, 247, 0.5)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 10px 30px rgba(168, 85, 247, 0.3)';
                }}
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              <button
                style={{
                  padding: '14px 36px',
                  border: '2px solid #c8a882',
                  color: '#c8a882',
                  background: 'transparent',
                  borderRadius: '8px',
                  fontWeight: '700',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  transition: 'all 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'rgba(200, 168, 130, 0.15)';
                  e.currentTarget.style.boxShadow = '0 0 30px rgba(200, 168, 130, 0.3)';
                  e.currentTarget.style.transform = 'translateY(-3px)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.boxShadow = 'none';
                  e.currentTarget.style.transform = 'translateY(0)';
                }}
                onClick={() => window.open('https://backpack.app/', '_blank')}
              >
                Get Wallet
              </button>
            </div>
          </div>
        );
      }

      return (
        <div style={{
          padding: '2rem 1rem',
          animation: 'fadeIn 0.8s ease-out',
        }}>
          {/* Progress Bar */}
          <div style={{
            marginBottom: '2rem',
            maxWidth: '600px',
            margin: '0 auto 2rem',
          }}>
            <div style={{
              background: '#1f2937',
              height: '10px',
              borderRadius: '8px',
              overflow: 'hidden',
              marginBottom: '0.75rem',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              boxShadow: '0 0 20px rgba(168, 85, 247, 0.2)',
            }}>
              <div
                style={{
                  background: 'linear-gradient(90deg, #a855f7, #ec4899)',
                  height: '100%',
                  width: `${((current + 1) / QUESTIONS.length) * 100}%`,
                  transition: 'width 0.3s ease',
                  borderRadius: '8px',
                  boxShadow: '0 0 20px rgba(168, 85, 247, 0.5)',
                }}
              />
            </div>
            <p style={{
              color: '#94a3b8',
              fontSize: '0.875rem',
              textAlign: 'center',
            }}>
              Question {current + 1} of {QUESTIONS.length}
            </p>
          </div>

          {/* Question */}
          <div style={{ maxWidth: '700px', margin: '0 auto' }}>
            <h2 style={{
              fontSize: '1.5rem',
              fontWeight: '600',
              marginBottom: '2rem',
              color: '#fff',
              lineHeight: '1.6',
              textAlign: 'center',
              animation: 'slideUp 0.5s ease-out',
            }}>
              {QUESTIONS[current].text}
            </h2>

            {/* Answer Options */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {[-2, -1, 0, 1, 2].map((score, idx) => (
                <button
                  key={score}
                  onClick={() => handleAnswer(score)}
                  style={{
                    padding: '1rem',
                    border: '2px solid transparent',
                    borderRadius: '8px',
                    background: '#1f2937',
                    color: '#cbd5e1',
                    fontWeight: '500',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease',
                    fontSize: '1rem',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#374151';
                    e.currentTarget.style.borderColor = '#a855f7';
                    e.currentTarget.style.color = '#fff';
                    e.currentTarget.style.boxShadow = '0 0 20px rgba(168, 85, 247, 0.3)';
                    e.currentTarget.style.transform = 'translateX(5px)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = '#1f2937';
                    e.currentTarget.style.borderColor = 'transparent';
                    e.currentTarget.style.color = '#cbd5e1';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
                    e.currentTarget.style.transform = 'translateX(0)';
                  }}
                >
                  <span>
                    {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'][idx]}
                  </span>
                  <span style={{ fontSize: '0.875rem', opacity: 0.7 }}>{score}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      );
    }

    return (
      <ResultsDisplay
        personality={result}
        onRestart={() => {
          setAnswers([]);
          setCurrent(0);
          setResult(null);
          setNickname('');
        }}
        walletPubkey={walletPubkey}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        router={router}
        nickname={nickname}
        setNickname={setNickname}
      />
    );
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: '#0a0e17',
      color: '#cbd5e1',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      padding: '2rem 0',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Animated Background */}
      <div style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 0,
      }}>
        <div style={{
          position: 'absolute',
          width: '400px',
          height: '400px',
          background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, transparent 70%)',
          borderRadius: '50%',
          top: '-100px',
          left: '-100px',
          animation: 'float 12s ease-in-out infinite',
          transform: `translate(${mousePos.x}px, ${mousePos.y}px)`,
          transition: 'transform 0.3s ease',
        }}></div>

        <div style={{
          position: 'absolute',
          width: '300px',
          height: '300px',
          background: 'radial-gradient(circle, rgba(59, 130, 246, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          bottom: '-50px',
          right: '-50px',
          animation: 'float 15s ease-in-out infinite reverse',
          transform: `translate(${-mousePos.x * 0.5}px, ${-mousePos.y * 0.5}px)`,
          transition: 'transform 0.3s ease',
        }}></div>
      </div>

      {/* Content */}
      <div style={{
        position: 'relative',
        zIndex: 1,
      }}>
        {renderContent()}
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-30px); }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}

function ResultsDisplay({
  personality,
  onRestart,
  walletPubkey,
  connectWallet,
  disconnectWallet,
  router,
  nickname,
  setNickname,
}: {
  personality: string;
  onRestart: () => void;
  walletPubkey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  router: any;
  nickname: string;
  setNickname: (nick: string) => void;
}) {
  const description = PERSONALITY_DESCRIPTIONS[personality] || 'A unique personality type.';
  const [minting, setMinting] = useState(false);
  const color = personalityColors[personality] || { main: '#a855f7', light: '#c084fc', dark: '#7e22ce' };

  const handleMint = async () => {
    if (!walletPubkey) {
      alert('Please connect your wallet first.');
      return;
    }

    if (!nickname.trim()) {
      alert('Please enter a nickname for your NFT!');
      return;
    }

    setMinting(true);
    try {
      console.log('📸 Generating NFT image...');
      const nftImageUrl = await generateNFTImage({
        personality: personality,
        nickname: nickname.trim(),
        walletAddress: walletPubkey,
        network: 'CARV SVM'
      });
      console.log('✅ NFT image generated!');

      if (DEV_MODE) {
        console.log('🟡 DEV MODE: Simulating NFT mint...');
        const mockTxId = generateMockTxId();
        const nftData = {
          walletAddress: walletPubkey,
          personality: personality,
          nickname: nickname.trim(),
          mintedAt: new Date().toISOString(),
          txId: mockTxId,
          network: 'carv-svm-testnet',
          nftImage: nftImageUrl
        };
        console.log('💾 Saving mock NFT:', nftData);
        saveMockNFT(nftData);
        alert('✓ NFT Generated! (DEV MODE - No gas fee)\nTX: ' + mockTxId);
        setTimeout(() => {
          router.push(`/success?wallet=${walletPubkey}&devMode=true`);
        }, 1000);
      } else {
        console.log('🟢 PRODUCTION: Minting real NFT...');
        const connection = new Connection(CARV_RPC, 'confirmed');
        const provider = getProvider();

        if (!provider) {
          throw new Error('No wallet provider');
        }

        const transaction = new Transaction().add(
          SystemProgram.transfer({
            fromPubkey: new PublicKey(walletPubkey),
            toPubkey: new PublicKey(walletPubkey),
            lamports: 0,
          })
        );

        transaction.feePayer = new PublicKey(walletPubkey);
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;

        const signedTx = await provider.signTransaction(transaction);
        const txId = await connection.sendRawTransaction(signedTx.serialize());
        await connection.confirmTransaction(txId, 'confirmed');

        const nftData = {
          walletAddress: walletPubkey,
          personality: personality,
          nickname: nickname.trim(),
          mintedAt: new Date().toISOString(),
          txId,
          network: 'carv-svm-testnet',
          nftImage: nftImageUrl
        };

        console.log('💾 Saving real NFT:', nftData);
        saveMintedNFT(nftData);
        alert('🟢 NFT Minted! TX: ' + txId.slice(0, 20) + '...');

        setTimeout(() => {
          router.push(`/success?wallet=${walletPubkey}`);
        }, 1000);
      }
    } catch (err: any) {
      console.error('❌ Mint error:', err);
      alert('Error: ' + (err?.message || err));
    } finally {
      setMinting(false);
    }
  };

  return (
    <div style={{
      textAlign: 'center',
      padding: '2rem 1rem',
      maxWidth: '800px',
      margin: '0 auto',
      animation: 'fadeIn 0.8s ease-out',
    }}>
      <h1 style={{
        fontSize: '2.5rem',
        fontWeight: 'bold',
        marginBottom: '1rem',
        color: '#fff',
      }}>
        Your Personality Type
      </h1>

      <div style={{
        fontSize: '5rem',
        fontWeight: 'bold',
        color: color.main,
        marginBottom: '1.5rem',
        letterSpacing: '3px',
        textShadow: `0 0 30px ${color.main}60`,
        animation: 'slideUp 0.6s ease-out',
      }}>
        {personality}
      </div>

      <p style={{
        fontSize: '1.125rem',
        color: '#cbd5e1',
        marginBottom: '2rem',
        lineHeight: '1.6',
      }}>
        {description}
      </p>

      {/* Nickname Input */}
      <div style={{
        maxWidth: '500px',
        margin: '0 auto 2rem',
        textAlign: 'left',
      }}>
        <label style={{
          display: 'block',
          marginBottom: '0.5rem',
          color: '#cbd5e1',
          fontWeight: '600',
        }}>
          Your NFT Nickname 🎭
        </label>
        <input
          type="text"
          value={nickname}
          onChange={(e) => setNickname(e.target.value.slice(0, 20))}
          placeholder="Enter a cool nickname (max 20 chars)"
          style={{
            width: '100%',
            padding: '1rem',
            background: '#1f2937',
            border: `2px solid ${color.main}40`,
            borderRadius: '8px',
            color: '#fff',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
          }}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = color.main;
            e.currentTarget.style.boxShadow = `0 0 20px ${color.main}40`;
          }}
          onBlur={(e) => {
            e.currentTarget.style.borderColor = `${color.main}40`;
            e.currentTarget.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.2)';
          }}
        />
        {nickname && (
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.875rem',
            color: color.main,
          }}>
            ✓ Preview: <strong>{nickname}</strong> - will appear on your NFT
          </p>
        )}
      </div>

      {/* Wallet & Mint */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap', marginBottom: '2rem' }}>
        {walletPubkey ? (
          <>
            <div style={{
              padding: '0.75rem 1rem',
              background: '#1f2937',
              border: '1px solid rgba(168, 85, 247, 0.2)',
              borderRadius: '8px',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              color: '#cbd5e1',
            }}>
              ✓ Connected: {walletPubkey.slice(0, 6)}...{walletPubkey.slice(-6)}
            </div>
            <button
              style={{
                padding: '0.75rem 1rem',
                border: '1px solid #ef4444',
                color: '#ef4444',
                background: 'transparent',
                borderRadius: '8px',
                cursor: 'pointer',
                fontWeight: '600',
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(239, 68, 68, 0.1)')}
              onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
              onClick={disconnectWallet}
            >
              Disconnect
            </button>
          </>
        ) : (
          <button
            style={{
              padding: '12px 32px',
              background: 'linear-gradient(135deg, #a855f7, #ec4899)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontWeight: '600',
              cursor: 'pointer',
              fontSize: '1rem',
              transition: 'all 0.3s ease',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 15px 45px rgba(168, 85, 247, 0.5)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            onClick={connectWallet}
          >
            Connect Wallet
          </button>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
        <button
          style={{
            padding: '12px 32px',
            background: `linear-gradient(135deg, ${color.main}, ${color.dark})`,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: minting || !walletPubkey || !nickname.trim() ? 0.5 : 1,
            transition: 'all 0.3s ease',
            boxShadow: `0 10px 30px ${color.main}30`,
          }}
          onMouseEnter={(e) => !minting && walletPubkey && nickname.trim() && (e.currentTarget.style.transform = 'translateY(-3px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
          onClick={handleMint}
          disabled={minting || !walletPubkey || !nickname.trim()}
        >
          {minting ? 'Minting NFT...' : 'Mint My NFT 🚀'}
        </button>

        <button
          style={{
            padding: '12px 32px',
            border: '2px solid #c8a882',
            color: '#c8a882',
            background: 'transparent',
            borderRadius: '8px',
            fontWeight: '600',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'all 0.3s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = 'rgba(200, 168, 130, 0.1)')}
          onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          onClick={onRestart}
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
}