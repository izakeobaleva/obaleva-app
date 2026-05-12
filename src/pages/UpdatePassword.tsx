import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Lock, CheckCircle, Eye, EyeOff } from 'lucide-react'

export default function UpdatePassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (password !== confirm) {
      toast.error('As senhas não coincidem')
      return
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres')
      return
    }

    setLoading(true)

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
      toast.error('Erro ao atualizar senha: ' + error.message)
    } else {
      toast.success('Senha atualizada com sucesso!')
      navigate('/login')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#F4D03F]/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#6B2D8C]/30 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="card-dark w-full max-w-md p-8 relative z-10"
      >
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-3">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Nova senha</h1>
          <p className="text-[#A0A0B0] mt-1">Escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-1">
          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1 leading-none">
            <Lock size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Nova senha (mín. 6 caracteres)"
              className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-3 py-1 leading-none">
            <Lock size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type={showConfirm ? 'text' : 'password'}
              placeholder="Confirmar nova senha"
              className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm leading-none"
              value={confirm}
              onChange={e => setConfirm(e.target.value)}
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="text-[#A0A0B0] hover:text-white transition shrink-0 p-0 min-h-0 min-w-0"
              aria-label={showConfirm ? 'Ocultar senha' : 'Mostrar senha'}
            >
              {showConfirm ? <EyeOff size={14} /> : <Eye size={14} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-xs px-3 py-1 leading-none"
          >
            {loading ? 'Atualizando...' : <><CheckCircle size={18} /> Atualizar senha</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}