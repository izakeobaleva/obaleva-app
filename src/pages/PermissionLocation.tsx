import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crosshair, Car } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => {
          navigate('/permission-notification');
        },
        () => {
          navigate('/permission-notification');
        },
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      navigate('/permission-notification');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#0F0B1A]">
      {/* Mapa de fundo */}
      <div className="absolute inset-0">
        <MapBackground />
      </div>

      {/* Overlay escuro */}
      <div className="absolute inset-0 bg-black/60" />

      {/* Modal */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl p-8 max-w-sm w-full border border-white/10 shadow-2xl"
        >
          <div className="text-center">
            {/* Ícone */}
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Crosshair size={36} className="text-[#1E1E2F]" />
            </div>

            <h1 className="text-2xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
              ObaLeva
            </h1>
            <p className="text-[#A0A0B0] text-sm mb-2">Acesso à localização</p>
            <p className="text-[#A0A0B0] text-xs leading-relaxed mb-6">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>

            <button
              onClick={handleAllow}
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2"
            >
              <Crosshair size={18} />
              SEMPRE PERMITIR
            </button>

            <button
              onClick={() => navigate('/permission-notification')}
              className="w-full mt-3 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all"
            >
              Agora não
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}