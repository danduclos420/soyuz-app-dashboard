import { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export function Input({ label, error, className, ...props }: InputProps) {
  return (
    <div className="w-full space-y-2">
      {label && (
        <label className="block text-xs font-bold uppercase tracking-widest text-white/70">
          {label}
        </label>
      )}
      <input
        className={`
          w-full bg-carbon-surface border border-white/10 px-4 py-3 text-sm text-white 
          placeholder:text-muted focus:outline-none focus:border-soyuz 
          transition-all duration-200 disabled:opacity-50
          ${error ? 'border-soyuz' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-[10px] text-soyuz uppercase tracking-tighter italic">
          {error}
        </p>
      )}
    </div>
  );
}
