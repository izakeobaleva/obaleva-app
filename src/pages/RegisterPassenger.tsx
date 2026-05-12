import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { UserPlus, ArrowRight } from 'lucide-react'

export default function RegisterPassenger() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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
    <div className="min-h-screen bg-gradient-to-br from-[#4A1D61] via-[#6B2D8C] to-[#3B1A4B] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-[#F4D03F]/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-[#F4D03F]/20 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="backdrop-blur-lg bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-6">
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 backdrop-blur mb-3"
            >
              <UserPlus className="w-8 h-8 text-[#F4D03F]" />
            </motion.div>
            <h2 className="text-2xl font-bold text-white drop-shadow-sm">Cadastro Passageiro</h2>
            <p className="text-white/70 text-sm">Crie sua conta em instantes</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-3">
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
            <input
              type="tel"
              placeholder="Telefone com DDD"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              required
            />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Senha (mínimo 6 caracteres)"
              className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] transition"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3 text-lg flex items-center justify-center gap-2"
            >
              {loading ? 'Cadastrando...' : <>Criar conta <ArrowRight size={18} /></>}
            </motion.button>
          </form>

          <p className="text-center text-white/70 text-sm mt-4">
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