/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
        inter: ['Inter', 'sans-serif'],
      },
      colors: {
        brand: { red: '#dc2626', pink: '#fde2e2', green: '#16a34a' },
      },
      animation: {
        'fade-in': 'fadeIn 0.4s ease-out',
        'pulse-cta': 'pulseCta 1.6s ease-in-out infinite',
      },
      keyframes: {
        // Botão "respira" e solta um anel verde, para chamar o toque
        pulseCta: {
          '0%, 100%': { transform: 'scale(1)', boxShadow: '0 0 0 0 rgba(22,163,74,0.55)' },
          '50%': { transform: 'scale(1.04)', boxShadow: '0 0 0 14px rgba(22,163,74,0)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
