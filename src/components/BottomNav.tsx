import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, User, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  role: 'passageiro' | 'motorista';
}

const tabsConfig = {
  passageiro: [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'trips', label: 'Viagens', icon: Clock, path: '/trips' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ],
  motorista: [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'earnings', label: 'Ganhos', icon: Wallet, path: '/earnings' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ],
}

const NavButton = memo(({ tab, isActive, onClick }: { tab: any; isActive: boolean; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
      isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
    }`}
    style={{ minHeight: '56px', minWidth: '56px' }}
  >
    <tab.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
    <span className="text-xs font-medium">{tab.label}</span>
    {isActive && (
      <motion.div
        layoutId="bottomNavIndicator"
        className="w-1 h-1 rounded-full bg-[#F4D03F] mt-1"
        transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      />
    )}
  </motion.button>
))

export const BottomNav: React.FC<BottomNavProps> = memo(({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const tabs = tabsConfig[role] || tabsConfig.passageiro;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/30 z-50">
      <div className="flex justify-around items-center px-4 py-2">
        {tabs.map((tab) => (
          <NavButton
            key={tab.id}
            tab={tab}
            isActive={location.pathname === tab.path}
            onClick={() => navigate(tab.path)}
          />
        ))}
      </div>
    </div>
  )
})