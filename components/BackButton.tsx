'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
  variant?: 'fixed' | 'relative';
}

export default function BackButton({ 
  href = '/', 
  label = 'BACK TO BASE',
  className = '',
  variant = 'fixed'
}: BackButtonProps) {
  const baseStyles = "inline-flex items-center gap-2 text-[#444444] hover:text-white text-[9px] font-black uppercase tracking-[0.4em] transition-colors group";
  
  if (variant === 'relative') {
    return (
      <Link href={href} className={`${baseStyles} ${className}`}>
        <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> {label}
      </Link>
    );
  }

  return (
    <Link 
      href={href}
      className={`${baseStyles} fixed top-8 left-8 z-[60] ${className}`}
    >
      <ArrowLeft size={12} className="group-hover:-translate-x-1 transition-transform" /> {label}
    </Link>
  );
}
