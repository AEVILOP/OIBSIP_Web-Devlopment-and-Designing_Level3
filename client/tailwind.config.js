/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A0A0A',
        surface: '#141414',
        card: '#1A1A1A',
        fire: '#FF5722',
        amber: '#FFB347',
        cream: '#F5F5F5',
        muted: '#8A8A8A',
        success: '#34D399',
        danger: '#F87171',
        line: '#252525',
        glow: '#FF572233',
      },
      fontFamily: {
        display: ['Outfit', 'Syne', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
      },
      boxShadow: {
        fire: '0 0 40px rgba(255,87,34,.18)',
        'fire-lg': '0 8px 60px rgba(255,87,34,.25)',
        card: '0 4px 24px rgba(0,0,0,.35)',
        glow: '0 0 20px rgba(255,87,34,.12)',
      },
      keyframes: {
        glow: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(255,87,34,.5)' },
          '50%': { boxShadow: '0 0 0 10px rgba(255,87,34,0)' },
        },
        fadeUp: {
          from: { opacity: '0', transform: 'translateY(20px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-16px)' },
          to: { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        shimmer: {
          from: { backgroundPosition: '-200% 0' },
          to: { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '.6' },
        },
        'spin-slow': {
          from: { transform: 'rotate(0deg)' },
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        glow: 'glow 1.8s ease-in-out infinite',
        fadeUp: 'fadeUp .5s ease-out both',
        slideIn: 'slideIn .4s ease-out both',
        float: 'float 4s ease-in-out infinite',
        shimmer: 'shimmer 2s linear infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
        'spin-slow': 'spin-slow 12s linear infinite',
      },
    },
  },
  plugins: [],
};
