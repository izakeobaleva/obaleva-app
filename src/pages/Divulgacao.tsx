import { useNavigate, useSearchParams } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Smartphone, Download, Share2 } from 'lucide-react'
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'

export default function Divulgacao() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const ref = searchParams.get('ref') || 'divulgacao'
  const [apkUrl, setApkUrl] = useState('')

  useEffect(() => {
    loadApkUrl()
  }, [])

  async function loadApkUrl() {
    const { data } = await supabase
      .from('app_config')
      .select('value')
      .eq('key', 'apk_url')
      .maybeSingle()
    
    if (data?.value) {
      setApkUrl(data.value)
    }
  }

  const handleShare = async () => {
    const url = `${window.location.origin}/divulgar?ref=${ref}`
    if (navigator.share) {
      await navigator.share({
        title: 'OBALEVA',
        text: 'Mobilidade premium para sua cidade',
        url
      })
    } else {
      await navigator.clipboard.writeText(url)
      // toast não precisa, só feedback visual
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F4D03F]/20">
            <Car className="text-[#F4D03F] w-10 h-10" />
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            OBALEVA
          </h1>
          
          <p className="text-lg text-[#A0A0B0] mb-8 leading-relaxed">
            Mobilidade premium para sua cidade. Corridas rápidas, motoristas confiáveis e um app que se adapta a você.
          </p>

          <div className="flex flex-col gap-3">
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={handleShare}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-3 text-lg"
            >
              <Share2 size={22} />
              Compartilhar ObaLeva
            </motion.button>

            {apkUrl && (
              <a
                href={apkUrl}
                download
                className="w-full py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-3 text-lg"
              >
                <Download size={22} />
                Baixar APK
              </a>
            )}

            <button
              onClick={() => navigate('/register')}
              className="w-full py-3 rounded-2xl text-[#A0A0B0] hover:text-white transition-all text-sm"
            >
              Criar Conta Grátis
            </button>
          </div>
        </motion.div>
      </div>

      <div className="text-center py-6 relative z-10">
        <p className="text-xs text-[#A0A0B0]">
          <strong className="text-white">OBALEVA</strong> &copy; 2025 &mdash; Mobilidade premium
        </p>
      </div>
    </div>
  )
}