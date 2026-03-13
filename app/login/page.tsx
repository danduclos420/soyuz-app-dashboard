'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Eye, EyeOff } from 'lucide-react';
import { FormLayout } from '@/components/layout/FormLayout';

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Map username to email if necessary
    const email = username === 'adminprotos' ? 'admin@soyuzbc.com' : username;

    // Shortcut for devtool login
    if (username === 'devtool' && password === 'devtool') {
      // Set dev mode in store
      const { useDevStore } = await import('@/lib/store/dev');
      useDevStore.getState().setDevMode(true);
      router.push('/workshop');
      setLoading(false);
      return;
    }

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role === 'admin') {
        router.push('/admin');
      } else if (profile?.role === 'affiliate') {
        router.push('/affiliate/dashboard');
      } else {
        router.push('/account');
      }
    }
  };

  return (
    <FormLayout
      variant="page"
      maxWidth="max-w-md"
      title="BIENVENUE"
      description="ACCÈS AU CENTRE DE COMMANDEMENT"
    >
      <div className="flex flex-col items-center mb-10">
        <Image 
          src="/assets/logo-short.png" 
          alt="SOYUZ Toro" 
          width={80} 
          height={80} 
          className="mb-6 h-20 w-auto object-contain"
        />
      </div>

      <form onSubmit={handleLogin} className="space-y-6">
        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Utilisateur</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full bg-black border border-white/10 px-4 py-4 text-white font-mono text-sm focus:border-soyuz outline-none transition-colors"
            placeholder="Username / Email"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Mot de Passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-4 text-white font-mono text-sm focus:border-soyuz outline-none transition-colors"
              placeholder="••••••••"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-soyuz transition-colors"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        {error && (
          <p className="text-soyuz text-[10px] uppercase font-black tracking-widest bg-soyuz/10 p-4 border border-soyuz/20">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[10px] py-5 hover:bg-soyuz hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:opacity-30"
        >
          {loading ? 'AUTHENTIFICATION...' : 'SE CONNECTER'}
        </button>

        <div className="text-center pt-6">
          <Link href="/register" className="text-white/20 hover:text-white text-[9px] uppercase tracking-widest transition-colors font-black">
            Pas de compte ? Créer un profil
          </Link>
        </div>
      </form>
    </FormLayout>
  );
}
