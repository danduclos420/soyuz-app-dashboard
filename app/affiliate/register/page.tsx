'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, Trophy, Users, Zap, Loader2, ArrowRight, CheckCircle2, Eye, EyeOff } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';
import Link from 'next/link';

export default function RepRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    social: '',
    motivation: '',
    repCode: '',
  });
  const [inviteCode, setInviteCode] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [verifyingCode, setVerifyingCode] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const verifyInvite = async () => {
    if (!inviteCode) return;
    setVerifyingCode(true);
    try {
      const { data, error } = await supabase
        .from('invite_codes')
        .select('*')
        .eq('code', inviteCode.toUpperCase())
        .eq('is_used', false)
        .single();

      if (error || !data) {
        toast.error('Code invalide ou déjà utilisé.');
        return;
      }
      setIsUnlocked(true);
      toast.success('Code accepté. Accès autorisé.');
    } catch (err) {
      toast.error('Erreur de vérification.');
    } finally {
      setVerifyingCode(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. We assume the user already has an account. 
      // We try to sign in or just get the current session if they are already logged in.
      let userId = '';
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session) {
        userId = session.user.id;
      } else {
        // Try to sign in with provided credentials to verify they have an account
        const { data: signInData, error: signInError } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });
        
        if (signInError) {
          throw new Error('Identifiants invalides. Veuillez vous assurer d\'avoir d\'abord créé un compte client.');
        }
        userId = signInData.user.id;
      }

      // 2. Insert profile data directly
      const { error: profileError } = await supabase
        .from('profiles')
        .update({
          full_name: `${formData.firstName} ${formData.lastName}`,
          role: 'rep',
          status: 'pending',
          affiliate_code: formData.repCode.toUpperCase() || userId.slice(0, 5).toUpperCase(),
          social_node: formData.social,
          motivation: formData.motivation
        })
        .eq('id', userId);
      
      if (profileError) throw profileError;

      // 3. Mark invite code as used
      await supabase
        .from('invite_codes')
        .update({ is_used: true, used_by: userId, used_at: new Date().toISOString() })
        .eq('code', inviteCode.toUpperCase());

      // 4. Trigger Emails via API
      await fetch('/api/affiliate/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      toast.success('Transmission Received');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Transmission failed. Contact control.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-6 pt-32 selection:bg-soyuz selection:text-white">
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl aspect-square bg-soyuz/10 blur-[120px] rounded-full" />
          <div className="absolute inset-0 carbon-texture opacity-5" />
        </div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-xl w-full bg-[#0A0A0A] border border-white/5 p-16 text-center space-y-10 relative z-10"
        >
          <div className="w-24 h-24 bg-soyuz/10 border border-soyuz/20 rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(255,0,0,0.1)]">
            <CheckCircle2 className="text-soyuz" size={48} />
          </div>
          <div className="space-y-4">
            <h2 className="text-4xl font-display italic text-white uppercase tracking-tight">TRANSMISSION <span className="outline-text-white">LOCKED</span></h2>
            <p className="text-[#888888] text-[10px] uppercase font-black tracking-[0.3em] leading-relaxed max-w-sm mx-auto">
              Your application has been logged. Our elite screening team will review your profile shortly. Keep your sensors active.
            </p>
          </div>
          <Link href="/" className="inline-flex items-center gap-3 px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all">
            RETURN TO BASE <ArrowRight size={14} />
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-40 pb-32 bg-black selection:bg-soyuz selection:text-white overflow-hidden">
      {/* Background Atmosphere */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] right-[-5%] w-[50%] h-[50%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-32 items-start">
          {/* 1. BRAND SIDE */}
          <div className="space-y-20">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              <div className="space-y-4">
                <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] uppercase tracking-[0.2em] rounded-full">
                  PARTNER ONBOARDING
                </span>
                <h1 className="text-6xl md:text-9xl font-display italic tracking-tighter leading-[0.85] uppercase">
                  JOIN THE <br /><span className="outline-text-white">ELITE NODE</span>
                </h1>
              </div>
              <p className="text-[#888888] text-base font-bold uppercase tracking-[0.1em] leading-relaxed max-w-md">
                Become an authorized SOYUZ affiliate. Drive the North American expansion. Earn elite-tier commissions.
              </p>
            </motion.div>
            
            <div className="grid grid-cols-1 gap-12">
              <div className="flex gap-8 group">
                <Trophy className="text-soyuz shrink-0 group-hover:scale-110 transition-transform" size={28} />
                <div className="space-y-2">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em]">ELITE MARGINS</h4>
                  <p className="text-[#444444] text-[9px] font-black uppercase tracking-widest leading-relaxed">Top-tier commission structure on every successful equipment referral.</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <Zap className="text-soyuz shrink-0 group-hover:scale-110 transition-transform" size={28} />
                <div className="space-y-2">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em]">KHL PIPELINE</h4>
                  <p className="text-[#444444] text-[9px] font-black uppercase tracking-widest leading-relaxed">Direct access to professional grade carbon hardware straight from the source.</p>
                </div>
              </div>
              <div className="flex gap-8 group">
                <Users className="text-soyuz shrink-0 group-hover:scale-110 transition-transform" size={28} />
                <div className="space-y-2">
                  <h4 className="text-white font-black text-[11px] uppercase tracking-[0.2em] italic">ALPHA NETWORK</h4>
                  <p className="text-[#444444] text-[9px] font-black uppercase tracking-widest leading-relaxed">Connect with a localized team of high-performance athletes and representatives.</p>
                </div>
              </div>
            </div>

            <div className="p-10 bg-[#0A0A0A] border border-white/5 relative overflow-hidden group">
              <div className="absolute inset-0 carbon-texture opacity-5 group-hover:opacity-10 transition-opacity" />
              <div className="relative z-10 flex items-center gap-8">
                <ShieldCheck className="text-soyuz" size={48} />
                <div>
                  <h4 className="text-white font-display italic text-2xl uppercase">VERIFIED STATUS</h4>
                  <p className="text-[#444444] text-[9px] font-black uppercase tracking-widest mt-1">We seek dedicated athletes who embody the SOYUZ performance mindset.</p>
                </div>
              </div>
            </div>
          </div>

          {/* 2. FORM SIDE */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-[#0A0A0A] border border-white/5 p-16 shadow-[0_0_100px_rgba(255,0,0,0.05)] relative overflow-hidden"
          >
            <div className="absolute inset-0 carbon-texture opacity-5" />
            
            <AnimatePresence mode="wait">
              {!isUnlocked ? (
                <motion.div
                  key="invite-gate"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.05 }}
                  className="relative z-10 space-y-12 py-10"
                >
                  <div className="space-y-4 text-center">
                    <ShieldCheck className="text-soyuz mx-auto" size={64} />
                    <h2 className="text-3xl font-display italic text-white uppercase tracking-tight">INVITATION REQUISE</h2>
                    <p className="text-[#888888] text-[10px] uppercase font-black tracking-[0.3em] leading-relaxed max-w-xs mx-auto">
                      L'accès au réseau d'affiliation est strictement réservé. Veuillez entrer votre code d'invitation personnel.
                    </p>
                  </div>
                  
                  <div className="space-y-6">
                    <Input 
                      placeholder="SOYUZ-XXXX" 
                      value={inviteCode} 
                      onChange={(e) => setInviteCode(e.target.value)}
                      className="text-center text-xl tracking-[0.5em] bg-black border-white/10"
                    />
                    <button 
                      onClick={verifyInvite}
                      disabled={verifyingCode || !inviteCode}
                      className="w-full py-6 bg-white text-black text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all disabled:opacity-20 flex items-center justify-center gap-3"
                    >
                      {verifyingCode ? <Loader2 className="animate-spin" size={16} /> : <>VÉRIFIER LE CODE <ArrowRight size={14} /></>}
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="registration-form"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <form onSubmit={handleSubmit} className="relative z-10 space-y-10">
                    <div className="p-6 bg-soyuz/10 border border-soyuz/20 space-y-2">
                      <p className="text-[10px] font-black text-soyuz uppercase tracking-widest">SÉCURITÉ DÉVERROUILLÉE</p>
                      <p className="text-[9px] text-white/60 font-medium uppercase tracking-wider leading-relaxed">
                        Compte client requis. Veuillez utiliser les mêmes identifiants pour lier votre affiliation.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <Input name="firstName" label="FIRST NAME" placeholder="JEAN" required value={formData.firstName} onChange={handleChange} className="bg-black border-white/5 focus:border-soyuz" />
                      <Input name="lastName" label="LAST NAME" placeholder="DUPONT" required value={formData.lastName} onChange={handleChange} className="bg-black border-white/5 focus:border-soyuz" />
                    </div>
                    <Input name="email" label="SECURE EMAIL (MÊME QUE VOTRE COMPTE)" placeholder="AFFILIATE@SOYUZ.APP" type="email" required value={formData.email} onChange={handleChange} className="bg-black border-white/5 focus:border-soyuz" />
                    <div className="relative">
                      <Input 
                        name="password" 
                        label="PASSWORD (MÊME QUE VOTRE COMPTE)" 
                        placeholder="••••••••" 
                        type={showPassword ? "text" : "password"} 
                        required 
                        value={formData.password} 
                        onChange={handleChange} 
                        className="bg-black border-white/5 focus:border-soyuz pr-12" 
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 bottom-3.5 text-gray-500 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                    <Input name="social" label="SOCIAL NODE (IG/TIKTOK)" placeholder="@USERNAME" required value={formData.social} onChange={handleChange} className="bg-black border-white/5 focus:border-soyuz" />
                    <Input name="repCode" label="DESIRED AFFILIATE CODE" placeholder="AGENT001" value={formData.repCode} onChange={handleChange} className="bg-black border-white/5 focus:border-soyuz" />
                    
                    <div className="space-y-4">
                      <label className="block text-[9px] font-black uppercase tracking-[0.3em] text-[#444444]">
                        MISSION STATEMENT / BACKGROUND
                      </label>
                      <textarea 
                        name="motivation"
                        value={formData.motivation}
                        onChange={handleChange}
                        className="w-full bg-black border border-white/5 rounded-none px-6 py-5 text-xs text-white uppercase font-bold focus:outline-none focus:border-soyuz min-h-[160px] placeholder:text-white/10 transition-all"
                        placeholder="EXPLIQUEZ VOTRE RÉSEAU ET EXPÉRIENCE..."
                        required
                      />
                    </div>
                    
                    <div className="pt-8 space-y-8">
                      <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full py-6 bg-white text-black text-xs font-black uppercase tracking-[0.3em] hover:bg-soyuz hover:text-white transition-all shadow-[0_0_30px_rgba(255,255,255,0.05)] disabled:opacity-30 flex items-center justify-center gap-3"
                      >
                        {loading ? <Loader2 className="animate-spin" size={18} /> : (
                          <>SUBMIT APPLICATION <ArrowRight size={16} /></>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
