'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase-client';
import { useRouter } from 'next/navigation';
import { User, Package, Settings, LogOut, ChevronRight, Calendar, CreditCard, Box, MapPin } from 'lucide-react';
import { PageLayout } from '@/components/layout/PageLayout';
import HockeyCard from '@/components/affiliate/HockeyCard';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'orders' | 'settings'>('dashboard');
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
      
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (profileData?.role === 'admin') {
        router.push('/admin');
        return;
      }
      if (profileData?.role === 'affiliate') {
        router.push('/affiliate/dashboard');
        return;
      }

      setProfile(profileData);
      setLoading(false);

      // Fetch Orders
      const { data: oData } = await supabase
        .from('orders')
        .select('*')
        .eq('customer_email', session.user.email)
        .order('created_at', { ascending: false });
      setOrders(oData || []);
    }
    getProfile();
  }, [router]);

  const handlePhotoUpload = async (base64: string) => {
    setUploading(true);
    try {
      const res = await fetch(base64);
      const blob = await res.blob();
      
      const fileName = `${user.id}-${Date.now()}.jpg`;
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

      setProfile((prev: any) => ({ ...prev, avatar_url: publicUrl }));
      toast.success('Profil mis à jour !');
    } catch (err) {
      console.error('Error uploading photo:', err);
      toast.error("Erreur lors de l'upload");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-8">
        <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_20px_rgba(255,0,0,0.2)]" />
        <p className="text-[10px] font-black text-white/20 uppercase tracking-[0.5em]">SYNCHRONISATION TERMINAL...</p>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || user?.user_metadata?.full_name?.split(' ')[0] || 'CLIENT';

  return (
    <PageLayout
      title={`MON COMPTE ${firstName}`}
      subtitle="ESPACE CLIENT PRIVÉ"
      actions={
        <button 
          onClick={handleLogout}
          className="px-6 py-4 bg-soyuz/10 border border-soyuz/20 text-[10px] font-black uppercase tracking-widest text-soyuz hover:bg-soyuz hover:text-white transition-all flex items-center gap-2 group shadow-[0_0_30px_rgba(255,0,0,0.05)]"
        >
          <LogOut size={14} /> DÉCONNEXION
        </button>
      }
    >
      {/* TABS NAVIGATION */}
      <div className="flex border-b border-white/5 mb-12 overflow-x-auto no-scrollbar">
        {[
          { id: 'dashboard', label: 'TABLEAU DE BORD', icon: User },
          { id: 'orders', label: 'MES COMMANDES', icon: Package },
          { id: 'settings', label: 'PARAMÈTRES', icon: Settings }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-6 text-[10px] font-black tracking-widest transition-all whitespace-nowrap border-b-2 ${
              activeTab === tab.id 
              ? 'border-soyuz text-white bg-white/[0.02]' 
              : 'border-transparent text-white/20 hover:text-white hover:bg-white/[0.01]'
            }`}
          >
            <tab.icon size={14} className={activeTab === tab.id ? 'text-soyuz' : ''} />
            {tab.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-16"
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-center">
              <div className="lg:col-span-2 space-y-8">
                <h2 className="text-6xl font-display italic text-white uppercase leading-tight">
                  STATUT <span className="outline-text-white">CLIENT</span> PRO
                </h2>
                <div className="flex flex-wrap gap-4">
                  <div className="px-6 py-3 bg-white/5 border border-white/10 rounded-full flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]" />
                    <span className="text-[10px] text-white font-black uppercase tracking-widest">Compte Actif</span>
                  </div>
                  <div className="px-6 py-3 bg-soyuz/5 border border-soyuz/20 rounded-full flex items-center gap-3">
                    <span className="text-[10px] text-soyuz font-black uppercase tracking-widest">Membre Soyuz Elite</span>
                  </div>
                </div>
                <p className="text-[#888888] text-lg uppercase font-bold tracking-widest max-w-xl">
                  Accédez à vos statistiques d'achat et gérez votre profil professionnel. Utilisez votre carte pour partager votre passion.
                </p>
                
                <div className="pt-8">
                  <button 
                    onClick={() => router.push('/products')}
                    className="px-10 py-5 bg-white text-black text-[10px] font-black uppercase tracking-[0.2em] hover:bg-soyuz hover:shadow-[0_0_50px_rgba(255,0,0,0.3)] transition-all flex items-center gap-3"
                  >
                    CONTINUER LES ACHATS <ChevronRight size={14} />
                  </button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <HockeyCard 
                  user={{
                    full_name: profile?.full_name || 'CLIENT SOYUZ',
                    avatar_url: profile?.avatar_url,
                    role: 'customer',
                    created_at: profile?.created_at || new Date().toISOString()
                  }}
                  stats={{
                    purchase_count: orders.length,
                    total_spent: orders.reduce((sum, o) => sum + (o.total || 0), 0),
                  }}
                  onPhotoSelected={handlePhotoUpload}
                />
              </div>
            </div>

            {/* QUICK STATS */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { label: 'Dépenses Totales', value: `$${orders.reduce((sum, o) => sum + (o.total || 0), 0).toLocaleString()}`, icon: CreditCard },
                { label: 'Commandes', value: orders.length, icon: Package },
                { label: 'Points Fidelité', value: Math.floor(orders.reduce((sum, o) => sum + (o.total || 0), 0) / 10), icon: Box },
                { label: 'Ancienneté', value: '6 MOIS', icon: Calendar }
              ].map((stat, i) => (
                <div key={i} className="bg-[#0A0A0A] border border-white/5 p-10 flex flex-col justify-between h-48 group hover:border-soyuz/20 transition-all shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
                  <div className="space-y-1">
                    <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">{stat.label}</p>
                    <p className="text-3xl font-display italic text-white leading-none">{stat.value}</p>
                  </div>
                  <stat.icon className="text-soyuz/10 group-hover:text-soyuz/30 transition-colors" size={32} />
                </div>
              ))}
            </div>

            {/* B2B TEASER */}
            <div className="relative p-12 overflow-hidden border border-white/5 bg-gradient-to-r from-soyuz/10 to-transparent flex flex-col md:flex-row items-center justify-between gap-8 group">
               <div className="absolute top-0 right-0 w-64 h-64 bg-soyuz/10 blur-[100px] pointer-events-none" />
               <div className="space-y-4 relative z-10">
                  <h3 className="text-3xl font-display italic text-white uppercase tracking-tighter">PROGRAMME <span className="text-soyuz">B2B</span> SOYUZ</h3>
                  <p className="text-white/40 text-[10px] font-black uppercase tracking-widest max-w-md">Devenez un partenaire officiel et profitez de tarifs exclusifs pour les équipes et les pros.</p>
               </div>
               <button 
                 onClick={() => router.push('/b2b')}
                 className="relative z-10 px-8 py-4 border border-soyuz text-soyuz text-[10px] font-black uppercase tracking-widest hover:bg-soyuz hover:text-white transition-all shadow-[0_0_50px_rgba(255,0,0,0.1)]"
               >
                 VOIR LES AVANTAGES
               </button>
            </div>
          </motion.div>
        )}

        {activeTab === 'orders' && (
          <motion.div
            key="orders"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="space-y-8"
          >
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-display italic text-white uppercase">HISTORIQUE DES <span className="outline-text-white">COMMANDES</span></h3>
              <p className="text-[10px] text-white/20 font-black tracking-widest uppercase">{orders.length} RÉSULTATS</p>
            </div>

            {orders.length === 0 ? (
              <div className="py-32 border border-dashed border-white/5 flex flex-col items-center justify-center space-y-6">
                <Package size={48} className="text-[#111111]" />
                <p className="text-[10px] text-white/20 font-black tracking-widest uppercase">AUCUNE COMMANDE TROUVÉE</p>
                <button 
                  onClick={() => router.push('/products')}
                  className="px-8 py-4 bg-white/5 border border-white/10 text-white text-[10px] font-black uppercase tracking-widest hover:bg-white hover:text-black transition-all"
                >
                  DÉCOUVRIR LE CATALOGUE
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4">
                {orders.map((order) => (
                  <div 
                    key={order.id} 
                    className="bg-[#0A0A0A] border border-white/5 p-8 flex flex-col md:flex-row items-center justify-between gap-8 group hover:border-white/10 transition-all"
                  >
                    <div className="flex items-center gap-8 w-full md:w-auto">
                      <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center text-soyuz group-hover:scale-110 transition-transform">
                        <Package size={24} />
                      </div>
                      <div className="space-y-1">
                        <p className="text-[10px] text-soyuz font-black tracking-widest uppercase mb-1">DÉTAILS COMMANDE</p>
                        <h4 className="text-xl font-display italic text-white uppercase tracking-tighter">
                          ST-#{(order.id || '0000').slice(0, 8).toUpperCase()}
                        </h4>
                        <p className="text-[10px] text-white/20 font-black tracking-[0.2em]">
                          EFFECTUÉE LE {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-12 w-full md:w-auto justify-between md:justify-end">
                      <div className="text-center md:text-right">
                        <p className="text-[9px] text-white/20 font-black tracking-widest uppercase">STATUT</p>
                        <p className={`text-[10px] font-black uppercase tracking-widest mt-1 ${
                          order.status === 'paid' ? 'text-green-500' : 
                          order.status === 'shipped' ? 'text-blue-500' : 
                          order.status === 'delivered' ? 'text-green-500' : 
                          'text-soyuz'
                        }`}>
                          {order.status?.toUpperCase() || 'PAYÉ'}
                        </p>
                      </div>
                      <div className="text-center md:text-right">
                        <p className="text-[9px] text-white/20 font-black tracking-widest uppercase">TOTAL</p>
                        <p className="text-2xl font-display italic text-white tracking-widest mt-1">${order.total?.toLocaleString()}</p>
                      </div>
                      <button className="p-4 bg-white/5 rounded-xl text-white/40 hover:bg-soyuz hover:text-black transition-all">
                        <ChevronRight size={20} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {activeTab === 'settings' && (
          <motion.div
            key="settings"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 lg:grid-cols-2 gap-12"
          >
            <div className="space-y-12">
               <h3 className="text-2xl font-display italic text-white uppercase">INFOS <span className="outline-text-white">PERSONNELLES</span></h3>
               <div className="space-y-6">
                 <div className="space-y-2">
                   <label className="text-[10px] text-white/20 font-black uppercase tracking-widest">NOM COMPLET</label>
                   <input 
                     type="text" 
                     defaultValue={profile?.full_name || user?.user_metadata?.full_name} 
                     className="w-full bg-[#0A0A0A] border border-white/5 p-6 text-white font-bold tracking-widest focus:border-soyuz outline-none transition-all placeholder:text-white/10"
                     placeholder="VOTRE NOM"
                   />
                 </div>
                 <div className="space-y-2">
                   <label className="text-[10px] text-white/20 font-black uppercase tracking-widest">EMAIL</label>
                   <input 
                     type="email" 
                     disabled
                     value={user?.email} 
                     className="w-full bg-[#0A0A0A] border border-white/5 p-6 text-white/20 font-bold tracking-widest cursor-not-allowed"
                   />
                 </div>
                 <button className="w-full py-6 bg-soyuz text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all shadow-[0_20px_40px_rgba(255,0,0,0.1)]">
                   ENREGISTRER LES MODIFICATIONS
                 </button>
               </div>
            </div>

            <div className="space-y-12">
               <h3 className="text-2xl font-display italic text-white uppercase">ADRESSE DE <span className="outline-text-white">LIVRAISON</span></h3>
               <div className="bg-[#0A0A0A] border border-white/5 p-10 flex items-start gap-8">
                  <div className="p-4 bg-white/5 rounded-2xl text-white/20">
                    <MapPin size={24} />
                  </div>
                  <div className="space-y-2">
                    {profile?.address ? (
                      <>
                        <p className="text-white font-bold tracking-widest uppercase">{profile.address}</p>
                        <button className="text-[10px] text-soyuz font-black uppercase tracking-widest hover:underline">Modifier l'adresse</button>
                      </>
                    ) : (
                      <>
                        <p className="text-white/20 font-bold tracking-widest uppercase">AUCUNE ADRESSE ENREGISTRÉE</p>
                        <button className="text-[10px] text-soyuz font-black uppercase tracking-widest hover:underline">Ajouter une adresse</button>
                      </>
                    )}
                  </div>
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <style jsx global>{`
        .outline-text-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>

      {uploading && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-xl flex flex-col items-center justify-center space-y-4 z-[200]">
           <div className="w-12 h-12 border-2 border-soyuz border-t-transparent rounded-full animate-spin shadow-[0_0_30px_rgba(255,0,0,0.2)]" />
           <p className="text-[10px] font-black text-white uppercase tracking-[0.5em] animate-pulse">TRANSMISSION DES DONNÉES...</p>
        </div>
      )}
    </PageLayout>
  );
}
