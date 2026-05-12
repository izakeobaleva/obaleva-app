import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Shield, Clock, ArrowRight } from 'lucide-react'

export default function Landing() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <div className="container mx-auto px-4 py-12">
        <div className="flex justify-between items-center mb-16">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-[#F4D03F] to-[#FFD966] bg-clip-text text-transparent">
            OBALEVA
          </h1>
          <Link to="/login" className="btn-premium px-6 py-2">
            Entrar
          </Link>
        </div>

        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-5xl font-bold text-white leading-tight"
            >
              Mobilidade premium<br />para sua cidade
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-[#A0A0B0] text-lg mt-4"
            >
              Corridas rápidas, motoristas confiáveis e um app que se adapta a você.
            </motion.p>
            <div className="flex gap-4 mt-8">
              <Link to="/login" className="btn-premium flex items-center gap-2">
                Começar <ArrowRight size={18} />
              </Link>
              <button
                onClick={() => window.open('https://wa.me/?text=OBALEVA%20–%20Mobilidade%20premium%20para%20sua%20cidade!', '_blank')}
                className="btn-outline-dark"
              >
                Compartilhar
              </button>
            </div>
          </div>
          <div className="bg-[#1A1528] rounded-3xl p-6 border border-white/10">
            <div className="w-full rounded-2xl h-80 flex items-center justify-center text-6xl">
              📱
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mt-20">
          <div className="card-dark p-6 text-center">
            <Car className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white">Corridas sob demanda</h3>
            <p className="text-[#A0A0B0]">Solicite e um motorista parceiro chega em minutos.</p>
          </div>
          <div className="card-dark p-6 text-center">
            <Shield className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white">Segurança total</h3>
            <p className="text-[#A0A0B0]">Avaliações, verificação de documentos e suporte 24h.</p>
          </div>
          <div className="card-dark p-6 text-center">
            <Clock className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h3 className="text-xl font-semibold text-white">Chegada rápida</h3>
            <p className="text-[#A0A0B0]">Tempo médio de espera inferior a 5 minutos.</p>
          </div>
        </div>
      </div>
    </div>
  )
}