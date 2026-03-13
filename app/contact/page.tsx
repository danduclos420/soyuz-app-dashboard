'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, Zap } from 'lucide-react';
import BackButton from '@/components/BackButton';

export default function ContactPage() {
  return (
    <div className="bg-background min-h-screen pt-32 pb-20 selection:bg-soyuz selection:text-white">
      <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <BackButton variant="relative" className="mb-12" />
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-3xl mb-20"
        >
          <span className="inline-block px-3 py-1 bg-soyuz/10 border border-soyuz/20 text-soyuz font-label text-[9px] mb-4 uppercase tracking-[0.2em] rounded-full">
            GET IN TOUCH
          </span>
          <h1 className="text-6xl md:text-8xl font-display italic tracking-tighter leading-[0.85] mb-6">
            BATTLE <br /><span className="outline-text-white">COMMAND</span>
          </h1>
          <p className="text-[#888888] font-bold uppercase tracking-widest text-xs max-w-xl">
            Connect with SOYUZ BC North America for support, partnership inquiries, or custom order requests.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* CONTACT FORM */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-8"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Full Name</label>
                  <input 
                    type="text" 
                    className="w-full bg-[#111] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none focus:border-soyuz transition-colors"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Email Address</label>
                  <input 
                    type="email" 
                    className="w-full bg-[#111] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none focus:border-soyuz transition-colors"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Subject</label>
                <select className="w-full bg-[#111] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none focus:border-soyuz transition-colors appearance-none">
                  <option>General Inquiry</option>
                  <option>Custom Stick Order</option>
                  <option>Affiliate Program</option>
                  <option>Technical Support</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-white/40">Message</label>
                <textarea 
                  rows={6}
                  className="w-full bg-[#111] border border-white/5 p-4 text-xs font-bold text-white focus:outline-none focus:border-soyuz transition-colors resize-none"
                  placeholder="How can we help?"
                />
              </div>

              <button className="btn-primary w-full h-16 text-sm font-black group">
                DISPATCH MESSAGE <Send size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </motion.div>

          {/* CONTACT INFO */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-soyuz/10 border border-soyuz/20 flex items-center justify-center shrink-0">
                  <Mail className="text-soyuz" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Email Support</h4>
                  <p className="text-white font-bold text-sm tracking-tight">info@protosmultisports.ca</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-soyuz/10 border border-soyuz/20 flex items-center justify-center shrink-0">
                  <MapPin className="text-soyuz" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">HQ Location</h4>
                  <p className="text-white font-bold text-sm tracking-tight italic">Québec, CA - North America</p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="w-12 h-12 bg-soyuz/10 border border-soyuz/20 flex items-center justify-center shrink-0">
                  <Zap className="text-soyuz" size={20} />
                </div>
                <div>
                  <h4 className="text-[10px] font-black uppercase tracking-widest text-white/40 mb-1">Response Time</h4>
                  <p className="text-white font-bold text-sm tracking-tight italic">Typically under 24 hours</p>
                </div>
              </div>
            </div>

            <div className="p-8 bg-white/5 border border-white/5 relative overflow-hidden">
               <div className="absolute inset-0 carbon-texture opacity-10" />
               <p className="relative z-10 text-[11px] text-white/60 font-medium uppercase tracking-[0.15em] leading-relaxed">
                 Join our mission to dominate the ice. For immediate business inquiries regarding the affiliate network, please mention "REP" in your message subject.
               </p>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
