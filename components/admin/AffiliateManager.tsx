'use client';

import { useState } from 'react';
import { Users, Check, X, Shield, Star, DollarSign, ExternalLink } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';
import SoyuzButton from '@/components/ui/SoyuzButton';

interface AffiliateManagerProps {
  affiliates: any[];
  onUpdate: () => void;
}

export default function AffiliateManager({ affiliates: initialAffiliates, onUpdate }: AffiliateManagerProps) {
  const [affiliates, setAffiliates] = useState(initialAffiliates);
  const [filter, setFilter] = useState<'all' | 'pending' | 'active'>('all');

  const handleStatusUpdate = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const { error } = await supabase
        .from('profiles')
        .update({ status })
        .eq('id', id);

      if (error) throw error;

      // If approved, ensure they also have an entry in the 'affiliates' table if needed
      if (status === 'approved') {
        const aff = affiliates.find(a => a.id === id);
        const { error: affError } = await supabase
          .from('affiliates')
          .upsert({ 
            id: id,
            affiliate_code: aff.affiliate_code || `SOYUZ-${Math.random().toString(36).substring(2, 7).toUpperCase()}`,
            total_sales: 0,
            status: 'approved'
          });
        if (affError) console.error('Error creating affiliate record:', affError);
      }

      toast.success(status === 'approved' ? 'Affilié approuvé !' : 'Demande rejetée');
      onUpdate();
    } catch (err) {
      console.error('Update Error:', err);
      toast.error("Erreur de mise à jour");
    }
  };

  const filteredAffiliates = affiliates.filter(a => {
    if (filter === 'pending') return a.status === 'pending' || !a.status;
    if (filter === 'active') return a.status === 'approved';
    return true;
  });

  return (
    <div className="space-y-12">
      {/* HEADER / FILTERS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <h3 className="text-3xl font-display italic text-white uppercase tracking-tighter">GESTION DES <span className="outline-text-white">NODES</span></h3>
        <div className="flex bg-white/5 p-1 rounded-2xl border border-white/10">
           {['all', 'pending', 'active'].map((f) => (
             <button
               key={f}
               onClick={() => setFilter(f as any)}
               className={`px-8 py-3 text-[9px] font-black uppercase tracking-widest rounded-xl transition-all ${
                 filter === f ? 'bg-soyuz text-black shadow-lg' : 'text-white/40 hover:text-white'
               }`}
             >
               {f === 'all' ? 'TOUS' : f === 'pending' ? 'EN ATTENTE' : 'ACTIFS'}
             </button>
           ))}
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0A0A0A] border border-white/5 rounded-[2rem] overflow-hidden">
        <div className="grid grid-cols-5 px-10 py-6 bg-white/[0.02] border-b border-white/5 text-[9px] font-black text-[#444444] uppercase tracking-widest">
           <span className="col-span-2">AMBASSADEUR / EMAIL</span>
           <span className="text-center">CODE</span>
           <span className="text-center">STATUT</span>
           <span className="text-right">ACTIONS</span>
        </div>

        <div className="divide-y divide-white/5">
           {filteredAffiliates.map((aff) => (
             <div key={aff.id} className="grid grid-cols-5 items-center px-10 py-8 hover:bg-white/[0.01] transition-all group">
                <div className="col-span-2 flex items-center gap-6">
                   <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 overflow-hidden shrink-0">
                      {aff.avatar_url ? <img src={aff.avatar_url} className="w-full h-full object-cover" /> : <div className="w-full h-full flex items-center justify-center text-white/10"><Users size={18} /></div>}
                   </div>
                   <div className="space-y-1">
                      <p className="text-sm font-black text-white uppercase tracking-tight">{aff.full_name || 'N/A'}</p>
                      <p className="text-[9px] text-[#444444] font-black uppercase tracking-widest">{aff.email}</p>
                   </div>
                </div>

                <div className="text-center">
                   <span className="px-4 py-2 bg-white/5 border border-white/10 text-[10px] font-mono text-white/60 rounded-lg tracking-widest">
                      {aff.affiliate_code || '---'}
                   </span>
                </div>

                <div className="text-center">
                   <span className={`px-4 py-2 rounded-full text-[8px] font-black uppercase tracking-[0.2em] border ${
                     aff.status === 'approved' ? 'bg-green-500/10 border-green-500/20 text-green-500' :
                     aff.status === 'pending' || !aff.status ? 'bg-soyuz/10 border-soyuz/20 text-soyuz' :
                     'bg-white/5 border-white/10 text-white/20'
                   }`}>
                      {aff.status === 'approved' ? 'APPROUVÉ' : (aff.status || 'PENDING').toUpperCase()}
                   </span>
                </div>

                <div className="flex justify-end gap-3 text-right">
                   {(!aff.status || aff.status === 'pending') ? (
                     <>
                        <button 
                          onClick={() => handleStatusUpdate(aff.id, 'approved')}
                          className="p-3 bg-green-500/20 text-green-500 hover:bg-green-500 hover:text-white rounded-xl transition-all"
                        >
                           <Check size={18} />
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(aff.id, 'rejected')}
                          className="p-3 bg-soyuz/20 text-soyuz hover:bg-soyuz hover:text-white rounded-xl transition-all"
                        >
                           <X size={18} />
                        </button>
                     </>
                   ) : (
                     <button className="p-3 bg-white/5 text-white/20 hover:text-white rounded-xl transition-all">
                        <ExternalLink size={18} />
                     </button>
                   )}
                </div>
             </div>
           ))}
           {filteredAffiliates.length === 0 && (
             <div className="py-20 text-center uppercase font-black text-white/10 text-[10px] tracking-widest">
                AUCUNE DEMANDE À TRAITER
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
