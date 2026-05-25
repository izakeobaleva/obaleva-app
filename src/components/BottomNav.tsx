import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Clock, User, DollarSign, Navigation } from 'lucide-react'

interface BottomNavProps {
  role: 'passageiro' | 'motorista'
}

export function BottomNav({ role }: BottomNavProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const currentPath = location.pathname

  const passengerTabs = [
    { path: '/', label: 'Início', icon: Home },
    { path: '/trips', label: 'Viagens', icon: Clock },
    { path: '/profile', label: 'Perfil', icon: User },
  ]

  const driverTabs = [
    { path: '/driver', label: 'Início', icon: Home },
    { path: '/earnings', label: 'Ganhos', icon: DollarSign },
    { path: '/profile', label: 'Perfil', icon: User },
  ]

  const tabs = role === 'motorista' ? driverTabs : passengerTabs

  const isActive = (path: string) => {
    if (path === '/') return currentPath === '/'
    return currentPath.startsWith(path)
  }

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pb-2 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3">
      <div className="bg-[#1A1528] border border-white/10 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-around px-5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 transition-all ${
                isActive(tab.path) 
                  ? 'text-[#F4D03F] scale-110' 
                  : 'text-[#A0A0B0] hover:text-white'
              }`}
            >
              <tab.icon size={22} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive(tab.path) && (
                <div className="w-1 h-1 rounded-full bg-[#F4D03F] mt-0.5" />
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}