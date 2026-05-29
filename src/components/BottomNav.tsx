import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, History, User, Car } from 'lucide-react';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Início' },
    { path: '/trips', icon: History, label: 'Viagens' },
    { path: '/driver', icon: Car, label: 'Motorista' },
    { path: '/profile', icon: User, label: 'Perfil' },
  ];

  return (
    <nav className="h-16 bg-gray-900 border-t border-gray-800 flex items-center justify-around px-4">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`
              flex flex-col items-center gap-1 transition-all
              ${isActive ? 'text-yellow-400' : 'text-gray-500 hover:text-gray-300'}
            `}
          >
            <Icon className="w-5 h-5" />
            <span className="text-xs">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export default BottomNav;