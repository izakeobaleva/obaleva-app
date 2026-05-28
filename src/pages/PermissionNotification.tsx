import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    localStorage.setItem('obaleva_notification_allowed', 'true');
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  const handleDeny = () => {
    localStorage.setItem('obaleva_notification_allowed', 'false');
    navigate('/login');
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
          <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-2xl flex items-center justify-center shadow-2xl">
            <Bell size={36} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-2" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Permitir notificações?
          </h1>
          <p className="text-sm text-[#A0A0B0] mb-6">Para receber alertas importantes como:</p>

          <div className="bg-black/40 backdrop-blur-md rounded-2xl p-4 mb-8 space-y-2 text-left border border-white/10">
            {[
              '"Motorista a caminho"',
              '"Estou chegando!"',
              '"Corrida confirmada"',
              '"Promoções e descontos"',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#A855F7] rounded-full" />
                <p className="text-white text-sm font-medium">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleAllow}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-xl cursor-pointer"
          >
            <Bell size={22} />
            PERMITIR
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