'use client';

import { motion } from 'framer-motion';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';

interface SoyuzButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'outline' | 'ghost' | 'glass' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  className?: string;
  href?: string;
  disabled?: boolean;
  isLoading?: boolean;
}

export default function SoyuzButton({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconPosition = 'right',
  className = '',
  href,
  disabled = false,
  isLoading = false
}: SoyuzButtonProps) {
  
  const baseStyles = "relative inline-flex items-center justify-center font-black italic uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed group overflow-hidden";
  
  const variants = {
    primary: "bg-soyuz text-black hover:shadow-[0_0_30px_rgba(204,0,0,0.4)] hover:scale-[1.02] active:scale-95",
    outline: "bg-transparent border border-white/20 text-white hover:bg-white/5 hover:border-soyuz/50",
    ghost: "bg-transparent text-white/40 hover:text-white hover:bg-white/5",
    glass: "bg-white/5 backdrop-blur-xl border border-white/10 text-white hover:bg-white/10 hover:border-white/20 shadow-2xl",
    white: "bg-white text-black hover:bg-white/90 shadow-xl"
  };

  const sizes = {
    sm: "px-6 py-2.5 text-[10px] rounded-lg",
    md: "px-8 py-4 text-xs rounded-xl",
    lg: "px-10 py-5 text-sm rounded-2xl",
    xl: "px-14 py-6 text-lg rounded-[2rem]"
  };

  const content = (
    <span className="relative z-10 flex items-center gap-3">
      {Icon && iconPosition === 'left' && <Icon size={size === 'xl' ? 24 : 18} className="shrink-0 transition-transform group-hover:-translate-x-1" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon size={size === 'xl' ? 24 : 18} className="shrink-0 transition-transform group-hover:translate-x-1" />}
      {isLoading && <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />}
    </span>
  );

  const buttonClasses = `${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`;

  if (href) {
    return (
      <Link href={href} className={buttonClasses}>
        <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
        {content}
      </Link>
    );
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={buttonClasses}
    >
      <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
      {content}
    </button>
  );
}
