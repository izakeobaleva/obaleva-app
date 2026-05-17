import React from 'react';
import { Home, Search, User, Menu as MenuIcon } from 'lucide-react';

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

const tabs = [
  { id: 'home', label: 'Início', icon: Home },
  { id: 'buscar', label: 'Buscar', icon: Search },
  { id: 'perfil', label: 'Perfil', icon: User },
  { id: 'menu', label: 'Menu', icon: MenuIcon },
];

export const BottomNav: React.FC<BottomNavProps> = ({ active, onNavigate }) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-xl backdrop-blur-sm">
        <div className="flex justify-between items-center px-5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-200 ${
                active === tab.id 
                  ? 'text-[#F4D03F] scale-105' 
                  : 'text-gray-400 hover:text-white/70'
              }`}
            >
              <tab.icon size={22} strokeWidth={active === tab.id ? 2.5 : 1.8} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#F4D03F] animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};