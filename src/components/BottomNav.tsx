import React, { memo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Search, User, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  role: 'passageiro' | 'motorista';
}

const tabsConfig = {
  passageiro: [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'search', label: 'Buscar', icon: Search, path: '/trips' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
    { id: 'menu', label: 'Menu', icon: Menu, path: '/settings' },
  ],
  motorista: [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'earnings', label: 'Ganhos', icon: Wallet, path: '/earnings' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
    { id: 'menu', label: 'Menu', icon: Menu, path: '/settings' },
  ],
}

const NavButton = memo(({ tab, isActive, onClick }: { tab: any; isActive: boolean; onClick: () => void }) => (
  <motion.button
    whileTap={{ scale: 0.9 }}
    onClick={onClick}
    className={`flex flex-col items-center gap-0.5 p-2 rounded-xl transition-colors flex-1 ${
      isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
    }`}
    style={{ minHeight: '56px' }}
  >
    <tab.icon size={22} strokeWidth={isActive ? 2.5 : 1.8} />
    <span className="text-[10px] font-medium">{tab.label}</span>
    {isActive && (
      <motion.div
        layoutId="bottomNavIndicator"
        className="w-1 h-1 rounded-full bg-[#F4D03F]"
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
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/20 z-50">
      <div className="flex justify-around items-center px-2 py-1.5">
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