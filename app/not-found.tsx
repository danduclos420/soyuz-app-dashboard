'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react';
import SoyuzButton from '@/components/ui/SoyuzButton';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-8 relative overflow-hidden">
      {/* Background VFX */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-soyuz/5 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center space-y-12 relative z-10 max-w-2xl"
      >
        <div className="relative inline-block">
          <h1 className="text-[180px] font-display italic leading-none text-white opacity-5 select-none tracking-tighter">404</h1>
          <div className="absolute inset-0 flex items-center justify-center">
             <ShieldAlert size={80} className="text-soyuz animate-pulse" />
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-5xl font-display italic text-white uppercase tracking-tighter">COORDONNÉES <span className="outline-text-white text-soyuz">PERDUES</span></h2>
          <p className="text-[#888888] text-sm uppercase font-bold tracking-[0.3em] max-w-md mx-auto leading-relaxed">
            LA TRANSMISSION A ÉCHOUÉ. LE SECTEUR QUE VOUS TENTEZ D'ATTEINDRE N'EXISTE PAS OU A ÉTÉ DÉPLACÉ.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 justify-center pt-8">
           <SoyuzButton href="/" variant="primary" icon={Home} size="lg">
              RETOUR AU QG
           </SoyuzButton>
           <SoyuzButton onClick={() => window.history.back()} variant="outline" icon={ArrowLeft} size="lg">
              RETOUR ARRIÈRE
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
