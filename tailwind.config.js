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
        'text-primary': '#F0F0F5',
        'text-secondary': '#A0A0B0',
        'card-bg': '#1A1528',
        'dark-bg': '#0F0B1A',
        'dark-card': '#1A1528',
        'accent': '#F4D03F',
        'text-main': '#F0F0F5',
        'text-muted': '#A0A0B0',
      },
      borderRadius: {
        '3xl': '1.5rem',
        '4xl': '2rem',
      },
    },
  },
  plugins: [],
}