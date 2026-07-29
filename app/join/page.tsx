'use client';

import { Suspense } from 'react';
import JoinPageContent from '@/app/components/JoinPageContent';

export default function JoinPage() {
  return (
    <Suspense fallback={<div style={{ padding: '20px' }}>Loading...</div>}>
      <JoinPageContent />
    </Suspense>
  );
}
