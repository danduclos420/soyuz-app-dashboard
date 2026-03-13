'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import SoyuzButton from '@/components/ui/SoyuzButton';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Critical System Error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-1 bg-soyuz shadow-[0_0_20px_rgba(255,0,0,0.5)]" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-12 relative z-10 max-w-2xl"
      >
        <div className="w-24 h-24 bg-soyuz/10 border border-soyuz/20 rounded-3xl flex items-center justify-center mx-auto mb-8 animate-bounce">
           <AlertTriangle size={48} className="text-soyuz" />
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-display italic text-white uppercase tracking-tighter">ERREUR <span className="outline-text-white text-soyuz">CRITIQUE</span></h2>
          <p className="text-[#888888] text-[10px] font-black uppercase tracking-[0.4em] max-w-md mx-auto leading-relaxed">
            UNE DÉFAILLANCE INTERNE A ÉTÉ DÉTECTÉE DANS LE SYSTÈME ALPHA. LES DONNÉES SONT SÉCURISÉES MAIS L'AFFICHAGE A ÉCHOUÉ.
          </p>
        </div>

        {error.digest && (
          <div className="py-4 px-8 bg-white/[0.02] border border-white/5 inline-block">
             <p className="text-[8px] font-mono text-white/20 tracking-widest uppercase">ID ERROR: {error.digest}</p>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
           <SoyuzButton onClick={() => reset()} variant="primary" icon={RefreshCw} size="lg">
              TENTER UNE RÉCUPÉRATION
           </SoyuzButton>
           <SoyuzButton href="/" variant="outline" icon={Home} size="lg">
              RETOUR AU TERMINAL
           </SoyuzButton>
        </div>
      </motion.div>

      <style jsx global>{`
        .outline-text-white {
          -webkit-text-stroke: 1px white;
          color: transparent;
        }
      `}</style>
    </div>
  );
}
