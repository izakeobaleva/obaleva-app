import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { Car, Star, Shield, Users, ChevronRight } from 'lucide-react'

export default function Landing() {
  const navigate = useNavigate()

  const features = [
    { icon: Car, title: 'Corridas Rápidas', desc: 'Motoristas próximos para te buscar em minutos' },
    { icon: Star, title: 'Motoristas Verificados', desc: 'Todos os motoristas passam por verificação' },
    { icon: Shield, title: 'Segurança', desc: 'Corridas monitoradas 24h com suporte prioritário' },
    { icon: Users, title: 'Para Todos', desc: 'Opções para passageiros e motoristas' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#1A1528] to-[#0F0B1A]">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-[#F4D03F]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-[#6B2D8C]/20 rounded-full blur-[120px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 flex justify-between items-center px-6 py-5 max-w-5xl mx-auto">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
          ObaLeve
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => navigate('/login')}
            className="btn-outline-dark px-5 py-2 text-sm"
          >
            Entrar
          </button>
          <button
            onClick={() => navigate('/register')}
            className="btn-premium px-5 py-2 text-sm"
          >
            Cadastrar
          </button>
        </div>
      </header>

      {/* Hero */}
      <main className="relative z-10 px-6 max-w-5xl mx-auto mt-10">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white leading-tight" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Mobilidade premium<br />
            <span className="bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent">para sua cidade</span>
          </h2>
          <p className="text-[#A0A0B0] text-lg mt-4 max-w-xl mx-auto">
            Corridas rápidas, motoristas confiáveis e um app que se adapta a você.
          </p>
          
          <div className="flex flex-wrap justify-center gap-3 mt-8">
            <button
              onClick={() => navigate('/register')}
              className="btn-premium px-8 py-3 text-base flex items-center gap-2"
            >
              Criar conta grátis
              <ChevronRight size={20} />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="btn-outline-dark px-8 py-3 text-base"
            >
              Já tenho conta
            </button>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#1A1528]/80 backdrop-blur-sm rounded-2xl p-6 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
            >
              <div className="p-3 bg-[#F4D03F]/10 rounded-xl w-fit mb-4">
                <feature.icon size={24} className="text-[#F4D03F]" />
              </div>
              <h3 className="text-white font-semibold mb-1">{feature.title}</h3>
              <p className="text-[#A0A0B0] text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* CTA Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-16 mb-10"
        >
          <p className="text-[#A0A0B0] text-sm">
            Quer dirigir?{' '}
            <button
              onClick={() => navigate('/register-driver')}
              className="text-[#F4D03F] font-semibold hover:underline"
            >
              Cadastre-se como motorista
            </button>
          </p>
        </motion.div>
      </main>
    </div>
  )
}