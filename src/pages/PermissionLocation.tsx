import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(() => {}, () => {});
    }
    navigate('/permission-notification');
  };

  const handleLater = () => {
    navigate('/permission-notification');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-purple-900/30 to-indigo-900/30 flex items-center justify-center">
          <div className="text-center">
            <MapPin size={80} className="mx-auto mb-4 text-[#F4D03F]/20" />
            <p className="text-[#A0A0B0] text-lg italic">Mapa de localização</p>
          </div>
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />
      <div className="relative z-10 flex-1 flex items-center justify-center px-6">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
          <div className="bg-[#1A1528]/95 backdrop-blur-xl border border-white/20 rounded-3xl p-10 text-center shadow-2xl">
            <div className="w-28 h-28 bg-[#F4D03F]/15 rounded-full flex items-center justify-center mx-auto mb-8 border-2 border-[#F4D03F]/30">
              <MapPin size={48} className="text-[#F4D03F]" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-3">Acesso à Localização</h1>
            <p className="text-[#A0A0B0] text-base leading-relaxed mb-10">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            <button onClick={handleAllow} className="w-full py-5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-lg mb-4">
              SEMPRE PERMITIR
            </button>
            <button onClick={handleLater} className="w-full py-4 rounded-2xl text-[#A0A0B0] font-medium border border-white/20 hover:text-white hover:border-white/30 transition-all text-base">
              Agora não
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}