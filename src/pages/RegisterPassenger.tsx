import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, ArrowRight, Check, Car } from 'lucide-react'

export function RegisterPassenger() {
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

  function goToLogin() {
    window.location.href = '/login'
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
          className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm p-8 text-center"
        >
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check size={32} className="text-green-400" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Conta criada!</h2>
          <p className="text-[#A0A0B0] text-sm mb-6">Sua conta foi criada com sucesso. Agora faça login para começar.</p>
          <button onClick={goToLogin} className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all text-sm">
            Ir para o Login
          </button>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm mx-auto p-5"
      >
        <div className="flex items-center mb-4">
          <button onClick={goToLogin} className="btn-outline-dark p-2" type="button">
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-10">
            <h1 className="text-lg font-bold text-white">Cadastro</h1>
          </div>
        </div>

        <div className="flex items-center gap-3 mb-4 justify-center">
          <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-xl flex items-center justify-center">
            <Car size={22} className="text-[#F4D03F]" />
          </div>
          <div>
            <p className="text-white font-bold text-sm">OBALEVA</p>
            <p className="text-[#A0A0B0] text-[10px]">Mobilidade premium</p>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-2.5">
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <User size={16} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <User size={16} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="CPF" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required maxLength={14} />
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Phone size={16} className="text-[#F4D03F] shrink-0" />
            <input type="tel" placeholder="Telefone / WhatsApp" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={telefone} onChange={e => setTelefone(e.target.value)} required />
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Mail size={16} className="text-[#F4D03F] shrink-0" />
            <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Lock size={16} className="text-[#F4D03F] shrink-0" />
            <input type={showPassword ? 'text' : 'password'} placeholder="Senha (mín. 6 caracteres)" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Lock size={16} className="text-[#F4D03F] shrink-0" />
            <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar senha" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} required minLength={6} />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>
          <motion.button whileTap={{ scale: 0.97 }} type="submit" disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs disabled:opacity-50 mt-1"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Cadastrando...
              </span>
            ) : (
              <><ArrowRight size={16} /> Criar conta</>
            )}
          </motion.button>
        </form>

        <div className="mt-4 pt-3 border-t border-white/10 text-center">
          <p className="text-[10px] text-[#A0A0B0]">
            Já tem conta?{' '}
            <button onClick={goToLogin} className="text-[#F4D03F] font-semibold hover:underline" type="button">Entrar</button>
          </p>
        </div>
      </motion.div>
    </div>
  )
}