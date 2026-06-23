/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,jsx}'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50:  '#f0fdfa',
          100: '#ccfbf1',
          200: '#99f6e4',
          300: '#5eead4',
          400: '#14b8a6',
          500: '#0d9488',
          600: '#0f766e',
          700: '#0f5f58',
          800: '#115e59',
          900: '#134e4a',
          950: '#042f2e'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif']
      },
      boxShadow: {
        'xs':   '0 1px 2px 0 rgb(0 0 0 / 0.04)',
        'card': '0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)',
        'card-hover': '0 4px 12px 0 rgb(0 0 0 / 0.08), 0 2px 4px -1px rgb(0 0 0 / 0.04)',
        'modal': '0 20px 60px -10px rgb(0 0 0 / 0.18), 0 8px 24px -4px rgb(0 0 0 / 0.10)',
        'brand': '0 4px 14px 0 rgb(15 118 110 / 0.25)',
        'brand-lg': '0 8px 24px 0 rgb(15 118 110 / 0.30)',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backgroundImage: {
        'brand-gradient': 'linear-gradient(135deg, #0f766e 0%, #14b8a6 100%)',
        'sidebar-gradient': 'linear-gradient(180deg, #0f172a 0%, #0a1628 100%)',
      },
      animation: {
        'fade-up':    'fadeUp 0.35s cubic-bezier(0.16, 1, 0.3, 1) both',
        'scale-in':   'scaleIn 0.2s cubic-bezier(0.16, 1, 0.3, 1) both',
        'slide-in':   'slideInLeft 0.2s ease both',
        'shimmer':    'shimmer 1.5s infinite linear',
      }
    }
  },
  plugins: []
}
