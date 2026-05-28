import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Navigation, DollarSign, Map } from 'lucide-react';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* MAPA DE FUNDO - Ocupa toda a parte superior */}
      <div className="flex-[1.3] relative overflow-hidden" style={{ minHeight: '55vh' }}>
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

        {/* Indicador de localização */}
        <div className="absolute top-6 left-5 bg-black/60 backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 border border-white/10">
          <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
          <span className="text-sm text-white font-medium">Online</span>
          <span className="text-xs text-[#A0A0B0] ml-1">📍 -23.5505, -46.6333</span>
        </div>

        {/* Avatar do usuário */}
        <button
          onClick={() => navigate('/login')}
          className="absolute top-6 right-5 w-12 h-12 bg-black/60 backdrop-blur-md rounded-full flex items-center justify-center border border-white/10 hover:bg-white/10 transition"
        >
          <span className="text-xl">👤</span>
        </button>
      </div>

      {/* BOTTOM SHEET - Área de inputs */}
      <div className="bg-[#1A1528] rounded-t-3xl border-t border-white/10 p-6 pb-10 shadow-xl flex-1 overflow-y-auto">
        <div className="mb-4">
          <div className="bg-[#0F0B1A] rounded-2xl p-5 border border-white/10">
            <p className="text-xs text-[#A0A0B0] mb-2 flex items-center gap-1">
              <MapPin size={14} className="text-green-400" />
              <strong>ONDE VOCÊ ESTÁ?</strong>
            </p>
            <p className="text-base text-white flex justify-between items-center">
              R. Santo Antônio, 1091 - Bela Vista, São Paulo
              <span className="text-[#F4D03F] text-sm font-medium ml-2 shrink-0">Editar</span>
            </p>
          </div>

          <div className="flex justify-center my-2">
            <div className="w-0.5 h-6 bg-white/20" />
          </div>

          <div className="bg-[#0F0B1A] rounded-2xl p-5 border border-white/10">
            <p className="text-xs text-[#A0A0B0] mb-2 flex items-center gap-1">
              <Navigation size={14} className="text-red-400" />
              <strong>PARA ONDE VOCÊ VAI?</strong>
            </p>
            <p className="text-base text-[#A0A0B0] flex justify-between items-center">
              Digite seu endereço de destino
              <span className="text-[#F4D03F] text-sm font-medium ml-2 shrink-0">Editar</span>
            </p>
          </div>
        </div>

        {/* Preço estimativo */}
        <div className="mb-4 bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-3 rounded-xl border border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <DollarSign size={20} className="text-[#F4D03F]" />
              <span className="font-bold text-lg text-white">R$ 18,50</span>
              <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
            </div>
            <span className="text-xs text-[#A0A0B0]">~15 min</span>
          </div>
        </div>

        <button
          onClick={() => navigate('/login')}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-lg"
        >
          🚕 Chamar ObaLeva
        </button>

        <p className="text-center mt-4 text-sm text-[#22C55E] font-medium">
          🎉 Baixe o app e ganhe R$ 10 na primeira corrida!
        </p>
      </div>
    </div>
  );
}