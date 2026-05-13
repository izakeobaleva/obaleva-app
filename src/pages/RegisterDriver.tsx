<<<<<<< HEAD
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { ArrowLeft, Car, Truck } from 'lucide-react'

export const RegisterDriver = () => {
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState<any>({})
  const [loading, setLoading] = useState(false)

  const updateForm = (field: string, value: any) => setForm({ ...form, [field]: value })

  const finalSubmit = async () => {
    setLoading(true)
    try {
      const { nome_completo, cpf, telefone, email, password, placa, modelo, ano, cor, pix } = form
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo, tipo: 'motorista' } } 
      })
      if (error) throw error
      if (!auth.user) throw new Error('Erro ao criar usuário')
      
      await supabase.from('usuarios').insert({ 
        id: auth.user.id, nome_completo, cpf, telefone, email, tipo: 'motorista' 
      })
      await supabase.from('motoristas').insert({ 
        id: auth.user.id, 
        status: 'pendente', 
        dados_veiculo: { placa, modelo, ano, cor }, 
        conta_bancaria_pix: pix 
      })
      
      toast.success('Cadastro enviado! Aguarde aprovação.')
      navigate('/login')
    } catch (err: any) {
      toast.error(err.message || 'Erro no cadastro')
=======
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { User, Mail, Lock, Phone, Car, Eye, EyeOff, ArrowLeft } from 'lucide-react'

export default function CadastroMotorista() {
  const navigate = useNavigate()
  const [nome, setNome] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!nome || !email || !telefone || !password) {
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
          data: { nome_completo: nome, tipo: 'motorista' }
        }
      })
      
      if (authError) throw authError
      if (!authData.user) throw new Error('Erro ao criar usuário')

      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo: nome,
        email,
        telefone,
        tipo: 'motorista'
      })
      if (insertUserError) throw insertUserError

      const { error: insertMotoristaError } = await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente'
      })
      if (insertMotoristaError) throw insertMotoristaError

      toast.success('Cadastro realizado! Aguarde aprovação.')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao cadastrar')
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
    } finally {
      setLoading(false)
    }
  }

<<<<<<< HEAD
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 w-full max-w-md p-8">
        <div className="flex items-center mb-6">
          <button onClick={() => navigate('/login')} className="text-[#A0A0B0] hover:text-white mr-3">
            <ArrowLeft size={20} />
          </button>
          <Truck className="text-[#F4D03F] w-8 h-8 mr-2" />
          <h1 className="text-2xl font-bold text-white">
            {step === 1 ? 'Motorista - Etapa 1' : 'Motorista - Etapa 2'}
          </h1>
        </div>

        <div className="flex gap-2 mb-6">
          <div className={`h-2 flex-1 rounded-full ${step >= 1 ? 'bg-[#F4D03F]' : 'bg-gray-600'}`}></div>
          <div className={`h-2 flex-1 rounded-full ${step >= 2 ? 'bg-[#F4D03F]' : 'bg-gray-600'}`}></div>
        </div>
        
        {step === 1 ? (
          <div className="space-y-3">
            <input 
              placeholder="Nome completo" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('nome_completo', e.target.value)} 
            />
            <input 
              placeholder="CPF" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('cpf', e.target.value)} 
            />
            <input 
              placeholder="Telefone" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('telefone', e.target.value)} 
            />
            <input 
              placeholder="E-mail" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('email', e.target.value)} 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('password', e.target.value)} 
            />
            <button onClick={() => setStep(2)} className="btn-amarelo w-full py-3 rounded-2xl mt-3">
              Próximo
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <input 
              placeholder="Placa" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('placa', e.target.value)} 
            />
            <input 
              placeholder="Modelo" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('modelo', e.target.value)} 
            />
            <input 
              placeholder="Ano" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('ano', e.target.value)} 
            />
            <input 
              placeholder="Cor" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('cor', e.target.value)} 
            />
            <input 
              placeholder="Chave PIX" 
              className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
              onChange={e => updateForm('pix', e.target.value)} 
            />
            <div className="flex gap-2 mt-4">
              <button onClick={() => setStep(1)} className="bg-gray-600 text-white px-4 py-3 rounded-2xl hover:bg-gray-500 transition flex-1">
                Voltar
              </button>
              <button onClick={finalSubmit} disabled={loading} className="btn-amarelo flex-1 py-3 rounded-2xl">
                {loading ? 'Enviando...' : 'Enviar'}
              </button>
            </div>
          </div>
        )}
      </div>
=======
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
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Cadastro Motorista</h1>
          </div>
        </div>

        <form onSubmit={handleRegister} className="space-y-3">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <User size={18} className="text-[#F4D03F] shrink-0" />
            <input type="text" placeholder="Nome completo" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-[#F4D03F] shrink-0" />
            <input type="email" placeholder="E-mail" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Phone size={18} className="text-[#F4D03F] shrink-0" />
            <input type="tel" placeholder="Telefone" className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
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
            {loading ? 'Cadastrando...' : 'Criar conta de motorista'}
          </motion.button>
        </form>

        <div className="mt-5 pt-5 border-t border-white/10 text-center">
          <p className="text-xs text-[#A0A0B0]">Já tem conta? <Link to="/login" className="text-[#F4D03F] font-semibold hover:underline">Entrar</Link></p>
        </div>
      </motion.div>
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
    </div>
  )
}