import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Home } from 'lucide-react'

export default function NotFound() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10"
      >
        <div className="text-8xl font-bold text-[#F4D03F]/30 mb-4">404</div>
        <h1 className="text-3xl font-bold text-white mb-2">Página não encontrada</h1>
        <p className="text-[#A0A0B0] mb-8 max-w-md">
          A página que você procura não existe ou foi movida.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn-premium px-8 py-3 inline-flex items-center gap-2"
        >
          <Home size={18} />
          Voltar ao início
        </button>
      </motion.div>
    </div>
  )
}