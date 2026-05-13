import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Shield, Lock, Mail, ArrowLeft, Eye, EyeOff } from 'lucide-react'

export default function AdminLogin() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      const { data: profile, error: profileError } = await supabase
        .from('usuarios')
        .select('tipo')
        .eq('id', data.user.id)
        .single()

      if (profileError || !profile) {
        await supabase.auth.signOut()
        toast.error('Usuário não encontrado na base de dados')
        setLoading(false)
        return
      }

      if (profile.tipo !== 'admin') {
        await supabase.auth.signOut()
        toast.error('Acesso restrito apenas para administradores')
        setLoading(false)
        return
      }

      toast.success('Bem-vindo ao painel admin!')
      navigate('/admin')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-5">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[400px]"
      >
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F4D03F]/20">
            <Shield className="text-[#F4D03F]" size={40} />
          </div>
          <h1 className="text-3xl font-bold text-white">Admin ObaLeve</h1>
          <p className="text-[#A0A0B0] mt-2">Acesso restrito para administradores</p>
        </div>

        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-6">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm text-white/70 mb-2">E-mail</label>
              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F4D03F] transition">
                <Mail size={18} className="text-[#A0A0B0] shrink-0" />
                <input
                  type="email"
                  placeholder="admin@obaleva.com"
                  className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-white/70 mb-2">Senha</label>
              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:border-[#F4D03F] transition">
                <Lock size={18} className="text-[#A0A0B0] shrink-0" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#A0A0B0] hover:text-white transition shrink-0"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 py-3 text-sm mt-2"
            >
              {loading ? (
                <span className="flex items-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Entrando...
                </span>
              ) : (
                <><Shield size={18} /> Entrar no Painel Admin</>
              )}
            </motion.button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10 text-center">
            <button
              onClick={() => navigate('/')}
              className="text-[#A0A0B0] hover:text-white transition flex items-center justify-center gap-2 text-sm mx-auto"
            >
              <ArrowLeft size={16} />
              Voltar para o site
            </button>
          </div>
        </div>

        <div className="mt-4 text-center">
          <div className="inline-flex items-center gap-2 bg-[#1A1528] rounded-2xl px-4 py-2 border border-white/10">
            <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
            <span className="text-xs text-[#A0A0B0]">Acesso exclusivo para admins</span>
          </div>
        </div>
      </motion.div>
    </div>
  )
}