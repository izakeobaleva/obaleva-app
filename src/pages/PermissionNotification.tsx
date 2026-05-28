import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

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
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] min-h-[100vh] flex flex-col justify-center mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center px-6"
        >
          <div className="w-24 h-24 mx-auto mb-8 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-3xl flex items-center justify-center shadow-2xl">
            <Bell size={44} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>
            Permitir notificações?
          </h1>
          <p className="text-base text-[#A0A0B0] mb-8">Para receber alertas importantes como:</p>

          <div className="bg-[#0F0B1A]/80 rounded-2xl p-5 mb-8 space-y-3 text-left border border-white/10">
            {[
              '"Motorista a caminho"',
              '"Estou chegando!"',
              '"Corrida confirmada"',
              '"Promoções e descontos"',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#A855F7] rounded-full" />
                <p className="text-white text-base font-medium">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleAllow}
            className="w-full h-[52px] rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all text-lg flex items-center justify-center gap-2 shadow-xl"
          >
            <Bell size={22} />
            PERMITIR
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full h-[52px] rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-base mt-3"
          >
            Agora não
          </button>
        </motion.div>
      </div>
    </div>
  );
}