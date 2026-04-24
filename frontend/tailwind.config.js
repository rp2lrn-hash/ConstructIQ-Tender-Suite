/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Sneat Color Palette
        'sneat-primary': '#696cff',
        'sneat-primary-rgb': '105, 108, 255',
        'sneat-secondary': '#8592a3',
        'sneat-success': '#71dd37',
        'sneat-info': '#03c3ec',
        'sneat-warning': '#ffab00',
        'sneat-danger': '#ff3e1d',
        'sneat-dark': '#2b2c40',
        'sneat-light': '#dbdee0',
        'sneat-gray': '#91979f',
        
        // Sneat Gray Scale
        'sneat-gray-25': '#fbfbfb',
        'sneat-gray-60': '#f2f3f3',
        'sneat-gray-80': '#edeef0',
        'sneat-gray-100': '#e9eaec',
        'sneat-gray-200': '#e4e6e8',
        'sneat-gray-300': '#bdc1c5',
        'sneat-gray-400': '#a7acb2',
        'sneat-gray-500': '#91979f',
        'sneat-gray-600': '#7a838b',
        'sneat-gray-700': '#646e78',
        'sneat-gray-800': '#4e5965',
        'sneat-gray-900': '#384551',
        
        // Backgrounds
        'bg-body': '#f5f5f9',
        'bg-paper': '#ffffff',
        'bg-card': '#ffffff',
        
        // Text
        'text-body': '#646e78',
        'text-heading': '#22303e',
        'text-muted': '#a7acb2',
        
        // Borders
        'border-default': '#e4e6e8',
        
        // Legacy colors for compatibility
        'neutral-50': '#FAFAFA',
        'neutral-100': '#F5F5F5',
        'neutral-200': '#E5E5E5',
        'neutral-300': '#D4D4D4',
        'neutral-400': '#A3A3A3',
        'neutral-500': '#737373',
        'neutral-600': '#525252',
        'neutral-700': '#404040',
        'neutral-800': '#262626',
        'neutral-900': '#171717',
      },
      boxShadow: {
        'sneat': '0 0.1875rem 0.5rem 0 rgba(34, 48, 62, 0.1)',
        'sneat-sm': '0 0.125rem 0.375rem 0 rgba(34, 48, 62, 0.08)',
        'sneat-lg': '0 0.25rem 0.75rem 0 rgba(34, 48, 62, 0.14)',
        'sneat-card': '0 0.1875rem 0.5rem 0 rgba(34, 48, 62, 0.1)',
      },
      borderRadius: {
        'sneat': '0.375rem',
        'sneat-sm': '0.25rem',
        'sneat-lg': '0.5rem',
      },
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        poppins: ['Poppins', 'sans-serif'],
        opensans: ['Open Sans', 'sans-serif'],
        'public': ['"Public Sans"', '-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Oxygen', 'Ubuntu', 'Cantarell', '"Fira Sans"', '"Droid Sans"', '"Helvetica Neue"', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
        'scale-in': 'scaleIn 0.25s ease',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-20px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95) translateY(-10px)' },
          '100%': { opacity: '1', transform: 'scale(1) translateY(0)' },
        },
      }
    },
  },
  plugins: [],
}
