import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react'

export default function CadastroPassageiro() {
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
        options: {
          data: { nome_completo: nome, tipo: 'passageiro' }
        }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        cpf,
        telefone,
        email,
        tipo: 'passageiro'
      })
      if (insertUserError) throw insertUserError

      const { error: insertPassError } = await supabase.from('passageiros').insert({
        id: authData.user.id
      })
      if (insertPassError) console.warn('Erro ao inserir em passageiros:', insertPassError)

      toast.success('Conta criada com sucesso!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  const handleVoltar = (e: React.MouseEvent) => {
    e.preventDefault()
    navigate('/')
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
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[400px] p-6"
      >
        <div className="flex items-center mb-4">
          <button
            onClick={handleVoltar}
            className="btn-outline-dark p-2"
            aria-label="Voltar"
            type="button"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex-1 text-center -ml-10">
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Criar Conta</h1>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="CPF" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Phone size={18} className="text-[#F4D03F] shrink-0" />
            <input type="tel" placeholder="Telefone" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
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
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
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
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3 text-sm">
            {loading ? 'Cadastrando...' : <><ArrowRight size={18} /> Criar conta</>}
          </motion.button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-[#A0A0B0]">Já tem conta? <Link to="/login" className="text-[#F4D03F] font-semibold hover:underline">Entrar</Link></p>
        </div>
      </motion.div>
    </div>
  )
}