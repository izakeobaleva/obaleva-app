import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bell } from 'lucide-react';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    localStorage.setItem('obaleva_onboarding', 'true');
    navigate('/login');
  };

  const handleLater = () => {
    localStorage.setItem('obaleva_onboarding', 'true');
    navigate('/login');
  };

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-[480px]">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-10 text-center">
          <div className="w-28 h-28 bg-[#F4D03F]/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-[#F4D03F]/20">
            <Bell size={48} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-3">Permitir Notificações?</h1>
          <p className="text-[#A0A0B0] text-base mb-6">Para receber alertas importantes como:</p>
          <ul className="text-left text-[#A0A0B0] text-base space-y-3 mb-8 bg-[#0F0B1A] rounded-2xl p-5 border border-white/10">
            <li className="flex items-center gap-2">🚗 Motorista a caminho</li>
            <li className="flex items-center gap-2">📍 Estou chegando!</li>
            <li className="flex items-center gap-2">✅ Corrida confirmada</li>
            <li className="flex items-center gap-2">🎉 Promoções e descontos</li>
            <li className="flex items-center gap-2">⭐ Avalie sua corrida</li>
          </ul>
          <button onClick={handleAllow} className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all mb-3 text-lg">
            PERMITIR
          </button>
          <button onClick={handleLater} className="w-full py-4 rounded-2xl text-[#A0A0B0] border border-white/10 hover:text-white hover:border-white/20 transition-all text-base">
            Agora não
          </button>
        </div>
      </motion.div>
    </div>
  );
}