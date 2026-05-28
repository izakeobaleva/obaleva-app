import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign, Map } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* MAPA DE FUNDO - Google Maps (ou fallback) */}
      <div className="flex-1 relative overflow-hidden">
        {/* Mapa online via iframe do Google Maps */}
        <div className="absolute inset-0">
          <iframe
            title="Mapa ObaLeva"
            width="100%"
            height="100%"
            style={{ border: 0, filter: 'brightness(0.65) saturate(0.8)' }}
            loading="lazy"
            src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTqQ5SM6xJ6k'}&center=-23.5505,-46.6333&zoom=15&maptype=roadmap`}
            allowFullScreen
          />
        </div>

        {/* Indicador de localização no canto */}
        <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 flex items-center gap-2 border border-white/10">
          <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">Online</span>
        </div>

        {/* Botão de menu / perfil */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-4 right-4 w-10 h-10 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition"
        >
          <span className="text-lg">👤</span>
        </button>
      </div>

      {/* BOTTOM SHEET */}
      <div className="bg-[#1A1528] rounded-t-3xl border-t border-white/10 p-5 pb-8 shadow-xl">
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
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
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