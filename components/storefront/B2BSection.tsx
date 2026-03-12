'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { ShieldCheck, Truck, RefreshCw, BarChart3 } from 'lucide-react';

export default function B2BSection() {
  const benefits = [
    { icon: <BarChart3 className="text-soyuz" />, label: 'Tarification Gros B2B' },
    { icon: <Truck className="text-soyuz" />, label: 'Livraison Prioritaire' },
    { icon: <RefreshCw className="text-soyuz" />, label: 'Sync Inventaire Direct' },
    { icon: <ShieldCheck className="text-soyuz" />, label: 'Garantie Platine Pro' }
  ];

  return (
    <section id="b2b" className="py-24 bg-background relative overflow-hidden">
      {/* Visual Accents */}
      <div className="absolute top-0 right-0 w-1/3 h-full bg-soyuz/5 -skew-x-12 transform translate-x-1/2" />
      
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="bg-carbon-surface border border-white/10 rounded-3xl p-12 md:p-20 shadow-2xl relative overflow-hidden"
        >
          {/* Carbon texture inside card */}
          <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
          
          <div className="relative z-10">
            <h2 className="text-soyuz font-bold uppercase tracking-[0.3em] text-xs mb-6">Partnership</h2>
            <h3 className="text-4xl md:text-6xl font-black uppercase tracking-tighter text-white mb-8">
              Portail Revendeurs <br />
              <span className="text-white opacity-50">B2B Professionnel</span>
            </h3>
            <p className="text-muted text-lg max-w-2xl mx-auto mb-16">
              Rejoignez l'élite. Accédez à notre inventaire en temps réel, gérez vos commandes groupées et bénéficiez de marges compétitives avec le programme partenaire SOYUZ BC North America.
            </p>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
              {benefits.map((benefit, i) => (
                <div key={i} className="flex flex-col items-center gap-4">
                  <div className="p-4 bg-background border border-white/5 rounded-2xl group-hover:border-soyuz/50 transition-colors">
                    {benefit.icon}
                  </div>
                  <p className="text-[10px] text-white/60 font-bold uppercase tracking-widest">{benefit.label}</p>
                </div>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-6">
              <Button variant="accent" size="lg" className="min-w-[250px]" asChild>
                <a href="https://soyuz-hockey.erplain.app/b2b/login" target="_blank" rel="noopener noreferrer">
                  Accéder au Portail
                </a>
              </Button>
              <Button variant="outline" size="lg" className="min-w-[250px]" asChild>
                <a href="/rep/register">Devenir Partenaire</a>
              </Button>
            </div>
          </div>

          {/* Decorative iridescent line */}
          <div className="absolute bottom-0 left-0 right-0 h-1 holographic opacity-50" />
        </motion.div>
      </div>
    </section>
  );
}
