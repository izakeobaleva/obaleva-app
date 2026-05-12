import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Clock, User, Wallet } from 'lucide-react';

interface BottomNavProps {
  role: 'passageiro' | 'motorista';
}

export function BottomNav({ role }: BottomNavProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const passengerTabs = [
    { id: 'home', label: 'Início', icon: Home, path: '/passenger' },
    { id: 'trips', label: 'Viagens', icon: Clock, path: '/trips' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  const driverTabs = [
    { id: 'home', label: 'Início', icon: Home, path: '/driver' },
    { id: 'earnings', label: 'Ganhos', icon: Wallet, path: '/earnings' },
    { id: 'profile', label: 'Perfil', icon: User, path: '/profile' },
  ];

  const tabs = role === 'passageiro' ? passengerTabs : driverTabs;

  return (
    <div className="fixed bottom-0 left-0 right-0 glass-effect border-t border-white/30 z-50 safe-area-bottom">
      <div className="flex justify-around items-center px-4 py-2 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.id}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all duration-200 ${
                isActive 
                  ? 'text-roxo-principal scale-105' 
                  : 'text-gray-400 hover:text-gray-600'
              }`}
            >
              <tab.icon size={24} strokeWidth={isActive ? 2.5 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {isActive && (
                <div className="w-6 h-0.5 rounded-full bg-amarelo-oba mt-0.5" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}