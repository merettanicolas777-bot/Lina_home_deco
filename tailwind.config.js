/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        cream: '#FAF8F5',
        sand: '#F5F2EB',
        beige: '#EFE9DD',
        ink: '#2C2A29',
        muted: '#7C756E',
        clay: {
          DEFAULT: '#A68A64',
          light: '#C4A484',
          dark: '#8C7150',
        },
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        brand: '0.28em',
      },
      opacity: {
        8: '0.08',
        12: '0.12',
        15: '0.15',
        35: '0.35',
        65: '0.65',
        85: '0.85',
      },
      boxShadow: {
        soft: '0 24px 60px -32px rgba(44, 42, 41, 0.35)',
        card: '0 12px 40px -28px rgba(44, 42, 41, 0.45)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s ease-out both',
      },
    },
  },
  plugins: [],
}
