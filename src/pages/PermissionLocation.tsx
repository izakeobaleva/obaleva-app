import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Crosshair } from 'lucide-react';

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
    <div className="min-h-screen w-full bg-[#0F0B1A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#6B2D8C]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-3xl flex items-center justify-center shadow-2xl">
            <Crosshair size={44} className="text-[#1E1E2F]" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            ObaLeva
          </h1>
          <p className="text-lg text-[#A0A0B0] mb-2">Acesso à localização</p>
          <p className="text-base text-[#A0A0B0] leading-relaxed mb-8">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          <button
            onClick={handleAllow}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-xl"
          >
            <Crosshair size={22} />
            SEMPRE PERMITIR
          </button>

          <button
            onClick={() => navigate('/permission-notification')}
            className="w-full mt-4 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-base"
          >
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}