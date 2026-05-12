import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { UserPlus, ArrowRight, Mail, Lock, User, Phone, Eye, EyeOff } from 'lucide-react'

export default function RegisterPassenger() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [nome, setNome] = useState('')
  const [telefone, setTelefone] = useState('')
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { nome_completo: nome, tipo: 'passageiro' } }
    })
    if (error) {
      toast.error('Erro: ' + error.message)
    } else if (data.user) {
      await supabase.from('passageiros').insert({ id: data.user.id, nome, telefone })
      await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, telefone, email, tipo: 'passageiro' })
      toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.')
      navigate('/')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card-dark p-8">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 backdrop-blur mb-3"
            >
              <UserPlus className="w-8 h-8 text-[#F4D03F]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white">Cadastro Passageiro</h2>
            <p className="text-[#A0A0B0] text-sm">Crie sua conta em instantes</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <User size={14} className="text-[#F4D03F] shrink-0" />
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Phone size={14} className="text-[#F4D03F] shrink-0" />
              <input
                type="tel"
                placeholder="Telefone com DDD"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Mail size={14} className="text-[#F4D03F] shrink-0" />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1.5 leading-none">
              <Lock size={14} className="text-[#F4D03F] shrink-0" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha (mínimo 6 caracteres)"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
                aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
              >
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-1.5 leading-none rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm shadow-md"
            >
              {loading ? 'Cadastrando...' : <>Criar conta <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <p className="text-center text-[#A0A0B0] text-sm mt-4">
            Já tem conta?{' '}
            <button onClick={() => navigate('/')} className="text-[#F4D03F] font-semibold hover:underline">
              Faça login
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}