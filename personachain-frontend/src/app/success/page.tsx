import { Suspense } from 'react';
import { SuccessContent } from './success-content';

export const dynamic = 'force-dynamic';

export default function SuccessPage() {
  return (
    <Suspense fallback={<div style={{ padding: '2rem', textAlign: 'center', color: '#cbd5e1' }}>Loading your NFT...</div>}>
      <SuccessContent />
    </Suspense>
  );
}