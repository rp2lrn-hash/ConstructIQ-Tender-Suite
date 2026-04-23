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
        // Soft neutral tones
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
        
        // Traffic-light status colors
        'status-green': '#22C55E',
        'status-green-light': '#DCFCE7',
        'status-yellow': '#EAB308',
        'status-yellow-light': '#FEF9C3',
        'status-red': '#EF4444',
        'status-red-light': '#FEE2E2',
        
        // Accent colors
        'accent-blue': '#3B82F6',
        'accent-blue-light': '#DBEAFE',
        'accent-purple': '#8B5CF6',
        'accent-purple-light': '#EDE9FE',
        
        // Backgrounds
        'bg-primary': '#FFFFFF',
        'bg-secondary': '#F8FAFC',
        'bg-tertiary': '#F1F5F9',
        
        // Text
        'text-primary': '#0F172A',
        'text-secondary': '#475569',
        'text-tertiary': '#94A3B8',
        
        // Borders
        'border-light': '#E2E8F0',
        'border-medium': '#CBD5E1',
      },
      boxShadow: {
        'card': '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 12px 32px rgba(0,0,0,0.10)',
        'button': '0 6px 18px rgba(43,182,115,0.35)',
        'button-hover': '0 10px 24px rgba(43,182,115,0.45)',
      },
      borderRadius: {
        'card': '14px',
        'button': '12px',
        'input': '22px',
        'badge': '999px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'slide-in': 'slideIn 0.3s ease-out',
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
      }
    },
  },
  plugins: [],
}
