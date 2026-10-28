/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', 'sans-serif'],
      },
      colors: {
        brand: { red: '#dc2626', pink: '#fde2e2', green: '#16a34a' },
      },
    },
  },
  plugins: [],
}
