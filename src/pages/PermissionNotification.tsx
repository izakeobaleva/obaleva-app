import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission().then(() => {
        navigate('/login');
      });
    } else {
      navigate('/login');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F0B1A] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-150px] left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-[#F4D03F]/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#A855F7]/20 rounded-full blur-[120px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8 text-center">
          <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#A855F7] to-[#7C3AED] rounded-3xl flex items-center justify-center shadow-2xl">
            <Bell size={44} className="text-white" />
          </div>

          <h1 className="text-3xl font-bold text-white mb-3" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
            Permitir notificações?
          </h1>
          <p className="text-base text-[#A0A0B0] mb-6">Para receber alertas importantes como:</p>

          <div className="bg-[#0F0B1A] rounded-2xl p-5 mb-8 space-y-3 text-left border border-white/10">
            {[
              '"Motorista a caminho"',
              '"Estou chegando!"',
              '"Corrida confirmada"',
              '"Promoções e descontos"',
              '"Avalie sua corrida"',
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-2 h-2 bg-[#A855F7] rounded-full" />
                <p className="text-white text-base font-medium">{item}</p>
              </div>
            ))}
          </div>

          <button
            onClick={handleAllow}
            className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#A855F7] to-[#7C3AED] text-white hover:shadow-lg transition-all flex items-center justify-center gap-2 text-lg shadow-xl"
          >
            <Bell size={22} />
            PERMITIR
          </button>

          <button
            onClick={() => navigate('/login')}
            className="w-full mt-4 py-3 rounded-2xl font-medium text-[#A0A0B0] hover:text-white transition-all text-base"
          >
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}