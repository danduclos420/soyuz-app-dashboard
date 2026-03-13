'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Layout, Move, Save, X, LogOut, Settings, MousePointer2, Component as WorkshopIcon, Box } from 'lucide-react';
import { useDevStore } from '@/lib/store/dev';
import { useRouter } from 'next/navigation';

export default function DevOverlay() {
  const { isDevMode, isWixModeActive, toggleWixMode, setDevMode } = useDevStore();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const [isMobileView, setIsMobileView] = useState(false);

  const toggleMobileView = () => {
    setIsMobileView(!isMobileView);
    if (!isMobileView) {
      document.body.style.width = '375px';
      document.body.style.margin = '0 auto';
      document.body.style.boxShadow = '0 0 100px rgba(0,0,0,0.5)';
      document.body.style.borderLeft = '1px solid rgba(255,255,255,0.1)';
      document.body.style.borderRight = '1px solid rgba(255,255,255,0.1)';
    } else {
      document.body.style.width = '';
      document.body.style.margin = '';
      document.body.style.boxShadow = '';
      document.body.style.borderLeft = '';
      document.body.style.borderRight = '';
    }
  };

  if (!isDevMode) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="absolute bottom-20 right-0 w-80 bg-black/95 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto"
          >
            <div className="flex items-center justify-between mb-8 border-b border-white/5 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-soyuz/20 flex items-center justify-center text-soyuz">
                  <Zap size={18} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-white uppercase tracking-widest">SOYUZ DEV TOOL</h3>
                  <p className="text-[9px] text-soyuz font-bold uppercase tracking-widest">Expert Mode v4.0</p>
                </div>
              </div>
              <button 
                onClick={() => setIsOpen(false)}
                className="text-white/20 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              {/* Wix Mode Toggle */}
              <button
                onClick={toggleWixMode}
                className={`w-full h-14 px-4 rounded-xl border flex items-center justify-between transition-all group ${
                  isWixModeActive 
                    ? 'bg-soyuz/10 border-soyuz/30 text-soyuz shadow-[0_0_20px_rgba(255,0,0,0.1)]' 
                    : 'bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Move size={18} className={isWixModeActive ? 'animate-pulse' : ''} />
                   <span className="text-[10px] font-black uppercase tracking-widest">EDIT MODE (DRAG)</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${isWixModeActive ? 'bg-soyuz' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isWixModeActive ? 'left-4.5' : 'left-0.5'}`} />
                </div>
              </button>

              {/* Mobile Preview Toggle */}
              <button
                onClick={toggleMobileView}
                className={`w-full h-14 px-4 rounded-xl border flex items-center justify-between transition-all bg-white/5 border-white/10 text-white/60 hover:border-white/20 hover:text-white ${isMobileView ? 'border-soyuz/50 text-white shadow-[0_0_15px_rgba(255,0,0,0.1)]' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <Layout size={18} />
                  <span className="text-[10px] font-black uppercase tracking-widest">MOBILE PREVIEW</span>
                </div>
                <div className={`w-8 h-4 rounded-full relative transition-all ${isMobileView ? 'bg-soyuz' : 'bg-white/10'}`}>
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${isMobileView ? 'left-4.5' : 'left-0.5'}`} />
                </div>
              </button>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  onClick={() => router.push('/workshop')}
                  className="w-full h-14 flex items-center gap-3 px-4 bg-white/5 border border-white/5 rounded-xl text-[10px] font-black text-white/60 uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all outline-none"
                >
                  <WorkshopIcon size={18} />
                  COMPONENT WORKSHOP
                </button>
                <button 
                  onClick={() => {
                    const styles = useDevStore.getState().elementStyles;
                    console.log('🚀 DANY, CLIQUE ICI POUR SAUVEGARDER DANS LE CODE:', styles);
                    alert('DESIGN SYNCED! Ask Antigravity to Lock it for mobile too.');
                  }}
                  className="w-full h-14 flex items-center gap-3 px-4 bg-soyuz text-black rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-[1.02] active:scale-95 shadow-[0_0_20px_rgba(255,10,10,0.3)] transition-all outline-none"
                >
                  <Save size={18} />
                  SAUVEGARDER DANS LE CODE
                </button>
              </div>

              <div className="pt-4 border-t border-white/5">
                <button 
                  onClick={() => {
                    localStorage.removeItem('soyuz-dev-mode');
                    setDevMode(false);
                    router.push('/');
                  }}
                  className="w-full h-12 flex items-center justify-center gap-2 text-soyuz text-[10px] font-black uppercase tracking-widest hover:bg-soyuz/10 transition-all rounded-xl border border-soyuz/20"
                >
                  <LogOut size={14} />
                  EXIT DEV MODE
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 bg-soyuz text-white rounded-2xl flex items-center justify-center shadow-[0_10px_30px_rgba(255,0,0,0.3)] hover:scale-110 active:scale-95 transition-all pointer-events-auto group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
        <Zap size={24} className="relative z-10" />
      </button>
    </div>
  );
}
