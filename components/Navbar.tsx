'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import Link from 'next/link';
import Image from 'next/image';

export default function Navbar() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });

    return () => subscription.unsubscribe();
  }, []);

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-3 bg-black/80 backdrop-blur-sm border-b border-white/10">
      <Link href="/" className="flex items-center gap-2">
        <Image 
          src="/assets/logo-long.png" 
          alt="SOYUZ BC Logo" 
          width={180} 
          height={40} 
          className="h-10 w-auto object-contain"
          priority
        />
      </Link>
      <div className="flex items-center gap-8">
        <Link href="/#collections" className="text-white uppercase tracking-widest text-sm hover:text-gray-300 transition-colors">Products</Link>
        <Link href="/#b2b" className="text-white uppercase tracking-widest text-sm hover:text-gray-300 transition-colors">B2B</Link>
        {user ? (
          <>
            <Link href="/admin" className="text-white uppercase tracking-widest text-sm hover:text-gray-300 transition-colors">Admin</Link>
            <Link href="/settings" className="text-white uppercase tracking-widest text-sm hover:text-gray-300 transition-colors">Settings</Link>
          </>
        ) : (
          <Link href="/login" className="text-white uppercase tracking-widest text-sm hover:text-gray-300 transition-colors">Login</Link>
        )}
        <a href="#b2b" className="border border-white text-white font-bold uppercase tracking-widest text-sm px-6 py-2 hover:bg-white hover:text-black transition-all duration-200">Contact</a>
      </div>
    </nav>
  );
}
