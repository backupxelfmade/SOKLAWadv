/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      screens: {
        'xs': '360px',
        '2xl': '1440px',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
      },
      maxHeight: {
        'screen-90': '90vh',
        'screen-80': '80vh',
        'screen-70': '70vh',
      },
      minHeight: {
        'screen-50': '50vh',
        'screen-60': '60vh',
        'screen-70': '70vh',
        'screen-80': '80vh',
        'screen-90': '90vh',
      },
      keyframes: {
        'dot-bounce': {
          '0%, 100%': { transform: 'translateY(0)',    opacity: '0.4' },
          '50%':       { transform: 'translateY(-3px)', opacity: '1'   },
        },
        'fade-in-up': {
          from: { opacity: '0', transform: 'translateY(12px) scale(0.97)' },
          to:   { opacity: '1', transform: 'translateY(0) scale(1)'       },
        },
        'teaser-in': {
          from: { opacity: '0', transform: 'translateY(8px)' },
          to:   { opacity: '1', transform: 'translateY(0)'   },
        },
      },
      animation: {
        'dot-bounce': 'dot-bounce 1s ease-in-out infinite',
        'fade-in-up': 'fade-in-up 0.25s ease-out',
        'teaser-in':  'teaser-in 0.3s ease-out',
      },
    },
  },
  plugins: [],
};
