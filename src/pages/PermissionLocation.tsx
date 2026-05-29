import React from 'react';
import { useNavigate } from 'react-router-dom';

const PermissionLocation = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      () => navigate('/permission-notification'),
      () => navigate('/permission-notification')
    );
  };

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA NO FUNDO - IFRAME DIRETO */}
      {apiKey ? (
        <iframe
          title="Mapa"
          className="absolute inset-0 w-full h-full"
          style={{ border: 0, filter: 'brightness(0.6)' }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps/embed/v1/view?key=${apiKey}&center=-23.5505,-46.6333&zoom=14&maptype=roadmap`}
          allowFullScreen
        />
      ) : (
        <div className="absolute inset-0 w-full h-full bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
          <div className="text-center">
            <div className="text-6xl mb-4">🗺️</div>
            <p className="text-gray-500 text-sm">Mapa indisponível</p>
            <p className="text-gray-800 text-xs mt-1">Configure a chave da API</p>
          </div>
        </div>
      )}

      {/* ESCUREÇO */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/30 to-black/60" />

      {/* CARD CENTRALIZADO - MENOR */}
      <div className="absolute inset-0 flex items-center justify-center px-8">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 max-w-[280px] w-full border border-gray-800 shadow-2xl">
          
          <div className="text-center">
            {/* Ícone */}
            <div className="w-14 h-14 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📍</span>
            </div>
            
            {/* Título */}
            <h2 className="text-xl font-bold text-white mb-2">ObaLeva</h2>
            
            {/* Texto */}
            <p className="text-gray-400 text-xs mb-6 leading-relaxed">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            
            {/* Botão Amarelo */}
            <button
              onClick={handleAllow}
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl text-sm mb-3 hover:bg-yellow-400 transition-all active:scale-[0.98]"
            >
              SEMPRE PERMITIR
            </button>
            
            {/* Botão Transparente */}
            <button
              onClick={() => navigate('/permission-notification')}
              className="w-full py-2.5 text-gray-500 font-medium text-xs hover:text-gray-300 transition"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionLocation;