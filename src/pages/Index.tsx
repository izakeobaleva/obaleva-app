import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { 
  Car, Mail, UserPlus, Share2, Smartphone, 
  Shield, Star, ChevronRight, Eye, EyeOff 
} from 'lucide-react'

export const Index = () => {
  const navigate = useNavigate()
  const { signIn } = useAuth()
  const [apkUrl, setApkUrl] = useState('')
  const [dominio, setDominio] = useState(window.location.origin)
  const [showEmailForm, setShowEmailForm] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: apkData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'apk_url')
      .maybeSingle()
    if (apkData?.value) setApkUrl(apkData.value)

    const { data: dominioData } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'app_domain')
      .maybeSingle()
    if (dominioData?.value) setDominio(String(dominioData.value))
  }

  const handleShare = async () => {
    const url = `${dominio}/divulgar`
    if (navigator.share) {
      try { await navigator.share({ title: 'OBALEVA', text: 'Mobilidade premium na palma da sua mão!', url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
      toast.success('Link copiado!')
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col relative overflow-x-hidden">
      {/* Glow de fundo */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 relative z-10 flex flex-col">
        {/* HEADER - Logo e nome */}
        <div className="pt-10 pb-4 px-6 text-center">
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

        {/* MOCKUP DO APP */}
        <div className="px-6 flex justify-center mb-5">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-[#1A1528] rounded-3xl border border-white/[0.07] p-5 w-full max-w-[270px] shadow-2xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-[#F4D03F]/20 rounded-lg flex items-center justify-center">
                  <Car size={13} className="text-[#F4D03F]" />
                </div>
                <span className="text-white text-xs font-semibold">ObaLeve</span>
                <div className="w-6 h-6" />
              </div>

              <div className="bg-[#0F0B1A] rounded-2xl h-28 flex items-center justify-center border border-white/[0.06]">
                <div className="text-center">
                  <Smartphone size={26} className="text-[#F4D03F]/40 mx-auto mb-1" />
                  <p className="text-[#A0A0B0] text-[10px]">Mapa ao vivo</p>
                </div>
              </div>

              <div className="space-y-1.5">
                <div className="bg-[#0F0B1A] rounded-xl p-2.5 flex items-center gap-2 border border-white/[0.06]">
                  <div className="w-2 h-2 bg-green-400 rounded-full shrink-0" />
                  <span className="text-white/40 text-[10px]">Onde você está?</span>
                </div>
                <div className="bg-[#0F0B1A] rounded-xl p-2.5 flex items-center gap-2 border border-white/[0.06]">
                  <div className="w-2 h-2 bg-red-400 rounded-full shrink-0" />
                  <span className="text-white/40 text-[10px]">Para onde vai?</span>
                </div>
              </div>

              <div className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] rounded-2xl py-2.5 text-center shadow-lg">
                <span className="text-[#1E1E2F] font-bold text-xs">🚗 Solicitar ObaLeva</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* TAGS DE BENEFÍCIOS */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="px-6 mb-5"
        >
          <div className="flex justify-center gap-3 flex-wrap">
            {[
              { icon: Shield, label: 'Seguro', color: '#22C55E' },
              { icon: Star, label: '4.8★', color: '#F4D03F' },
              { icon: Smartphone, label: 'Rápido', color: '#60A5FA' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/[0.07]">
                <item.icon size={12} style={{ color: item.color }} />
                <span className="text-white text-[10px]">{item.label}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* BOTÕES DE AÇÃO */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 space-y-2.5 max-w-xs mx-auto w-full flex-1"
        >
          {/* Botão Google */}
          <button
            onClick={() => navigate('/register')}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <svg width="18" height="18" viewBox="0 0 24 24">
              <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
              <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Google
            <ChevronRight size={16} className="opacity-50" />
          </button>

          {/* Botão Email - abre o formulário */}
          <button
            onClick={() => setShowEmailForm(!showEmailForm)}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <Mail size={18} />
            E-mail
            <ChevronRight size={16} className="opacity-50" />
          </button>

          {/* Formulário de login por email */}
          {showEmailForm && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-[#1A1528] rounded-2xl border border-white/[0.07] p-4 space-y-3 overflow-hidden"
            >
              <form onSubmit={handleLogin} className="space-y-2.5">
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-2.5 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-[#F4D03F] text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-xl px-4 focus-within:ring-1 focus-within:ring-[#F4D03F]">
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
                    className="text-[#A0A0B0] hover:text-white transition shrink-0 p-1"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-2.5 rounded-xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] text-sm disabled:opacity-50 hover:shadow-lg transition-all"
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

          {/* GRID Passageiro / Motorista */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
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

          {/* BOTÃO COMPARTILHAR */}
          <button
            onClick={handleShare}
            className="w-full py-2.5 rounded-2xl border border-white/[0.06] text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all text-xs flex items-center justify-center gap-2"
          >
            <Share2 size={14} />
            Compartilhar App
          </button>

          {/* BOTÃO BAIXAR APK */}
          {apkUrl && (
            <a
              href={apkUrl}
              download
              className="block w-full py-2.5 rounded-2xl border border-white/[0.06] text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all text-xs text-center flex items-center justify-center gap-2"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              Baixar APK
            </a>
          )}
        </motion.div>

        {/* FOOTER */}
        <div className="text-center py-5 mt-auto">
          <p className="text-xs text-[#A0A0B0]/60">
            <span className="text-white/80 font-semibold">OBALEVA</span> &copy; 2025 &mdash; Mobilidade premium
          </p>
        </div>
      </div>
    </div>
  )
}