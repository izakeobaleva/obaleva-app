import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          localStorage.setItem('obaleva_location_allowed', 'true');
          navigate('/permission-notification');
        },
        () => {
          localStorage.setItem('obaleva_location_allowed', 'true');
          navigate('/permission-notification');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      navigate('/permission-notification');
    }
  };

  const handleDeny = () => {
    localStorage.setItem('obaleva_location_allowed', 'false');
    navigate('/permission-notification');
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0F0B1A]">
      <div className="absolute inset-0 z-0">
        <MapBackground />
      </div>

      <div className="absolute inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-20 h-full flex flex-col items-center justify-center px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm text-center"
        >
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-2xl">
            <Crosshair size={36} className="text-[#1E1E2F]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            ObaLeva
          </h1>
          <p className="text-lg text-[#E0E0E0] mb-1">Acesso à localização</p>
          <p className="text-sm text-[#A0A0B0] leading-relaxed mb-8 px-4">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          <button
            onClick={handleAllow}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-xl cursor-pointer"
          >
            <Crosshair size={22} />
            SEMPRE PERMITIR
          </button>

          <button
            onClick={handleDeny}
            className="w-full mt-3 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-base cursor-pointer"
          >
            Agora não
          </button>
        </motion.div>
      </div>

      <div className="absolute bottom-8 left-0 right-0 z-20 text-center">
        <p className="text-xs text-white/30">ObaLeva © 2025</p>
      </div>
    </div>
  );
}