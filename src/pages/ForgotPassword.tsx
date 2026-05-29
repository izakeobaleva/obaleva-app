import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { motion } from 'framer-motion'
import { ArrowLeft, Mail, ArrowRight } from 'lucide-react'

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
      const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/update-password` })
      if (error) throw error
      setSent(true)
      toast.success('E-mail de recuperação enviado!')
    } catch (err: any) { toast.error(err.message || 'Erro ao enviar e-mail') }
    setLoading(false)
  }

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-[480px]">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8">
          <div className="flex items-center gap-3 mb-6">
            <button onClick={() => navigate('/login')} className="back-button-outline" aria-label="Voltar"><ArrowLeft size={22} /></button>
            <h1 className="text-xl font-bold text-white">Recuperar senha</h1>
          </div>
          {sent ? (
            <div className="text-center py-6">
              <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4"><Mail size={28} className="text-green-400" /></div>
              <p className="text-white font-medium mb-2">E-mail enviado!</p>
              <p className="text-sm text-[#A0A0B0] mb-6">Verifique sua caixa de entrada</p>
              <button onClick={() => navigate('/login')} className="btn-outline-dark px-6 py-2.5 text-sm">Voltar ao login</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <p className="text-sm text-[#A0A0B0] mb-4">Digite seu e-mail cadastrado e enviaremos um link para redefinir sua senha.</p>
              <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
                <Mail size={18} className="text-[#F4D03F] shrink-0" />
                <input type="email" placeholder="seu@email.com" className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
              </div>
              <motion.button whileTap={{ scale: 0.98 }} type="submit" disabled={loading} className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
                {loading ? 'Enviando...' : 'Enviar link de recuperação'} <ArrowRight size={18} />
              </motion.button>
            </form>
          )}
        </div>
      </motion.div>
    </div>
  )
}

export default ForgotPassword