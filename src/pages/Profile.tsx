import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-roxo-principal">Meu Perfil</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Card do usuário */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="<dyad-write path="src/pages/Profile.tsx" description="Página de perfil do usuário">
import { useAuth } from '../contexts/AuthContext'
import { BottomNav } from '../components/BottomNav'
import { User, Mail, Phone, Shield, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function Profile() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await signOut()
    navigate('/')
  }

  const userType = user?.user_metadata?.tipo || 'passageiro'

  return (
    <div className="min-h-screen bg-gray-100 pb-24">
      <header className="glass-header sticky top-0 z-20 px-6 py-4">
        <h1 className="text-xl font-bold text-roxo-principal">Meu Perfil</h1>
      </header>
      
      <main className="p-4 max-w-lg mx-auto space-y-4">
        {/* Card do usuário */}
        <div className="bg-white rounded-2xl p-6 shadow-sm text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-roxo-principal to-purple-400 rounded-full flex items-center justify-center mx-auto mb-4">
            <User size={36} className="text-white" />
          </div>
          <h2 className="text-xl font-bold text-gray-800">{user?.email?.split('@')[0] || 'Usuário'}</h2>
          <span className={`inline-block mt-2 px-4 py-1 rounded-full text-xs font-semibold ${
            userType === 'motorista' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
          }`}>
            {userType === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
          </span>
        </div>

        {/* Informações */}
        <div className="bg-white rounded-xl p-4 shadow-sm space-y-3">
          <div className="flex items-center gap-3 py-2">
            <Mail size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">E-mail</p>
              <p className="text-sm font-medium">{user?.email}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 py-2 border-t">
            <Shield size={18} className="text-gray-400" />
            <div>
              <p className="text-xs text-gray-400">Conta</p>
              <p className="text-sm font-medium">Verificada</p>
            </div>
          </div>
        </div>

        {/* Sair */}
        <button
          onClick={handleSignOut}
          className="w-full bg-white rounded-xl p-4 shadow-sm flex items-center justify-center gap-2 text-red-500 hover:bg-red-50 transition-all font-medium"
        >
          <LogOut size={18} />
          Sair da conta
        </button>
      </main>

      <BottomNav role={userType as 'passageiro' | 'motorista'} />
    </div>
  )
}