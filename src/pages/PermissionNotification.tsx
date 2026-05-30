"use client";

import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) {
      Notification.requestPermission();
    }
    navigate('/login');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA AO VIVO - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CARD CENTRAL */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[320px] border border-gray-800">
          
          <div className="text-center">
            {/* Ícone */}
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔔</span>
            </div>
            
            <h2 className="text-xl font-bold text-white mb-3">Permitir notificações?</h2>
            
            <p className="text-gray-400 text-sm mb-3">
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
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl text-base mb-3"
            >
              PERMITIR
            </button>
            
            <button
              onClick={() => navigate('/login')}
              className="w-full py-2 text-gray-500 font-medium text-sm"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}