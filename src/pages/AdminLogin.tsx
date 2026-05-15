import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { Shield, Eye, EyeOff, ArrowLeft, LogOut } from 'lucide-react'

function AdminLogin() {
  const navigate = useNavigate()
  const { signOut, user } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }

    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data?.user) {
        const { data: userData } = await supabase
          .from('usuarios')
          .select('tipo')
          .eq('id', data.user.id)
          .single()

        if (userData?.tipo !== 'admin') {
          await supabase.auth.signOut()
          toast.error('Acesso não autorizado')
          return
        }

        toast.success('Login administrativo realizado!')
        navigate('/admin')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    }
    setLoading(false)
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Saiu da conta!')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8">
          {/* Botão de sair - visível se estiver logado */}
          {user && (
            <div className="flex justify-end mb-4">
              <button
                onClick={handleSignOut}
                className="px-4 py-2 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-sm flex items-center gap-2"
              >
                <LogOut size={16} />
                Sair da conta atual
              </button>
            </div>
          )}

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-[#F4D03F]/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-[#F4D03F]/20">
              <Shield size={32} className="text-[#F4D03F]" />
            </div>
            <h1 className="text-2xl font-bold text-white">Admin</h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Área restrita</p>
            {user && (
              <p className="text-xs text-yellow-400 mt-2 bg-yellow-900/20 rounded-xl px-3 py-1.5 inline-block">
                ⚠️ Você está logado como {user.email}. Saia primeiro se quiser trocar de conta.
              </p>
            )}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-1">E-mail</label>
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="admin@obaleva.com"
                className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
                required
              />
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-1">Senha</label>
              <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="flex-1 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#A0A0B0] hover:text-white transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50"
            >
              {loading ? 'Entrando...' : 'Entrar como Admin'}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center space-y-2">
            <button
              onClick={() => navigate('/')}
              className="text-[#A0A0B0] hover:text-white transition flex items-center justify-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Voltar para o site
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default AdminLogin