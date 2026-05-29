import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

const PermissionMaps = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    localStorage.setItem('mapsAllowed', 'true');
    navigate('/permission-app');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <MapBackground zoom={14} />
      </div>
      <div className="absolute inset-0 bg-black/60" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-gray-900 rounded-2xl p-6 w-full max-w-sm border border-gray-700">
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🗺️</span>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">ObaLeva</h2>
            <p className="text-gray-400 text-sm mb-6">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            <button
              onClick={handleAllow}
              className="w-full py-3 bg-yellow-400 text-gray-900 font-bold rounded-xl mb-3"
            >
              SEMPRE PERMITIR
            </button>
            <button
              onClick={handleAllow}
              className="w-full py-3 bg-transparent text-gray-400 font-medium"
            >
              Agora não
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PermissionMaps;