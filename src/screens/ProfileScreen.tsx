import { User, Truck, LogOut } from 'lucide-react';

interface ProfileScreenProps {
  user: any;
  tipo: string;
  onSignOut: () => void;
}

export function ProfileScreen({ user, tipo, onSignOut }: ProfileScreenProps) {
  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
          {tipo === 'motorista' ? (
            <Truck size={40} className="text-[#F4D03F]" />
          ) : (
            <User size={40} className="text-[#F4D03F]" />
          )}
        </div>
        <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
        <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20">
          <span className="text-[#F4D03F] text-xs font-bold">
            {tipo === 'motorista' ? '🚗 Motorista' : '🚶 Passageiro'}
          </span>
        </div>
        <button
          onClick={onSignOut}
          className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-bold hover:bg-red-600 transition"
        >
          SAIR
        </button>
      </div>
    </div>
  );
}