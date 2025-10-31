/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#00FF88',
        'primary-dark': '#00E676',
        'primary-light': '#66FFB3',
        accent: '#FF6B35',
        'accent-dark': '#E55A2B',
        background: '#0A0A0A',
        'background-secondary': '#111111',
        'background-tertiary': '#1A1A1A',
        text: '#FFFFFF',
        'text-secondary': '#B3B3B3',
        'text-muted': '#666666',
        success: '#00FF88',
        error: '#FF4444',
        warning: '#FFB800',
        'glass-bg': 'rgba(255, 255, 255, 0.05)',
        'glass-border': 'rgba(255, 255, 255, 0.1)',
        'glass-hover': 'rgba(255, 255, 255, 0.08)',
      },
      fontFamily: {
        sans: ['Urbanist', 'system-ui', 'sans-serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
    },
  },
  plugins: [],
}
