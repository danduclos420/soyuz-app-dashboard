'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, Users, Zap } from 'lucide-react';

export default function RepRegisterPage() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-carbon-surface border border-white/5 p-12 rounded-3xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-soyuz/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="text-soyuz" size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white">Demande Reçue</h2>
          <p className="text-muted text-sm leading-relaxed">
            Merci de vouloir rejoindre l'élite SOYUZ BC. Notre équipe examinera votre profil et vous contactera sous peu pour finaliser votre accès au portail Rep.
          </p>
          <Button variant="outline" fullWidth asChild>
            <a href="/">Retour à l'Accueil</a>
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <h1 className="text-soyuz font-bold uppercase tracking-[0.3em] text-sm mb-4">Elite Partner Program</h1>
              <h2 className="text-5xl md:text-7xl font-black uppercase tracking-tighter text-white leading-none">
                Rejoignez la <br />
                <span className="text-white/50 italic">Team SOYUZ</span>
              </h2>
            </div>
            
            <p className="text-muted text-lg max-w-lg leading-relaxed">
              Devenez un ambassadeur officiel de SOYUZ BC North America. Gagnez des commissions, développez votre réseau et représentez la marque de bâtons de hockey la plus puissante du marché.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Trophy className="text-soyuz shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Commissions Élite</h4>
                  <p className="text-muted text-xs">Rémunération compétitive sur chaque vente générée par votre code.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="text-soyuz shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-white font-bold text-sm uppercase tracking-widest">Réseau Pro</h4>
                  <p className="text-muted text-xs">Accès à des événements exclusifs et aux dernières nouveautés KHL.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-carbon-surface rounded-2xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6">
                <ShieldCheck className="text-soyuz" size={40} />
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-lg">Authenticité</h4>
                  <p className="text-muted text-sm">Nous recherchons des athlètes passionnés qui partagent nos valeurs d'excellence.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-carbon-surface border border-white/10 rounded-3xl p-8 md:p-12 shadow-2xl"
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input label="Prénom" placeholder="Jean" required />
                <Input label="Nom" placeholder="Dupont" required />
              </div>
              <Input label="Email Professionnel" placeholder="jean@exemple.com" type="email" required />
              <Input label="Instagram / TikTok" placeholder="@votre_handle" required />
              <div className="space-y-2">
                <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
                  Motivation / Expérience Hockey
                </label>
                <textarea 
                  className="w-full bg-background border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-soyuz min-h-[120px]"
                  placeholder="Dites-nous pourquoi vous devriez représenter SOYUZ BC..."
                  required
                />
              </div>
              <Input label="Code Rep Souhaité" placeholder="JEAN10" />
              
              <div className="pt-6">
                <Button type="submit" variant="accent" fullWidth size="lg">
                  Soumettre ma Candidature
                </Button>
                <p className="mt-4 text-center text-[10px] text-muted uppercase tracking-widest leading-loose">
                  En soumettant ce formulaire, vous acceptez d'être contacté par notre équipe concernant le programme partenaire.
                </p>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
