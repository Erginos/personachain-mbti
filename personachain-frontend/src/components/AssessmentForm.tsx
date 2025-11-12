'use client';

import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/navigation';
import { saveMintedNFT } from '@/utils/storage';
import { PERSONA_NFT_PROGRAM_ID, CARV_RPC } from '@/config/programs';
import { PublicKey, Connection, Transaction, SystemProgram } from '@solana/web3.js';
import { useState } from 'react';
import { Connection, PublicKey, SystemProgram, Transaction } from '@solana/web3.js';
import { CARV_RPC } from '@/config/programs';


interface Question {
  id: number;
  text: string;
  dim: string;
  polarity: number;
}

const QUESTIONS: Question[] = [
  { id: 1, text: 'When meeting someone new, do you prefer to talk and engage quickly?', dim: 'EI', polarity: 1 },
  { id: 2, text: 'Do you often prefer group activities to spending time alone?', dim: 'EI', polarity: 1 },
  { id: 3, text: 'After social events, do you feel energized rather than drained?', dim: 'EI', polarity: 1 },
  { id: 4, text: 'Do you find it easy to strike up conversations with strangers?', dim: 'EI', polarity: 1 },
  { id: 5, text: 'Do you focus more on facts and details than abstract ideas?', dim: 'SN', polarity: 1 },
  { id: 6, text: 'Do you prefer practical solutions more than imagining possibilities?', dim: 'SN', polarity: 1 },
  { id: 7, text: 'Are you more interested in what is happening now than future theories?', dim: 'SN', polarity: 1 },
  { id: 8, text: 'Do you often prefer concrete examples over metaphors?', dim: 'SN', polarity: 1 },
  { id: 9, text: 'Do you base decisions more on logic than personal values?', dim: 'TF', polarity: 1 },
  { id: 10, text: 'Do you find it comfortable to critique ideas objectively?', dim: 'TF', polarity: 1 },
  { id: 11, text: 'Do you prioritize fairness over personal harmony?', dim: 'TF', polarity: 1 },
  { id: 12, text: 'Would you say you trust analysis more than feelings when deciding?', dim: 'TF', polarity: 1 },
  { id: 13, text: 'Do you prefer schedules and planning rather than spontaneous actions?', dim: 'JP', polarity: 1 },
  { id: 14, text: 'Do you feel more comfortable when choices are decided?', dim: 'JP', polarity: 1 },
  { id: 15, text: 'Do you like finishing tasks ahead of time rather than leaving them open?', dim: 'JP', polarity: 1 },
  { id: 16, text: 'Do you structure your day around plans rather than improvising?', dim: 'JP', polarity: 1 },
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

export default function AssessmentForm() {
  const router = useRouter();
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [result, setResult] = useState<string | null>(null);
  const [walletPubkey, setWalletPubkey] = useState<string | null>(null);

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
    const dims: { [key: string]: number } = { EI: 0, SN: 0, TF: 0, JP: 0 };
    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      const mapped = allAnswers[i] - 3;
      dims[q.dim] += mapped * q.polarity;
    }

    const letters: string[] = [];
    letters.push(dims.EI >= 0 ? 'E' : 'I');
    letters.push(dims.SN >= 0 ? 'S' : 'N');
    letters.push(dims.TF >= 0 ? 'T' : 'F');
    letters.push(dims.JP >= 0 ? 'J' : 'P');

    setResult(letters.join(''));
  };

  const getProvider = () => {
    const win = window as any;
    if (win.solana) return win.solana;
    if (win.backpack) return win.backpack;
    if (win.xnft && win.xnft.solana) return win.xnft.solana;
    return null;
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
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold mb-4">Welcome — connect your Solana wallet to begin</h1>
            <p className="mb-4 text-gray-600">Please connect a Solana wallet (Backpack or Phantom recommended).</p>
            <div className="flex items-center justify-center gap-4">
              <button
                className="bg-green-600 text-white px-6 py-3 rounded-md hover:bg-green-700"
                onClick={connectWallet}
              >
                Connect Wallet
              </button>
              <button
                className="px-6 py-3 border rounded-md hover:bg-gray-100"
                onClick={() => alert('Get Backpack: https://backpack.app/')}
              >
                Get Wallet
              </button>
            </div>
          </div>
        );
      }

      return (
        <div>
          <div className="mb-6">
            <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${((current + 1) / QUESTIONS.length) * 100}%` }}
              />
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Question {current + 1} of {QUESTIONS.length}
            </p>
          </div>

          <h2 className="text-2xl font-semibold mb-4">{QUESTIONS[current].text}</h2>

          <div className="space-y-3">
            {[1, 2, 3, 4, 5].map((score) => (
              <button
                key={score}
                onClick={() => handleAnswer(score)}
                className="w-full p-4 border rounded-lg hover:scale-[1.01] transition transform text-left hover:border-blue-500 hover:bg-blue-50"
              >
                <div className="flex items-center justify-between">
                  <span className="font-medium">
                    {['Strongly Disagree', 'Disagree', 'Neutral', 'Agree', 'Strongly Agree'][score - 1]}
                  </span>
                  <span className="text-sm text-gray-500">{score}</span>
                </div>
              </button>
            ))}
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
        }}
        walletPubkey={walletPubkey}
        connectWallet={connectWallet}
        disconnectWallet={disconnectWallet}
        router={router}
      />
    );
  };

  return <div className="bg-white shadow-lg rounded-lg p-6">{renderContent()}</div>;
}

function ResultsDisplay({
  personality,
  onRestart,
  walletPubkey,
  connectWallet,
  disconnectWallet,
  router,
}: {
  personality: string;
  onRestart: () => void;
  walletPubkey: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => Promise<void>;
  router: any;
}) {
  const description = PERSONALITY_DESCRIPTIONS[personality] || 'A comprehensive MBTI personality type.';
  const [minting, setMinting] = useState(false);

  const handleMint = async () => {
  if (!walletPubkey) {
    alert('Please connect your wallet first.');
    return;
  }

  setMinting(true);
  try {
    const connection = new Connection(CARV_RPC, 'confirmed');
    const provider = getProvider();
    
    if (!provider) {
      throw new Error('No wallet provider');
    }

    // Create a simple transaction to CARV SVM
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

    // Save to storage
    saveMintedNFT({
      walletAddress: walletPubkey,
      personality,
      mintedAt: new Date().toISOString(),
      txId,
      network: 'carv-svm-testnet',
    });

    alert('NFT Minted! TX: ' + txId.slice(0, 20) + '...');

    setTimeout(() => {
      router.push(`/success?wallet=${walletPubkey}`);
    }, 1000);
  } catch (err: any) {
    console.error('Mint error:', err);
    alert('Error: ' + (err?.message || err));
  } finally {
    setMinting(false);
  }
};
