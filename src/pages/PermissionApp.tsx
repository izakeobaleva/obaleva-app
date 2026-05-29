import React from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionApp = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    localStorage.setItem('notificationsAllowed', 'true');
    navigate('/login');
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex items-center justify-center p-6">
      <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
        <div className="text-center">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">🔔</span>
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Permitir notificações?</h2>
          <p className="text-gray-400 text-sm mb-4">
            Para receber alertas importantes como:
          </p>
          <ul className="text-left text-gray-300 text-sm space-y-1 mb-6">
            <li>• "Motorista a caminho"</li>
            <li>• "Estou chegando!"</li>
            <li>• "Corrida confirmada"</li>
            <li>• "Promoções e descontos"</li>
            <li>• "Avalie sua corrida"</li>
          </ul>
          <button
            onClick={handleAllow}
            className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl mb-3"
          >
            PERMITIR
          </button>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-transparent text-gray-400 font-medium"
          >
            Agora não
          </button>
        </div>
      </div>
    </div>
  );
};

export default PermissionApp;