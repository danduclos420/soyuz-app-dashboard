'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Facebook, Youtube, Mail, MapPin, Phone } from 'lucide-react';

const FOOTER_LINKS = {
  shop: [
    { name: 'All Products', href: '/products' },
    { name: 'HIT ULTRA Series', href: '/products?category=hit-ultra' },
    { name: 'CLASSIC Series', href: '/products?category=classic' },
    { name: 'MASTER FRST', href: '/products?category=master-frst' },
    { name: 'LORD Goalie', href: '/products?category=lord-goalie' },
    { name: 'New Arrivals', href: '/products?sort=new' },
  ],
  company: [
    { name: 'About SOYUZ BC', href: '/about' },
    { name: 'Contact Us', href: '/contact' },
    { name: 'Newsletter', href: '/newsletter' },
    { name: 'Become a Rep', href: '/rep/register' },
    { name: 'B2B Portal', href: 'https://soyuz-hockey.erplain.app/b2b/login' },
  ],
  account: [
    { name: 'My Account', href: '/account' },
    { name: 'My Orders', href: '/account' },
    { name: 'Rep Dashboard', href: '/rep' },
    { name: 'Track Order', href: '/account' },
    { name: 'Returns', href: '/contact' },
  ],
};

const SOCIALS = [
  { icon: Instagram, href: 'https://www.instagram.com/soyuznorthamerica/', label: 'Instagram' },
  { icon: Facebook, href: 'https://www.facebook.com', label: 'Facebook' },
  { icon: Youtube, href: '#', label: 'YouTube' },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative bg-[#0D0D0D] border-t border-white/5 overflow-hidden">
      {/* SUBTLE RED GLOW TOP */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-[#CC0000]/30 to-transparent" />

      {/* NEWSLETTER BANNER */}
      <div className="bg-[#1A1A1A] border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-widest text-[#CC0000] mb-1">Stay in the game</p>
              <h3 className="text-xl font-black uppercase tracking-tight">Join the SOYUZ Squad</h3>
              <p className="text-[#888888] text-sm mt-1">Exclusive drops, training tips & early access.</p>
            </div>
            <form className="flex w-full md:w-auto gap-0" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 md:w-72 bg-[#0D0D0D] border border-white/10 px-4 py-3 text-sm text-white placeholder-[#888888] focus:outline-none focus:border-[#CC0000] transition-colors"
              />
              <button
                type="submit"
                className="bg-[#CC0000] hover:bg-[#990000] text-white px-6 py-3 text-xs font-bold uppercase tracking-widest transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* MAIN FOOTER */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">

          {/* BRAND COLUMN */}
          <div className="lg:col-span-2">
            <Image
              src="/assets/SOYUZ_Logo_Long.png"
              alt="SOYUZ BC"
              width={160}
              height={45}
              className="h-10 w-auto object-contain mb-5 brightness-200"
            />
            <p className="text-[#888888] text-sm leading-relaxed mb-6 max-w-xs">
              Elite performance hockey sticks engineered for the next generation of champions.
              Designed in North America. Built for the pros.
            </p>
            {/* SOCIALS */}
            <div className="flex items-center gap-3 mb-6">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="w-9 h-9 flex items-center justify-center border border-white/10 text-[#888888] hover:text-white hover:border-white/30 transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {/* CONTACT INFO */}
            <div className="space-y-2">
              <a href="mailto:info@soyuzhockey.com" className="flex items-center gap-2 text-[#888888] hover:text-white transition-colors text-xs">
                <Mail size={12} />
                <span>info@soyuzhockey.com</span>
              </a>
              <div className="flex items-center gap-2 text-[#888888] text-xs">
                <MapPin size={12} />
                <span>BC, North America</span>
              </div>
            </div>
          </div>

          {/* SHOP LINKS */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-4">Shop</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.shop.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#888888] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* COMPANY LINKS */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-4">Company</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#888888] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* ACCOUNT LINKS */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#888888] mb-4">Account</h4>
            <ul className="space-y-3">
              {FOOTER_LINKS.account.map((link) => (
                <li key={link.name}>
                  <Link href={link.href} className="text-sm text-[#888888] hover:text-white transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* BOTTOM BAR */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[#888888] text-[11px] uppercase tracking-widest">
            &copy; {year} SOYUZ BC North America. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-[#888888] hover:text-white transition-colors text-[11px] uppercase tracking-wider">Privacy</Link>
            <Link href="/terms" className="text-[#888888] hover:text-white transition-colors text-[11px] uppercase tracking-wider">Terms</Link>
            <Link href="/shipping" className="text-[#888888] hover:text-white transition-colors text-[11px] uppercase tracking-wider">Shipping</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
