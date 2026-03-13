'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, useMotionValue, useSpring, useTransform, AnimatePresence } from 'framer-motion';
import { toPng } from 'html-to-image';

// Modular Components
import CardFront from './hockey-card/CardFront';
import CardBack from './hockey-card/CardBack';
import HolographicOverlay from './hockey-card/HolographicOverlay';
import PhotoEditorOverlay from './hockey-card/PhotoEditorOverlay';
import CardActions from './hockey-card/CardActions';

import { TrendingUp } from 'lucide-react';

interface PhotoSettings {
  x: number;
  y: number;
  scale: number;
}

interface HockeyCardProps {
  user: {
    full_name: string;
    avatar_url?: string;
    role: 'admin' | 'affiliate' | 'customer';
    affiliate_code?: string;
    created_at: string;
    // New Persistence Fields
    hockey_card_photo_url?: string | null;
    hockey_card_settings?: PhotoSettings;
  };
  stats: {
    total_sales?: number;
    monthly_sales?: number;
    points?: number;
    commissions?: number;
    purchase_count?: number;
    total_spent?: number;
    favorite_product?: string;
    network_revenue?: number;
    active_affiliates?: number;
  };
  rank?: 'agent' | 'pro' | 'elite' | 'legend' | 'mvp';
  editMode?: boolean;
  tempPhotoUrl?: string | null;
  onDownload?: () => void;
  onPhotoSelected?: (dataUrl: string) => void;
  onSaveEdit?: (settings: PhotoSettings) => void;
  onCancelEdit?: () => void;
}

export default function HockeyCard({ 
  user, 
  stats, 
  rank = 'agent', 
  editMode = false,
  tempPhotoUrl,
  onDownload, 
  onPhotoSelected,
  onSaveEdit,
  onCancelEdit
}: HockeyCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDownloading, setIsDownloading] = useState(false);
  
  // Photo Edit State - Locally managed for immediate feedback
  const savedSettings = user.hockey_card_settings || { x: 0, y: 0, scale: 1 };
  const [zoom, setZoom] = useState(savedSettings.scale);
  const photoX = useMotionValue(savedSettings.x);
  const photoY = useMotionValue(savedSettings.y);

  // Sync with prop updates (e.g. after save)
  useEffect(() => {
    if (!editMode && user.hockey_card_settings) {
      setZoom(user.hockey_card_settings.scale);
      photoX.set(user.hockey_card_settings.x);
      photoY.set(user.hockey_card_settings.y);
    }
  }, [user.hockey_card_settings, editMode]);

  // Mouse Tracking for Tilt
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springConfig = { stiffness: 150, damping: 20 };
  const mouseXSpring = useSpring(x, springConfig);
  const mouseYSpring = useSpring(y, springConfig);
  
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], [12, -12]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], [-12, 12]);

  // Holographic VFX Transform
  const shineX = useTransform(mouseXSpring, [-0.5, 0.5], [0, 100]);
  const shineY = useTransform(mouseYSpring, [-0.5, 0.5], [0, 100]);
  const shineOpacity = useTransform(mouseXSpring, (v) => Math.abs(v) * 2 + 0.1);

  // Sync state with parent editMode
  useEffect(() => {
    if (editMode) {
      if (isFlipped) setIsFlipped(false);
      x.set(0);
      y.set(0);
    }
  }, [editMode]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (editMode || isFlipped || isDownloading || !containerRef.current) {
       x.set(0); y.set(0); return;
    }
    const rect = containerRef.current.getBoundingClientRect();
    const xPct = (e.clientX - rect.left) / rect.width - 0.5;
    const yPct = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(xPct);
    y.set(yPct);
  };

  const handleInternalDownload = async () => {
    if (!cardRef.current) return;
    setIsDownloading(true);
    x.set(0); y.set(0);
    
    try {
      if (onDownload) {
        onDownload();
      } else {
        const dataUrl = await toPng(cardRef.current, { cacheBust: true, pixelRatio: 2 });
        const link = document.createElement('a');
        link.download = `SOYUZ_CARD_${user.full_name.toUpperCase().replace(/\s+/g, '_')}.png`;
        link.href = dataUrl;
        link.click();
      }
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setIsDownloading(false);
    }
  };

  const currentRankLabel = () => {
    if (rank === 'mvp' || user.role === 'admin') return 'SOYUZ AMBASSADOR';
    if (user.role === 'affiliate') return 'SOYUZ AFFILIATE';
    return 'SOYUZ CUSTOMER';
  };

  const firstName = user.full_name.split(' ')[0] || 'Dany';

  const handlePhotoSelected = (dataUrl: string) => {
    // 1. Send photo to parent (which should then set editMode prop to true)
    if (onPhotoSelected) {
      onPhotoSelected(dataUrl);
    }
    // 2. Local fallback if parent doesn't immediately sync
    if (isFlipped) setIsFlipped(false);
    x.set(0);
    y.set(0);
  };

  return (
    <div className="flex flex-col items-center gap-12">
      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&family=Great+Vibes&family=Playball&display=swap');
      `}</style>

      {/* 1. EDIT MODE BLUR BACKDROP */}
      <AnimatePresence>
        {editMode && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/98 backdrop-blur-3xl z-[80]"
          />
        )}
      </AnimatePresence>

      {/* 2. MASTER STAGE (Scale & z-index orchestration) */}
      <motion.div 
        ref={containerRef}
        animate={editMode ? { scale: 1.4, z: 100 } : { scale: 1, z: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className={`relative w-[340px] h-[470px] ${editMode ? 'z-[100]' : 'z-10'}`}
        style={{ perspective: '2500px' }}
      >
        {/* 3. FLIP LAYER */}
        <motion.div
           animate={{ rotateY: isFlipped ? 180 : 0 }}
           transition={{ type: "spring", stiffness: 80, damping: 18 }}
           className="w-full h-full relative"
           style={{ transformStyle: 'preserve-3d' }}
        >
          {/* 4. TILT LAYER */}
          <motion.div
            onMouseMove={handleMouseMove}
            onMouseLeave={() => { x.set(0); y.set(0); }}
            onClick={() => !editMode && !isDownloading && setIsFlipped(!isFlipped)}
            style={{ 
              transformStyle: 'preserve-3d',
              rotateX: editMode ? 0 : rotateX,
              rotateY: editMode ? 0 : rotateY
            }}
            className="w-full h-full relative"
          >
            {/* --- RECTO --- */}
            <div ref={cardRef} className="absolute inset-0 w-full h-full" style={{ transformStyle: 'preserve-3d' }}>
               <CardFront
                 firstName={firstName}
                 lastName={user.full_name.split(' ').slice(1).join(' ')}
                 rankLabel={currentRankLabel()}
                 avatarUrl={user.avatar_url}
                 tempPhotoUrl={tempPhotoUrl}
                 photoX={photoX}
                 photoY={photoY}
                 zoom={zoom}
                 editMode={editMode}
               >
                 <HolographicOverlay 
                   shineOpacity={shineOpacity}
                   shineX={shineX}
                   shineY={shineY}
                 />
               </CardFront>

               {/* RECTO-ONLY OVERLAYS (Editor) */}
               <AnimatePresence>
                 {editMode && (
                   <PhotoEditorOverlay 
                     zoom={zoom} 
                     setZoom={setZoom}
                     onCancel={() => onCancelEdit?.()}
                     onSave={() => onSaveEdit?.({ x: photoX.get(), y: photoY.get(), scale: zoom })}
                   />
                 )}
               </AnimatePresence>
            </div>

            {/* --- VERSO --- */}
            <CardBack user={user} stats={stats} />

          </motion.div>
        </motion.div>
      </motion.div>

      {/* 5. INDEPENDENT ACTIONS */}
      <CardActions 
        isVisible={!editMode}
        isDownloading={isDownloading}
        onPhotoClick={() => fileInputRef.current?.click()}
        onDownloadClick={handleInternalDownload}
      />

      {/* HIDDEN INPUT */}
      <input
        type="file"
        ref={fileInputRef}
        className="hidden"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => handlePhotoSelected(reader.result as string);
            reader.readAsDataURL(file);
            e.target.value = '';
          }
        }}
      />
    </div>
  );
}
