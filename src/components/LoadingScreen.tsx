import { Car } from 'lucide-react';

export function LoadingScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
      <div className="animate-pulse flex flex-col items-center">
        <div className="w-20 h-20 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
          <Car className="w-10 h-10 text-[#F4D03F]" />
        </div>
        <p className="text-white mt-4 font-medium">Carregando ObaLeva...</p>
        <p className="text-[#A0A0B0] text-xs mt-1">Sua corrida de confiança</p>
      </div>
    </div>
  );
}