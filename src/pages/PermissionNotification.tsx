import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';

const PermissionNotification = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex items-center justify-center p-6">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-50px] right-[-50px] w-[200px] h-[200px] bg-yellow-400/10 rounded-full blur-[80px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[200px] h-[200px] bg-purple-600/10 rounded-full blur-[80px]" />
      </div>
      <div className="bg-gray-900/95 backdrop-blur rounded-2xl p-8 w-full max-w-sm border border-gray-700 shadow-2xl relative z-10">
        <div className="text-center">
          <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-yellow-400/30">
            <Bell className="w-10 h-10 text-yellow-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Permitir notificações?</h2>
          <p className="text-gray-400 text-sm mb-5">Para receber alertas importantes como:</p>
          <ul className="text-left text-gray-300 text-sm space-y-2 mb-7 bg-gray-800/50 rounded-xl p-4 border border-gray-700">
            <li className="flex items-center gap-2">🚗 Motorista a caminho</li>
            <li className="flex items-center gap-2">📍 Estou chegando!</li>
            <li className="flex items-center gap-2">✅ Corrida confirmada</li>
            <li className="flex items-center gap-2">🎉 Promoções e descontos</li>
            <li className="flex items-center gap-2">⭐ Avalie sua corrida</li>
          </ul>
          <button
            onClick={handleAllow}
            className="w-full py-4 bg-yellow-400 text-gray-900 font-bold rounded-2xl text-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20 mb-3"
          >
            PERMITIR
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 text-gray-400 font-medium hover:text-white transition"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionNotification;