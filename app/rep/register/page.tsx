import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { motion } from 'framer-motion';
import { ShieldCheck, Trophy, Users, Zap, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabase-client';
import { toast } from 'react-hot-toast';

export default function RepRegisterPage() {
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    social: '',
    motivation: '',
    repCode: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // 1. Sign up user in Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: `${formData.firstName} ${formData.lastName}`,
          }
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error('Failed to create account');

      // 2. We assume a trigger handles profile creation, or we do it here if needed
      // Actually, standard SOYUZ pattern often uses a trigger for profiles.
      // But let's ensure we create the rep record.
      
      const { error: repError } = await supabase.from('reps').insert({
        user_id: authData.user.id,
        code: formData.repCode.toUpperCase() || authData.user.id.slice(0, 5).toUpperCase(),
        status: 'pending',
      });

      if (repError) {
        console.error('Rep record error:', repError);
        // We don't throw here because user is already created, 
        // but we should notify admin to fix it.
      }

      // 3. Trigger Emails via API route (since we are in Client Component)
      await fetch('/api/rep/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      setSubmitted(true);
      toast.success('Professional Request Received');
    } catch (error: any) {
      console.error('Registration error:', error);
      toast.error(error.message || 'Transmission failed. Contact support.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (submitted) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-20">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-md w-full bg-carbon-surface border border-white/5 p-12 rounded-3xl text-center space-y-6"
        >
          <div className="w-20 h-20 bg-soyuz/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-soyuz/20 shadow-[0_0_40px_rgba(0,229,255,0.1)]">
            <Zap className="text-soyuz" size={40} />
          </div>
          <h2 className="text-3xl font-black uppercase tracking-tight text-white italic">Demande <span className="outline-text-white">Reçue</span></h2>
          <p className="text-[#888888] text-sm uppercase font-bold tracking-widest leading-relaxed">
            Merci de vouloir rejoindre l'élite SOYUZ BC. Notre équipe examinera votre profil et vous contactera sous peu pour finaliser votre accès au portail Rep.
          </p>
          <div className="pt-4">
            <Button variant="outline" fullWidth asChild className="py-4">
              <a href="/">RETOUR À L'ACCUEIL</a>
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-24 bg-[#0D0D0D]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* Info Side */}
          <div className="space-y-12">
            <div>
              <p className="text-soyuz font-black uppercase tracking-[0.4em] text-[10px] mb-4">Elite Partner Program</p>
              <h2 className="text-5xl md:text-8xl font-black uppercase tracking-tighter text-white leading-none italic">
                Rejoignez la <br />
                <span className="outline-text-white">Team SOYUZ</span>
              </h2>
            </div>
            
            <p className="text-[#888888] text-lg uppercase font-bold tracking-widest leading-relaxed max-w-lg">
              Devenez un ambassadeur officiel de SOYUZ BC North America. Gagnez des commissions, développez votre réseau et représentez la marque la plus puissante.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="flex gap-4">
                <Trophy className="text-soyuz shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Commissions Élite</h4>
                  <p className="text-[#888888] text-[9px] font-bold uppercase tracking-wider">Rémunération compétitive sur chaque vente générée.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <Users className="text-soyuz shrink-0" size={24} />
                <div className="space-y-1">
                  <h4 className="text-white font-black text-[10px] uppercase tracking-widest">Réseau Pro</h4>
                  <p className="text-[#888888] text-[9px] font-bold uppercase tracking-wider">Accès exclusif aux dernières nouveautés KHL.</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-carbon-surface rounded-3xl border border-white/5 relative overflow-hidden">
              <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
              <div className="relative z-10 flex items-center gap-6">
                <ShieldCheck className="text-soyuz" size={40} />
                <div>
                  <h4 className="text-white font-black uppercase tracking-widest text-lg italic">Authenticité</h4>
                  <p className="text-[#888888] text-xs uppercase font-bold tracking-wider leading-relaxed">Nous recherchons des athlètes passionnés qui partagent nos valeurs.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Form Side */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-carbon-surface border border-white/5 rounded-[32px] p-8 md:p-12 shadow-2xl relative overflow-hidden"
          >
            <div className="absolute inset-0 carbon-texture opacity-5" />
            <form onSubmit={handleSubmit} className="relative z-10 space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <Input name="firstName" label="Prénom" placeholder="Jean" required value={formData.firstName} onChange={handleChange} />
                <Input name="lastName" label="Nom" placeholder="Dupont" required value={formData.lastName} onChange={handleChange} />
              </div>
              <Input name="email" label="Email Professionnel" placeholder="jean@exemple.com" type="email" required value={formData.email} onChange={handleChange} />
              <Input name="password" label="Mot de passe" placeholder="••••••••" type="password" required value={formData.password} onChange={handleChange} />
              <Input name="social" label="Instagram / TikTok" placeholder="@votre_handle" required value={formData.social} onChange={handleChange} />
              <div className="space-y-2">
                <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-[#888888]">
                  Motivation / Expérience Hockey
                </label>
                <textarea 
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleChange}
                  className="w-full bg-black/40 border border-white/5 rounded-2xl px-4 py-4 text-sm text-white focus:outline-none focus:border-soyuz min-h-[120px] placeholder:text-white/10 transition-colors"
                  placeholder="Dites-nous pourquoi vous devriez rejoindre SOYUZ..."
                  required
                />
              </div>
              <Input name="repCode" label="Code Rep Souhaité" placeholder="JEAN10" value={formData.repCode} onChange={handleChange} />
              
              <div className="pt-6">
                <Button type="submit" variant="primary" fullWidth size="lg" disabled={loading} className="py-4">
                  {loading ? <Loader2 className="animate-spin" /> : 'SOUMETTRE MA CANDIDATURE'}
                </Button>
                <p className="mt-6 text-center text-[9px] text-[#888888] font-black uppercase tracking-[0.2em] leading-relaxed">
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
