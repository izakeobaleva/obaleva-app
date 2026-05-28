import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, User, Mail, Lock, Phone, Eye, EyeOff, Loader } from 'lucide-react'
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

  function validarCampos(): boolean {
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
    if (!validarCampos()) return
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
      toast.success('Conta criada com sucesso!')
      navigate('/login', { replace: true })
    } catch (err: any) {
      if (err.message?.includes('already registered')) toast.error('Este e-mail já está cadastrado. Faça login.')
      else toast.error(err.message || 'Erro ao cadastrar')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="w-full max-w-[500px]">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
            <div className="flex items-center gap-4 mb-8">
              <button onClick={() => navigate('/login')} className="w-12 h-12 rounded-2xl border border-white/10 flex items-center justify-center hover:bg-white/5 transition shrink-0" type="button">
                <ArrowLeft size={24} className="text-[#A0A0B0]" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
                <p className="text-sm text-[#A0A0B0]">Passageiro</p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <User size={20} className="text-[#F4D03F] shrink-0" />
                <input type="text" placeholder="Nome completo" autoComplete="name" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none" value={nome} onChange={e => setNome(e.target.value)} required />
              </div>

              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <User size={20} className="text-[#F4D03F] shrink-0" />
                <input type="text" placeholder="CPF" maxLength={14} className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none" value={cpf} onChange={e => setCpf(formatarCpf(e.target.value))} required />
              </div>

              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Phone size={20} className="text-[#F4D03F] shrink-0" />
                <input type="tel" placeholder="Telefone / WhatsApp" autoComplete="tel" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none" value={telefone} onChange={e => setTelefone(formatarTelefone(e.target.value))} required />
              </div>

              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Mail size={20} className="text-[#F4D03F] shrink-0" />
                <input type="email" placeholder="E-mail" autoComplete="email" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Lock size={20} className="text-[#F4D03F] shrink-0 mr-3" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Senha (mín. 6)" className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none" value={password} onChange={e => setPassword(e.target.value)} minLength={6} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Lock size={20} className="text-[#F4D03F] shrink-0 mr-3" />
                <input type={showConfirm ? 'text' : 'password'} placeholder="Confirmar senha" className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} minLength={6} required />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                  {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 mt-2">
                {loading ? <><Loader size={20} className="animate-spin" /> Criando conta...</> : 'Criar Conta'}
              </motion.button>
            </form>

            <div className="mt-6 text-center space-y-2">
              <p className="text-sm text-[#A0A0B0]">Já tem conta? <button onClick={() => navigate('/login')} className="text-[#F4D03F] hover:underline font-medium">Entrar</button></p>
              <p className="text-sm text-[#A0A0B0]">É motorista? <button onClick={() => navigate('/cadastro-motorista')} className="text-[#F4D03F] hover:underline font-medium">Cadastre-se como motorista</button></p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  )
}