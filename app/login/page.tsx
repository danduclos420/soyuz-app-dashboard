'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import BackButton from '@/components/BackButton';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const useRouterInstance = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map username to email if necessary
    // For adminprotos, we use the initialized email
    const email = username === 'adminprotos' ? 'admin@soyuzbc.com' : username;

    const { data: { user }, error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      setLoading(false);
      return;
    }

    if (user) {
      // Fetch role from profiles
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        useRouterInstance.push('/admin');
      } else if (profile?.role === 'rep') {
        useRouterInstance.push('/rep/dashboard');
      } else {
        useRouterInstance.push('/account');
      }
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6">
      <BackButton />
      <div className="w-full max-w-md bg-[#0D0D0D] border border-white/10 p-10">
        <div className="text-center mb-10 flex flex-col items-center">
          <Image 
            src="/assets/logo-short.png" 
            alt="SOYUZ Toro" 
            width={80} 
            height={80} 
            className="mb-6 h-20 w-auto object-contain"
          />
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-white">SOYUZ LOGIN</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Access the command center</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
              placeholder="Username"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
              placeholder="Password"
            />
          </div>

          {error && <p className="text-red-500 text-xs uppercase tracking-widest">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-white text-black font-bold uppercase tracking-widest py-4 hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {loading ? 'AUTHENTICATING...' : 'SIGN IN'}
          </button>

          <div className="text-center pt-4">
            <Link href="/register" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-black">
              Don't have an account? Create one
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
