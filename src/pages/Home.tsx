import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* Mapa placeholder */}
      <div className="flex-1 bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] flex items-center justify-center relative">
        <div className="absolute inset-0 opacity-10" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(244, 208, 63, 0.1) 0%, transparent 50%)`,
        }} />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 mx-auto mb-4 bg-[#F4D03F]/10 rounded-full flex items-center justify-center border border-[#F4D03F]/20">
            <span className="text-4xl">🗺️</span>
          </div>
          <p className="text-lg text-[#A0A0B0] font-medium">Mapa indisponível</p>
          <p className="text-xs text-[#A0A0B0]/60 mt-2">Configure a API do Google Maps</p>
        </div>
      </div>

      {/* Bottom sheet */}
      <div className="bg-[#1A1528] rounded-t-3xl border-t border-white/10 p-6 pb-8">
        <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 mb-3">
          <p className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-green-400" />
            ONDE VOCÊ ESTÁ?
          </p>
          <p className="text-sm text-white flex justify-between items-center">
            R. Santo Antônio, 1091 - Bela Vista, SP
            <span className="text-[#F4D03F] text-xs font-medium">Editar</span>
          </p>
        </div>

        <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 mb-4">
          <p className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
            <Navigation size={12} className="text-red-400" />
            PARA ONDE VOCÊ VAI?
          </p>
          <p className="text-sm text-[#A0A0B0] flex justify-between items-center">
            Digite seu destino
            <span className="text-[#F4D03F] text-xs font-medium">Editar</span>
          </p>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg"
        >
          🚕 Chamar ObaLeva
        </button>

        <p className="text-center mt-3 text-sm text-[#22C55E] font-medium">
          🎉 Baixe o app e ganhe R$ 10 na primeira corrida!
        </p>
      </div>
    </div>
  );
}