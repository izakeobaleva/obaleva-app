import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [
    react({
      // Ativa a transformação automática de JSX runtime (mais rápido)
      jsxRuntime: 'automatic',
      // Remove PropTypes em produção
      babel: {
        plugins: process.env.NODE_ENV === 'production' ? [['babel-plugin-transform-react-remove-prop-types', { removeImport: true }]] : []
      }
    }),
  ],
  resolve: {
    alias: {
      '@': new URL('./src', import.meta.url).pathname,
    },
  },
  build: {
    // Ativa minificação mais agressiva
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: false, // mantém console.warn/error, remove console.log se quiser
        drop_debugger: true,
      },
    },
    // Gera source maps apenas para desenvolvimento
    sourcemap: process.env.NODE_ENV !== 'production',
    // Divisão de chunks para melhor cache
    rollupOptions: {
      output: {
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom'],
          supabase: ['@supabase/supabase-js'],
          motion: ['framer-motion'],
          ui: ['sonner', 'lucide-react'],
        },
      },
    },
    // Otimiza CSS
    cssCodeSplit: false,
    // Gera relatório de tamanho (opcional)
    reportCompressedSize: false,
    chunkSizeWarningLimit: 1000,
  },
  server: {
    // Compressão para dev server
    compress: true,
  },
})