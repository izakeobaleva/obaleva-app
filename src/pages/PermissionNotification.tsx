import React from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionNotification = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-black flex items-center justify-center p-5">
      <div className="bg-black rounded-3xl p-6 w-full max-w-sm border border-gray-800">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔔</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-3">Permitir notificações?</h2>
          <p className="text-gray-400 text-sm mb-3">
            Para receber alertas importantes como:
          </p>
          <ul className="text-left text-gray-300 text-sm space-y-1 mb-6 pl-2">
            <li>• "Motorista a caminho"</li>
            <li>• "Estou chegando!"</li>
            <li>• "Corrida confirmada"</li>
            <li>• "Promoções e descontos"</li>
            <li>• "Avalie sua corrida"</li>
          </ul>
          <button
            onClick={handleAllow}
            className="w-full py-3.5 bg-yellow-400 text-black font-bold rounded-xl text-base mb-3"
          >
            PERMITIR
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 text-gray-500 font-medium text-sm"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionNotification;