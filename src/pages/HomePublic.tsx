import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Mail, Chrome, UserPlus, Car } from 'lucide-react'

export default function HomePublic() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#1A1528] to-[#0F0B1A] flex flex-col">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/20 rounded-full blur-[120px]" />
      </div>

      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-6">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#F4D03F]/20">
            <Car size={40} className="text-[#1E1E2F]" />
          </div>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-3xl font-bold text-white text-center" 
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          ObaLeve
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-[#A0A0B0] text-center mt-2 mb-10 max-w-xs"
        >
          Mobilidade premium para sua cidade
        </motion.p>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="w-full max-w-sm space-y-3"
        >
          <button
            onClick={() => navigate('/login')}
            className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center gap-3 hover:border-[#F4D03F]/30 transition-all"
          >
            <div className="p-2 bg-[#F4D03F]/10 rounded-xl">
              <Mail size={20} className="text-[#F4D03F]" />
            </div>
            <span>Entrar com e-mail</span>
          </button>

          <button
            className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center gap-3 hover:border-[#F4D03F]/30 transition-all opacity-60 cursor-not-allowed"
            disabled
          >
            <div className="p-2 bg-white/10 rounded-xl">
              <Chrome size={20} className="text-white" />
            </div>
            <span className="text-[#A0A0B0]">Entrar com Google</span>
            <span className="ml-auto text-[10px] text-[#A0A0B0] bg-white/10 px-2 py-0.5 rounded-full">Em breve</span>
          </button>

          <div className="pt-4">
            <button
              onClick={() => navigate('/register')}
              className="w-full btn-premium py-4 rounded-2xl text-base font-bold flex items-center justify-center gap-2"
            >
              <UserPlus size={20} />
              Criar conta
            </button>
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 text-center"
        >
          <p className="text-[#A0A0B0] text-xs">
            Quer dirigir?{' '}
            <button
              onClick={() => navigate('/register-driver')}
              className="text-[#F4D03F] font-semibold hover:underline"
            >
              Cadastro Motorista
            </button>
          </p>
        </motion.div>
      </div>
    </div>
  )
}