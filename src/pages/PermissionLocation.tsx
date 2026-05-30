"use client";

import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      () => navigate('/permission-notification'),
      () => navigate('/permission-notification')
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA AO VIVO - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO PARA DESTACAR O CARD */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CARD CENTRAL */}
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[320px] border border-gray-800">
          
          <div className="text-center">
            {/* Ícone */}
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗺️</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">ObaLeva</h2>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            
            <button
              onClick={handleAllow}
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl text-base mb-3"
            >
              SEMPRE PERMITIR
            </button>
            
            <button
              onClick={() => navigate('/permission-notification')}
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