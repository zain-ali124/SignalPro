/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx,css}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['Syne', 'sans-serif'],
        body: ['DM Sans', 'sans-serif'],
      },
      colors: {
        dark: {
          900: '#06060b',
          800: '#0d0d15',
          700: '#12121e',
          600: '#1a1a2e',
          500: '#22223b',
        },
        orange: {
          400: '#fb923c',
          500: '#f97316',
          600: '#ea6c0a',
          glow: 'rgba(249,115,22,0.35)',
        },
        glass: 'rgba(255,255,255,0.04)',
      },
      backgroundImage: {
        'orange-gradient': 'linear-gradient(135deg, #f97316, #fb923c)',
        'dark-gradient': 'linear-gradient(135deg, #06060b, #0d0d15)',
        'glow-radial': 'radial-gradient(ellipse at center, rgba(249,115,22,0.15) 0%, transparent 70%)',
      },
      boxShadow: {
        'orange-glow': '0 0 30px rgba(249,115,22,0.3)',
        'orange-glow-sm': '0 0 15px rgba(249,115,22,0.2)',
        'glass': '0 8px 32px rgba(0,0,0,0.4)',
        'card': '0 4px 24px rgba(0,0,0,0.3)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow-pulse': 'glowPulse 3s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        glowPulse: {
          '0%, 100%': { boxShadow: '0 0 20px rgba(249,115,22,0.2)' },
          '50%': { boxShadow: '0 0 40px rgba(249,115,22,0.5)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}