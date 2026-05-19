import { User } from 'lucide-react';

interface ProfileScreenProps {
  user: any;
  onLogout: () => void;
}

export function ProfileScreen({ user, onLogout }: ProfileScreenProps) {
  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
          <User size={40} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
        <button onClick={onLogout} className="mt-6 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold">
          SAIR
        </button>
      </div>
    </div>
  );
}