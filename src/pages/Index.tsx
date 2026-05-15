import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Smartphone, Shield, Star, Mail, Share2, Download, LogOut, LayoutDashboard, Home, Search, User, Menu } from 'lucide-react'
import { useState, useEffect, useRef } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../contexts/AuthContext'
import { toast } from 'sonner'

const QUICK_OPTIONS = [
  { label: 'Início', icon: Home, color: '#F4D03F' },
  { label: 'Buscar', icon: Search, color: '#3B82F6' },
  { label: 'Perfil', icon: User, color: '#A855F7' },
  { label: 'Menu', icon: Menu, color: '#22C55E' },
]

export const Index = () => {
  const navigate = useNavigate()
  const { user, loading, signOut } = useAuth()
  const [apkUrl, setApkUrl] = useState('')
  const [dominio, setDominio] = useState(window.location.origin)
  const [showPromoPanel, setShowPromoPanel] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    const { data: apkData } = await supabase.from('app_config').select('value').eq('key', 'apk_url').maybeSingle()
    if (apkData?.value) setApkUrl(apkData.value)
    const { data: dominioData } = await supabase.from('app_config').select('value').eq('key', 'app_domain').maybeSingle()
    if (dominioData?.value) setDominio(String(dominioData.value))
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

  const handleShare = async () => {
    const url = `${dominio}/divulgar`
    if (navigator.share) {
      try { await navigator.share({ title: 'ObaLeva', text: 'Mobilidade premium na palma da sua mão!', url }) } catch {}
    } else {
      await navigator.clipboard.writeText(url)
    }
  }

  const handleSignOut = async () => {
    await signOut()
    toast.success('Saiu da conta!')
  }

  const handleGoToDashboard = () => {
    const tipo = user?.user_metadata?.tipo
    if (tipo === 'passageiro') navigate('/passenger')
    else if (tipo === 'motorista') navigate('/driver')
    else navigate('/test-login')
  }

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
      <div className="animate-spin h-8 w-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  )

  const promoItems = [
    {
      titulo: 'Motoristas Parceiros',
      descricao: 'Ganhe dinheiro dirigindo. Horários flexíveis, ganhos semanais.',
      cor: '#A855F7',
      icone: '🚗',
      action: () => navigate('/register-driver')
    },
    {
      titulo: 'ObaLeva Empresas',
      descricao: 'Solução corporativa de mobilidade para sua empresa.',
      cor: '#3B82F6',
      icone: '💼',
      action: () => navigate('/register')
    },
    {
      titulo: 'Seguro Viagem',
      descricao: 'Todas as corridas com seguro de passageiro incluso.',
      cor: '#22C55E',
      icone: '🛡️',
      action: () => navigate('/register')
    },
    {
      titulo: 'Indique e Ganhe',
      descricao: 'Ganhe bônus para cada amigo que se cadastrar.',
      cor: '#F59E0B',
      icone: '🎁',
      action: handleShare
    },
    {
      titulo: 'ObaLeva Flash',
      descricao: 'Entregas rápidas. Envie documentos e objetos.',
      cor: '#EF4444',
      icone: '⚡',
      action: () => navigate('/register')
    },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* Fundo decorativo */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-[#F4D03F]/8 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/25 rounded-full blur-[100px]" />
      </div>

      <div className="flex-1 flex flex-col relative z-10 pb-[140px]">
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#F4D03F]/15 rounded-xl flex items-center justify-center border border-[#F4D03F]/20">
              <Car size={16} className="text-[#F4D03F]" />
            </div>
            <span className="text-white font-bold text-sm" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ObaLeva</span>
          </div>
          <div className="flex gap-2">
            {user && (
              <>
                <button onClick={handleGoToDashboard} className="btn-outline-dark px-3 py-1.5 text-xs flex items-center gap-1">
                  <LayoutDashboard size={14} />
                  Dashboard
                </button>
                <button onClick={handleSignOut} className="px-3 py-1.5 rounded-2xl border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-xs flex items-center gap-1">
                  <LogOut size={14} />
                  Sair
                </button>
              </>
            )}
          </div>
        </div>

        {/* Título */}
        <div className="pt-6 pb-4 px-6 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 10 }} 
            animate={{ opacity: 1, y: 0 }} 
            className="text-3xl md:text-4xl font-extrabold text-white" 
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            ObaLeva
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            transition={{ delay: 0.1 }}
            className="text-sm text-[#A0A0B0] font-medium"
          >
            Mobilidade premium para sua cidade
          </motion.p>
        </div>

        {/* Preview do app em formato de celular */}
        <div className="px-4 flex justify-center mb-6">
          <motion.div 
            initial={{ opacity: 0, y: 30 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ delay: 0.2 }}
            className="bg-[#1A1528] rounded-3xl border border-white/15 p-5 w-full max-w-sm shadow-2xl shadow-black/30"
          >
            <div className="space-y-3">
              {/* Header do card */}
              <div className="flex items-center justify-between mb-1">
                <div className="w-7 h-7 bg-[#F4D03F]/20 rounded-xl flex items-center justify-center">
                  <Car size={16} className="text-[#F4D03F]" />
                </div>
                <span className="text-white font-bold text-sm">ObaLeva</span>
                <div className="w-7 h-7" />
              </div>

              {/* Mapa - destaque principal */}
              <div className="bg-[#0F0B1A] rounded-2xl h-48 flex items-center justify-center border border-white/10 relative overflow-hidden">
                {/* Grid do mapa */}
                <div className="absolute inset-0 opacity-10">
                  <div className="grid grid-cols-6 grid-rows-4 h-full">
                    {Array.from({ length: 24 }).map((_, i) => (
                      <div key={i} className="border border-white/10" />
                    ))}
                  </div>
                </div>
                <div className="text-center relative z-10">
                  <Smartphone size={40} className="text-[#F4D03F]/60 mx-auto mb-2" />
                  <p className="text-white font-bold text-base">Mapa ao vivo</p>
                  <p className="text-[#A0A0B0]/60 text-xs mt-1">Sua localização em tempo real</p>
                </div>
                {/* Indicadores no mapa */}
                <div className="absolute bottom-3 left-3 bg-green-500/20 px-2 py-1 rounded-full border border-green-500/30">
                  <span className="text-green-400 text-[10px] font-medium">● Online</span>
                </div>
                <div className="absolute top-3 right-3 bg-[#F4D03F]/10 px-2 py-1 rounded-full border border-[#F4D03F]/20">
                  <span className="text-[#F4D03F] text-[10px] font-medium">4.8★</span>
                </div>
              </div>

              {/* Campos de origem e destino */}
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

              {/* Botão Solicitar */}
              <div className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] rounded-2xl py-3 text-center shadow-lg shadow-[#F4D03F]/20 cursor-pointer hover:shadow-xl hover:shadow-[#F4D03F]/30 transition-all active:scale-[0.98]">
                <span className="text-[#1E1E2F] font-bold text-base flex items-center justify-center gap-2">
                  <Car size={18} strokeWidth={2.5} />
                  Solicitar ObaLeva
                </span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Benefícios */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.3 }}
          className="px-6 mb-6"
        >
          <div className="flex justify-center gap-3">
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

        {/* Botões de ação */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.35 }}
          className="px-6 space-y-3 max-w-sm mx-auto w-full flex-1"
        >
          {user ? (
            <>
              <p className="text-center text-sm text-[#A0A0B0] mb-2">
                Logado como <strong className="text-white">{user.email}</strong>
              </p>
              <button 
                onClick={handleGoToDashboard} 
                className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-xl hover:shadow-[#F4D03F]/20 transition-all text-base active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <LayoutDashboard size={18} />
                Ir para o Dashboard
              </button>
              <button 
                onClick={handleSignOut} 
                className="w-full py-4 rounded-2xl font-bold border-2 border-red-500/30 text-red-400 hover:bg-red-500/10 transition-all text-base active:scale-[0.98] flex items-center justify-center gap-2"
              >
                <LogOut size={18} />
                Sair da conta
              </button>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={handleGoogleLogin} 
                  className="py-4 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                >
                  <svg width="18" height="18" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59A14.5 14.5 0 0 1 9.5 24c0-1.59.28-3.14.76-4.59l-7.98-6.19A23.99 23.99 0 0 0 0 24c0 3.88.93 7.55 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  Google
                </button>
                <button 
                  onClick={() => { navigate('/login'); setShowPromoPanel(true) }} 
                  className="py-4 rounded-2xl font-bold border-2 border-white/20 text-white hover:bg-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 text-sm active:scale-[0.98]"
                >
                  <Mail size={18} />
                  E-mail
                </button>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => navigate('/register')} 
                  className="py-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-xl hover:shadow-[#F4D03F]/20 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Passageiro
                </button>
                <button 
                  onClick={() => navigate('/register-driver')} 
                  className="py-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-xl hover:shadow-[#F4D03F]/20 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Car size={16} strokeWidth={2.5} />
                  Motorista
                </button>
              </div>

              <button 
                onClick={handleShare} 
                className="w-full py-3 rounded-2xl font-bold border border-white/15 text-[#A0A0B0] hover:text-white hover:bg-white/5 hover:border-white/30 transition-all text-sm flex items-center justify-center gap-2 active:scale-[0.98]"
              >
                <Share2 size={16} />
                Compartilhar App
              </button>

              {apkUrl && (
                <a 
                  href={apkUrl} 
                  download 
                  className="block w-full py-3 rounded-2xl font-bold border border-white/15 text-[#A0A0B0] hover:text-white hover:bg-white/5 hover:border-white/30 transition-all text-sm text-center flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <Download size={16} />
                  Baixar APK
                </a>
              )}
            </>
          )}
        </motion.div>
      </div>

      {/* Painel Descubra o ObaLeva - acima da barra fixa */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        {/* Painel de propaganda */}
        <div 
          onClick={() => setShowPromoPanel(!showPromoPanel)}
          className="bg-[#1A1528]/80 backdrop-blur-xl border-t border-white/10 px-4 pt-3 cursor-pointer hover:bg-[#1A1528]/90 transition-colors"
        >
          <div className="max-w-sm mx-auto flex items-center justify-between mb-2">
            <h2 className="text-white font-bold text-sm">Descubra o ObaLeva</h2>
            <span className="text-[#F4D03F] text-xs font-medium">
              {showPromoPanel ? 'Recolher ▲' : 'Ver todos ▼'}
            </span>
          </div>

          {showPromoPanel && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div 
                ref={scrollRef}
                className="flex gap-3 overflow-x-auto pb-3 scrollbar-hide"
              >
                {promoItems.map((item, index) => (
                  <motion.button
                    key={item.titulo}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={(e) => { e.stopPropagation(); item.action() }}
                    className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 hover:border-[#F4D03F]/30 transition-all flex-shrink-0 w-[200px] text-left"
                  >
                    <div className="text-2xl mb-2">{item.icone}</div>
                    <h3 className="text-white font-bold text-sm mb-1">{item.titulo}</h3>
                    <p className="text-[#A0A0B0] text-xs leading-relaxed">{item.descricao}</p>
                  </motion.button>
                ))}
              </div>
              
              <div className="flex justify-center gap-1 pb-2">
                {promoItems.map((_, i) => (
                  <div 
                    key={i} 
                    className={`w-1.5 h-1.5 rounded-full transition-all ${i === 0 ? 'bg-[#F4D03F] w-3' : 'bg-white/20'}`}
                  />
                ))}
              </div>
            </motion.div>
          )}
        </div>

        {/* Barra fixa inferior */}
        <div className="bg-[#1A1528]/95 backdrop-blur-xl border-t border-white/10 px-4 py-3">
          <div className="flex justify-around items-center max-w-sm mx-auto">
            {QUICK_OPTIONS.map((option) => (
              <button
                key={option.label}
                className="flex flex-col items-center gap-1 px-4 py-1 rounded-2xl hover:bg-white/5 transition-all min-w-[60px]"
              >
                <option.icon size={22} color={option.color} strokeWidth={1.5} />
                <span className="text-[#A0A0B0] text-[10px] font-medium">{option.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}