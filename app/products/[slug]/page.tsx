'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { ChevronRight, ShieldCheck, Truck, RotateCcw, Heart, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import Link from 'next/link';

const mockProduct = {
  name: 'SOYUZ PRO V1',
  category: 'PRO SERIES',
  price: '299,00 $',
  description: 'Le bâton le plus avancé techniquement jamais conçu par SOYUZ BC. Utilisé par les professionnels de la KHL pour sa rigidité exceptionnelle et son transfert d\'énergie instantané.',
  images: [
    'https://images.unsplash.com/photo-1547053501-bc8497672af6?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1580748141549-716500ca23ae?q=80&w=1200&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1200&auto=format&fit=crop'
  ],
  specs: [
    { label: 'Construction', value: '100% Extreme Carbon' },
    { label: 'Poids', value: '385g' },
    { label: 'Kick Point', value: 'Low Kick' },
    { label: 'Technologie', value: 'Monocomp One-Piece' }
  ]
};

export default function ProductDetailPage() {
  const [selectedMainImage, setSelectedMainImage] = useState(0);
  const [selectedHand, setSelectedHand] = useState('Génération');
  const [selectedFlex, setSelectedFlex] = useState(85);
  const [selectedCurve, setSelectedCurve] = useState('P92');

  return (
    <div className="bg-background min-h-screen pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        <nav className="flex items-center gap-2 text-[10px] text-muted font-bold uppercase tracking-widest mb-12">
          <Link href="/">Home</Link>
          <ChevronRight size={12} />
          <Link href="/products">Catalogue</Link>
          <ChevronRight size={12} />
          <span className="text-white">{mockProduct.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 xl:gap-24">
          {/* Gallery Area */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div 
              layoutId="main-image"
              className="aspect-[4/5] bg-carbon-surface rounded-3xl overflow-hidden border border-white/5 relative"
            >
              <img 
                src={mockProduct.images[selectedMainImage]} 
                alt={mockProduct.name}
                className="w-full h-full object-cover grayscale-0 brightness-110"
              />
              <div className="absolute top-6 left-6">
                <Badge variant="accent">Elite Series</Badge>
              </div>
            </motion.div>
            
            <div className="grid grid-cols-3 gap-6">
              {mockProduct.images.map((img, idx) => (
                <button 
                  key={idx}
                  onClick={() => setSelectedMainImage(idx)}
                  className={`aspect-square rounded-2xl overflow-hidden border-2 transition-all ${selectedMainImage === idx ? 'border-soyuz' : 'border-white/5'}`}
                >
                  <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Config Area */}
          <div className="lg:col-span-5 space-y-10">
            <div>
              <p className="text-soyuz font-bold uppercase tracking-[0.3em] text-xs mb-4">{mockProduct.category}</p>
              <h1 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-4 leading-none">
                {mockProduct.name}
              </h1>
              <p className="text-2xl font-black text-white tracking-widest">{mockProduct.price}</p>
            </div>

            <p className="text-muted text-sm leading-relaxed max-w-md">
              {mockProduct.description}
            </p>

            {/* Selectors */}
            <div className="space-y-8">
              {/* Hand */}
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Main</h4>
                <div className="flex gap-4">
                  {['Gauche', 'Droite'].map((h) => (
                    <button 
                      key={h}
                      onClick={() => setSelectedHand(h)}
                      className={`flex-1 py-3 border text-xs font-bold uppercase tracking-widest transition-all ${selectedHand === h ? 'bg-white text-black border-white' : 'border-white/10 text-muted hover:border-white/30'}`}
                    >
                      {h}
                    </button>
                  ))}
                </div>
              </div>

              {/* Flex */}
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Flex</h4>
                <div className="grid grid-cols-4 gap-4">
                  {[75, 85, 95, 100].map((f) => (
                    <button 
                      key={f}
                      onClick={() => setSelectedFlex(f)}
                      className={`py-3 border text-xs font-bold uppercase tracking-widest transition-all ${selectedFlex === f ? 'bg-white text-black border-white' : 'border-white/10 text-muted hover:border-white/30'}`}
                    >
                      {f}
                    </button>
                  ))}
                </div>
              </div>

              {/* Curve */}
              <div className="space-y-4">
                <h4 className="text-white font-bold uppercase tracking-widest text-[10px]">Courbe</h4>
                <div className="grid grid-cols-4 gap-4">
                  {['P92', 'P28', 'P88', 'P02'].map((c) => (
                    <button 
                      key={c}
                      onClick={() => setSelectedCurve(c)}
                      className={`py-3 border text-xs font-bold uppercase tracking-widest transition-all ${selectedCurve === c ? 'bg-white text-black border-white' : 'border-white/10 text-muted hover:border-white/30'}`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Add to Cart */}
            <div className="pt-8 flex gap-4 border-t border-white/5">
              <Button size="lg" variant="accent" className="flex-1">
                Ajouter au Panier
              </Button>
              <button className="p-4 border border-white/10 rounded-xl text-white hover:text-soyuz hover:border-soyuz/50 transition-all">
                <Heart size={20} />
              </button>
            </div>

            {/* Benefits */}
            <div className="grid grid-cols-2 gap-6 pt-10">
              <div className="flex items-center gap-3">
                <ShieldCheck className="text-soyuz" size={18} />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Garantie 30 Jours</span>
              </div>
              <div className="flex items-center gap-3">
                <Truck className="text-soyuz" size={18} />
                <span className="text-[10px] text-white font-bold uppercase tracking-widest">Expédition Rapide</span>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Specs */}
        <section className="mt-32 pt-16 border-t border-white/5">
          <h3 className="text-2xl font-black uppercase tracking-widest text-white mb-12">Spécifications Techniques</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
            {mockProduct.specs.map((spec, idx) => (
              <div key={idx} className="space-y-2">
                <p className="text-muted text-[10px] uppercase tracking-widest font-bold">{spec.label}</p>
                <p className="text-white font-bold">{spec.value}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
