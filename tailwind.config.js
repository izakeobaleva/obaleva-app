/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roxo-principal': '#6B21A8',
        'amarelo-oba': '#F59E0B',
      },
    },
  },
  plugins: [],
}