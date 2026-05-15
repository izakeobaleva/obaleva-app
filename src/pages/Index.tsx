import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Smartphone, Mail, MapPin, Send, Target, Navigation } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'
import { BottomNav } from '../components/BottomNav'

export const Index = () => {
  const navigate = useNavigate()
  const { user, loading, signOut, profile } = useAuth()
  const [origem, setOrigem] = useState('')
  const [destino, setDestino] = useState('')
  const [coordsAtuais, setCoordsAtuais] = useState<{ lat: number; lng: number } | null>(null)
  const [velocidade, setVelocidade] = useState(0)
  const watchIdRef = useRef<number | null>(null)
  const [solicitando, setSolicitando] = useState(false)

  useEffect(() => {
    if (user) {
      iniciarLocalizacao()
    }
    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current)
      }
    }
  }, [user])

  function iniciarLocalizacao() {
    if (!navigator.geolocation) return

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, speed } = position.coords
        setCoordsAtuais({ lat: latitude, lng: longitude })
        setVelocidade(speed || 0)
        setOrigem(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
        toast.success('📍 Localização ativada!')
      },
      () => {
        console.warn('Não foi possível obter localização automática')
      },
      { enableHighAccuracy: true, timeout: 10000 }
    )

    watchIdRef.current = navigator.geolocation.watchPosition(
      (newPos) => {
        const { latitude, longitude, speed } = newPos.coords
        setCoordsAtuais({ lat: latitude, lng: longitude })
        setVelocidade(speed || 0)
        setOrigem(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`)
      },
      () => {},
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 3000 }
    )
  }

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      })
      if (error) throw error
    } catch (err: any) {
      console.error(err)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Saiu da conta!')
    setCoordsAtuais(null)
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current)
      watchIdRef.current = null
    }
  }

  const solicitarCorrida = async () => {
    if (!destino) {
      toast.error('Digite o destino')
      return
    }
    setSolicitando(true)
    
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id,
        origem: origem || 'Local atual',
        destino: destino,
        status: 'pendente',
        valor: 15 + Math.random() * 25,
      })
      
      if (error) throw error
      toast.success('🚗 Corrida solicitada! Aguardando motorista...')
      setDestino('')
    } catch (err: any) {
      toast.error('Erro ao solicitar: ' + err.message)
    }
    setSolicitando(false)
  }

  const handleCompartilharLocalizacao = () => {
    if (!coordsAtuais) {
      toast.error('Localização não disponível')
      return
    }
    
    const mapsUrl = `https://www.google.com/maps?q=${coordsAtuais.lat},${coordsAtuais.lng}`
    const texto = `📍 Estou usando o ObaLeva! Veja onde estou:\n${mapsUrl}`

    if (navigator.share) {
      navigator.share({ title: '📍 Minha localização - ObaLeva', text: texto })
    } else {
      navigator.clipboard.writeText(texto)
      toast.success('📍 Localização copiada!')
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  // ========== TELA PRINCIPAL QUANDO LOGADO (Solicitar ObaLeva com mapa ao vivo) ==========
  if (user) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex flex-col pb-24">
        {/* Header minimalista */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F4D03F]/15 rounded-xl flex items-center justify-center border border-[#F4D03F]/20">
              <Car size={16} className="text-[#F4D03F]" />
            </div>
            <span className="text-white font-bold text-sm">ObaLeva</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="bg-green-500/20 px-3 py-1 rounded-full border border-green-500/30 flex items-center gap-1.5">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-green-400 text-[10px] font-medium">Online</span>
            </div>
            <button onClick={handleSignOut} className="px-3 py-1.5 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-[10px] font-medium">
              Sair
            </button>
          </div>
        </div>

        {/* Mapa ao vivo - ocupa espaço flexível */}
        <div className="flex-1 mx-4 my-2 relative" style={{ minHeight: '300px' }}>
          <div className="bg-[#1A1528] rounded-3xl border border-white/10 h-full w-full relative overflow-hidden">
            {/* Grid do mapa */}
            <div className="absolute inset-0 opacity-[0.07]">
              <div className="grid grid-cols-8 grid-rows-8 h-full">
                {Array.from({ length: 64 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>

            {/* Ponto central - localização atual */}
            <div className="absolute inset-0 flex items-center justify-center">
              <motion.div
                animate={{ scale: [1, 1.15, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="relative"
              >
                <div className="w-20 h-20 bg-[#F4D03F]/10 rounded-full absolute -top-8 -left-8 blur-sm" />
                <div className="w-12 h-12 bg-[#F4D03F]/20 rounded-full absolute -top-4 -left-4" />
                <div className="w-6 h-6 bg-[#F4D03F] rounded-full flex items-center justify-center shadow-lg shadow-[#F4D03F]/40">
                  <Target size={14} className="text-[#1E1E2F]" />
                </div>
              </motion.div>
            </div>

            {/* Informações no mapa */}
            <div className="absolute top-3 left-3 space-y-1.5">
              <div className="bg-[#0F0B1A]/80 backdrop-blur-sm px-3 py-1.5 rounded-xl border border-white/10 flex items-center gap-2">
                <MapPin size={12} className="text-green-400" />
                <span className="text-white text-[10px]">
                  {coordsAtuais ? `${coordsAtuais.lat.toFixed(4)}, ${coordsAtuais.lng.toFixed(4)}` : 'Buscando...'}
                </span>
              </div>
            </div>

            {/* Botão compartilhar */}
            <button
              onClick={handleCompartilharLocalizacao}
              className="absolute top-3 right-3 bg-[#0F0B1A]/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10 hover:border-[#F4D03F]/30 transition-all flex items-center gap-1.5"
            >
              <Send size={14} className="text-[#F4D03F]" />
              <span className="text-white text-[10px] font-medium">Compartilhar</span>
            </button>

            {/* Indicador de localização */}
            <div className="absolute bottom-3 left-3 bg-[#0F0B1A]/80 backdrop-blur-sm px-3 py-2 rounded-xl border border-white/10">
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-[#F4D03F]" />
                <span className="text-white text-[10px]">Sua localização em tempo real</span>
              </div>
            </div>
          </div>
        </div>

        {/* Card inferior com origem, destino e solicitar */}
        <div className="px-4 pb-4 pt-2">
          <div className="bg-[#1A1528] rounded-3xl border border-white/10 p-4 space-y-3 shadow-2xl shadow-black/30">
            {/* Status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">Localização ativa</span>
              </div>
              <span className="text-[#A0A0B0] text-[10px]">
                {profile?.tipo === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
              </span>
            </div>

            {/* Origem e Destino */}
            <div className="flex items-center gap-3 bg-[#0F0B1A] rounded-2xl px-4 py-3 border border-white/10">
              <div className="flex flex-col items-center gap-0.5">
                <div className="w-2.5 h-2.5 bg-green-400 rounded-full shadow-lg shadow-green-400/30" />
                <div className="w-px h-5 bg-white/20" />
                <div className="w-2.5 h-2.5 bg-red-400 rounded-full shadow-lg shadow-red-400/30" />
              </div>
              <div className="flex-1 space-y-3">
                <input
                  type="text"
                  placeholder="Sua localização"
                  className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                  value={origem || 'Local atual'}
                  readOnly
                />
                <input
                  type="text"
                  placeholder="Para onde vai?"
                  className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                  value={destino}
                  onChange={e => setDestino(e.target.value)}
                />
              </div>
            </div>

            {/* Botão Solicitar */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={solicitarCorrida}
              disabled={solicitando}
              className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg hover:shadow-[#F4D03F]/20 transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-base"
            >
              {solicitando ? (
                <>
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Buscando motorista...
                </>
              ) : (
                <>
                  <Car size={20} strokeWidth={2.5} />
                  Solicitar ObaLeva
                </>
              )}
            </motion.button>
          </div>
        </div>

        {/* BottomNav */}
        <BottomNav role={profile?.tipo === 'motorista' ? 'motorista' : 'passageiro'} />
      </div>
    )
  }

  // ========== TELA DE ENTRADA (apenas Google + E-mail + Criar conta) ==========
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/25 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm text-center"
      >
        {/* Logo */}
        <div className="mb-8">
          <div className="w-20 h-20 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-[#F4D03F]/20 shadow-xl shadow-[#F4D03F]/10">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-4xl font-extrabold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            ObaLeva
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-2 font-medium">
            Mobilidade premium para sua cidade
          </p>
        </div>

        {/* Preview rápido do mapa */}
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 p-4 mb-6 shadow-xl shadow-black/30">
          <div className="bg-[#0F0B1A] rounded-2xl h-28 flex items-center justify-center border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 opacity-[0.06]">
              <div className="grid grid-cols-4 grid-rows-3 h-full">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={i} className="border border-white/10" />
                ))}
              </div>
            </div>
            <div className="text-center relative z-10">
              <Smartphone size={32} className="text-[#F4D03F]/60 mx-auto mb-1" />
              <p className="text-white font-bold text-sm">Mapa ao vivo</p>
              <p className="text-[#A0A0B0]/70 text-[10px] mt-0.5">Com localização em tempo real</p>
            </div>
          </div>
        </div>

        {/* Botões de entrada - apenas Google e E-mail */}
        <div className="space-y-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleGoogleLogin}
            className="w-full py-4 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-3 text-sm"
          >
            <svg width="20" height="20" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Entrar com Google
          </motion.button>

          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/login')}
            className="w-full py-4 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 text-sm"
          >
            <Mail size={18} />
            Entrar com E-mail
          </motion.button>
        </div>

        {/* Criar conta */}
        <p className="text-[#A0A0B0] text-xs mt-6">
          Não tem conta?{' '}
          <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium">
            Criar conta
          </button>
        </p>
      </motion.div>
    </div>
  )
}