'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';

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
      if (profile?.role === 'rep') {
        router.push('/affiliate');
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
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">ACCESSING PROFILE...</p>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen pt-32 pb-20 selection:bg-soyuz selection:text-white">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-soyuz/5 blur-[150px] rounded-full" />
        <div className="absolute inset-0 carbon-texture opacity-5" />
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-20 border-b border-white/5 pb-16">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-6 uppercase tracking-[0.2em] rounded-full">
              USER TERMINAL
            </span>
            <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] uppercase">
              BIENVENUE <br /><span className="outline-text-white">{user?.user_metadata?.full_name?.split(' ')[0] || 'COMMANDER'}</span>
            </h1>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-wrap gap-4"
          >
            <button 
              onClick={async () => {
                 await supabase.auth.signOut();
                 router.push('/');
              }}
              className="px-6 py-4 bg-soyuz/10 border border-soyuz/20 text-[10px] font-black uppercase tracking-widest text-soyuz hover:bg-soyuz hover:text-white transition-all flex items-center gap-2 shadow-[0_0_30px_rgba(255,0,0,0.1)] group"
            >
              <LogOut size={14} /> LOGOUT
            </button>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all">
            <div className="space-y-1">
              <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">PROFILE INFO</p>
              <p className="text-xl font-display italic text-white leading-none truncate">{user?.email}</p>
            </div>
            <User className="text-soyuz/20" size={32} />
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all opacity-50 grayscale cursor-not-allowed">
            <div className="space-y-1">
              <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">MY ORDERS</p>
              <p className="text-xl font-display italic text-white leading-none">0 TRANSACTIONS</p>
            </div>
            <Package className="text-white/10" size={32} />
          </div>

          <div className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all opacity-50 grayscale cursor-not-allowed">
            <div className="space-y-1">
              <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">SETTINGS</p>
              <p className="text-xl font-display italic text-white leading-none">NOT CONFIGURED</p>
            </div>
            <Settings className="text-white/10" size={32} />
          </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-12 text-center">
            <p className="text-[10px] text-[#444444] font-black uppercase tracking-[0.4em]">MISSION DATA ENCRYPTED — MORE FEATURES COMING SOON</p>
        </div>
      </div>
    </div>
  );
}
