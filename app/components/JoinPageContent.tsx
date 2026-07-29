'use client';

import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import ScriptGenerator from '@/app/components/ScriptGenerator';

export default function JoinPageContent() {
  const searchParams = useSearchParams();
  const devToken = searchParams.get('whop-dev-user-token');
  
  const [userId, setUserId] = useState<string | null>(null);
  const [userProducts, setUserProducts] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!devToken) {
      setError('No dev token provided');
      setLoading(false);
      return;
    }

    try {
      const parts = devToken.split('.');
      if (parts.length !== 3) throw new Error('Invalid token format');
      
      const payload = JSON.parse(atob(parts[1]));
      const extractedUserId = payload.sub;
      setUserId(extractedUserId);

      fetch('/api/user-access', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: extractedUserId }),
      })
        .then(res => res.json())
        .then(data => {
          const products = [];
          if (data.hasGameDev) products.push('prod_2NCaLmIX3miCc');
          if (data.hasVideoGen) products.push('prod_rvBtXBKVYH9wR');
          setUserProducts(products);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setLoading(false);
        });
    } catch (err) {
      setError('Failed to parse token');
      setLoading(false);
    }
  }, [devToken]);

  if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
  if (error) return <div style={{ padding: '20px', color: 'red' }}>Error: {error}</div>;
  if (!userId) return <div style={{ padding: '20px', color: 'red' }}>No user ID found</div>;

  return <ScriptGenerator userId={userId} userProducts={userProducts} />;
}
