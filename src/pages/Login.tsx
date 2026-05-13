import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, Chrome, Mail, Eye, EyeOff, ArrowRight, UserPlus, Truck } from 'lucide-react'
import { motion } from 'framer-motion'

export const Login = () => {
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
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm p-5"
        >
          <button onClick={() => setShowEmailForm(false)} className="text-[#A0A0B0] hover:text-white transition text-xs flex items-center gap-1 mb-3">
            ← Voltar
          </button>

          <div className="text-center mb-4">
            <div className="w-12 h-12 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-2">
              <Car className="text-[#F4D03F]" size={24} />
            </div>
            <h1 className="text-xl font-bold text-white">OBALEVA</h1>
            <p className="text-[#A0A0B0] text-[10px]">Segurança e conforto em cada viagem</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-3">
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <Mail size={16} className="text-[#F4D03F] shrink-0" />
              <input 
                type="email" 
                placeholder="seu@email.com" 
                autoComplete="email"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <Mail size={16} className="text-[#F4D03F] shrink-0" />
              <input 
                type={showPassword ? 'text' : 'password'} 
                placeholder="••••••••" 
                autoComplete="current-password"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
            
            <div className="text-right">
              <button onClick={() => window.location.href = '/forgot-password'} className="text-[#F4D03F] text-[10px] hover:underline" type="button">
                Esqueceu a senha?
              </button>
            </div>
            
            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-2.5 text-xs disabled:opacity-50"
            >
              {loading ? 'Entrando...' : <><ArrowRight size={16} /> Entrar</>}
            </motion.button>
          </form>

          <div className="mt-4 pt-3 border-t border-white/10 text-center space-y-2">
            <p className="text-[#A0A0B0] text-[10px]">Ainda não tem conta?</p>
            <div className="flex gap-2">
              <button onClick={() => window.location.href = '/register'} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-[10px]">
                <UserPlus size={12} /> Passageiro
              </button>
              <button onClick={() => window.location.href = '/register-driver'} className="flex-1 py-2 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-[10px]">
                <Truck size={12} /> Motorista
              </button>
            </div>
          </div>

          <button onClick={handleShare} className="w-full mt-3 py-2 flex items-center justify-center gap-1.5 text-[#A0A0B0] hover:text-white transition text-[10px]">
            📤 Compartilhar ObaLeva
          </button>
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

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl w-full max-w-sm p-6"
      >
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-3">
            <Car className="text-[#F4D03F]" size={28} />
          </div>
          <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
          <p className="text-[#A0A0B0] text-xs mt-1">Segurança e conforto em cada viagem</p>
        </div>

        <button onClick={handleGoogleLogin} className="w-full py-3 rounded-2xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition text-sm">
          <Chrome size={18} /> Continuar com Google
        </button>

        <button onClick={() => setShowEmailForm(true)} className="w-full py-3 rounded-2xl border border-[#F4D03F]/30 text-[#F4D03F] flex items-center justify-center gap-2 hover:bg-[#F4D03F]/5 transition mt-3 text-sm">
          <Mail size={16} /> Entre com e-mail
        </button>

        <div className="flex gap-2 mt-5">
          <button onClick={() => window.location.href = '/register'} className="flex-1 py-2.5 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-xs">
            <UserPlus size={14} /> Passageiro
          </button>
          <button onClick={() => window.location.href = '/register-driver'} className="flex-1 py-2.5 rounded-2xl border border-white/20 text-white hover:bg-white/5 transition flex items-center justify-center gap-1.5 text-xs">
            <Truck size={14} /> Motorista
          </button>
        </div>

        <button onClick={handleShare} className="w-full mt-4 py-2 flex items-center justify-center gap-1.5 text-[#A0A0B0] hover:text-white transition text-xs">
          📤 Compartilhar ObaLeva
        </button>
      </motion.div>
    </div>
  )
}