/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // Base
        chalk: '#F2F1EA',
        bone: '#E8E5DA',
        shell: '#FFFFFF',
        line: '#DCD8CB',
        ink: '#23251F',
        muted: '#6E7167',
        // Acentos
        moss: {
          DEFAULT: '#3F4A3A',
          light: '#8A957E',
          dark: '#2E372A',
        },
        amber: '#B98B4E',
        // Aliases heredados (admin, formularios, PWA)
        cream: '#F2F1EA',
        sand: '#E8E5DA',
        beige: '#E4E0D2',
        clay: {
          DEFAULT: '#3F4A3A',
          light: '#8A957E',
          dark: '#2E372A',
        },
      },
      fontFamily: {
        display: ['Fraunces', 'Georgia', 'serif'],
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Manrope', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        xs: '6px',
        sm: '10px',
        md: '14px',
        lg: '20px',
        xl: '26px',
        '2xl': '32px',
        '3xl': '40px',
        '4xl': '48px',
      },
      letterSpacing: {
        brand: '0.18em',
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
        soft: '0 2px 4px -2px rgba(35, 37, 31, 0.06), 0 20px 40px -30px rgba(35, 37, 31, 0.4)',
        card: '0 1px 2px rgba(35, 37, 31, 0.04), 0 26px 48px -34px rgba(35, 37, 31, 0.45)',
        lift: '0 3px 8px -3px rgba(35, 37, 31, 0.1), 0 34px 60px -38px rgba(35, 37, 31, 0.5)',
        inset: 'inset 0 1px 0 rgba(255, 255, 255, 0.7)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.6s cubic-bezier(0.16, 1, 0.3, 1) both',
        'fade-in': 'fade-in 0.4s ease-out both',
      },
    },
  },
  plugins: [],
}
