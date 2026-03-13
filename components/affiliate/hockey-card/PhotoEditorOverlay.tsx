'use client';

import { motion } from 'framer-motion';
import { Camera, Check, Maximize2 } from 'lucide-react';

interface PhotoEditorOverlayProps {
  zoom: number;
  setZoom: (val: number) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function PhotoEditorOverlay({
  zoom,
  setZoom,
  onCancel,
  onSave
}: PhotoEditorOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 50 }}
      className="absolute inset-x-6 -top-32 z-[100] bg-[#0A0A0A] border border-soyuz/40 p-10 flex flex-col items-center gap-6 rounded-[2rem] shadow-[0_40px_100px_rgba(255,0,0,0.3)] pointer-events-auto"
      style={{ transform: 'translateZ(100px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-2">
             <Camera size={18} className="text-soyuz animate-pulse" />
             <p className="text-[14px] font-black italic text-white tracking-[0.5em] uppercase">STUDIO EDITION</p>
          </div>
          <p className="text-[9px] text-white/30 uppercase tracking-[0.2em]">DÉPOSEZ, ZOOMEZ, VALIDEZ</p>
      </div>
      
      <div className="flex items-center gap-6 w-full px-2">
         <Maximize2 size={12} className="text-white/20" />
         <input 
            type="range" 
            min="0.5" 
            max="4" 
            step="0.01" 
            value={zoom} 
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="flex-1 accent-soyuz h-1 bg-white/5 rounded-full"
         />
         <span className="text-[11px] font-mono text-soyuz w-8">{zoom.toFixed(1)}x</span>
      </div>

      <div className="flex gap-4 w-full">
         <button 
            onClick={(e) => { e.stopPropagation(); onCancel(); }}
            className="flex-1 flex items-center justify-center gap-2 px-6 py-4 bg-white/5 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest text-white/40 hover:text-white transition-all underline underline-offset-4"
         >
            ANNULER
         </button>
         <button 
            onClick={(e) => { 
               e.stopPropagation(); 
               onSave(); 
            }}
            className="flex-3 flex items-center justify-center gap-3 px-10 py-5 bg-soyuz text-black rounded-full text-[12px] font-black uppercase tracking-[0.5em] hover:bg-white transition-all shadow-[0_0_50px_rgba(255,0,0,0.5)]"
         >
            <Check size={18} /> CONFIRMER
         </button>
      </div>
    </motion.div>
  );
}
