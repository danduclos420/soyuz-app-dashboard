'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { User, Package, Settings, LogOut } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import HockeyCard from '@/components/affiliate/HockeyCard';
import { toPng } from 'html-to-image';
import ImageCropper from '@/components/ImageCropper';
import { X } from 'lucide-react';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isCropping, setIsCropping] = useState(false);
  const [tempImage, setTempImage] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
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

    async function fetchStats() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: pData } = await supabase.from('profiles').select('*').eq('id', user.id).single();
      setProfile(pData);

      const { data: oData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', user.email);
      setOrders(oData || []);
    }
    fetchStats();
  }, [router]);

  const handlePhotoUpload = async (base64: string) => {
    setUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const res = await fetch(base64);
      const blob = await res.blob();
      
      const fileName = `${user.id}-${Math.random()}.jpg`;
      const filePath = `avatars/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, blob, { contentType: 'image/jpeg', upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: publicUrl })
        .eq('id', user.id);

      if (updateError) throw updateError;

      setProfile({ ...profile, avatar_url: publicUrl });
      setIsCropping(false);
    } catch (err) {
      console.error('Error uploading photo:', err);
      alert('Erreur lors de l\'upload');
    } finally {
      setUploading(false);
    }
  };

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
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 mb-16 items-center">
         <div className="lg:col-span-2 space-y-8">
            <h2 className="text-6xl font-display italic text-white uppercase leading-tight">
              VOTRE CARTE <span className="outline-text-white">SOYUZ</span>
            </h2>
            <p className="text-[#888888] text-lg uppercase font-bold tracking-widest max-w-xl">
              EN TANT QUE CLIENT PRIVILÉGIÉ, VOUS POSSÉDEZ UNE CARTE DE COLLECTION UNIQUE. RETOURNEZ-LA POUR VOIR VOS STATS.
            </p>
         </div>
         <div className="flex justify-center">
            <HockeyCard 
              user={{
                full_name: profile?.full_name || user?.user_metadata?.full_name || 'CLIENT',
                avatar_url: profile?.avatar_url,
                role: 'customer',
                created_at: profile?.created_at || new Date().toISOString()
              }}
              stats={{
                purchase_count: orders.length,
                total_spent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
                favorite_product: '---' // To be implemented with product counts
              }}
              onEditPhoto={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = 'image/*';
                input.onchange = (e: any) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = () => {
                      setTempImage(reader.result as string);
                      setIsCropping(true);
                    };
                    reader.readAsDataURL(file);
                  }
                };
                input.click();
              }}
              onDownload={() => {}}
            />
         </div>
      </div>

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

      {/* PHOTO CROP MODAL */}
      <AnimatePresence>
        {isCropping && tempImage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-8 bg-black/90 backdrop-blur-xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#050505] border border-white/10 p-10 w-full max-w-2xl relative"
            >
              <button 
                onClick={() => setIsCropping(false)}
                className="absolute top-6 right-6 text-white/20 hover:text-white transition-colors"
                disabled={uploading}
              >
                <X size={24} />
              </button>

              <div className="text-center mb-10">
                <h3 className="text-3xl font-display italic text-white uppercase">STYLE <span className="outline-text-white">CLIENT</span></h3>
                <p className="text-[10px] text-white/20 uppercase tracking-[0.3em] mt-2">PERSONNALISEZ VOTRE CARTE SOYUZ</p>
              </div>

              <div className="max-w-md mx-auto">
                <ImageCropper 
                  initialImage={tempImage}
                  onCropped={handlePhotoUpload}
                  label="DÉCOUPE DE LA CARTE"
                />
              </div>

              {uploading && (
                <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center space-y-4 z-[110]">
                  <div className="w-8 h-8 border-2 border-soyuz border-t-transparent rounded-full animate-spin" />
                  <p className="text-[10px] font-black text-white uppercase tracking-widest">TRANSMISSION...</p>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </PageLayout>
  );
}
