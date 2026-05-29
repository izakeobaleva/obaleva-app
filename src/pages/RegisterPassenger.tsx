import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff, Loader, CheckCircle } from 'lucide-react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

function formatarCpf(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

function formatarTelefone(value: string) {
  const digits = value.replace(/\D/g, '').slice(0, 11)
  if (digits.length <= 10) return digits.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
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

  function validar(): boolean {
    if (!nome.trim() || nome.trim().length < 3) { toast.error('Nome deve ter pelo menos 3 caracteres'); return false }
    if (cpf.replace(/\D/g, '').length !== 11) { toast.error('CPF deve ter 11 dígitos'); return false }
    if (!telefone.trim()) { toast.error('Telefone é obrigatório'); return false }
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) { toast.error('E-mail inválido'); return false }
    if (!password || password.length < 6) { toast.error('Senha deve ter no mínimo 6 caracteres'); return false }
    if (password !== confirmPassword) { toast.error('Senhas não conferem'); return false }
    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validar()) return
    setLoading(true)
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email, password,
        options: { data: { nome_completo: nome.trim(), telefone, tipo: 'passageiro' } }
      })
      if (authError) throw authError
      if (authData.user) {
        await supabase.from('usuarios').insert({ id: authData.user.id, nome_completo: nome.trim(), email, telefone, cpf, tipo: 'passageiro' })
        await supabase.from('passageiros').insert({ id: authData.user.id })
      }
      toast.success('✅ Conta criada com sucesso!')
      navigate('/login', { replace: true })
    } catch (err: any) {
      if (err.message?.includes('already registered')) toast.error('Este e-mail já está cadastrado')
      else toast.error(err.message || 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-purple-700/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-[#F4D03F]/5 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
          <div className="flex items-center gap-4 mb-6">
            <button onClick={() => navigate('/login')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition" type="button">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <div>
              <h1 className="text-lg font-bold text-white">Criar Conta</h1>
              <p className="text-xs text-[#A0A0B0]">Preencha os dados abaixo</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <User size={16} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
            </div>
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <User size={16} className="text-[#F4D03F] shrink-0" />
              <input type="text" placeholder="CPF" maxLength={14} className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required />
            </div>
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Phone size={16} className="text-[#F4D03F] shrink-0" />
              <input type="tel" placeholder="WhatsApp" className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={telefone} onChange={e => setTelefone(formatarTelefone(e.target.value))} required />
            </div>
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Mail size={16} className="text-[#F4D03F] shrink-0" />
              <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
            </div>
            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha (mín. 6)" className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-gray-500 hover:text-white transition shrink-0">
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
              <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar senha" className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6} required />
              <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-gray-500 hover:text-white transition shrink-0">
                {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 mt-2">
              {loading ? <><Loader size={16} className="animate-spin" /> Criando...</> : <><CheckCircle size={18} /> Criar Conta</>}
            </motion.button>
          </form>

          <div className="mt-5 pt-4 border-t border-white/10 text-center">
            <p className="text-sm text-[#A0A0B0]">Já tem conta? <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">Entrar</button></p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}