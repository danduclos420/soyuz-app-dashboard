'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-24 bg-carbon-surface relative overflow-hidden">
      {/* Background patterns */}
      <div className="absolute inset-0 opacity-5 carbon-texture pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="aspect-square relative rounded-2xl overflow-hidden border border-white/10">
              <img 
                src="https://images.unsplash.com/photo-1512719994953-eabf50895df7?q=80&w=1200&auto=format&fit=crop" 
                alt="SOYUZ Heritage"
                className="w-full h-full object-cover grayscale brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-60" />
            </div>
            {/* Decorative badge */}
            <div className="absolute -bottom-6 -right-6 bg-soyuz p-8 rounded-2xl shadow-2xl">
              <p className="text-white font-black text-4xl leading-none">2026</p>
              <p className="text-white/80 text-[10px] uppercase tracking-widest font-bold">Official Partner</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-soyuz font-bold uppercase tracking-[0.3em] text-sm mb-4">L'Héritage</h2>
              <h3 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-white">À Propos de SOYUZ</h3>
            </div>
            
            <div className="space-y-6 text-muted leading-relaxed">
              <p>
                SOYUZ BC n'est pas simplement une marque d'équipement ; c'est une alliance de force, de précision et de passion. Fondée sur le principe de l'unité ("Soyuz" signifiant Union), notre mission est de fournir aux athlètes d'élite les outils nécessaires pour briser leurs limites.
              </p>
              <p>
                Chaque bâton SOYUZ est le résultat d'une ingénierie de pointe en fibre de carbone, testée dans les conditions les plus extrêmes de la KHL pour garantir une puissance et une durabilité inégalées en Amérique du Nord.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-8 pt-8 border-t border-white/10">
              <div>
                <p className="text-white font-black text-3xl mb-1">98%</p>
                <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold">Pure Carbon Base</p>
              </div>
              <div>
                <p className="text-white font-black text-3xl mb-1">Elite</p>
                <p className="text-muted text-[10px] uppercase tracking-[0.2em] font-bold">KHL Performance</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
