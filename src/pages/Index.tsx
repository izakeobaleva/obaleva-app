import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Share2, Download, Smartphone, Shield, Star, Mail } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'

export const Index = () => {
  const navigate = useNavigate()
  const [apkUrl, setApkUrl] = useState('')
  const [dominio, setDominio] = useState(window.location.origin)

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
      try { await navigator.share({ title: 'OvaLeva', text: 'Mobilidade premium na palma da sua mão!', url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin,
        }
      })
      if (error) throw error
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login com Google')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/25 rounded-full blur-[100px]" />
        <div className="absolute top-1/3 left-[-80px] w-[200px] h-[200px] bg-blue-500/10 rounded-full blur-[120px]" />
      </div>

      <div className="flex-1 flex flex-col relative z-10">
        {/* Header */}
        <div className="pt-10 pb-6 px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="w-24 h-24 bg-[#F4D03F]/15 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-[#F4D03F]/30 shadow-lg shadow-[#F4D03F]/10"
          >
            <Car className="text-[#F4D03F] w-12 h-12" strokeWidth={2} />
          </motion.div>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-extrabold text-white text-center"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            OvaLeva
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-lg text-[#A0A0B0] text-center font-medium"
          >
            Mobilidade premium para sua cidade
          </motion.p>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="text-sm text-[#A0A0B0]/60 text-center"
          >
            Corridas seguras e motoristas confiáveis
          </motion.p>
        </div>

        {/* Mockup do App - mesma largura dos botões (max-w-md) */}
        <div className="px-6 flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-[#1A1528] rounded-3xl border border-white/15 p-6 w-full max-w-md shadow-2xl shadow-black/30"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 bg-[#F4D03F]/20 rounded-xl flex items-center justify-center">
                  <Car size={16} className="text-[#F4D03F]" />
                </div>
                <span className="text-white font-bold text-sm">OvaLeva</span>
                <div className="w-7 h-7" />
              </div>
              <div className="bg-[#0F0B1A] rounded-2xl h-40 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <Smartphone size={32} className="text-[#F4D03F]/40 mx-auto mb-2" />
                  <p className="text-[#A0A0B0] text-sm font-medium">Mapa ao vivo</p>
                  <p className="text-[#A0A0B0]/50 text-xs mt-1">Sua localização em tempo real</p>
                </div>
              </div>
              <div className="space-y-2">
                <div className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 bg-green-400 rounded-full shrink-0 shadow-lg shadow-green-400/30" />
                  <span className="text-white/50 text-sm">Onde você está?</span>
                </div>
                <div className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10 flex items-center gap-3">
                  <div className="w-3 h-3 bg-red-400 rounded-full shrink-0 shadow-lg shadow-red-400/30" />
                  <span className="text-white/50 text-sm">Para onde vai?</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] rounded-2xl py-3 text-center shadow-lg shadow-[#F4D03F]/20">
                <span className="text-[#1E1E2F] font-bold text-base">🚗 Solicitar OvaLeva</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefícios */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="px-6 mb-6"
        >
          <div className="flex justify-center gap-2">
            <div className="flex items-center gap-1.5 bg-[#1A1528]/80 rounded-full px-3 py-1.5 border border-white/10 shadow-sm">
              <Shield size={14} className="text-green-400 shrink-0" />
              <span className="text-white text-xs font-medium">Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/80 rounded-full px-3 py-1.5 border border-white/10 shadow-sm">
              <Star size={14} className="text-[#F4D03F] shrink-0" />
              <span className="text-white text-xs font-medium">4.8★ Avaliação</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/80 rounded-full px-3 py-1.5 border border-white/10 shadow-sm">
              <Smartphone size={14} className="text-blue-400 shrink-0" />
              <span className="text-white text-xs font-medium">Rápido</span>
            </div>
          </div>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 space-y-3 max-w-md mx-auto w-full"
        >
          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={handleGoogleLogin}
              className="py-4 px-5 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 text-base active:scale-[0.98]"
            >
              <svg width="20" height="20" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/>
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => navigate('/login')}
              className="py-4 px-5 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 text-base active:scale-[0.98]"
            >
              <Mail size={20} />
              E-mail
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button
              onClick={() => navigate('/register')}
              className="py-5 px-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-xl hover:shadow-[#F4D03F]/20 transition-all text-base flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Passageiro
            </button>
            <button
              onClick={() => navigate('/register-driver')}
              className="py-5 px-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-xl hover:shadow-[#F4D03F]/20 transition-all text-base flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Car size={18} strokeWidth={2.5} />
              Motorista
            </button>
          </div>

          <button
            onClick={handleShare}
            className="w-full py-4 rounded-2xl font-bold border border-white/15 text-[#A0A0B0] hover:text-white hover:bg-white/5 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-3 active:scale-[0.98]"
          >
            <Share2 size={18} />
            Compartilhar App
          </button>

          {apkUrl && (
            <a
              href={apkUrl}
              download
              className="w-full py-4 rounded-2xl font-bold border border-white/15 text-[#A0A0B0] hover:text-white hover:bg-white/5 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-3 active:scale-[0.98]"
            >
              <Download size={18} />
              Baixar APK
            </a>
          )}
        </motion.div>

        <div className="text-center py-8 mt-auto">
          <p className="text-sm text-[#A0A0B0]">
            <strong className="text-white font-bold">OvaLeva</strong> &copy; 2025
          </p>
          <p className="text-xs text-[#A0A0B0]/50 mt-1">Mobilidade premium para sua cidade</p>
        </div>
      </div>
    </div>
  )
}