import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // SOYUZ Brand Colors - matching soyuzhockey.com exactly
        background: '#0D0D0D',
        foreground: '#FFFFFF',
        carbon: '#0D0D0D',
        'carbon-surface': '#1A1A1A',
        'carbon-border': '#2A2A2A',
        soyuz: '#CC0000',        // SOYUZ Red accent
        'soyuz-dark': '#990000',
        muted: '#888888',
        'muted-foreground': '#AAAAAA',
        // Holographic / iridescent accent for premium feel
        holographic: 'linear-gradient(135deg, #a8edea, #fed6e3, #d299c2, #fef9d7)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Inter', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'carbon-texture': `repeating-linear-gradient(
          45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.015) 2px,
          rgba(255,255,255,0.015) 4px
        )`,
        'carbon-texture-2': `repeating-linear-gradient(
          -45deg,
          transparent,
          transparent 2px,
          rgba(255,255,255,0.01) 2px,
          rgba(255,255,255,0.01) 4px
        )`,
        'gradient-red': 'linear-gradient(135deg, #CC0000 0%, #880000 100%)',
        'gradient-dark': 'linear-gradient(180deg, #0D0D0D 0%, #1A1A1A 100%)',
        'holographic': 'linear-gradient(135deg, #a8edea 0%, #fed6e3 25%, #d299c2 50%, #ffecd2 75%, #a8edea 100%)',
      },
      animation: {
        ticker: 'ticker 30s linear infinite',
        'fade-in': 'fadeIn 0.6s ease forwards',
        'slide-up': 'slideUp 0.6s ease forwards',
        'slide-in-right': 'slideInRight 0.4s ease forwards',
        'pulse-red': 'pulseRed 2s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100%)' },
          '100%': { transform: 'translateX(0)' },
        },
        pulseRed: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(204,0,0,0.4)' },
          '50%': { boxShadow: '0 0 0 10px rgba(204,0,0,0)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition: '200% center' },
        },
      },
      screens: {
        'xs': '375px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
    },
  },
  plugins: [],
};

export default config;
