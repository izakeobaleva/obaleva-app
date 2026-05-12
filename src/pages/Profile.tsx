import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { User, Mail, Shield, LogOut, ArrowLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Perfil() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const userType = user?.user_metadata?.tipo || 'passageiro'

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4 flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="btn-outline-dark p-2"
          aria-label="Voltar"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>Meu Perfil</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto space-y-4 mt-4">
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-[#1E1E2F]" />
          </div>
          <h2 className="text-xl font-bold text-white">{user?.email?.split('@')[0] || 'Usuário'}</h2>
          <span className={`inline-block mt-2 px-4 py-1.5 rounded-full text-xs font-semibold ${
            userType === 'motorista' ? 'bg-green-900/40 text-green-400' : 'bg-blue-900/40 text-blue-400'
          }`}>
            {userType === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
          </span>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 space-y-4">
          <div className="flex items-center gap-3">
            <Mail size={18} className="text-[#F4D03F]" />
            <div>
              <p className="text-xs text-[#A0A0B0]">E-mail</p>
              <p className="text-sm font-medium text-white">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 pt-3 border-t border-white/10">
            <Shield size={18} className="text-[#F4D03F]" />
            <div>
              <p className="text-xs text-[#A0A0B0]">Conta</p>
              <p className="text-sm font-medium text-white">Verificada</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          className="w-full bg-[#1A1528] rounded-2xl p-4 border border-white/10 flex items-center justify-center gap-2 text-red-400 hover:bg-red-500/10 transition-all font-medium"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </main>

      <BottomNav role={userType as 'passageiro' | 'motorista'} />
    </div>
  )
}