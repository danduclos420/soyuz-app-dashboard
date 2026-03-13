'use client';

import { useState, useEffect, useRef, Fragment, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, User, ChevronDown, Globe, Search, LogOut, ArrowRight } from 'lucide-react';
import { useCartStore } from '@/lib/store/cart';
import ShoppingCart from '../storefront/ShoppingCart';
import { supabase } from '@/lib/supabase-client';
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from 'next/navigation';

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'fr', label: 'Français', flag: '🇫🇷' },
  { code: 'es', label: 'Español', flag: '🇪🇸' },
  { code: 'zh', label: '中文', flag: '🇨🇳' },
  { code: 'de', label: 'Deutsch', flag: '🇩🇪' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

const CURRENCIES = [
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'USD', symbol: 'US$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
];

const NAV_LINKS = [
  { name: 'Shop', href: '/products' },
  { name: 'Collections', href: '/products#collections' },
  { name: 'Stick Guide', href: '#', hasMegaMenu: true },
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

const STICK_GUIDE_ITEMS = [
  {
    title: 'CURVE',
    description: 'Our hockey curve chart will help you compare popular brands to SOYUZ equivalent patterns.',
    href: '/guide/curve',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M10 5C10 5 12 25 35 30" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'KICK POINT',
    description: 'Choose where you want the focus of the bend of your stick to be located for maximum power.',
    href: '/guide/kick-point',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M20 5V35M15 20L20 22L25 20" strokeLinecap="round" />
        <circle cx="20" cy="22" r="2" fill="currentColor" />
      </svg>
    )
  },
  {
    title: 'HEIGHT',
    description: 'Learn how to measure your stick and get the perfect fit for your next order.',
    href: '/guide/height',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M15 5H25M20 5V35M15 35H25M15 15H20M15 25H20" strokeLinecap="round" />
      </svg>
    )
  },
  {
    title: 'LIE',
    description: 'Understand how your blade sits on the ice in your natural skating or shooting stance.',
    href: '/guide/lie',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 30L20 30L35 15" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 35H35" strokeOpacity="0.3" />
      </svg>
    )
  },
  {
    title: 'FLEX',
    description: 'Understand what stick flex is best suited for your weight and playing style.',
    href: '/guide/flex',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M5 25C15 15 25 15 35 25" strokeLinecap="round" />
        <path d="M18 18L20 15L22 18" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    )
  },
  {
    title: 'PLAYER SIDE',
    description: 'Establish what side feels more natural to your playing style: Left or Right handed.',
    href: '/guide/player-side',
    icon: (
      <svg viewBox="0 0 40 40" className="w-10 h-10 text-soyuz" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 10C12 10 15 25 10 35M28 10C28 10 25 25 30 35" strokeLinecap="round" />
        <circle cx="20" cy="22" r="3" fill="currentColor" />
      </svg>
    )
  },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [user, setUser] = useState<any>(null);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const router = useRouter();
  
  const { getTotalItems, toggleCart } = useCartStore();
  const [isHydrated, setIsHydrated] = useState(false);
  
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsHydrated(true);
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Check auth status
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUserProfile(null);
      }
    });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      subscription.unsubscribe();
    };
  }, []);

  const fetchProfile = async (userId: string) => {
    const { data } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .maybeSingle();
    setUserProfile(data);
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) setLangOpen(false);
      if (currRef.current && !currRef.current.contains(e.target as Node)) setCurrencyOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  const cartCount = isHydrated ? getTotalItems() : 0;

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR - REVERTED TO TOP */}
      <div className="bg-[#CC0000] text-white text-center py-1.5 text-[10px] font-bold tracking-widest uppercase sticky top-0 z-[60]">
        WELCOME TO SOYUZ STORE — FREE SHIPPING ON ORDERS $150+
      </div>

      <header
        className={`sticky top-[24px] left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? 'bg-[#0D0D0D]/95 backdrop-blur-md border-b border-white/5 shadow-xl'
            : 'bg-[#0D0D0D] border-b border-white/5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between h-16">

            {/* LOGO */}
            <Link href="/" className="flex-shrink-0 flex items-center">
              <Image
                src="/assets/logo-long.png"
                alt="SOYUZ BC"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-10">
              {NAV_LINKS.map((link) => (
                <div 
                  key={link.name}
                  onMouseEnter={() => link.hasMegaMenu && setMegaMenuOpen(true)}
                  onMouseLeave={() => link.hasMegaMenu && setMegaMenuOpen(false)}
                  className="relative py-4"
                >
                  <Link
                    href={link.href}
                    className="text-[#888888] hover:text-white transition-colors duration-200 text-[10px] font-black uppercase tracking-[0.2em] flex items-center gap-1"
                  >
                    {link.name}
                    {link.hasMegaMenu && <ChevronDown size={10} className={`transition-transform duration-300 ${megaMenuOpen ? 'rotate-180 text-soyuz' : ''}`} />}
                  </Link>
                </div>
              ))}
              <Link
                href="https://soyuz-hockey.erplain.app/b2b/login"
                target="_blank"
                className="text-[10px] font-black uppercase tracking-[0.3em] text-soyuz hover:text-white transition-colors border-l border-white/10 pl-10"
              >
                B2B NODE
              </Link>
            </nav>

            {/* RIGHT SIDE ACTIONS */}
            <div className="flex items-center gap-2">

              {/* LANGUAGE SELECTOR */}
              <div ref={langRef} className="relative hidden md:block">
                <button
                  onClick={() => { setLangOpen(!langOpen); setCurrencyOpen(false); }}
                  className="flex items-center gap-1 text-[#888888] hover:text-white transition-colors px-2 py-1 text-xs"
                  aria-label="Select language"
                >
                  <Globe size={14} />
                  <span className="font-bold uppercase tracking-wider">{selectedLang.code.toUpperCase()}</span>
                  <ChevronDown size={12} className={`transition-transform ${langOpen ? 'rotate-180' : ''}`} />
                </button>
                {langOpen && (
                  <div className="lang-dropdown absolute right-0 mt-2 bg-carbon-surface border border-white/5 shadow-2xl py-2 w-48 z-50">
                    {LANGUAGES.map((lang) => (
                      <button
                        key={lang.code}
                        onClick={() => { setSelectedLang(lang); setLangOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                          selectedLang.code === lang.code ? 'text-white font-bold' : 'text-[#888888]'
                        }`}
                      >
                        <span>{lang.flag}</span>
                        <span className="uppercase tracking-wide">{lang.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* CURRENCY SELECTOR */}
              <div ref={currRef} className="relative hidden md:block">
                <button
                  onClick={() => { setCurrencyOpen(!currencyOpen); setLangOpen(false); }}
                  className="flex items-center gap-1 text-[#888888] hover:text-white transition-colors px-2 py-1 text-xs"
                  aria-label="Select currency"
                >
                  <span className="font-bold">{selectedCurrency.code}</span>
                  <ChevronDown size={12} className={`transition-transform ${currencyOpen ? 'rotate-180' : ''}`} />
                </button>
                {currencyOpen && (
                  <div className="lang-dropdown absolute right-0 mt-2 bg-carbon-surface border border-white/5 shadow-2xl py-2 w-48 z-50">
                    {CURRENCIES.map((curr) => (
                      <button
                        key={curr.code}
                        onClick={() => { setSelectedCurrency(curr); setCurrencyOpen(false); }}
                        className={`w-full flex items-center gap-2 px-3 py-2 text-xs hover:bg-white/5 transition-colors ${
                          selectedCurrency.code === curr.code ? 'text-white font-bold' : 'text-[#888888]'
                        }`}
                      >
                        <span className="font-mono">{curr.symbol}</span>
                        <span className="uppercase tracking-wide">{curr.code}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* SEARCH */}
              <button className="hidden md:flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors" aria-label="Search">
                <Search size={18} />
              </button>

              {/* ACCOUNT ICON REDIRECT LOGIC */}
              <Link 
                href={
                  !user ? '/login' :
                  userProfile?.role === 'admin' ? '/admin' :
                  userProfile?.role === 'rep' ? '/affiliate' :
                  '/account'
                } 
                className="hidden md:flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors" 
                aria-label="Account"
              >
                <User size={18} />
              </Link>

              {user && (
                <button 
                  onClick={async () => {
                    await supabase.auth.signOut();
                    router.push('/');
                  }}
                  className="hidden md:flex items-center justify-center w-9 h-9 text-[#888888] hover:text-soyuz transition-colors" 
                  aria-label="Logout"
                >
                  <LogOut size={16} />
                </button>
              )}

              {/* CART */}
              <button 
                onClick={() => toggleCart(true)}
                className="relative flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors" 
                aria-label="Cart"
              >
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#CC0000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </button>

              {/* MOBILE MENU TOGGLE */}
              <button
                onClick={() => setMobileOpen(!mobileOpen)}
                className="md:hidden flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors"
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* MEGA MENU: STICK GUIDE */}
        <AnimatePresence>
          {megaMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              onMouseEnter={() => setMegaMenuOpen(true)}
              onMouseLeave={() => setMegaMenuOpen(false)}
              className="absolute top-full left-0 right-0 bg-[#0D0D0D] border-b border-white/5 shadow-[0_50px_100px_rgba(0,0,0,0.8)] z-50 overflow-hidden"
            >
              <div className="absolute inset-0 carbon-texture opacity-5 pointer-events-none" />
              <div className="max-w-7xl mx-auto flex">
                {/* SIDEBAR */}
                <div className="w-1/4 p-12 border-r border-white/5 bg-white/[0.02]">
                  <h3 className="font-display text-4xl italic mb-6">STICK <span className="text-soyuz">GUIDE</span></h3>
                  <p className="text-[#888888] text-xs leading-relaxed mb-8 uppercase tracking-wider font-medium">
                    Don't know where to start? Or searching for a specific curve? Our guide will help you through the customization process to be sure you choose the right Custom Hockey Stick.
                  </p>
                  <Link href="/guide" className="inline-block px-6 py-3 bg-soyuz text-white text-[10px] font-black uppercase tracking-[0.2em] hover:bg-white hover:text-black transition-all">
                    VIEW THE FULL GUIDE
                  </Link>
                </div>

                {/* CONTENT GRID */}
                <div className="w-3/4 p-12 grid grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-10 bg-gradient-to-br from-transparent to-soyuz/[0.02]">
                  {STICK_GUIDE_ITEMS.map((item) => (
                    <Link key={item.title} href={item.href} className="flex gap-4 group">
                      <div className="flex-shrink-0 w-16 h-16 bg-white/[0.03] border border-white/5 rounded-xl flex items-center justify-center group-hover:bg-soyuz/10 group-hover:border-soyuz/30 transition-all duration-300 shadow-xl">
                        {item.icon}
                      </div>
                      <div className="flex flex-col">
                        <h4 className="font-black text-xs uppercase tracking-[0.2em] mb-2 group-hover:text-soyuz transition-colors flex items-center gap-2">
                          {item.title} <ArrowRight size={12} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                        </h4>
                        <p className="text-[#666666] text-[10px] leading-relaxed uppercase tracking-widest group-hover:text-[#888888] transition-colors line-clamp-2">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="mobile-menu pt-16">
          <div className="flex flex-col gap-1 mt-4">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="py-4 px-2 text-white text-xl font-black uppercase tracking-wider border-b border-white/5 hover:text-[#CC0000] transition-colors"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="https://soyuz-hockey.erplain.app/b2b/login"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="py-4 px-2 text-[#CC0000] text-xl font-black uppercase tracking-wider border-b border-white/5"
            >
              B2B Portal
            </Link>
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="py-4 px-2 text-[#888888] text-xl font-black uppercase tracking-wider border-b border-white/5 hover:text-white transition-colors"
            >
              My Account
            </Link>
          </div>

          {/* MOBILE LANG + CURRENCY */}
          <div className="mt-auto pt-8 border-t border-white/10">
            <p className="text-[#888888] text-xs uppercase tracking-widest mb-3 font-bold">Language</p>
            <div className="grid grid-cols-3 gap-2">
              {LANGUAGES.map((lang) => (
                <button
                  key={lang.code}
                  onClick={() => setSelectedLang(lang)}
                  className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    selectedLang.code === lang.code
                      ? 'border-[#CC0000] text-white bg-[#CC0000]/10'
                      : 'border-white/10 text-[#888888] hover:border-white/30'
                  }`}
                >
                  {lang.flag} {lang.code.toUpperCase()}
                </button>
              ))}
            </div>
            <p className="text-[#888888] text-xs uppercase tracking-widest mb-3 mt-4 font-bold">Currency</p>
            <div className="flex gap-2">
              {CURRENCIES.map((curr) => (
                <button
                  key={curr.code}
                  onClick={() => setSelectedCurrency(curr)}
                  className={`py-2 px-3 text-xs font-bold uppercase tracking-wider border transition-colors ${
                    selectedCurrency.code === curr.code
                      ? 'border-[#CC0000] text-white bg-[#CC0000]/10'
                      : 'border-white/10 text-[#888888] hover:border-white/30'
                  }`}
                >
                  {curr.code}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      <ShoppingCart />
    </>
  );
}
