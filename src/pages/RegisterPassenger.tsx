import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff, Car } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export function RegisterPassenger() {
  const navigate = useNavigate()
  const { signUpPassenger } = useAuth()
  
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  function formatarCpf(value: string) {
    const digits = value.replace(/\D/g, '').slice(0, 11)
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome || !cpf || !telefone || !email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    if (password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }
    if (password !== confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    setLoading(true)
    try {
      await signUpPassenger({ nome_completo: nome, cpf, telefone, email, password })
      toast.success('Conta criada com sucesso! Verifique seu e-mail.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          {/* Header */}
          <div className="flex items-center gap-3 mb-5">
            <button
              onClick={() => navigate('/login')}
              className="back-button-outline"
              type="button"
            >
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Criar Conta</h1>
              <p className="text-xs text-[#A0A0B0]">Passageiro</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            {/* Nome */}
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <User size={16} className="text-[#F4D03F] shrink-0" />
              <input
                type="text"
                placeholder="Nome completo"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={nome}
                onChange={e => setNome(e.target.value)}
                required
              />
            </div>

            {/* CPF */}
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <User size={16} className="text-[#F4D03F] shrink-0" />
              <input
                type="text"
                placeholder="CPF"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={cpf}
                onChange={e => setCpf(formatarCpf(e.target.value))}
                maxLength={14}
                required
              />
            </div>

            {/* Telefone */}
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Phone size={16} className="text-[#F4D03F] shrink-0" />
              <input
                type="text"
                placeholder="Telefone / WhatsApp"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={telefone}
                onChange={e => setTelefone(e.target.value)}
                required
              />
            </div>

            {/* Email */}
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Mail size={16} className="text-[#F4D03F] shrink-0" />
              <input
                type="email"
                placeholder="E-mail"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Senha */}
            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha (mín. 6 caracteres)"
                className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[#A0A0B0] hover:text-white transition shrink-0"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Confirmar senha */}
            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
              <input
                type={showConfirm ? 'text' : 'password'}
                placeholder="Confirmar senha"
                className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                minLength={6}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirm(!showConfirm)}
                className="text-[#A0A0B0] hover:text-white transition shrink-0"
              >
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 mt-2"
            >
              {loading ? 'Criando conta...' : 'Criar Conta'}
            </motion.button>
          </form>

          <div className="mt-4 text-center space-y-2">
            <p className="text-xs text-[#A0A0B0]">
              Já tem conta?{' '}
              <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">
                Entrar
              </button>
            </p>
            <p className="text-xs text-[#A0A0B0]">
              É motorista?{' '}
              <button onClick={() => navigate('/register-driver')} className="text-[#F4D03F] hover:underline font-medium">
                Cadastre-se como motorista
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}