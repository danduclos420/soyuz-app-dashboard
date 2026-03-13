'use client';

import { Camera, Download } from 'lucide-react';

interface CardActionsProps {
  onPhotoClick: () => void;
  onDownloadClick: () => void;
  isDownloading: boolean;
  isVisible: boolean;
}

export default function CardActions({
  onPhotoClick,
  onDownloadClick,
  isDownloading,
  isVisible
}: CardActionsProps) {
  if (!isVisible) return null;

  return (
    <div className="flex flex-col items-center gap-4 relative z-50 animate-in fade-in duration-500">
      <div className="flex gap-4">
        <button 
          onClick={(e) => { 
            e.stopPropagation(); 
            onPhotoClick();
          }} 
          className="flex items-center gap-3 px-8 py-5 bg-white/[0.01] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz/60 transition-all group"
          disabled={isDownloading}
        >
          <Camera size={18} className="text-soyuz group-hover:scale-110 transition-transform" /> PHOTO
        </button>
        <button 
          onClick={(e) => { e.stopPropagation(); onDownloadClick(); }} 
          className={`flex items-center gap-3 px-8 py-5 bg-white/[0.01] border border-white/10 rounded-2xl text-[10px] font-black uppercase tracking-[0.3em] text-white/40 hover:text-white hover:border-soyuz/60 transition-all ${isDownloading ? 'animate-pulse text-soyuz' : ''}`}
          disabled={isDownloading}
        >
          <Download size={18} className={isDownloading ? 'animate-bounce' : 'text-soyuz'} /> 
          {isDownloading ? 'EXPORTATION...' : 'TÉLÉCHARGER'}
        </button>
      </div>
      <p className="text-[9px] font-bold text-white/10 uppercase tracking-[0.4em] italic text-center max-w-[320px]">
        TAP TO FLIP • HOVER TO TILT • PHOTO TO EDIT
      </p>
    </div>
  );
}
