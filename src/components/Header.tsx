import { Car, LogOut } from 'lucide-react';

interface HeaderProps {
  user: any;
  onSignOut: () => void;
}

export function Header({ user, onSignOut }: HeaderProps) {
  return (
    <div className="py-2 flex justify-between items-center">
      <div className="flex items-center gap-1.5">
        <div className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
          <Car className="text-[#F4D03F] w-3 h-3" />
        </div>
        <h1 className="text-base font-bold text-white">OBALEVA</h1>
      </div>
      {user && (
        <button onClick={onSignOut} className="text-[#A0A0B0] text-[9px] flex items-center gap-0.5 hover:text-red-400 transition">
          <LogOut size={10} /> Sair
        </button>
      )}
    </div>
  );
}