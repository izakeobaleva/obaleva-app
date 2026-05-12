import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { Lock, CheckCircle } from 'lucide-react'

export default function UpdatePassword() {
  const navigate = useNavigate()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
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
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
            <Lock className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">Nova senha</h1>
          <p className="text-[#A0A0B0] mt-1">Escolha uma nova senha para sua conta.</p>
        </div>

        <form onSubmit={handleUpdate} className="space-y-4">
          <input
            type="password"
            placeholder="Nova senha (mín. 6 caracteres)"
            className="w-full px-4 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
          />
          <input
            type="password"
            placeholder="Confirmar nova senha"
            className="w-full px-4 py-3 rounded-2xl bg-[#1A1528] border border-white/10 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            minLength={6}
          />
          <motion.button
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="btn-premium w-full py-3 flex items-center justify-center gap-2"
          >
            {loading ? 'Atualizando...' : <><CheckCircle size={18} /> Atualizar senha</>}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}