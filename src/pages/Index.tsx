import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Mail, UserPlus, ChevronRight, Shield, Smartphone, Download } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

export const Index = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [apkUrl, setApkUrl] = useState('')
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadApk()
  }, [])

  async function loadApk() {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'apk_url')
      .maybeSingle()
    if (data?.value) setApkUrl(data.value)
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) {
      toast.error('Preencha todos os campos')
      return
    }
    setLoading(true)
    try {
      await signIn(email, password)
      toast.success('Login realizado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="pt-8 pb-4 px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-20 h-20 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F4D03F]/20"
          >
            <Car className="text-[#F4D03F] w-10 h-10" />
          </motion.div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            OBALEVA
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Mobilidade premium para sua cidade</p>
        </div>

        {/* Benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="px-6 mb-6"
        >
          <div className="flex justify-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Shield size={12} className="text-green-400" />
              <span className="text-white text-[10px]">Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="#F4D03F"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <span className="text-white text-[10px]">4.8★</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Smartphone size={12} className="text-blue-400" />
              <span className="text-white text-[10px]">Rápido</span>
            </div>
          </div>
        </motion.div>

        {/* Opções de login */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 space-y-3 max-w-sm mx-auto w-full"
        >
          {/* Google */}
          <button
            onClick={() => {/* Integrar Google OAuth depois */}}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 24 24"><path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/><path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>
            Google
          </button>

          {/* E-mail */}
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <Mail size={18} />
            E-mail
          </button>

          {showEmailForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="bg-[#1A1528] rounded-2xl border border-white/10 p-4 space-y-3"
            >
              <form onSubmit={handleLogin} className="space-y-2">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4D03F] text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-xl px-4">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Senha"
                    className="flex-1 py-2.5 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[#A0A0B0] hover:text-white transition text-xs"
                  >
                    {showPassword ? 'Ocultar' : 'Mostrar'}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] text-sm disabled:opacity-50"
                >
                  {loading ? 'Entrando...' : 'Entrar'}
                </button>
              </form>
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition w-full text-center"
              >
                Esqueceu a senha?
              </button>
            </motion.div>
          )}

          {/* Opções de cadastro */}
          <div className="grid grid-cols-2 gap-3 pt-2">
            <button
              onClick={() => navigate('/register')}
              className="py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <UserPlus size={16} />
              Passageiro
            </button>
            <button
              onClick={() => navigate('/register-driver')}
              className="py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all text-sm flex items-center justify-center gap-2"
            >
              <Car size={16} />
              Motorista
            </button>
          </div>

          {/* Divulgar */}
          <button
            onClick={() => navigate('/divulgar')}
            className="w-full py-3 rounded-2xl font-bold border border-white/10 text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all text-xs flex items-center justify-center gap-2"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/><line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/></svg>
            Compartilhar App
          </button>

          {apkUrl && (
            <a
              href={apkUrl}
              download
              className="w-full py-3 rounded-2xl font-bold border border-white/10 text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all text-xs flex items-center justify-center gap-2"
            >
              <Download size={14} />
              Baixar APK
            </a>
          )}
        </motion.div>

        {/* Footer */}
        <div className="text-center py-6 mt-auto">
          <p className="text-xs text-[#A0A0B0]">
            <strong className="text-white">OBALEVA</strong> &copy; 2025 &mdash; Mobilidade premium
          </p>
        </div>
      </div>
    </div>
  )
}