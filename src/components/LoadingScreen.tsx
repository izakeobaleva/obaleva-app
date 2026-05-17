import React from 'react';
import { Car } from 'lucide-react';

export const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 border border-[#F4D03F]/30 animate-bounce">
          <Car size={40} className="text-[#F4D03F]" />
        </div>
        <p className="text-white font-bold text-lg">OBALEVA</p>
        <p className="text-gray-400 text-sm mt-1">Sua corrida de confiança</p>
        <div className="mt-4 flex justify-center">
          <div className="w-6 h-6 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    </div>
  );
};