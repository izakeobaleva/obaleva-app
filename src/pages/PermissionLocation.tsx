import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

const PermissionLocation = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      () => navigate('/permission-notification'),
      () => navigate('/permission-notification')
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <MapBackground zoom={14} />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="bg-black rounded-3xl p-6 w-full max-w-sm border border-gray-800 shadow-2xl">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📍</span>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">ObaLeva</h2>
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            <button
              onClick={handleAllow}
              className="w-full py-3.5 bg-yellow-400 text-black font-bold rounded-xl text-base mb-3"
            >
              SEMPRE PERMITIR
            </button>
            <button
              onClick={() => navigate('/permission-notification')}
              className="w-full py-3 text-gray-500 font-medium text-sm"
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