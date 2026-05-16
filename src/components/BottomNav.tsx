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

export function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-2 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-xl max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between items-center px-3 py-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
              }`}
            >
              <tab.icon size={22} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-1 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}