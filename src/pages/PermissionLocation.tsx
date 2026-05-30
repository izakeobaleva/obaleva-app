import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealMap from '../components/RealMap';

const PermissionLocation = () => {
  const navigate = useNavigate();
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const handleAllow = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        navigate('/permission-notification');
      },
      () => {
        navigate('/permission-notification');
      }
    );
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* MAPA NO FUNDO */}
      <div className="absolute inset-0 w-full h-full">
        <RealMap 
          center={userLocation || undefined}
          zoom={14}
          showUserLocation={!!userLocation}
        />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CONTAINER CENTRALIZADO */}
      <div className="absolute inset-0 flex items-center justify-center p-5">
        <div className="bg-[#1a1a2e] rounded-3xl p-6 w-full max-w-[320px] border border-purple-500/30 shadow-2xl">
          
          <div className="text-center">
            <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">📍</span>
            </div>
            
            <h2 className="text-2xl font-bold text-white mb-2">ObaLeva</h2>
            
            <p className="text-gray-400 text-sm mb-6 leading-relaxed">
              Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
            </p>
            
            <button
              onClick={handleAllow}
              className="w-full py-3.5 bg-yellow-500 text-black font-bold rounded-xl text-base mb-3 hover:bg-yellow-400 transition"
            >
              SEMPRE PERMITIR
            </button>
            
            <button
              onClick={() => navigate('/permission-notification')}
              className="w-full py-3 text-gray-500 font-medium text-sm hover:text-gray-400 transition"
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