'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function RepRedirect() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/affiliate/register');
  }, [router]);

  return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="w-8 h-8 border-2 border-soyuz border-t-transparent rounded-full animate-spin" />
    </div>
  );
}
