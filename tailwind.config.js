export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        display: ['"Sora"', 'system-ui', 'sans-serif'],
        mono: ['"DM Mono"', 'monospace'],
      },
      colors: {
        brand: {
          50:  '#f0fafa',
          100: '#d0f0f0',
          200: '#a1dede',
          300: '#6ec6c6',
          400: '#3daaaa',
          500: '#1d9090',
          600: '#147474',
          700: '#0e5858',
          800: '#083c3c',
          900: '#042222',
        },
        surface: {
          0: '#ffffff',
          1: '#f8f9fa',
          2: '#f1f3f5',
          3: '#e9ecef',
          4: '#dee2e6',
        }
      },
      borderRadius: {
        '2xl': '1rem',
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 24px 0 rgba(0,0,0,0.06), 0 1px 4px 0 rgba(0,0,0,0.04)',
        'glass-lg': '0 8px 40px 0 rgba(0,0,0,0.08), 0 2px 8px 0 rgba(0,0,0,0.04)',
        'float': '0 20px 60px -12px rgba(0,0,0,0.12)',
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease both',
        'fade-in': 'fadeIn 0.4s ease both',
        'pulse-soft': 'pulseSoft 2s ease-in-out infinite',
        'slide-in': 'slideIn 0.35s cubic-bezier(0.16,1,0.3,1) both',
      },
      keyframes: {
        fadeUp: { '0%': { opacity: 0, transform: 'translateY(16px)' }, '100%': { opacity: 1, transform: 'translateY(0)' } },
        fadeIn: { '0%': { opacity: 0 }, '100%': { opacity: 1 } },
        pulseSoft: { '0%,100%': { opacity: 1 }, '50%': { opacity: 0.5 } },
        slideIn: { '0%': { opacity: 0, transform: 'translateX(-12px)' }, '100%': { opacity: 1, transform: 'translateX(0)' } },
      }
    },
  },
  plugins: [],
}
