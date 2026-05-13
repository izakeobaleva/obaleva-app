import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { Link, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, Chrome, Share2, UserPlus, Truck } from 'lucide-react'

export const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-8">
          <Car className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] mt-1">Acesse sua conta</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full px-4 py-3 rounded-2xl bg-[#0F0B1A] border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-[#F4D03F] transition" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
          />
          <button type="submit" className="btn-amarelo w-full py-3 rounded-2xl">Entrar</button>
        </form>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div>
        </div>

        <button 
          onClick={handleGoogleLogin} 
          className="w-full py-3 rounded-2xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition mb-4"
        >
          <Chrome size={18} /> Entrar com Google
        </button>

        <div className="flex flex-col gap-3">
          <Link to="/register" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2">
            <UserPlus size={18} /> Cadastrar Passageiro
          </Link>
          <Link to="/register-driver" className="w-full py-3 rounded-2xl border border-white/20 text-white text-center hover:bg-white/5 transition flex items-center justify-center gap-2">
            <Truck size={18} /> Cadastrar Motorista
          </Link>
        </div>

        <button 
          onClick={handleShare} 
          className="w-full mt-6 py-3 flex items-center justify-center gap-2 text-[#A0A0B0] hover:text-white transition"
        >
          <Share2 size={18} /> Compartilhar OBALEVA
        </button>
      </div>
    </div>
  )
}