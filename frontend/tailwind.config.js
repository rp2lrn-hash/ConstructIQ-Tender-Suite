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
        // LMS Teal Branding
        'teal-primary': '#005D6C',
        'teal-secondary': '#007B8F',
        'teal-accent': '#009BAA',
        'teal-soft': '#E8F4F6',
        'teal-light': '#F0F9FB',
        
        // Backgrounds
        'bg-app': '#F7F9FA',
        'bg-card': '#FFFFFF',
        'bg-soft': '#E8F4F6',
        
        // Text
        'text-primary': '#1A2332',
        'text-secondary': '#5A6E82',
        'text-muted': '#94A3B8',
        
        // Borders
        'border-default': '#E2E8ED',
        
        // Status Colors
        'status-success': '#16A34A',
        'status-success-bg': '#DCFCE7',
        'status-error': '#DC2626',
        'status-error-bg': '#FEE2E2',
        'status-warning': '#D97706',
        'status-warning-bg': '#FEF3C7',
        
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
        'card': '0 2px 6px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.06)',
        'card-hover': '0 10px 25px rgba(0,0,0,0.06)',
        'button': '0 4px 12px rgba(0,93,108,0.25)',
        'button-hover': '0 6px 16px rgba(0,93,108,0.35)',
        'navbar': '0 2px 6px rgba(0,0,0,0.04)',
      },
      borderRadius: {
        'card': '14px',
        'card-lg': '16px',
        'button': '9px',
        'tab': '8px',
        'input': '22px',
        'badge': '999px',
        'pill': '999px',
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
