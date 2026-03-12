import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Twitter } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-background border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-6">
            <Image 
              src="/assets/logo-long.png" 
              alt="SOYUZ BC" 
              width={140} 
              height={35} 
              className="h-8 w-auto grayscale brightness-200"
            />
            <p className="text-muted text-sm leading-relaxed">
              Professional hockey sticks designed for elite athletes. SOYUZ BC North America.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="text-muted hover:text-white transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-muted hover:text-white transition-colors"><Twitter size={20} /></a>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Shop</h4>
            <ul className="space-y-4">
              <li><Link href="/products" className="text-muted hover:text-white text-sm transition-colors">All Products</Link></li>
              <li><Link href="/#collections" className="text-muted hover:text-white text-sm transition-colors">Collections</Link></li>
              <li><Link href="/rep/register" className="text-muted hover:text-white text-sm transition-colors">Affiliate Program</Link></li>
              <li><Link href="#b2b" className="text-muted hover:text-white text-sm transition-colors">B2B Portal</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Support</h4>
            <ul className="space-y-4">
              <li><Link href="#" className="text-muted hover:text-white text-sm transition-colors">Contact Us</Link></li>
              <li><Link href="#" className="text-muted hover:text-white text-sm transition-colors">Shipping Policy</Link></li>
              <li><Link href="#" className="text-muted hover:text-white text-sm transition-colors">Returns & Refunds</Link></li>
              <li><Link href="#" className="text-muted hover:text-white text-sm transition-colors">FAQ</Link></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold uppercase tracking-widest text-sm mb-6">Newsletter</h4>
            <p className="text-muted text-sm mb-4">Subscribe to receive updates and exclusive offers.</p>
            <form className="flex gap-2">
              <input 
                type="email" 
                placeholder="Email address" 
                className="bg-carbon-surface border border-white/10 px-4 py-2 text-sm text-white focus:outline-none focus:border-soyuz w-full"
              />
              <button className="bg-white text-black px-4 py-2 text-sm font-bold uppercase hover:bg-gray-200 transition-colors">
                Join
              </button>
            </form>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-muted text-xs uppercase tracking-widest">
            © {currentYear} SOYUZ BC NORTH AMERICA. ALL RIGHTS RESERVED.
          </p>
          <div className="flex gap-6">
            <Link href="#" className="text-muted hover:text-white text-[10px] uppercase tracking-widest transition-colors">Privacy Policy</Link>
            <Link href="#" className="text-muted hover:text-white text-[10px] uppercase tracking-widest transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
