import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, ArrowRight, Loader, CheckCircle } from 'lucide-react'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) { toast.error('Digite seu e-mail'); return }
    setLoading(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/update-password`
      })
      if (error) throw error
      setSent(true)
      toast.success('E-mail de recuperação enviado!')
    } catch (err: any) {
      toast.error(err.message || 'Erro ao enviar e-mail')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-purple-700/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-6">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/login')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition" aria-label="Voltar">
              <ArrowLeft size={18} className="text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">Recuperar senha</h1>
          </div>

          {sent ? (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-green-500/10 rounded-full flex items-center justify-center border border-green-500/20">
                <CheckCircle size={28} className="text-green-400" />
              </div>
              <p className="text-white font-bold mb-1">E-mail enviado!</p>
              <p className="text-sm text-[#A0A0B0] mb-6">Verifique sua caixa de entrada e siga as instruções.</p>
              <button onClick={() => navigate('/login')} className="btn-outline w-full">Voltar ao login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#A0A0B0] mb-4">
                Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.
              </p>
              <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
                <Mail size={18} className="text-[#F4D03F] shrink-0" />
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>
              <motion.button
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2"
              >
                {loading ? (
                  <><Loader size={16} className="animate-spin" /> Enviando...</>
                ) : (
                  <>Enviar link <ArrowRight size={18} /></>
                )}
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword