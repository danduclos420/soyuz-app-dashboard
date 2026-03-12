import { ButtonHTMLAttributes } from 'react';
import { Slot } from '@radix-ui/react-slot';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'accent' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  asChild?: boolean;
}

export function Button({ 
  className, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  asChild = false,
  ...props 
}: ButtonProps) {
  const Comp = asChild ? Slot : 'button';

  const variants = {
    primary: 'bg-white text-black hover:bg-gray-200',
    accent: 'bg-soyuz text-white hover:opacity-90',
    outline: 'border border-white text-white hover:bg-white hover:text-black',
    ghost: 'text-white hover:bg-white/10'
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-8 py-3 text-sm',
    lg: 'px-12 py-4 text-base'
  };

  return (
    <Comp
      className={cn(
        'font-bold uppercase tracking-widest transition-all duration-200 inline-block text-center disabled:opacity-50 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth ? 'w-full' : '',
        className
      )}
      {...(props as any)}
    />
  );
}
