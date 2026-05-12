import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '../lib/supabaseClient'
import { Car, Chrome, Mail, Lock, Eye, EyeOff, Share2 } from 'lucide-react'

export default function Entrar() {
  const navigate = useNavigate()
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        const tipo = data.user.user_metadata?.tipo

        if (tipo === 'motorista') {
          navigate('/driver')
        } else if (tipo === 'admin') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
        toast.success('Login realizado com sucesso!')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const landingUrl = 'https://obaleva-oficial.vercel.app/landing'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ObaLeve',
          text: 'Mobilidade premium para sua cidade. Baixe oClaro! Continuando exatamente de onde parei:

<dyad-write path="src/pages/Login.tsx" description="Finalizando a atualização do compartilhar para o link /landing">
import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { supabase } from '../lib/supabaseClient'
import { Car, Chrome, Mail, Lock, Eye, EyeOff, Share2 } from 'lucide-react'

export default function Entrar() {
  const navigate = useNavigate()
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
      const { data, error } = await supabase.auth.signInWithPassword({ email, password })
      if (error) throw error

      if (data.user) {
        const tipo = data.user.user_metadata?.tipo

        if (tipo === 'motorista') {
          navigate('/driver')
        } else if (tipo === 'admin') {
          navigate('/admin')
        } else {
          navigate('/home')
        }
        toast.success('Login realizado com sucesso!')
      }
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login')
    } finally {
      setLoading(false)
    }
  }

  const handleShare = async () => {
    const landingUrl = window.location.origin + '/landing'
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'ObaLeve',
          text: 'Mobilidade premium para sua cidade. Baixe o app ObaLeve!',
          url: landingUrl,
        })
      } catch (err) {
        // usuário cancelou
      }
    } else {
      navigator.clipboard.writeText(landingUrl)
      toast.success('Link da Landing Page copiado!')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col items-center justify-center p-5">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-[380px]"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4"
          >
            <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center mx-auto shadow-lg shadow-[#F4D03F]/20">
              <Car size={40} className="text-[#1E1E2F]" />
            </div>
          </motion.div>
          <h1 className="text-3xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Segurança e conforto em cada viagem</p>
        </div>

        {/* Botão Google */}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="w-full bg-[#1A1528] border border-white/10 rounded-2xl px-5 py-4 text-white font-medium flex items-center justify-center gap-3 hover:bg-white/5 transition-all mb-4"
          disabled
        >
          <Chrome size={22} />
          <span>Continuar com Google</span>
          <span className="ml-auto text-[10px] text-[#A0A0B0] bg-white/10 px-2 py-0.5 rounded-full">Em breve</span>
        </motion.button>

        {/* Divider */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-white/10" />
          <span className="text-xs text-[#A0A0B0]">Entre com e-mail</span>
          <div className="flex-1 h-px bg-white/10" />
        </div>

        {/* Form */}
        <motion.form
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          onSubmit={handleLogin}
          className="space-y-3"
        >
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Mail size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type="email"
              placeholder="Seu e-mail"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
            <Lock size={18} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Sua senha"
              className="w-full bg-transparent text-white placeholder-white/50 focus:outline-none text-sm"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>

          <div className="text-right">
            <Link
              to="/forgot-password"
              className="text-xs text-[#A0A0B0] hover:text-[#F4D03F] transition"
            >
              Esqueceu a senha?
            </Link>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all py-3 text-sm"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </motion.button>
        </motion.form>

        {/* Cadastro */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="mt-6 space-y-3"
        >
          <p className="text-xs text-[#A0A0B0] text-center">Ainda não tem conta?</p>

          <Link
            to="/register"
            className="block w-full rounded-2xl font-semibold bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all py-3 text-sm text-center"
          >
            Criar conta como Passageiro
          </Link>

          <Link
            to="/register-driver"
            className="block w-full rounded-2xl font-semibold bg-transparent border border-white/20 text-white hover:bg-white/5 transition-all py-3 text-sm text-center"
          >
            Criar conta como Motorista
          </Link>
        </motion.div>

        {/* Compartilhar */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6 text-center"
        >
          <button
            onClick={handleShare}
            className="text-[#A0A0B0] hover:text-[#F4D03F] transition-all flex items-center justify-center gap-2 mx-auto text-xs"
          >
            <Share2 size={14} />
            Compartilhar ObaLeve
          </button>
        </motion.div>
      </motion.div>
    </div>
  )
}