import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Car, Truck, Shield, User, BarChart, Settings, LogOut, Home as HomeIcon, Wallet, Clock } from 'lucide-react'

export default function Home() {
  const { user, signOut } = useAuth()
  const navigate = useNavigate()

  const role = user?.user_metadata?.tipo || 'passageiro'

  const cards: { title: string; icon: any; path: string; color: string; desc: string }[] = []

  if (role === 'passageiro') {
    cards.push({ title: 'Solicitar Corrida', icon: Car, path: '/passenger', color: '#F4D03F', desc: 'Solicitar e acompanhar corridas' })
    cards.push({ title: 'Minhas Viagens', icon: Clock, path: '/trips', color: '#6B2D8C', desc: 'Histórico de corridas' })
    cards.push({ title: 'Perfil', icon: User, path: '/profile', color: '#9B59B6', desc: 'Seus dados e endereços' })
  } 
  else if (role === 'motorista') {
    cards.push({ title: 'Painel Motorista', icon: Truck, path: '/driver', color: '#F4D03F', desc: 'Corridas, saldo e status' })
    cards.push({ title: 'Ganhos', icon: Wallet, path: '/earnings', color: '#6B2D8C', desc: 'Histórico e saques' })
    cards.push({ title: 'Perfil', icon: User, path: '/profile', color: '#9B59B6', desc: 'Seus dados' })
  }
  else if (role === 'admin' || role === 'admin') {
    cards.push({ title: 'Motoristas', icon: Truck, path: '/admin?tab=motoristas', color: '#F4D03F', desc: 'Aprovar e gerenciar motoristas' })
    cards.push({ title: 'Passageiros', icon: User, path: '/admin?tab=passageiros', color: '#6B2D8C', desc: 'Listar e gerenciar passageiros' })
    cards.push({ title: 'Corridas', icon: Car, path: '/admin?tab=corridas', color: '#9B59B6', desc: 'Todas as corridas' })
    cards.push({ title: 'Financeiro', icon: BarChart, path: '/admin?tab=financeiro', color: '#2C3E50', desc: 'Relatórios e fundos' })
    cards.push({ title: 'Landing Page', icon: Settings, path: '/admin?tab=landing', color: '#F4D03F', desc: 'Editar texto e links da landing' })
    cards.push({ title: 'Aluguel Veículos', icon: Settings, path: '/admin?tab=alugueis', color: '#E67E22', desc: 'Gerenciar aluguéis' })
    cards.push({ title: 'Suporte', icon: Shield, path: '/admin?tab=suporte', color: '#3498DB', desc: 'Tickets de suporte' })
    cards.push({ title: 'Modo Passageiro', icon: Car, path: '/passenger', color: '#F4D03F', desc: 'Visualizar como passageiro' })
  }

  const handleCardClick = (path: string) => {
    navigate(path)
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      <header className="glass-header sticky top-0 z-20 flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-2xl font-bold text-white">
            Olá, {user?.email?.split('@')[0] || 'Usuário'}
          </h1>
          <p className="text-[#A0A0B0] text-sm">O que você deseja fazer hoje?</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline-block px-3 py-1 rounded-full bg-[#F4D03F]/20 text-[#F4D03F] text-xs font-semibold capitalize">
            {role}
          </span>
          <button
            onClick={signOut}
            className="btn-outline-dark px-3 py-2 text-sm flex items-center gap-2"
          >
            <LogOut size={16} />
            <span className="hidden sm:inline">Sair</span>
          </button>
        </div>
      </header>

      <main className="p-6 max-w-4xl mx-auto">
        {role === 'admin' && (
          <div className="card-dark p-4 mb-6">
            <h2 className="text-[#F4D03F] font-bold flex items-center gap-2">
              <Shield size={20} />
              Painel Administrativo
            </h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Você tem acesso a todas as áreas do sistema.</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((card, index) => (
            <motion.button
              key={card.path}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              whileTap={{ scale: 0.97 }}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleCardClick(card.path)}
              className="card-dark p-5 text-left hover:border-[#F4D03F]/50 transition-all cursor-pointer"
              style={{ borderLeft: `4px solid ${card.color}` }}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${card.color}20` }}>
                  <card.icon size={22} color={card.color} />
                </div>
              </div>
              <h3 className="text-lg font-semibold text-white">{card.title}</h3>
              <p className="text-[#A0A0B0] text-xs mt-1">{card.desc}</p>
            </motion.button>
          ))}
        </div>
      </main>
    </div>
  )
}