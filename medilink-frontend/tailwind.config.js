/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        medilink: {
          canvas: '#f7f4ee',
          panel: '#fffdf9',
          ink: '#1f2937',
          muted: '#6b7280',
          mint: '#1d9d74',
          mintSoft: '#d9f5eb',
          coral: '#ef7d62',
          coralSoft: '#ffe4db',
          gold: '#c78d1d',
          goldSoft: '#fff3cf',
          border: '#e7dfd1',
        },
      },
      fontFamily: {
        display: ['Sora', 'ui-sans-serif', 'system-ui'],
        sans: ['Manrope', 'ui-sans-serif', 'system-ui'],
      },
      boxShadow: {
        panel: '0 22px 60px -36px rgba(31, 41, 55, 0.35)',
        glass: '0 8px 32px 0 rgba(31, 38, 135, 0.07)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.8' },
        }
      },
      animation: {
        fadeIn: 'fadeIn 0.5s ease-out',
        slideUp: 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        pulseSoft: 'pulseSoft 3s infinite',
      }
    },
  },
  plugins: [],
}
