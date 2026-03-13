'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import BackButton from '@/components/BackButton';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('en');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const dob = (year && month && day) ? `${year}-${month}-${day}` : '';

    const { data: { user }, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: `${firstName} ${lastName}`,
          dob: dob,
          role: 'client',
          preferred_language: language
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
    <main className="min-h-screen bg-black flex items-center justify-center px-6 py-20 relative overflow-hidden">
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
            <div className="grid grid-cols-3 gap-2">
              <select
                value={day}
                onChange={(e) => setDay(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-white outline-none transition-colors text-xs appearance-none"
              >
                <option value="" disabled>Jour</option>
                {[...Array(31)].map((_, i) => (
                  <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>
                    {(i + 1).toString().padStart(2, '0')}
                  </option>
                ))}
              </select>

              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-white outline-none transition-colors text-xs appearance-none"
              >
                <option value="" disabled>Mois</option>
                {[
                  { v: '01', l: 'Janvier' },
                  { v: '02', l: 'Février' },
                  { v: '03', l: 'Mars' },
                  { v: '04', l: 'Avril' },
                  { v: '05', l: 'Mai' },
                  { v: '06', l: 'Juin' },
                  { v: '07', l: 'Juillet' },
                  { v: '08', l: 'Août' },
                  { v: '09', l: 'Septembre' },
                  { v: '10', l: 'Octobre' },
                  { v: '11', l: 'Novembre' },
                  { v: '12', l: 'Décembre' },
                ].map((m) => (
                  <option key={m.v} value={m.v}>{m.l}</option>
                ))}
              </select>

              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-white outline-none transition-colors text-xs appearance-none"
              >
                <option value="" disabled>Année</option>
                {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                  <option key={y} value={y.toString()}>{y}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-gray-400 text-xs uppercase tracking-widest mb-2">Langue Préférée</label>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors text-xs appearance-none"
            >
              <option value="en">US - ENGLISH</option>
              <option value="fr">FR - FRANÇAIS</option>
              <option value="es">ES - ESPAÑOL</option>
              <option value="zh">CN - 中文</option>
              <option value="de">DE - DEUTSCH</option>
              <option value="ru">RU - РУССКИЙ</option>
            </select>
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
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-white outline-none transition-colors"
                placeholder="Password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
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
