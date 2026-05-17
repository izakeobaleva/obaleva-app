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
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-4 bg-gradient-to-t from-[#0F0B1A] via-[#0F0B1A]/95 to-transparent pt-4 z-50">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#1F1A30] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-2xl backdrop-blur-sm">
        <div className="flex justify-between items-center px-6 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1.5 transition-all duration-300 ${
                active === tab.id 
                  ? 'text-[#F4D03F] transform scale-110' 
                  : 'text-[#A0A0B0] hover:text-white/70'
              }`}
            >
              <tab.icon size={24} strokeWidth={active === tab.id ? 2.5 : 1.8} />
              <span className={`text-[11px] font-medium ${active === tab.id ? 'opacity-100' : 'opacity-70'}`}>{tab.label}</span>
              {active === tab.id && <div className="w-1.5 h-1.5 rounded-full bg-[#F4D03F] mt-0.5 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}