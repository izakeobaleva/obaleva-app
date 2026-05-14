import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Car, ArrowLeft, Eye, EyeOff, Mail, Lock, Chrome, Share2, UserPlus, Truck, ChevronLeft } from 'lucide-react'

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Login realizado!')
      navigate('/', { replace: true })
    } catch (err: any) {
      toast.error(err.message || 'E-mail ou senha inválidos')
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
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
          <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
        </div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
          <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
            <button onClick={() => setShowEmailForm(false)} className="back-button-outline mb-4" type="button">
              <ArrowLeft size={22} />
            </button>

            <div className="text-center mb-6">
              <div className="w-12 h-12 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <Car className="text-[#F4D03F] w-6 h-6" />
              </div>
              <h1 className="text-xl font-bold text-white">Entrar com e-mail</h1>
              <p className="text-xs text-[#A0A0B0] mt-1">Digite suas credenciais</p>
            </div>

            <button onClick={handleGoogleLogin} className="w-full py-3 rounded-2xl border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/5 transition mb-4 text-sm">
              <Chrome size={18} /> Continuar com Google
            </button>

            <div className="flex items-center gap-3 mb-4">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-[#A0A0B0] text-xs">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Mail size={16} className="text-[#F4D03F] shrink-0" />
                <input type="email" placeholder="seu@email.com" className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>

              <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Lock size={16} className="text-[#F4D03F] shrink-0 mr-2" />
                <input type={showPassword ? 'text' : 'password'} placeholder="Sua senha" className="flex-1 py-3 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              <div className="text-right">
                <button type="button" onClick={() => navigate('/forgot-password')} className="text-[#F4D03F] text-xs hover:underline">Esqueceu a senha?</button>
              </div>

              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 mt-2">
                {loading ? 'Entrando...' : 'Entrar'}
              </motion.button>
            </form>

            <div className="text-center mt-6 space-y-2">
              <p className="text-xs text-[#A0A0B0]">Ainda não tem conta?</p>
              <div className="flex flex-col gap-2">
                <Link to="/register" className="w-full py-2.5 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2 text-xs">
                  <UserPlus size={14} /> Criar conta como Passageiro
                </Link>
                <Link to="/register-driver" className="w-full py-2.5 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2 text-xs">
                  <Truck size={14} /> Criar conta como Motorista
                </Link>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
              <Car className="text-[#F4D03F] w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-sm text-[#A0A0B0] mt-1">Segurança e conforto em cada viagem</p>
          </div>

          <motion.button whileTap={{ scale: 0.98 }} onClick={handleGoogleLogin} className="w-full py-3.5 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 text-sm mb-4">
            <Chrome size={20} /> Continuar com Google
          </motion.button>

          <motion.button whileTap={{ scale: 0.98 }} onClick={() => setShowEmailForm(true)} className="w-full py-3.5 rounded-2xl font-bold border border-[#F4D03F]/30 text-[#F4D03F] flex items-center justify-center gap-2 hover:bg-[#F4D03F]/5 transition mb-6 text-sm">
            <Mail size={18} /> Entrar com e-mail
          </motion.button>

          <div className="space-y-2">
            <Link to="/register" className="block w-full py-3 rounded-2xl font-bold border border-white/20 text-white text-center hover:bg-white/5 transition text-sm">
              Criar conta como Passageiro
            </Link>
            <Link to="/register-driver" className="block w-full py-3 rounded-2xl font-bold border border-white/20 text-white text-center hover:bg-white/5 transition text-sm">
              Criar conta como Motorista
            </Link>
          </div>

          <button onClick={handleShare} className="w-full mt-4 py-2.5 rounded-2xl text-xs text-[#A0A0B0] hover:text-white hover:bg-white/5 transition flex items-center justify-center gap-2">
            <Share2 size={14} /> Compartilhar ObaLeva
          </button>

          <div className="mt-4 pt-4 border-t border-white/10 text-center">
            <button onClick={() => navigate('/')} className="text-xs text-[#A0A0B0] hover:text-white transition flex items-center justify-center gap-1 mx-auto">
              <ChevronLeft size={14} /> Voltar ao início
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}