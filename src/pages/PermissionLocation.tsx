import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Navigation } from 'lucide-react';
import { MapBackground } from '../components/MapBackground';

const PermissionLocation = () => {
  const navigate = useNavigate();

  const handleAllow = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        () => navigate('/permission-notification'),
        () => navigate('/permission-notification')
      );
    } else {
      navigate('/permission-notification');
    }
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <div className="absolute inset-0">
        <MapBackground zoom={14} />
      </div>
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 flex items-center justify-center p-6">
        <div className="bg-gray-900/95 backdrop-blur rounded-2xl p-6 w-full max-w-sm border border-gray-700 shadow-2xl">
          <div className="text-center">
            <div className="w-20 h-20 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-5 border-2 border-yellow-400/30">
              <Navigation className="w-10 h-10 text-yellow-400" />
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">ObaLeva</h2>
            <p className="text-gray-400 text-sm mb-8 leading-relaxed">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            <button
              onClick={handleAllow}
              className="w-full py-4 bg-yellow-400 text-gray-900 font-bold rounded-2xl text-lg hover:bg-yellow-300 transition-all shadow-lg shadow-yellow-400/20"
            >
              SEMPRE PERMITIR
            </button>
            <button
              onClick={() => navigate('/permission-notification')}
              className="w-full py-3 mt-3 text-gray-400 font-medium hover:text-white transition"
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