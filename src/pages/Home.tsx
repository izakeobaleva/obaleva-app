import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign, Map } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col overflow-hidden">
      {/* MAPA - 55% da tela */}
      <div className="relative w-full" style={{ height: '55%' }}>
        {import.meta.env.VITE_GOOGLE_MAPS_API_KEY ? (
          <iframe
            title="Mapa ObaLeva"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'brightness(0.65) saturate(0.8)' }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=-23.5505,-46.6333&zoom=15&maptype=roadmap`}
            allowFullScreen
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] flex items-center justify-center">
            <div className="text-center">
              <Map size={48} className="mx-auto mb-2 text-[#F4D03F]/30" />
              <p className="text-[#A0A0B0] text-sm">Mapa será carregado aqui</p>
              <p className="text-[#A0A0B0] text-xs mt-1">Configure VITE_GOOGLE_MAPS_API_KEY no .env</p>
            </div>
          </div>
        )}
        <div className="absolute top-6 left-5 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-white font-medium">Online</span>
        </div>
        <button onClick={() => navigate('/login')} className="absolute top-6 right-5 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition">
          <span className="text-xl">👤</span>
        </button>
      </div>

      {/* PAINEL INFERIOR - 45% da tela */}
      <div className="w-full bg-[#1A1528] rounded-t-3xl border-t border-white/10 p-6 flex flex-col overflow-y-auto" style={{ height: '45%' }}>
        <div className="flex-1 mx-auto w-full">
          <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 mb-1">
            <p className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
              <MapPin size={14} className="text-green-400" />
              <strong>ONDE VOCÊ ESTÁ?</strong>
            </p>
            <p className="text-sm text-white">R. Santo Antônio, 1091 - Bela Vista, SP</p>
          </div>
          <div className="bg-[#0F0B1A] rounded-2xl p-4 border border-white/10 mt-1">
            <p className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
              <Navigation size={14} className="text-red-400" />
              <strong>PARA ONDE VOCÊ VAI?</strong>
            </p>
            <p className="text-sm text-[#A0A0B0]">Digite seu destino</p>
          </div>

          <div className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-3 rounded-xl border border-white/10 my-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#F4D03F]" />
                <span className="font-bold text-white">R$ 18,50</span>
                <span className="text-xs text-[#A0A0B0]">estimativa</span>
              </div>
              <span className="text-xs text-[#A0A0B0]">~15 min</span>
            </div>
          </div>

          <button onClick={() => navigate('/login')} className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg">
            🚕 Chamar ObaLeva
          </button>
        </div>
      </div>
    </div>
  );
}