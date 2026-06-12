/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Orbitron', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      colors: {
        cosmic: {
          bg: '#07080f',
          surface: '#0f1120',
          card: '#141728',
          border: '#1e2340',
          purple: '#7c3aed',
          blue: '#2563eb',
          glow: '#a78bfa',
          accent: '#818cf8',
          text: '#e2e8f0',
          muted: '#64748b',
        },
      },
      animation: {
        'pulse-slow': 'pulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #7c3aed, 0 0 10px #7c3aed' },
          '100%': { boxShadow: '0 0 20px #7c3aed, 0 0 40px #2563eb' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
      },
      backgroundImage: {
        'cosmic-gradient': 'linear-gradient(135deg, #07080f 0%, #0f0a1e 50%, #07080f 100%)',
        'card-gradient': 'linear-gradient(135deg, #141728 0%, #1a1f35 100%)',
        'button-gradient': 'linear-gradient(135deg, #7c3aed, #2563eb)',
        'x-gradient': 'linear-gradient(135deg, #f472b6, #ec4899)',
        'o-gradient': 'linear-gradient(135deg, #60a5fa, #3b82f6)',
        'win-gradient': 'linear-gradient(135deg, #a78bfa, #818cf8)',
      },
    },
  },
  plugins: [],
};
