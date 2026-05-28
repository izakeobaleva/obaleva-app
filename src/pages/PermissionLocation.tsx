import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin } from 'lucide-react';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    // Tentar pedir permissão de localização
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
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-[#F4D03F]/5 rounded-full blur-[120px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-sm">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8 text-center">
          <div className="w-24 h-24 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F4D03F]/20">
            <MapPin size={48} className="text-[#F4D03F]" />
          </div>
          
          <h1 className="text-2xl font-bold text-white mb-3">Acesso à Localização</h1>
          <p className="text-[#A0A0B0] text-base leading-relaxed mb-8">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          <button
            onClick={handleAllow}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all mb-3"
          >
            SEMPRE PERMITIR
          </button>
          <button
            onClick={handleLater}
            className="w-full py-3.5 rounded-2xl text-[#A0A0B0] border border-white/10 hover:text-white hover:border-white/20 transition-all"
          >
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}