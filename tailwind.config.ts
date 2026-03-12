import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        carbon: '#000000',
        'carbon-surface': '#121212',
        soyuz: '#00E5FF', // Mother site Cyan Glow
        muted: '#CCCCCC',
        background: '#000000',
        foreground: '#FFFFFF',
      },
      animation: {
        ticker: 'ticker 25s linear infinite',
      },
      keyframes: {
        ticker: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
