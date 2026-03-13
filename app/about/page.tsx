'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Target, Zap, Globe } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function AboutPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-24">
      <div className="soyuz-container relative z-10">
        <BackButton variant="relative" className="mb-12" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-soyuz font-bold uppercase tracking-[0.5em] text-xs mb-6">Heritage & Innovation</h1>
          <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-tight">
            Designed for <br />
            <span className="text-white outline-text">The Elite</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center mb-32">
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 group">
            <img 
              src="https://images.unsplash.com/photo-1580748141549-716500ca23ae?q=80&w=1200&auto=format&fit=crop" 
              alt="SOYUZ Carbon Technology"
              className="w-full h-full object-cover grayscale transition-all duration-700 group-hover:grayscale-0 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
          </div>

          <div className="space-y-8">
            <h3 className="text-3xl font-black text-white uppercase tracking-tight">Notre Mission</h3>
            <p className="text-muted text-lg leading-relaxed">
              SOYUZ BC North America est né d'une vision simple : apporter la technologie de pointe de la fibre de carbone utilisée dans les ligues professionnelles mondiales à chaque joueur ambitieux en Amérique du Nord.
            </p>
            <p className="text-muted leading-relaxed">
              Nous ne faisons aucun compromis sur la qualité. Chaque bâton est le résultat d'un processus de fabrication rigoureux, testé pour garantir un point de flexion réactif, une durabilité structurelle et un poids plume qui défie la physique.
            </p>
            
            <div className="grid grid-cols-2 gap-8 pt-8">
              <div className="flex gap-4">
                <Zap className="text-soyuz" size={24} />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest">Puissance</h4>
                  <p className="text-[10px] text-muted uppercase">Transfert d'énergie maximal</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Target className="text-soyuz" size={24} />
                <div>
                  <h4 className="text-white font-bold text-xs uppercase tracking-widest">Précision</h4>
                  <p className="text-[10px] text-muted uppercase">Contrôle laser sur la glace</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Global Impact */}
        <div className="bg-carbon-surface border border-white/5 rounded-3xl p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 carbon-texture opacity-5" />
          <div className="relative z-10 space-y-12">
            <Globe className="text-soyuz mx-auto" size={48} />
            <h3 className="text-4xl font-black text-white uppercase tracking-tighter">Une Portée Mondiale</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { label: 'Points de Vente', value: '50+' },
                { label: 'Revendeurs Pro', value: '120+' },
                { label: 'Modèles Carbone', value: '15' },
                { label: 'Satisfaction', value: '99%' }
              ].map((stat, idx) => (
                <div key={idx} className="space-y-1">
                  <p className="text-white font-black text-3xl">{stat.value}</p>
                  <p className="text-muted text-[10px] uppercase font-bold tracking-widest">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
