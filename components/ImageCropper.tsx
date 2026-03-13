'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, Check, Search, Crop } from 'lucide-react';

interface ImageCropperProps {
  onCropped: (base64: string) => void;
  aspectRatio?: number;
  initialImage?: string | null;
  label?: string;
}

export default function ImageCropper({ 
  onCropped, 
  aspectRatio = 1, 
  initialImage = null,
  label = "PHOTO DE PROFIL"
}: ImageCropperProps) {
  const [image, setImage] = useState<string | null>(initialImage);
  const [isCropping, setIsCropping] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setImage(reader.result as string);
        setIsCropping(true);
      };
      reader.readAsDataURL(file);
    }
  };

  const cropImage = () => {
    if (!canvasRef.current || !imageRef.current) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // For a simple square crop
    const size = Math.min(imageRef.current.naturalWidth, imageRef.current.naturalHeight);
    canvas.width = 400; // Standard size for avatars
    canvas.height = 400;

    const startX = (imageRef.current.naturalWidth - size) / 2;
    const startY = (imageRef.current.naturalHeight - size) / 2;

    ctx.drawImage(
      imageRef.current,
      startX, startY, size, size, // Source
      0, 0, 400, 400 // Destination
    );

    const base64 = canvas.toDataURL('image/jpeg', 0.8);
    setPreview(base64);
    onCropped(base64);
    setIsCropping(false);
  };

  return (
    <div className="space-y-4">
      <label className="text-[10px] text-[#444444] font-black uppercase tracking-widest">{label}</label>
      
      <div 
        onClick={() => !isCropping && fileInputRef.current?.click()}
        className={`relative group cursor-pointer border border-dashed transition-all duration-500 overflow-hidden ${
          preview ? 'border-soyuz/40 aspect-square' : 'border-white/10 hover:border-white/30 aspect-square flex flex-col items-center justify-center bg-white/[0.02]'
        }`}
      >
        {preview ? (
          <>
            <img src={preview} alt="Preview" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <p className="text-[10px] font-black text-white uppercase tracking-widest">Changer la photo</p>
            </div>
          </>
        ) : (
          <div className="text-center p-8 space-y-4">
            <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mx-auto group-hover:bg-soyuz/10 transition-colors">
              <Upload size={20} className="text-[#333333] group-hover:text-soyuz" />
            </div>
            <p className="text-[10px] font-black text-[#333333] uppercase tracking-widest">Cliquer pour uploader</p>
          </div>
        )}
        <input 
          type="file" 
          ref={fileInputRef} 
          onChange={handleFileChange} 
          accept="image/*" 
          className="hidden" 
        />
      </div>

      <AnimatePresence>
        {isCropping && image && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-8 bg-black/95 backdrop-blur-3xl">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-[#0A0A0A] border border-white/10 p-12 w-full max-w-xl space-y-12"
            >
              <div className="flex justify-between items-center">
                <h3 className="text-2xl font-display italic text-white uppercase">Ajuster la <span className="outline-text-white">photo</span></h3>
                <button onClick={() => setIsCropping(false)} className="p-2 text-[#444444] hover:text-white transition-colors">
                  <X size={24} />
                </button>
              </div>

              <div className="relative aspect-square max-w-sm mx-auto overflow-hidden bg-black/40 border border-white/5">
                <img 
                  ref={imageRef}
                  src={image} 
                  alt="To Crop" 
                  className="w-full h-full object-contain"
                />
                {/* Visual crop overlay */}
                <div className="absolute inset-0 pointer-events-none ring-[100vw] ring-black/70">
                   <div className="absolute inset-0 border border-soyuz/50 shadow-[0_0_50px_rgba(255,0,0,0.2)]" style={{ margin: '15%' }} />
                </div>
              </div>

              <canvas ref={canvasRef} className="hidden" />

              <div className="flex gap-4">
                <button 
                  onClick={() => setIsCropping(false)}
                  className="flex-1 py-5 bg-white/5 border border-white/10 text-[#444444] text-[10px] font-black uppercase tracking-widest hover:bg-white/10 hover:text-white transition-all"
                >
                  ANNULER
                </button>
                <button 
                  onClick={cropImage}
                  className="flex-1 py-5 bg-soyuz text-black text-[10px] font-black uppercase tracking-widest hover:bg-white transition-all"
                >
                  APPLIQUER LE CROP
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
