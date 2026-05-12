import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
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
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      })
      if (error) throw error
      if (data.user) {
        await supabase.from('passageiros').insert({ id: data.user.id, nome, telefone })
        await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, telefone, email, tipo: 'passageiro' })
        toast.success('Cadastro realizado! Verifique seu e-mail para confirmar.')
        navigate('/')
      }
    } catch (err: any) {
      toast.error('Erro: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[380px] p-6"
      >
        <div className="text-center mb-5">
          <div className="w-14 h-14 rounded-full bg-[#F4D03F]/20 backdrop-blur-md border border-white/10 flex items-center justify-center mx-auto mb-3">
            <UserPlus size={24} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Cadastro Passageiro</h1>
          <p className="text-[#A0A0B0] text-sm mt-0.5">Crie sua conta em instantes</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3.5">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type="text"
              placeholder="Nome completo"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={nome}
              onChange={e => setNome(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Phone size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type="tel"
              placeholder="Telefone com DDD"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={telefone}
              onChange={e => setTelefone(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type="email"
              placeholder="E-mail"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha (mínimo 6 caracteres)"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3"
          >
            {loading ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              <>
                <span className="text-sm">Criar conta</span>
                <ArrowRight size={18} />
              </>
            )}
          </button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10">
          <p className="text-xs text-[#A0A0B0] text-center">
            Já tem conta?{' '}
            <Link to="/" className="text-[#F4D03F] font-semibold hover:underline">
              Faça login
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  )
}