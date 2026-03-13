'use client';

import { useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Eye, EyeOff, Globe, Camera } from 'lucide-react';
import { FormLayout } from '@/components/layout/FormLayout';
import ImageCropper from '@/components/ImageCropper';

const LANGUAGES = [
  { code: 'fr', name: 'FRANÇAIS', flag: '🇫🇷' },
  { code: 'en', name: 'ENGLISH', flag: '🇺🇸' },
  { code: 'es', name: 'ESPAÑOL', flag: '🇪🇸' },
  { code: 'de', name: 'DEUTSCH', flag: '🇩🇪' },
  { code: 'it', name: 'ITALIANO', flag: '🇮🇹' },
  { code: 'pt', name: 'PORTUGUÊS', flag: '🇵🇹' },
  { code: 'zh', name: '中文 (CHINOIS)', flag: '🇨🇳' },
  { code: 'ja', name: '日本語 (JAPONAIS)', flag: '🇯🇵' },
  { code: 'ru', name: 'РУССКИЙ (RUSSE)', flag: '🇷🇺' },
  { code: 'ko', name: '한국어 (CORÉEN)', flag: '🇰🇷' },
  { code: 'ar', name: 'العربية (ARABE)', flag: '🇸🇦' },
  { code: 'tr', name: 'TÜRKÇE', flag: '🇹🇷' },
  { code: 'nl', name: 'NEDERLANDS', flag: '🇳🇱' },
  { code: 'pl', name: 'POLSKI', flag: '🇵🇱' },
];

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [language, setLanguage] = useState('fr');
  const [photo, setPhoto] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dob = (year && month && day) ? `${year}-${month}-${day}` : '';

      // 1. Auth SignUp
      const { data: { user }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: `${firstName} ${lastName}`,
            first_name: firstName,
            last_name: lastName,
            dob: dob,
            role: 'client',
            preferred_language: language,
            avatar_url: photo // Store base64 for now, or ideally upload to storage
          }
        }
      });

      if (signUpError) throw signUpError;

      if (user) {
        // If photo exists, we should ideally upload it to Supabase Storage and update profiles
        // For Phase 0 completion, storing in metadata is sufficient for the "link or upload" requirement
        // but let's at least ensures it ends up in the profile.
        
        // Wait for profile trigger to finish and update it with the photo if needed
        // (Assuming a trigger creates the profile from auth.user)
        await supabase.from('profiles').update({
          avatar_url: photo,
          preferred_language: language,
          status: 'active'
        }).eq('id', user.id);

        router.push('/account');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormLayout
      variant="page"
      maxWidth="max-w-2xl"
      title="INSCRIPTION"
      description="CRÉATION DE VOTRE PROFIL SOYUZ"
    >
      <form onSubmit={handleRegister} className="space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Column 1: Identity & Photo */}
          <div className="space-y-8">
            <ImageCropper 
              onCropped={(base64) => setPhoto(base64)} 
              label="PHOTO DE PROFIL (HOCKEY CARD)"
            />

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
                <select value={day} onChange={(e) => setDay(e.target.value)} required className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-xs appearance-none font-mono">
                  <option value="" disabled>Jour</option>
                  {[...Array(31)].map((_, i) => <option key={i + 1} value={(i + 1).toString().padStart(2, '0')}>{(i + 1).toString().padStart(2, '0')}</option>)}
                </select>
                <select value={month} onChange={(e) => setMonth(e.target.value)} required className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-[10px] appearance-none font-bold uppercase">
                  <option value="" disabled>Mois</option>
                  {[{ v: '01', l: 'JAN' }, { v: '02', l: 'FEV' }, { v: '03', l: 'MAR' }, { v: '04', l: 'AVR' }, { v: '05', l: 'MAI' }, { v: '06', l: 'JUN' }, { v: '07', l: 'JUL' }, { v: '08', l: 'AOU' }, { v: '09', l: 'SEP' }, { v: '10', l: 'OCT' }, { v: '11', l: 'NOV' }, { v: '12', l: 'DEC' }].map((m) => <option key={m.v} value={m.v}>{m.l}</option>)}
                </select>
                <select value={year} onChange={(e) => setYear(e.target.value)} required className="w-full bg-black border border-white/10 px-2 py-3 text-white focus:border-soyuz outline-none transition-colors text-xs appearance-none font-mono">
                  <option value="" disabled>Année</option>
                  {Array.from({ length: 100 }, (_, i) => new Date().getFullYear() - i).map((y) => <option key={y} value={y.toString()}>{y}</option>)}
                </select>
              </div>
            </div>
          </div>

          {/* Column 2: Account & Language */}
          <div className="space-y-8">
            <div className="space-y-2">
              <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest flex items-center gap-2">
                <Globe size={12} className="text-soyuz" /> Langue Préférée
              </label>
              <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-2 scrollbar-soyuz">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`flex items-center justify-between px-4 py-3 border transition-all ${
                      language === lang.code 
                        ? 'bg-soyuz/10 border-soyuz text-white shadow-[0_0_20px_rgba(255,0,0,0.1)]' 
                        : 'bg-black border-white/5 text-[#444444] hover:border-white/20'
                    }`}
                  >
                    <span className="text-[10px] font-black tracking-widest">{lang.name}</span>
                    <span className="text-lg">{lang.flag}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors" placeholder="email@example.com" />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">Mot de passe</label>
              <div className="relative">
                <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required className="w-full bg-black border border-white/10 px-4 py-3 text-white focus:border-soyuz outline-none transition-colors" placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-soyuz transition-colors">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
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
          className="w-full bg-white text-black font-black uppercase tracking-[0.2em] text-[11px] py-6 hover:bg-soyuz hover:text-white transition-all shadow-[0_0_40px_rgba(255,255,255,0.05)] disabled:opacity-30"
        >
          {loading ? 'CRÉATION...' : 'CRÉER MON PROFIL SOYUZ'}
        </button>

        <div className="text-center">
          <Link href="/login" className="text-white/20 hover:text-white text-[9px] uppercase tracking-widest transition-colors font-black">
            Déjà membre? Se connecter au réseau
          </Link>
        </div>
      </form>
    </FormLayout>
  );
}
