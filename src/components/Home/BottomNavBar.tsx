import { useNavigate } from 'react-router-dom';
import { Map, History, MapPin, Search } from 'lucide-react';

interface BottomNavBarProps {
  activeTab?: string;
}

export function BottomNavBar({ activeTab = 'home' }: BottomNavBarProps) {
  const navigate = useNavigate();

  const tabs = [
    { id: 'home', icon: Map, label: 'Início', path: '/' },
    { id: 'buscar', icon: Search, label: 'Buscar', path: null },
    { id: 'atividade', icon: History, label: 'Atividade', path: '/trips' },
    { id: 'perfil', icon: MapPin, label: 'Perfil', path: '/profile' },
  ];

  return (
    <div className="flex justify-around pt-3 pb-1">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => tab.path && navigate(tab.path)}
          className={`flex flex-col items-center gap-0.5 transition-all ${
            tab.id === activeTab ? 'text-[#F4D03F]' : 'text-[#A0A0B0] hover:text-white'
          }`}
        >
          <tab.icon size={20} />
          <span className="text-[10px] font-medium">{tab.label}</span>
          {tab.id === activeTab && <div className="w-1 h-1 rounded-full bg-[#F4D03F]" />}
        </button>
      ))}
    </div>
  );
}