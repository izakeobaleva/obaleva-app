import { useState, useCallback, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff, CheckCircle, Loader } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

// Componente Field memoizado para evitar re-renderizações
const InputField = ({ icon: Icon, placeholder, value, onChange, type = 'text', maxLength, autoComplete, error, format }: any) => (
  <div>
    <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all`}>
      <Icon size={16} className="text-[#F4D03F] shrink-0" />
      <input
        type={type}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
        value={value}
        onChange={(e) => {
          const val = format ? format(e.target.value) : e.target.value
          onChange(val)
        }}
        required
        maxLength={maxLength}
      />
      {value && !error && <CheckCircle size={14} className="text-green-400 shrink-0" />}
    </div>
    {error && <p className="text-red-400 text-[10px] mt-1 ml-2">{error}</p>}
  </div>
)

// Helpers de formatação
function formatarCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarTelefone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) {
    return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
  }
  return digits.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
}

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
  const [errors, setErrors] = useState<Record<string, string>>({})

  const clearError = useCallback((field: string) => {
    setErrors(prev => {
      if (!prev[field]) return prev
      const next = { ...prev }
      delete next[field]
      return next
    })
  }, [])

  function validarCampos(): boolean {
    const newErrors: Record<string, string> = {}
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório'
    if (nome.trim().length < 3) newErrors.nome = 'Nome deve ter pelo menos 3 caracteres'
    const cpfClean = cpf.replace(/\D/g, '')
    if (cpfClean.length !== 11) newErrors.cpf = 'CPF deve ter 11 dígitos'
    if (!telefone.trim()) newErrors.telefone = 'Telefone é obrigatório'
    if (!email.trim()) newErrors.email = 'E-mail é obrigatório'
    else if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = 'E-mail inválido'
    if (!password) newErrors.password = 'Senha é obrigatória'
    else if (password.length < 6) newErrors.password = 'Mínimo 6 caracteres'
    if (password !== confirmPassword) newErrors.confirmPassword = 'Senhas não conferem'
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validarCampos()) {
      toast.error('Corrija os campos destacados')
      return
    }

    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome.trim(), telefone, tipo: 'passageiro' } }
      })

      if (authError) throw authError

      if (authData.user) {
        await supabase.from('usuarios').insert({
          id: authData.user.id,
          nome_completo: nome.trim(),
          email,
          telefone,
          cpf,
          tipo: 'passageiro',
        })
        await supabase.from('passageiros').insert({ id: authData.user.id })
      }

      toast.success('Conta criada com sucesso!')
      navigate('/complete-profile', { replace: true })
    } catch (err: any) {
      if (err.message?.includes('already registered') || err.message?.includes('already exists')) {
        toast.error('Este e-mail já está cadastrado. Faça login.')
      } else {
        toast.error(err.message || 'Erro ao cadastrar')
      }
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => navigate('/login')} className="back-button-outline" type="button">
              <ArrowLeft size={22} />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Criar Conta</h1>
              <p className="text-xs text-[#A0A0B0]">Passageiro</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3">
            <InputField icon={User} placeholder="Nome completo" autoComplete="name" value={nome} onChange={(v) => { setNome(v); clearError('nome') }} error={errors.nome} />
            <InputField icon={User} placeholder="CPF" value={cpf} onChange={(v) => { setCpf(v); clearError('cpf') }} format={formatarCpf} maxLength={14} error={errors.cpf} />
            <InputField icon={Phone} placeholder="Telefone / WhatsApp" autoComplete="tel" value={telefone} onChange={(v) => { setTelefone(v); clearError('telefone') }} format={formatarTelefone} error={errors.telefone} />
            <InputField icon={Mail} placeholder="E-mail" autoComplete="email" type="email" value={email} onChange={(v) => { setEmail(v); clearError('email') }} error={errors.email} />

            {/* Senha */}
            <div>
              <div className={`flex items-center bg-[#0F0B1A] border ${errors.password ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
                <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Senha (mín. 6 caracteres)" className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={password} onChange={e => { setPassword(e.target.value); clearError('password') }} minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {password && password.length >= 6 && <CheckCircle size={14} className="text-green-400 ml-2" />}
              </div>
              {errors.password && <p className="text-red-400 text-[10px] mt-1 ml-2">{errors.password}</p>}
            </div>

            {/* Confirmar senha */}
            <div>
              <div className={`flex items-center bg-[#0F0B1A] border ${errors.confirmPassword ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
                <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar senha" className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={confirmPassword} onChange={e => { setConfirmPassword(e.target.value); clearError('confirmPassword') }} minLength={6} required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                  {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
                {confirmPassword && confirmPassword === password && <CheckCircle size={14} className="text-green-400 ml-2" />}
              </div>
              {errors.confirmPassword && <p className="text-red-400 text-[10px] mt-1 ml-2">{errors.confirmPassword}</p>}
            </div>

            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 mt-2 flex items-center justify-center gap-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Criando conta...</> : 'Criar Conta'}
            </motion.button>
          </form>

          <div className="mt-4 text-center text-xs text-[#A0A0B0] space-y-1">
            <p>Já tem conta? <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">Entrar</button></p>
            <p>É motorista? <button onClick={() => navigate('/cadastro-motorista')} className="text-[#F4D03F] hover:underline font-medium">Cadastre-se como motorista</button></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}