'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Menu, X, ShoppingBag, User, ChevronDown, Globe, Search } from 'lucide-react';

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
  { name: 'About', href: '/about' },
  { name: 'Contact', href: '/contact' },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [selectedLang, setSelectedLang] = useState(LANGUAGES[0]);
  const [selectedCurrency, setSelectedCurrency] = useState(CURRENCIES[0]);
  const [cartCount] = useState(0);
  const langRef = useRef<HTMLDivElement>(null);
  const currRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  return (
    <>
      {/* TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#CC0000] text-white text-center py-1.5 text-[10px] font-bold tracking-widest uppercase z-50">
        WELCOME TO SOYUZ STORE — FREE SHIPPING ON ORDERS $150+
      </div>

      {/* MAIN HEADER */}
      <header
        className={`sticky top-0 left-0 right-0 z-40 transition-all duration-300 ${
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
                src="/assets/SOYUZ_Logo_Long.png"
                alt="SOYUZ BC"
                width={140}
                height={40}
                className="h-9 w-auto object-contain"
                priority
              />
            </Link>

            {/* DESKTOP NAV */}
            <nav className="hidden md:flex items-center gap-8">
              {NAV_LINKS.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-[#888888] hover:text-white transition-colors duration-200 text-xs font-bold uppercase tracking-widest"
                >
                  {link.name}
                </Link>
              ))}
              <Link
                href="https://soyuz-hockey.erplain.app/b2b/login"
                target="_blank"
                className="text-xs font-bold uppercase tracking-widest text-[#CC0000] hover:text-red-400 transition-colors"
              >
                B2B Portal
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
                  <div className="lang-dropdown">
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
                  <div className="lang-dropdown">
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

              {/* ACCOUNT */}
              <Link href="/login" className="hidden md:flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors" aria-label="Account">
                <User size={18} />
              </Link>

              {/* CART */}
              <Link href="/cart" className="relative flex items-center justify-center w-9 h-9 text-[#888888] hover:text-white transition-colors" aria-label="Cart">
                <ShoppingBag size={18} />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-[#CC0000] text-white text-[9px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {cartCount}
                  </span>
                )}
              </Link>

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
    </>
  );
}
