import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Share2, Download, Smartphone, Shield, Star } from 'lucide-react'
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
      try { await navigator.share({ title: 'OBALEVA', text: 'Mobilidade premium na palma da sua mão!', url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
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

        {/* Mockup do App */}
        <div className="px-6 flex justify-center mb-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1528] rounded-3xl border border-white/10 p-5 w-full max-w-[280px] shadow-2xl"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-[#F4D03F]/20 rounded-lg flex items-center justify-center">
                  <Car size={14} className="text-[#F4D03F]" />
                </div>
                <span className="text-white text-xs font-semibold">ObaLeve</span>
                <div className="w-6 h-6" />
              </div>
              <div className="bg-[#0F0B1A] rounded-2xl h-32 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <Smartphone size={28} className="text-[#F4D03F]/50 mx-auto mb-1" />
                  <p className="text-[#A0A0B0] text-[10px]">Mapa ao vivo</p>
                </div>
              </div>
              <div className="space-y-1.5">
                <div className="bg-[#0F0B1A] rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-white/50 text-[10px]">Onde você está?</span>
                </div>
                <div className="bg-[#0F0B1A] rounded-xl p-2.5 border border-white/10 flex items-center gap-2">
                  <div className="w-2 h-2 bg-red-400 rounded-full" />
                  <span className="text-white/50 text-[10px]">Para onde vai?</span>
                </div>
              </div>
              <div className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] rounded-2xl py-2.5 text-center">
                <span className="text-[#1E1E2F] font-bold text-xs">🚗 Solicitar Carona</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefícios resumidos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="px-6 mb-5"
        >
          <div className="flex justify-center gap-4">
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Shield size={12} className="text-green-400" />
              <span className="text-white text-[10px]">Seguro</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Star size={12} className="text-[#F4D03F]" />
              <span className="text-white text-[10px]">4.8★</span>
            </div>
            <div className="flex items-center gap-1.5 bg-[#1A1528]/60 rounded-full px-3 py-1.5 border border-white/10">
              <Smartphone size={12} className="text-blue-400" />
              <span className="text-white text-[10px]">Rápido</span>
            </div>
          </div>
        </motion.div>

        {/* Botões */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="px-6 space-y-3 max-w-xs mx-auto w-full"
        >
          {/* Linha: Google | E-mail */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/login')}
              className="py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24">
                <path fill="#fff" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                <path fill="#fff" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#fff" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#fff" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Google
            </button>
            <button
              onClick={() => navigate('/login')}
              className="py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
              E-mail
            </button>
          </div>

          {/* Linha: Passageiro | Motorista */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => navigate('/register')}
              className="py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              Passageiro
            </button>
            <button
              onClick={() => navigate('/register-driver')}
              className="py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-sm flex items-center justify-center gap-2"
            >
              <Car size={16} />
              Motorista
            </button>
          </div>

          {/* Compartilhar */}
          <button
            onClick={handleShare}
            className="w-full py-3 rounded-2xl font-bold border border-white/10 text-[#A0A0B0] hover:text-white hover:bg-white/5 transition-all text-xs flex items-center justify-center gap-2"
          >
            <Share2 size={14} />
            Compartilhar App
          </button>

          {/* Baixar APK */}
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