import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, Chrome, Share2, UserPlus, Truck, ChevronLeft, Mail, ArrowRight } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
      navigate('/')
    } catch {
      toast.error('E-mail ou senha inválidos')
    }
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

        <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl w-full max-w-md p-8 relative z-10">
          <button 
            onClick={() => setShowEmailForm(false)} 
            className="flex items-center gap-2 text-[#A0A0B0] hover:text-white transition mb-6"
          >
            <ChevronLeft size={20} /> Voltar
          </button>

          <div className="text-center mb-8">
            <Car className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
            <p className="text-[#A0A0B0] mt-1">Segurança e conforto em cada viagem</p>
          </div>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <p className="text-sm text-[#A0A0B0] mb-2">Seu e-mail</p>
              <input 
                type="email" 
                placeholder="seu@email.com" 
                className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                required 
              />
            </div>
            <div>
              <p className="text-sm text-[#A0A0B0] mb-2">Sua senha</p>
              <input 
                type="password" 
                placeholder="••••••••" 
                className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
            </div>
            
            <div className="text-right">
              <Link to="/forgot-password" className="text-[#F4D03F] text-sm hover:underline">
                Esqueceu a senha?
              </Link>
            </div>
            
            <button type="submit" className="btn-amarelo w-full py-3 rounded-2xl text-lg">Entrar</button>
          </form>

          <div className="text-center mt-8">
            <p className="text-[#A0A0B0] text-sm mb-4">Ainda não tem conta?</p>
            <div className="flex flex-col gap-3">
              <Link to="/register" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2">
                <UserPlus size={18} /> Criar conta como Passageiro
              </Link>
              <Link to="/register-driver" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2">
                <Truck size={18} /> Criar conta como Motorista
              </Link>
            </div>
          </div>

          <button 
            onClick={handleShare} 
            className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-[#A0A0B0] hover:text-white transition"
          >
            <Share2 size={18} /> Compartilhar ObaLeva
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl w-full max-w-md p-8 relative z-10">
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Car className="text-[#F4D03F] w-10 h-10" />
          </div>
          <h1 className="text-3xl font-bold text-white">ObaLeva</h1>
          <p className="text-[#A0A0B0] mt-2">Segurança e conforto em cada viagem</p>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="w-full py-3 rounded-2xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-3 hover:bg-white/10 transition mb-4 text-lg"
        >
          <Chrome size={22} /> Continuar com Google
        </button>

        <button 
          onClick={() => setShowEmailForm(true)} 
          className="w-full py-3 rounded-2xl border border-[#F4D03F]/30 text-[#F4D03F] flex items-center justify-center gap-2 hover:bg-[#F4D03F]/5 transition mb-6"
        >
          <Mail size={20} /> Entre com e-mail
        </button>

        <div className="flex flex-col gap-3">
          <Link to="/register" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition">
            Criar conta como Passageiro
          </Link>
          <Link to="/register-driver" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition">
            Criar conta como Motorista
          </Link>
        </div>

        <button 
          onClick={handleShare} 
          className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-[#A0A0B0] hover:text-white transition"
        >
          <Share2 size={18} /> Compartilhar ObaLeva
        </button>
      </div>
    </div>
  )
}