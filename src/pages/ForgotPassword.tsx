import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { motion } from 'framer-motion'
import { toast } from 'sonner'
import { KeyRound, ArrowLeft, Mail, CheckCircle } from 'lucide-react'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/update-password`,
    })

    if (error) {
      toast.error('Erro ao enviar e-mail de redefinição: ' + error.message)
    } else {
      setSent(true)
      toast.success('E-mail de redefinição enviado! Verifique sua caixa de entrada.')
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
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#F4D03F]/20 mb-4">
            {sent ? (
              <CheckCircle className="w-8 h-8 text-green-400" />
            ) : (
              <KeyRound className="w-8 h-8 text-[#F4D03F]" />
            )}
          </div>
          <h1 className="text-3xl font-bold text-white">
            {sent ? 'E-mail enviado!' : 'Redefinir senha'}
          </h1>
          <p className="text-[#A0A0B0] mt-1">
            {sent
              ? 'Verifique sua caixa de entrada e siga as instruções.'
              : 'Digite seu e-mail para receber o link de redefinição.'}
          </p>
        </div>

        {!sent ? (
          <form onSubmit={handleReset} className="space-y-4">
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-3">
              <Mail size={18} className="text-[#A0A0B0]" />
              <input
                type="email"
                placeholder="Seu e-mail cadastrado"
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={loading}
              className="btn-premium w-full py-3 flex items-center justify-center gap-2"
            >
              {loading ? 'Enviando...' : 'Enviar link de redefinição'}
            </motion.button>
          </form>
        ) : (
          <div className="text-center">
            <p className="text-[#A0A0B0] text-sm mb-4">
              Não recebeu o e-mail? Verifique sua caixa de spam ou tente novamente.
            </p>
            <button
              onClick={() => setSent(false)}
              className="text-[#F4D03F] hover:underline text-sm font-medium"
            >
              Tentar com outro e-mail
            </button>
          </div>
        )}

        <div className="mt-6 text-center">
          <Link
            to="/login"
            className="text-[#A0A0B0] hover:text-white transition flex items-center justify-center gap-2 text-sm"
          >
            <ArrowLeft size={16} />
            Voltar para o login
          </Link>
        </div>
      </motion.div>
    </div>
  )
}