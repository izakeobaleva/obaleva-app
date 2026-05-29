import { MapPin, Car } from 'lucide-react';

interface HomeScreenProps {
  user: any;
  onLogout?: () => void;
  showFullUI: boolean;
}

export function HomeScreen({ user, onLogout, showFullUI }: HomeScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="text-center max-w-sm">
        <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-2xl flex items-center justify-center shadow-xl shadow-[#F4D03F]/20">
          <span className="text-4xl">🚕</span>
        </div>
        <h1 className="text-3xl font-bold text-white mb-2">ObaLeva</h1>
        <p className="text-[#A0A0B0] mb-8">Mobilidade premium para sua cidade</p>
        
        {!showFullUI ? (
          <div className="space-y-3">
            <p className="text-sm text-[#A0A0B0]">Carregando...</p>
          </div>
        ) : user ? (
          <div className="space-y-3">
            <div className="card p-4">
              <div className="flex items-center gap-3 mb-3">
                <MapPin size={18} className="text-green-400" />
                <span className="text-white text-sm">Conectado como {user.email}</span>
              </div>
            </div>
            {onLogout && (
              <button onClick={onLogout} className="btn-outline w-full mt-4">
                Sair
              </button>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}