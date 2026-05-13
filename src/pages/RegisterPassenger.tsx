import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { User, Mail, Lock, Phone, Eye, EyeOff, ArrowLeft, Car } from 'lucide-react'

export function RegisterPassenger() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [cpf, setCpf] = useState('')
  const [telefone, setTelefone] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState<'form' | 'success'>('form')

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome || !cpf || !telefone || !email || !password) {
      toast.error('Preencha todos os campos')
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
        cpf,
        telefone,
        email,
        tipo: 'passageiro'
      })

      await supabase.from('passageiros').insert({ id: authData.user.id })

      toast.success('Conta criada com sucesso!')
      setStep('success')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
    } finally {
      setLoading(false)
    }
  }

  if (step === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center p-5" style={{ background: 'linear-gradient(135deg, #0F0B1A 0%, #1A1528 100%)' }}>
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-[380px] p-8 text-center">
          <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Conta criada!</h2>
          <p className="text-[#A0A0B0] text-sm mb-6">Sua conta foi criada com sucesso.</p>
          <button
            onClick={() => window.location.href = '/login'}
            className="w-full py-3 rounded-2xl font-bold text-[#1E1E2F] hover:shadow-lg transition-all"
            style={{ background: 'linear-gradient(135deg, #FFD966 0%, #F4D03F 100%)' }}
          >
            Ir para o Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-5" style={{ background: 'linear-gradient(135deg, #0F0B1A 0%, #1A1528 100%)' }}>
      <div className="max-w-[400px] mx-auto pt-8">
        <button
          onClick={() => window.location.href = '/login'}
          className="flex items-center gap-2 text-[#A0A0B0] hover:text-white transition mb-6"
          type="button"
        >
          <ArrowLeft size={20} /> Voltar
        </button>

        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(244, 208, 63, 0.1)' }}>
            <Car className="text-[#F4D03F]" size={32} />
          </div>
          <h1 className="text-2xl font-bold text-white">Criar Conta</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Preencha os dados para se cadastrar</p>
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
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar senha"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
              {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-2xl font-bold text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50"
            style={{ background: 'linear-gradient(135deg, #FFD966 0%, #F4D03F 100%)' }}
          >
            {loading ? 'Cadastrando...' : 'Criar conta'}
          </button>
        </form>

        <div className="mt-6 pt-6 border-t border-white/10 text-center">
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
      </div>
    </div>
  )
}