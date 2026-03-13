'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function getProfile() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);
      
      // Role-based Redirects
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profile?.role === 'admin') {
        router.push('/admin');
        return;
      }
      if (profile?.role === 'affiliate') {
        router.push('/affiliate/dashboard');
        return;
      }

      setLoading(false);
    }
    getProfile();
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">ACCÈS AU PROFIL...</p>
      </div>
    );
  }

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || user?.user_metadata?.first_name || 'CLIENT';

  return (
    <PageLayout
      title={`BIENVENUE ${firstName}`}
      subtitle="TERMINAL UTILISATEUR"
      actions={
        <button 
          onClick={async () => {
             await supabase.auth.signOut();
             router.push('/');
          }}
          className="px-6 py-4 bg-soyuz/10 border border-soyuz/20 text-[10px] font-black uppercase tracking-widest text-soyuz hover:bg-soyuz hover:text-white transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.1)] group"
        >
          <LogOut size={14} /> DÉCONNEXION
        </button>
      }
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all">
          <div className="space-y-1">
            <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">INFOS PROFIL</p>
            <p className="text-xl font-display italic text-white leading-none truncate">{user?.email}</p>
          </div>
          <User className="text-soyuz/20" size={32} />
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all opacity-50 grayscale cursor-not-allowed">
          <div className="space-y-1">
            <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">MES COMMANDES</p>
            <p className="text-xl font-display italic text-white leading-none">0 TRANSACTIONS</p>
          </div>
          <Package className="text-white/10" size={32} />
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all opacity-50 grayscale cursor-not-allowed">
          <div className="space-y-1">
            <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">PARAMÈTRES</p>
            <p className="text-xl font-display italic text-white leading-none">NON CONFIGURÉ</p>
          </div>
          <Settings className="text-white/10" size={32} />
        </div>
      </div>

      <div className="bg-[#0A0A0A] border border-white/5 p-12 text-center">
          <p className="text-[10px] text-[#444444] font-black uppercase tracking-[0.4em]">DONNÉES CHIFFRÉES — PLUS DE FONCTIONNALITÉS À VENIR</p>
      </div>
    </PageLayout>
  );
}
