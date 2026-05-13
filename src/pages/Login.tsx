import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { 
  Eye, EyeOff, ArrowLeft, Car, Smartphone,
  Mail, Lock, ShieldCheck, Zap
} from 'lucide-react'

function LoginPage() {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Login realizado com sucesso!')
      navigate('/')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4 relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 left-[-80px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        key={showEmailForm ? 'form' : 'choices'}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative z-10 w-full max-w-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-[#F4D03F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#F4D03F]/20">
            <Car className="text-[#F4D03F]" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Mobilidade premium</p>
        </div>

        <AnimatePresence mode="wait">
          {!showEmailForm ? (
            <motion.div
              key="choices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-3"
            >
              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => setShowEmailForm(true)}
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-3 text-base"
              >
                <Mail size={20} />
                Entrar com E-mail
              </motion.button>

              <div className="text-center text-sm text-[#A0A0B0] py-2">ou</div>

              <motion.button
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate('/register')}
                className="w-full py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-base"
              >
                <Smartphone size={20} />
                Criar Conta
              </motion.button>

              <div className="flex items-center gap-2 justify-center text-xs text-[#A0A0B0] pt-2">
                <ShieldCheck size={14} />
                <span>Ambiente seguro</span>
                <Zap size={14} />
                <span>Cadastro rápido</span>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6"
            >
              <div className="flex items-center gap-3 mb-4">
                <button onClick={() => setShowEmailForm(false)} className="back-button-outline" type="button">
                  <ArrowLeft size={22} />
                </button>
                <h2 className="text-lg font-bold text-white">Entrar</h2>
              </div>

              <form onSubmit={handleLogin} className="space-y-3">
                <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                  <Mail size={18} className="text-[#F4D03F] shrink-0" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                  <Lock size={18} className="text-[#F4D03F] shrink-0 mr-2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Sua senha"
                    className="flex-1 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#A0A0B0] hover:text-white transition shrink-0"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => navigate('/forgot-password')}
                    className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition"
                  >
                    Esqueceu a senha?
                  </button>
                </div>

                <motion.button
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={loading}
                  className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </motion.button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-xs text-[#A0A0B0]">
                  Não tem conta?{' '}
                  <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium">
                    Cadastre-se
                  </button>
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}

export default LoginPage