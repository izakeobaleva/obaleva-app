/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        roxo: { principal: "#6B2D8C", escuro: "#4A1D61", claro: "#9B59B6" },
        amarelo: { principal: "#F4D03F", escuro: "#D4AC0D" },
      },
    },
  },
  plugins: [],
};