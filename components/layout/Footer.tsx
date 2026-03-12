import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter, Youtube, Send } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/5 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-soyuz to-transparent opacity-20" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand */}
          <div className="space-y-8">
            <Image 
              src="/assets/logo-long.png" 
              alt="SOYUZ BC" 
              width={160} 
              height={40} 
              className="h-10 w-auto object-contain brightness-200"
            />
            <p className="text-muted text-[11px] uppercase tracking-widest leading-loose font-medium max-w-xs">
              Elite performance sticks for the next generation of hockey players. Engineer your shot with SOYUZ BC technology.
            </p>
            <div className="flex space-x-6">
              {[
                { icon: <Facebook size={18} />, href: '#' },
                { icon: <Instagram size={18} />, href: '#' },
                { icon: <Twitter size={18} />, href: '#' },
                { icon: <Youtube size={18} />, href: '#' },
              ].map((social, i) => (
                <a key={i} href={social.href} className="text-muted hover:text-soyuz transition-all duration-300 transform hover:scale-110">
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">Catalogue</h4>
            <ul className="space-y-4">
              {['All Products', 'Flex Guide', 'B2B Portal', 'Affiliate Rewards'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted hover:text-white text-[11px] uppercase tracking-widest font-bold transition-all hover:translate-x-1 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal / Company */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">Company</h4>
            <ul className="space-y-4">
              {['About Heritage', 'Privacy Protocol', 'Shipping Intel', 'Returns & FAQ'].map((item) => (
                <li key={item}>
                  <Link href="#" className="text-muted hover:text-white text-[11px] uppercase tracking-widest font-bold transition-all hover:translate-x-1 inline-block">
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter / The List */}
          <div>
            <h4 className="text-white font-black uppercase tracking-[0.3em] text-[10px] mb-8 italic">The Insider List</h4>
            <p className="text-muted text-[11px] uppercase tracking-widest mb-6 font-medium">Join the elite list for secure drops and performance updates.</p>
            <form className="relative group">
              <input 
                type="email" 
                placeholder="SECURE EMAIL ADDRESS" 
                className="bg-carbon-surface border border-white/5 px-6 py-4 text-[10px] text-white focus:outline-none focus:border-soyuz w-full uppercase tracking-tighter transition-all font-black placeholder:text-white/20"
              />
              <button className="absolute right-4 top-1/2 -translate-y-1/2 text-muted group-hover:text-soyuz transition-colors">
                <Send size={16} />
              </button>
            </form>
          </div>
        </div>

        <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-muted text-[9px] uppercase tracking-[0.4em] font-black">
            © {currentYear} SOYUZ BC NORTH AMERICA. ENGINEERED FOR PERFORMANCE.
          </p>
          <div className="flex gap-8">
            <Link href="#" className="text-muted hover:text-white text-[9px] uppercase tracking-widest font-black transition-colors">System Protocol</Link>
            <Link href="#" className="text-muted hover:text-white text-[9px] uppercase tracking-widest font-black transition-colors">Access Controls</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
