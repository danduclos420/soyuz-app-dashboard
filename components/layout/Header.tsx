'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, User, ChevronDown } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user);
    });
  }, []);

  const navLinks = [
    { name: 'Products', href: '/products' },
    { name: 'B2B Portal', href: '#b2b' },
    { name: 'Collections', href: '/#collections' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <Link href="/" className="flex-shrink-0 flex items-center">
            <Image 
              src="/assets/logo-long.png" 
              alt="SOYUZ BC" 
              width={160} 
              height={40} 
              className="h-10 w-auto object-contain"
              priority
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                href={link.href} 
                className="nav-link"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Icons & Selectors */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Language Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 group relative">
              <button className="text-[10px] text-muted font-bold tracking-widest uppercase hover:text-soyuz flex items-center gap-1">
                EN <ChevronDown size={10} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-32 bg-carbon-surface border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                {['EN', 'FR', 'ES', 'ZH', 'DE', 'RU'].map((l) => (
                  <button key={l} className="block w-full text-left px-2 py-1 text-[10px] text-muted hover:text-white uppercase font-bold tracking-widest">
                    {l}
                  </button>
                ))}
              </div>
            </div>

            {/* Currency Selector (Desktop) */}
            <div className="hidden lg:flex items-center gap-1 group relative">
              <button className="text-[10px] text-muted font-bold tracking-widest uppercase hover:text-soyuz flex items-center gap-1">
                CAD <ChevronDown size={10} />
              </button>
              <div className="absolute top-full right-0 mt-2 w-24 bg-carbon-surface border border-white/10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all p-2 z-50">
                {['CAD', 'USD'].map((c) => (
                  <button key={c} className="block w-full text-left px-2 py-1 text-[10px] text-muted hover:text-white uppercase font-bold tracking-widest">
                    {c}
                  </button>
                ))}
              </div>
            </div>

            <button className="text-white hover:text-soyuz transition-colors p-2">
              <ShoppingBag size={20} />
              <span className="sr-only">Cart</span>
            </button>
            <Link href={user ? "/account" : "/login"} className="text-white hover:text-soyuz transition-colors p-2">
              <User size={20} />
              <span className="sr-only">Account</span>
            </Link>
            {/* Mobile menu button */}
            <button 
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden text-white p-2"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      {isOpen && (
        <div className="md:hidden bg-background border-b border-white/5 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="px-4 pt-2 pb-6 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block nav-link py-3 border-b border-white/5 last:border-0"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            {user && (
              <Link
                href="/admin"
                className="block nav-link py-3 border-b border-white/5"
                onClick={() => setIsOpen(false)}
              >
                Admin Dashboard
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
