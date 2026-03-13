import { motion } from 'framer-motion';
import { Factory, Check, Maximize2, Crosshair, Box } from 'lucide-react';

interface CardFactoryOverlayProps {
  zoom: number;
  setZoom: (val: number) => void;
  onCancel: () => void;
  onSave: () => void;
}

export default function CardFactoryOverlay({
  zoom,
  setZoom,
  onCancel,
  onSave
}: CardFactoryOverlayProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute left-1/2 -translate-x-1/2 top-full mt-12 z-[100] w-[340px] bg-[#0A0A0A] border border-soyuz/40 p-10 flex flex-col items-center gap-6 rounded-[2rem] shadow-[0_40px_100px_rgba(255,0,0,0.5)] pointer-events-auto"
      style={{ transform: 'translateZ(200px)' }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex flex-col items-center gap-1">
          <div className="flex items-center gap-3">
             <Factory size={20} className="text-soyuz" />
             <p className="text-[16px] font-black italic text-white tracking-[0.4em] uppercase">CARD FACTORY</p>
          </div>
          <p className="text-[9px] text-soyuz/60 uppercase font-bold tracking-[0.3em]">SOYUZ PRECISION IMAGING v4.0</p>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 border-y border-white/5 py-4 my-2">
         <div className="flex items-center gap-2 opacity-30">
            <Crosshair size={10} className="text-white" />
            <span className="text-[8px] font-mono text-white uppercase tracking-widest">POSITION: SYNCED</span>
         </div>
         <div className="flex items-center gap-2 opacity-30">
            <Box size={10} className="text-white" />
            <span className="text-[8px] font-mono text-white uppercase tracking-widest">RENDER: HI-RES</span>
         </div>
      </div>
      
      <div className="flex flex-col gap-3 w-full px-2">
         <div className="flex justify-between items-center text-[10px] font-black uppercase text-white/40 tracking-widest">
            <span>ZOOM LEVEL</span>
            <span className="text-soyuz">{zoom.toFixed(2)}x</span>
         </div>
         <div className="flex items-center gap-6">
            <Maximize2 size={12} className="text-white/20" />
            <input 
               type="range" 
               min="0.5" 
               max="4" 
               step="0.01" 
               value={zoom} 
               onChange={(e) => setZoom(parseFloat(e.target.value))}
               className="flex-1 accent-soyuz h-1 bg-white/5 rounded-full cursor-pointer"
            />
         </div>
      </div>

      <div className="flex gap-4 w-full pt-4">
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
            className="flex-3 flex items-center justify-center gap-3 px-10 py-5 bg-soyuz text-white rounded-full text-[14px] font-black uppercase tracking-[0.4em] hover:bg-white hover:text-black transition-all shadow-[0_0_50px_rgba(255,0,0,0.4)]"
         >
            <Check size={18} /> CONFIRMER
         </button>
      </div>
    </motion.div>
  );
}
