import { Car } from 'lucide-react';

export function SplashScreen() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
          <Car size={40} className="text-[#F4D03F]" />
        </div>
        <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
        <p className="text-[#A0A0B0] text-sm mt-2">Carregando...</p>
      </div>
    </div>
  );
}