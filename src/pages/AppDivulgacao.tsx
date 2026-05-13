import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Share2, Download, Smartphone, Shield, Star } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function AppDivulgacao() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref') || 'divulgacao'
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
    const url = `${dominio}/divulgar?ref=${ref}`
    if (navigator.share) {
      await navigator.share({
        title: 'OBALEVA',
        text: 'Mobilidade premium na palma da sua mão!',
        url
      })
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
        <div className="px-6 flex justify-center mb-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#1A1528] rounded-3xl border border-white/10 p-5 w-full max-w-[280px] shadow-2xl"
          >
            {/* Tela do app */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="w-6 h-6 bg-[#F4D03F]/20 rounded-lg flex items-center justify-center">
                  <Car size={14} className="text-[#F4D03F]" />
                </div>
                <span className="text-white text-xs font-semibold">ObaLeve</span>
                <div className="w-6 h-6" />
              </div>
              
              {/* Mapa placeholder */}
              <div className="bg-[#0F0B1A] rounded-2xl h-32 flex items-center justify-center border border-white/10">
                <div className="text-center">
                  <Smartphone size={28} className="text-[#F4D03F]/50 mx-auto mb-1" />
                  <p className="text-[#A0A0B0] text-[10px]">Mapa ao vivo</p>
                </div>
              </div>

              {/* Inputs */}
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

              {/* Botão Solicitar */}
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
          className="px-6 mb-6"
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
          {apkUrl && (
            <a
              href={apkUrl}
              download
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-3 text-base shadow-lg"
            >
              <Download size={22} />
              Baixar APK
            </a>
          )}

          <button
            onClick={handleShare}
            className="w-full py-3.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2.5 text-sm"
          >
            <Share2 size={18} />
            Compartilhar App
          </button>
        </motion.div>

        {/* Footer */}
        <div className="text-center py-6 mt-auto">
          <p className="text-xs text-[#A0A0B0]">
            <strong className="text-white">OBALEVA</strong> &copy; 2025
          </p>
        </div>
      </div>
    </div>
  )
}