'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff } from 'lucide-react';
import { FormLayout } from '@/components/layout/FormLayout';

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('fr'); // Default to FR
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
    <FormLayout
      variant="page"
      maxWidth="max-w-md"
      title="INSCRIPTION"
      description="CRÉATION DE VOTRE PROFIL CLIENT"
    >
      <div className="flex flex-col items-center mb-10">
        <Image 
          src="/assets/logo-short.png" 
          alt="SOYUZ Toro" 
          width={80} 
          height={80} 
          className="mb-6 h-16 w-auto object-contain"
        />
      </div>

      <form onSubmit={handleRegister} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Prénom</label>
            <input
              type="text"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors"
              placeholder="John"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Nom</label>
            <input
              type="text"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors"
              placeholder="Doe"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Date de naissance</label>
          <div className="grid grid-cols-3 gap-2">
            <select
              value={day}
              onChange={(e) => setDay(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-xs appearance-none font-mono"
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
              className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-[10px] appearance-none font-bold uppercase tracking-tighter"
            >
              <option value="" disabled>Mois</option>
              {[
                { v: '01', l: 'JAN' }, { v: '02', l: 'FEV' }, { v: '03', l: 'MAR' },
                { v: '04', l: 'AVR' }, { v: '05', l: 'MAI' }, { v: '06', l: 'JUN' },
                { v: '07', l: 'JUL' }, { v: '08', l: 'AOU' }, { v: '09', l: 'SEP' },
                { v: '10', l: 'OCT' }, { v: '11', l: 'NOV' }, { v: '12', l: 'DEC' },
              ].map((m) => (
                <option key={m.v} value={m.v}>{m.l}</option>
              ))}
            </select>

            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-xs appearance-none font-mono"
            >
              <option value="" disabled>Année</option>
              {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => (
                <option key={y} value={y.toString()}>{y}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Langue Préférée</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            required
            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors text-[10px] font-black uppercase tracking-widest appearance-none"
          >
            <option value="en">US - ENGLISH</option>
            <option value="fr">FR - FRANÇAIS</option>
            <option value="es">ES - ESPAÑOL</option>
            <option value="zh">CN - 中文</option>
            <option value="de">DE - DEUTSCH</option>
            <option value="ru">RU - РУССКИЙ</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors"
            placeholder="email@example.com"
          />
        </div>

        <div className="space-y-2">
          <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Mot de passe</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors"
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
          {loading ? 'CRÉATION...' : 'CRÉER LE COMPTE'}
        </button>

        <div className="text-center pt-6">
          <Link href="/login" className="text-white/20 hover:text-white text-[9px] uppercase tracking-widest transition-colors font-black">
            Déjà inscrit? Se connecter
          </Link>
        </div>
      </form>
    </FormLayout>
  );
}
