import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'
import { 
  User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, 
  ArrowRight, Check, Car 
} from 'lucide-react'

export function RegisterPassenger() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome || !cpf || !telefone || !email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem')
      return
    }
    
    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf: cpf.replace(/\D/g, ''),
        telefone,
        email,
        tipo: 'passageiro'
      })

      await supabase.from('passageiros').insert({ id: authData.user.id })

      toast.success('Conta criada com sucesso!')
      setSuccess(true)
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const formatarCpf = (value: string) => {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[380px] p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Conta criada!</h2>
          <p className="text-[#A0A0B0] text-sm mb-6">Sua conta foi criada com sucesso. Agora faça login para começar.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all text-sm"
          >
            Ir para o Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] py-5 px-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[420px] mx-auto p-6"
      >
        {/* Header com botão de voltar */}
        <div className="flex items-center mb-6">
          <button
            onClick={() => window.location.href = '/login'}
            className="btn-outline-dark p-2 inline-flex items-center justify-center"
            aria-label="Voltar"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-10">
            <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              Criar Conta
            </h1>
          </div>
        </div>

        {/* Ícone decorativo */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Car size={28} className="text-[#F4D03F]" />
          </div>
          <p className="text-xs text-[#A0A0B0]">Preencha seus dados para se cadastrar</p>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="CPF" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required maxLength={14} />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Phone size={18} className="text-[#F4D03F] shrink-0" />
            <input type="tel" placeholder="Telefone / WhatsApp" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-[#F4D03F] shrink-0" />
            <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Senha (mín. 6 caracteres)"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar senha"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={confirmPassword}
              onChange={e => setConfirmPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0"
              aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3 text-sm disabled:opacity-50 mt-4"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Cadastrando...
              </span>
            ) : (
              <><ArrowRight size={18} /> Criar conta</>
            )}
          </motion.button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-[#A0A0B0]">
            Já tem conta?{' '}
            <button
              onClick={() => window.location.href = '/login'}
              className="text-[#F4D03F] font-semibold hover:underline"
              type="button"
            >
              Entrar
            </button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}