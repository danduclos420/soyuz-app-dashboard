interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'outline' | 'accent';
  className?: string;
}

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  const variants = {
    default: 'bg-white/10 text-white border-transparent',
    outline: 'bg-transparent text-white border-white/20',
    accent: 'bg-soyuz text-white border-transparent'
  };

  return (
    <span className={`
      inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest border
      ${variants[variant]}
      ${className}
    `}>
      {children}
    </span>
  );
}
