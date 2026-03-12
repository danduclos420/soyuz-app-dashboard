'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

interface BackButtonProps {
  href?: string;
  label?: string;
  className?: string;
}

export default function BackButton({ 
  href = '/', 
  label = 'Back to Website',
  className = ''
}: BackButtonProps) {
  return (
    <Link 
      href={href}
      className={`fixed top-6 left-6 z-[60] flex items-center gap-2 text-white/50 hover:text-white transition-colors bg-black/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/10 text-xs uppercase tracking-widest sm:top-8 sm:left-8 ${className}`}
    >
      <ArrowLeft size={14} />
      <span>{label}</span>
    </Link>
  );
}
