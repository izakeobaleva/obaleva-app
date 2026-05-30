"use client";

import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

export default function PermissionNotification() {
  const navigate = useNavigate();

  const handleAllow = () => {
    if ('Notification' in window) Notification.requestPermission();
    navigate('/login');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA NO FUNDO */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      
      {/* CONTAINER CENTRAL */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#1a0a2e] rounded-3xl p-6 w-full max-w-[340px] border-2 border-yellow-500/80 shadow-2xl shadow-yellow-500/10">
          
          {/* LOGO */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🔔</div>
            <h1 className="text-3xl font-bold text-yellow-400">Permitir notificações?</h1>
            <p className="text-white text-sm mt-3 mb-4">
              Para receber alertas importantes como:
            </p>
            <ul className="text-left text-gray-300 text-sm space-y-1.5 mb-4 pl-4">
              <li>• "Motorista a caminho"</li>
              <li>• "Estou chegando!"</li>
              <li>• "Corrida confirmada"</li>
              <li>• "Promoções e descontos"</li>
              <li>• "Avalie sua corrida"</li>
            </ul>
          </div>

          {/* BOTÃO AMARELO */}
          <button
            onClick={handleAllow}
            className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl mb-3 transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
          >
            PERMITIR
          </button>

          {/* BOTÃO VINHO */}
          <button
            onClick={() => navigate('/login')}
            className="w-full py-3 bg-[#800020] hover:bg-[#a00030] text-white font-bold rounded-xl transition-all shadow-lg shadow-[#800020]/20 active:scale-[0.98]"
          >
            AGORA NÃO
          </button>
        </div>
      </div>
    </div>
  );
}