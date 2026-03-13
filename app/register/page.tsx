'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import Link from 'next/link';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          dob: dob,
          role: 'client'
        }
      }
    });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    if (user) {
      router.push('/account');
    }
  };

  return (
    <main className="min-h-screen bg-[#0a0a0a] flex items-center justify-center py-20 px-6">
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
          <h1 className="text-2xl font-bold uppercase tracking-[0.3em] text-white">RECRUITMENT</h1>
          <p className="text-gray-500 text-xs uppercase tracking-widest mt-2">Join the SOYUZ ecosystem</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Prénom</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                placeholder="John"
              />
            </div>
            <div>
              <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Nom</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                placeholder="Doe"
              />
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Date de naissance</label>
            <input
              type="date"
              value={dob}
              onChange={(e) => setDob(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors text-xs"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
              placeholder="email@example.com"
            />
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Mot de passe</label>
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
            {loading ? 'PROCESSING...' : 'CREATE ACCOUNT'}
          </button>

          <div className="text-center pt-4">
            <Link href="/login" className="text-gray-500 hover:text-white text-[10px] uppercase tracking-widest transition-colors font-black">
              Already have an account? Sign In
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
