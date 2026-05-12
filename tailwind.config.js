/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'roxo-principal': '#6B2D8C',
        'roxo-escuro': '#3B1A4B',
        'roxo-grad-start': '#4A1D61',
        'roxo-grad-end': '#6B2D8C',
        'amarelo-oba': '#F4D03F',
        'amarelo-claro': '#FFD966',
        'amarelo-escuro': '#E6B800',
        'text-primary': '#1E1E2F',
        'text-secondary': '#6C6F85',
        'card-bg': '#FFFFFF',
      },
    },
  },
  plugins: [],
}