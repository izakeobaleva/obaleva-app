import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, Mail, Eye, EyeOff, ChevronRight, Smartphone, Shield, Star, Share2, ArrowLeft } from 'lucide-react'
import { motion } from 'framer-motion'

function LoginPage() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await signIn(email, password)
    } catch {
      toast.error('E-mail ou senha inválidos')
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin }
    })
    if (error) toast.error('Erro ao logar com Google')
  }

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({ title: 'OBALEVA', text: 'Mobilidade premium', url: window.location.origin })
    } else {
      navigator.clipboard.writeText(window.location.origin)
      toast.success('Link copiado!')
    }
  }

  if (showEmailForm) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-5">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-md"
        >
          <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
            <button onClick={() => setShowEmailForm(false)} className="text-[#A0A0B0] hover:text-white transition text-xs flex items-center gap-1 mb-3">
              <ArrowLeft size={14} /> Voltar
            </button>

            <div className="text-center mb-3">
              <div className="w-12 h-12 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#F4D03F]/20">
                <Car className="text-[#F4D03F]" size={22} />
              </div>
              <h1 className="text-lg font-bold text-white">ObaLeva</h1>
              <p className="text-[#A0A0B0] text-[10px] mt-0.5">Segurança e conforto em cada viagem</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-2">
              <div className="bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-1.5">
                <input 
                  type="email" 
                  placeholder="seu@email.com" 
                  autoComplete="email"
                  className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" 
                  value={email} 
                  onChange={e => setEmail(e.target.value)} 
                  required 
                />
              </div>
              <div className="bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-1.5 flex items-center">
                <input 
                  type={showPassword ? 'text' : 'password'} 
                  placeholder="Senha" 
                  autoComplete="current-password"
                  className="flex-1 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0 ml-2">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              
              <div className="text-right">
                <button onClick={() => navigate('/forgot-password')} className="text-[#F4D03F] text-[10px] hover:underline" type="button">
                  Esqueceu a senha?
                </button>
              </div>
              
              <motion.button
                whileTap={{ scale: 0.97 }}
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2 text-sm disabled:opacity-50"
              >
                {loading ? 'Entrando...' : <><ChevronRight size={18} /> Entrar</>}
              </motion.button>
            </form>

            <div className="mt-3 pt-3 border-t border-white/10 text-center space-y-2">
              <p className="text-[#A0A0B0] text-[10px]">Ainda não tem conta?</p>
              <div className="flex gap-2">
                <button onClick={() => navigate('/register')} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-xs">
                  Passageiro
                </button>
                <button onClick={() => navigate('/register-driver')} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-xs">
                  Motorista
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col relative z-10 px-4">
        {/* Header */}
        <div className="pt-6 pb-2 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-16 h-16 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-2 border border-[#F4D03F]/20"
          >
            <Car className="text-[#F4D03F] w-8 h-8" />
          </motion.div>
          <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            OBALEVA
          </h1>
          <p className="text-[#A0A0B0] text-[10px] mt-0.5">Mobilidade premium para sua cidade</p>
        </div>

        {/* Mockup do App */}
        <div className="flex justify-center mb-3">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1528] rounded-3xl border border-white/10 p-3 w-full shadow-2xl"
          >
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="w-5 h-5 bg-[#F4D03F]/20 rounded-lg flex items-center justify-center">
                  <Car size={12} className="text-[#F4D03F]" />
                </div>
                <span className="text-white text-[10px] font-semibold">ObaLeve</span>
                <div className="w-5 h-5" />
              </div>

              {/* Mapa ao vivo */}
              <div className="bg-[#0F0B1A] rounded-2xl h-48 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <Smartphone size={28} className="text-[#F4D03F]/50 mx-auto mb-1" />
                  <p className="text-[#A0A0B0] text-[10px]">Mapa ao vivo</p>
                </div>
              </div>

              <div className="space-y-1">
                <div className="bg-[#0F0B1A] rounded-xl p-2 border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/50 text-[10px]">Onde você está?</span>
                </div>
                <div className="bg-[#0F0B1A] rounded-xl p-2 border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-white/50 text-[10px]">Para onde vai?</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] rounded-2xl py-1.5 text-center">
                <span className="text-[#1E1E2F] font-bold text-[10px]">🚗 Solicitar ObaLeva</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3"
        >
          <div className="flex justify-center gap-3 flex-wrap">
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Shield size={11} className="text-green-400" />
              <span className="text-white text-[10px]">Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Star size={11} className="text-[#F4D03F]" />
              <span className="text-white text-[10px]">4.8★</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Smartphone size={11} className="text-blue-400" />
              <span className="text-white text-[10px]">Rápido</span>
            </div>
          </div>
        </motion.div>

        {/* Botões de Login */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="w-full mx-auto"
        >
          <div className="flex gap-2">
            <button
              onClick={handleGoogleLogin}
              className="flex-1 py-2 rounded-2xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition text-sm font-medium"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => setShowEmailForm(true)}
              className="flex-1 py-2 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-sm shadow-lg"
            >
              <Mail size={16} /> E-mail
            </button>
          </div>
        </motion.div>

        {/* Cadastro rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="w-full mx-auto mt-2"
        >
          <div className="flex gap-2">
            <button onClick={() => navigate('/register')} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition text-sm font-medium">
              Passageiro
            </button>
            <button onClick={() => navigate('/register-driver')} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition text-sm font-medium">
              Motorista
            </button>
          </div>
        </motion.div>

        {/* Compartilhar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center py-3"
        >
          <button onClick={handleShare} className="text-[#A0A0B0] hover:text-white transition flex items-center justify-center gap-2 text-xs mx-auto">
            <Share2 size={12} /> Compartilhar App
          </button>
        </motion.div>
      </div>
    </div>
  )
}

export default LoginPage