import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, User, Wallet } from 'lucide-react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';

interface BottomNavProps {
  role: 'passageiro' | 'motorista';
}

export const BottomNav: React.FC<BottomNavProps> = ({ role }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const passengerTabs = [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'trips', label: 'Viagens', icon: Clock, path: '/trips' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  const driverTabs = [
    { id: 'home', label: 'Início', icon: Home, path: '/' },
    { id: 'earnings', label: 'Ganhos', icon: Wallet, path: '/earnings' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  const tabs = role === 'passageiro' ? passengerTabs : driverTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/30 z-50">
      <div className="flex justify-around items-center px-4 py-2">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <motion.button
              key={tab.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-colors ${
                isActive ? 'text-roxo-principal' : 'text-texto-secundario'
              }`}
              style={{ minHeight: '56px', minWidth: '56px' }}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && (
                <motion.div
                  layoutId="bottomNavIndicator"
                  className="w-1 h-1 rounded-full bg-amarelo-principal mt-1"
                  transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                />
              )}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
};