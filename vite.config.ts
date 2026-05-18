import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: { 
    port: 32103,
    strictPort: true // Força usar exatamente esta porta
  },
});