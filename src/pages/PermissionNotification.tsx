import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';
import MapBackground from '../components/MapBackground';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => navigate('/login'));
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-[#0F0B1A]">
      <div className="fixed inset-0 z-0">
        <MapBackground />
      </div>
      <div className="fixed inset-0 z-10 bg-gradient-to-b from-black/70 via-black/50 to-black/80" />

      <div className="relative z-20 w-full min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-[450px]">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="w-28 h-28 mx-auto mb-8 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-3xl flex items-center justify-center shadow-2xl">
              <Bell size={52} className="text-white" />
            </div>

            <h1 className="text-4xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
              Permitir notificações?
            </h1>
            <p className="text-lg text-[#A0A0B0] mb-8">Para receber alertas importantes como:</p>

            <div className="bg-black/40 backdrop-blur-md rounded-2xl p-5 mb-8 space-y-3 text-left border border-white/10 max-w-[380px] mx-auto">
              {[
                '"Motorista a caminho"',
                '"Estou chegando!"',
                '"Corrida confirmada"',
                '"Promoções e descontos"',
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-[#A855F7] rounded-full" />
                  <p className="text-white text-lg font-medium">{item}</p>
                </div>
              ))}
            </div>

            <button
              onClick={handleAllow}
              className="w-full h-[56px] rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 shadow-xl"
            >
              <Bell size={22} />
              PERMITIR
            </button>

            <button
              onClick={() => navigate('/login')}
              className="w-full h-[56px] rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-lg mt-3"
            >
              Agora não
            </button>
          </motion.div>
        </div>
      </div>

      <div className="fixed bottom-6 left-0 right-0 z-20 text-center">
        <p className="text-xs text-white/30">ObaLeva © 2025</p>
      </div>
    </div>
  );
}