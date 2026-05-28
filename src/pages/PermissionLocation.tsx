import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => navigate('/permission-notification'),
        () => navigate('/permission-notification'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      navigate('/permission-notification');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F0B1A]">
      <div className="fixed inset-0 z-0">
        <MapBackground />
      </div>

      <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-20 w-full max-w-[450px] min-h-screen flex flex-col justify-center mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center"
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Crosshair size={44} className="text-[#1E1E2F]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            ObaLeva
          </h1>
          <h2 className="text-xl text-[#E0E0E0] mb-2 font-medium">Acesso à localização</h2>
          <p className="text-base text-[#A0A0B0] leading-relaxed mb-10">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          <button
            onClick={handleAllow}
            className="w-full h-[52px] rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 shadow-xl"
          >
            <Crosshair size={22} />
            PERMITIR
          </button>

          <button
            onClick={() => navigate('/permission-notification')}
            className="w-full h-[52px] rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-base mt-3"
          >
            Agora não
          </button>
        </motion.div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-20 text-center">
        <p className="text-xs text-white/30">ObaLeva © 2025</p>
      </div>
    </div>
  );
}