'use client';

import { useState } from 'react';
import { Mail, Send, Users, Trash2, ShieldCheck, Clock } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';
import SoyuzButton from '@/components/ui/SoyuzButton';

interface MessagePortalProps {
  affiliates: any[];
}

export default function MessagePortal({ affiliates }: MessagePortalProps) {
  const [recipientId, setRecipientId] = useState<string>('all');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isPerpetual, setIsPerpetual] = useState(false);
  const [sending, setSending] = useState(false);

  const handleSendMessage = async () => {
    if (!subject || !body) {
      toast.error('Sujet et message requis');
      return;
    }

    setSending(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Non authentifié');

      const isBroadcast = recipientId === 'all';
      
      const { error } = await supabase.from('messages').insert({
        sender_id: user.id,
        recipient_id: isBroadcast ? null : recipientId,
        is_broadcast: isBroadcast,
        subject,
        body,
        is_perpetual: isPerpetual,
        created_at: new Date().toISOString()
      });

      if (error) throw error;

      toast.success(isBroadcast ? 'Message diffusé à tous !' : 'Message privé envoyé');
      setSubject('');
      setBody('');
    } catch (err: any) {
      console.error('Send Error:', err);
      toast.error("Erreur lors de l'envoi");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* FORM SECTION */}
      <div className="bg-[#0A0A0A] border border-white/5 p-12 space-y-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="p-3 bg-soyuz/10 rounded-xl text-soyuz">
            <Mail size={24} />
          </div>
          <h3 className="text-2xl font-display italic text-white uppercase tracking-tight">ENVOYER UNE <span className="outline-text-white">TRANSMISSION</span></h3>
        </div>

        <div className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] text-white/20 font-black uppercase tracking-widest flex items-center gap-2">
              <Users size={12} /> DESTINATAIRE
            </label>
            <select 
              value={recipientId}
              onChange={(e) => setRecipientId(e.target.value)}
              className="w-full bg-black border border-white/10 p-5 text-white font-bold tracking-widest outline-none focus:border-soyuz transition-all appearance-none"
            >
              <option value="all">DIFFUSION GLOBALE (TOUS LES AFFILIÉS)</option>
              {affiliates.map(aff => (
                <option key={aff.id} value={aff.id}>{aff.full_name || aff.email} ({aff.affiliate_code})</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/20 font-black uppercase tracking-widest">OBJET DE LA MISSION</label>
            <input 
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="EX: NOUVELLE CAMPAGNE HIVER"
              className="w-full bg-black border border-white/10 p-5 text-white font-bold tracking-widest outline-none focus:border-soyuz transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] text-white/20 font-black uppercase tracking-widest">CORPS DU MESSAGE (MAX 1000 CARACTÈRES)</label>
            <textarea 
              value={body}
              onChange={(e) => setBody(e.target.value)}
              rows={6}
              placeholder="DÉTAILS DE LA TRANSMISSION..."
              className="w-full bg-black border border-white/10 p-5 text-white font-medium tracking-wide outline-none focus:border-soyuz transition-all resize-none"
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-white/[0.02] border border-white/5 rounded-xl">
             <input 
               type="checkbox" 
               id="perpetual"
               checked={isPerpetual}
               onChange={(e) => setIsPerpetual(e.target.checked)}
               className="w-5 h-5 accent-soyuz bg-black border-white/10 rounded" 
             />
             <label htmlFor="perpetual" className="text-[10px] text-white font-black uppercase tracking-widest cursor-pointer select-none">
                MARQUER COMME MESSAGE PERPÉTUEL (PAS DE RESET MENSUEL)
             </label>
          </div>

          <SoyuzButton 
            onClick={handleSendMessage} 
            isLoading={sending} 
            variant="primary" 
            icon={Send} 
            className="w-full"
          >
            LANCER LA TRANSMISSION
          </SoyuzButton>
        </div>
      </div>

      {/* RULES / INFO SECTION */}
      <div className="space-y-8">
        <div className="bg-soyuz/5 border border-soyuz/20 p-10 space-y-6">
           <h4 className="text-xl font-display italic text-white uppercase tracking-tighter flex items-center gap-3">
              <ShieldCheck size={20} className="text-soyuz" /> PROTOCOLE DE MESSAGERIE
           </h4>
           <div className="space-y-4">
              {[
                "Les messages sont à sens unique (Pas de réponse possible).",
                "Les messages non-perpétuels sont supprimés le 1er de chaque mois.",
                "Les diffusions globales touchent tous les affiliés instantanément.",
                "Les messages privés ne sont visibles que par le destinataire ciblé.",
                "Toute suppression par l'admin est définitive pour tous."
              ].map((rule, i) => (
                <div key={i} className="flex gap-4 items-start">
                   <div className="w-1.5 h-1.5 rounded-full bg-soyuz mt-1.5 shrink-0" />
                   <p className="text-[10px] text-white/60 font-black uppercase tracking-widest leading-relaxed">{rule}</p>
                </div>
              ))}
           </div>
        </div>

        <div className="bg-[#0A0A0A] border border-white/5 p-10 flex items-center justify-between group">
           <div className="space-y-1">
              <p className="text-[9px] text-white/20 font-black uppercase tracking-widest">PROCHAIN RESET GLOBAL</p>
              <p className="text-xl font-display italic text-white">01 AVRIL • 00:00</p>
           </div>
           <Clock className="text-white/5 group-hover:text-soyuz/20 transition-colors" size={32} />
        </div>
      </div>
    </div>
  );
}
