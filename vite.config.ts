import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  server: {
    port: 3000,
=======
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
  },
})