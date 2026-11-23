import { palette } from './src/data/palette.js';

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: Object.fromEntries(Object.entries(palette).map(([name, shades]) => [
        name, Object.fromEntries(Object.entries(shades).map(([shade, hex]) => [
          shade, `rgb(var(--${name}-${shade}, ${hex.slice(1).match(/.{2}/g).map((part) => parseInt(part, 16)).join(' ')}) / <alpha-value>)`,
        ])),
      ])),
      fontFamily: {
        display: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      maxWidth: {
        content: '1200px',
      },
      boxShadow: {
        glow: '0 0 0 1px rgba(44,189,209,0.12), 0 18px 60px -20px rgba(12,164,187,0.45)',
        'glow-amber': '0 0 0 1px rgba(255,149,51,0.14), 0 18px 60px -20px rgba(237,117,0,0.45)',
        card: '0 1px 0 0 rgba(255,255,255,0.04) inset, 0 24px 60px -30px rgba(0,0,0,0.7)',
      },
      backgroundImage: {
        'grid-fade':
          'radial-gradient(circle at 50% 0%, rgba(12,164,187,0.12), transparent 60%)',
      },
      keyframes: {
        float: {
          '0%,100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseSlow: {
          '0%,100%': { opacity: '0.35' },
          '50%': { opacity: '0.7' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      animation: {
        float: 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulseSlow 5s ease-in-out infinite',
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
};
