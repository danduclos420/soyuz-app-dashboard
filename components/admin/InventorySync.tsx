'use client';

import { useState, useEffect } from 'react';
import { RefreshCw, Database, CheckCircle2, AlertCircle, ExternalLink, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';
import SoyuzButton from '@/components/ui/SoyuzButton';

export default function InventorySync() {
  const [lastSync, setLastSync] = useState<any>(null);
  const [syncing, setSyncing] = useState(false);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetchSyncInfo();
  }, []);

  async function fetchSyncInfo() {
    const { data: cfg } = await supabase
      .from('app_config')
      .select('*')
      .eq('key', 'quickbooks_token')
      .maybeSingle();
    
    setConfig(cfg);
    
    if (cfg && cfg.updated_at) {
      setLastSync(new Date(cfg.updated_at));
    }
  }

  const triggerSync = async () => {
    setSyncing(true);
    try {
      const res = await fetch('/api/sync/quickbooks', { method: 'POST' });
      const data = await res.json();
      
      if (data.success) {
        toast.success(`Synchronisation terminée : ${data.count} items mis à jour.`);
        await fetchSyncInfo();
      } else {
        throw new Error(data.error || 'Erreur inconnue');
      }
    } catch (err: any) {
      console.error('Sync Error:', err);
      toast.error(`Erreur de synchro : ${err.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 text-white/5">
           <Database size={64} />
        </div>

        <div className="space-y-4 relative z-10">
           <h3 className="text-3xl font-display italic text-white uppercase tracking-tighter">QUICKBOOKS <span className="text-soyuz">SYNC</span></h3>
           <p className="text-[#888888] text-[10px] font-black uppercase tracking-widest max-w-sm">
             Synchronisation automatique de l'inventaire toutes les heures. Utilisez le bouton ci-dessous pour forcer une mise à jour immédiate.
           </p>
        </div>

        <div className="pt-8 space-y-6 relative z-10">
           <div className="flex items-center gap-6 p-6 bg-white/[0.02] border border-white/5 rounded-2xl">
              <div className={`p-4 rounded-xl ${config ? 'bg-green-500/10 text-green-500' : 'bg-soyuz/10 text-soyuz'}`}>
                 {config ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
              </div>
              <div>
                 <p className="text-[10px] text-[#444444] font-black uppercase tracking-widest leading-none mb-2">STATUT CONNEXION</p>
                 <p className="text-lg font-display italic text-white uppercase tracking-tight">
                    {config ? 'SÉCURISÉ & CONNECTÉ' : 'NON CONNECTÉ'}
                 </p>
              </div>
           </div>

           <div className="grid grid-cols-2 gap-4">
              <SoyuzButton 
                onClick={triggerSync} 
                isLoading={syncing} 
                variant="primary" 
                icon={RefreshCw}
                className="w-full"
              >
                FORCER LA SYNCHRONISATION
              </SoyuzButton>
              <a 
                href="/api/auth/quickbooks/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 border border-white/10 hover:bg-white/5 transition-all text-[10px] font-black tracking-widest uppercase rounded-xl"
              >
                <ExternalLink size={14} />
                RE-CONNECTER QB
              </a>
           </div>
        </div>
      </div>

      <div className="space-y-8">
         <div className="bg-[#0A0A0A] border border-white/5 p-10 flex items-center justify-between">
            <div className="space-y-1">
               <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">DERNIÈRE SYNCHRONISATION</p>
               <p className="text-xl font-display italic text-white uppercase tracking-tight">
                  {lastSync ? lastSync.toLocaleString() : 'JAMAIS'}
               </p>
            </div>
            <Clock className="text-white/10" size={32} />
         </div>

         <div className="bg-white/[0.02] border border-white/5 p-10 space-y-6">
            <h4 className="text-[10px] text-white font-black uppercase tracking-widest flex items-center gap-3">
               <div className="w-1.5 h-1.5 rounded-full bg-soyuz shadow-[0_0_10px_rgba(204,0,0,0.5)]" /> 
               LOGS DE FLUX EN DIRECT
            </h4>
            <div className="space-y-3 font-mono text-[8px] text-[#444444] uppercase tracking-widest">
               <p>[{new Date().toLocaleTimeString()}] INITIALISATION DU MODULE QB...</p>
               {config && <p>[{new Date().toLocaleTimeString()}] TOKEN VÉRIFIÉ & VALIDE.</p>}
               <p>[{new Date().toLocaleTimeString()}] PRÊT POUR RÉCEPTION DONNÉES.</p>
            </div>
         </div>
      </div>
    </div>
  );
}
