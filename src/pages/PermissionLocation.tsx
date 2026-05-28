import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {},
        () => {}
      );
    }
    navigate('/permission-notification');
  };

  const handleLater = () => {
    navigate('/permission-notification');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      {/* MAPA DE FUNDO - Ocupa toda a tela */}
      <div className="absolute inset-0">
        <iframe
          title="Mapa ObaLeva"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'brightness(0.6) saturate(0.8)' }}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTqQ5SM6xJ6k'}&center=-23.5505,-46.6333&zoom=15&maptype=roadmap`}
          allowFullScreen
        />
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-8">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          
          {/* Card central */}
          <div className="bg-[#1A1528]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-12 text-center shadow-2xl">
            
            {/* Ícone grande */}
            <div className="w-28 h-28 bg-[#F4D03F]/15 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[#F4D03F]/30">
              <MapPin size={56} className="text-[#F4D03F]" />
            </div>
            
            {/* Título */}
            <h1 className="text-3xl font-bold text-white mb-4">Acesso à Localização</h1>
            
            {/* Descrição */}
            <p className="text-[#A0A0B0] text-lg leading-relaxed mb-12 max-w-sm mx-auto">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>

            {/* Botões */}
            <button
              onClick={handleAllow}
              className="w-full py-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-lg mb-4"
            >
              SEMPRE PERMITIR
            </button>
            <button
              onClick={handleLater}
              className="w-full py-4 rounded-2xl text-[#A0A0B0] font-medium border border-white/20 hover:text-white hover:border-white/30 transition-all text-base"
            >
              Agora não
            </button>
          </div>

        </motion.div>
      </div>
    </div>
  );
}