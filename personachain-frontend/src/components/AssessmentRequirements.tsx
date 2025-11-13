'use client';

interface AssessmentRequirementsProps {
}

export default function AssessmentRequirements() {

  return (
    <div style={{
      background: 'rgba(168, 85, 247, 0.08)',
      border: '1px solid rgba(168, 85, 247, 0.2)',
      borderRadius: '8px',
      padding: '1.5rem',
      marginBottom: '2rem',
      backdropFilter: 'blur(10px)',
    }}>
      <div style={{
        fontSize: '0.875rem',
        color: '#cbd5e1',
        lineHeight: '1.8',
      }}>
        <p style={{ marginBottom: '0.75rem', fontWeight: '600', color: '#a855f7' }}>
          📋 Before you start, make sure you have:
        </p>
        
        <ul style={{
          listStyle: 'none',
          padding: 0,
          margin: '0.75rem 0 0 0',
        }}>
          <li style={{ marginBottom: '0.5rem' }}>
            ✓ A Solana wallet (Backpack or Phantom)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            ✓ Connected to CARV Testnet (RPC: rpc.testnet.carv.io)
          </li>
          <li style={{ marginBottom: '0.5rem' }}>
            ✓ CARV testnet tokens (
            <a
              href="https://faucet.carv.io"
              target="_blank"
              rel="noopener noreferrer"
              style={{
                color: '#a855f7',
                textDecoration: 'underline',
              }}
            >
              get from faucet
            </a>
            )
          </li>
          <li>
            ✓ At least 0.01 SOL for gas fees
          </li>
        </ul>
      </div>
    </div>
  );
}