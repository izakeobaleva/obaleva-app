import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapBackground } from '../components/MapBackground';
import { Toaster, toast } from 'sonner';

const MainScreen = () => {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [origin, setOrigin] = useState<string>('Carregando localização...');
  const [isRequesting, setIsRequesting] = useState(false);
  
  const { location, loading: locationLoading } = useGeolocation();
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (location) {
      setOrigin(`${location.lat.toFixed(4)}, ${location.lng.toFixed(4)}`);
    }
  }, [location]);

  const handleRequestRide = () => {
    if (!destination) {
      toast.error('Digite um destino');
      return;
    }
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Procurando motorista... 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      
      <div className="h-[60px] flex-shrink-0 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <span className="text-lg">🚗</span>
          </div>
          <span className="text-xl font-bold text-yellow-400">ObaLeva</span>
        </div>
        <div className="text-sm text-gray-400">Passageiro</div>
      </div>

      <div className="flex-1 relative">
        {isLoaded && location ? (
          <MapBackground 
            center={{ lat: location.lat, lng: location.lng }}
            zoom={15}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex flex-col items-center justify-center">
            <div className="text-center">
              <div className="text-5xl mb-3">🗺️</div>
              <p className="text-gray-400">Carregando mapa...</p>
              <p className="text-gray-500 text-xs mt-2">📍 Aguardando localização</p>
            </div>
          </div>
        )}
        
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
          <div className="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
        </div>
      </div>

      <div className="flex-shrink-0 bg-gray-900 px-4 py-3 border-t border-gray-800">
        
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-green-400 text-sm">📍</span>
            <span className="text-xs text-gray-400 font-medium">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2">
            <span className="text-sm text-white truncate flex-1">
              {locationLoading ? 'Carregando...' : origin}
            </span>
            <button className="text-xs text-yellow-400 ml-2">[Alterar]</button>
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-red-400 text-sm">🎯</span>
            <span className="text-xs text-gray-400 font-medium">PARA ONDE VOCÊ VAI?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Para onde vai?"
              className="flex-1 bg-transparent text-sm text-white outline-none"
            />
            <button className="text-xs text-yellow-400 ml-2">[Selecionar]</button>
          </div>
        </div>

        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          className={`
            w-full py-3 rounded-xl font-bold text-base transition-all
            ${!isRequesting 
              ? 'bg-yellow-400 text-gray-900' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
        </button>
      </div>

      <div className="flex-shrink-0 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">🔥</span>
            <span className="text-xs text-gray-300"><strong className="text-yellow-400">10% OFF</strong> 1ª corrida</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-yellow-400 text-xs">🛡️</span>
            <span className="text-xs text-gray-400">Segurança 24h</span>
          </div>
        </div>
        <button className="text-xs text-yellow-400">Saiba mais →</button>
      </div>
    </div>
  );
};

export default MainScreen;