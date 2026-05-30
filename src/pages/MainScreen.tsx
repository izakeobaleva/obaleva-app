import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';
import { Toaster, toast } from 'sonner';

const containerStyle = { width: '100%', height: '100%' };

export default function MainScreen() {
  const navigate = useNavigate();
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  useEffect(() => {
    const isLoggedIn = localStorage.getItem('isLoggedIn');
    if (!isLoggedIn) {
      navigate('/login');
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude }),
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 })
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, [navigate]);

  const handleRequestRide = () => {
    if (!destination) { toast.error('Digite um destino'); return; }
    setIsRequesting(true);
    setTimeout(() => { toast.success('Procurando motorista... 🚗'); setIsRequesting(false); }, 2000);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* MAPA REAL DO GOOGLE - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        {isLoaded && userLocation ? (
          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation}
            zoom={15}
            options={{
              disableDefaultUI: true,
              zoomControl: true,
              zoomControlOptions: { position: google.maps.ControlPosition.RIGHT_BOTTOM },
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
              <p className="text-gray-400">Carregando mapa...</p>
              <p className="text-gray-600 text-xs mt-2">📍 Aguardando localização</p>
            </div>
          </div>
        )}
      </div>
      
      {/* OVERLAY LEVE */}
      <div className="absolute inset-0 bg-black/30" />
      
      {/* CONTEÚDO SOBRE O MAPA */}
      <div className="relative z-10 h-full flex flex-col">
        
        {/* TOP BAR */}
        <div className="h-[60px] flex-shrink-0 bg-black/50 backdrop-blur-sm border-b border-yellow-500/50 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center">
              <span className="text-lg">🚗</span>
            </div>
            <span className="text-xl font-bold text-yellow-400">ObaLeva</span>
          </div>
          <button onClick={() => { localStorage.removeItem('isLoggedIn'); navigate('/login'); }}
            className="text-sm text-gray-300 hover:text-white">
            Sair
          </button>
        </div>

        {/* ESPAÇO FLEXÍVEL */}
        <div className="flex-1" />

        {/* CARDS ORIGEM/DESTINO */}
        <div className="flex-shrink-0 bg-black/70 backdrop-blur-md rounded-t-3xl p-4 border-t border-yellow-500/50">
          
          {/* Onde você está */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-green-400 text-sm">📍</span>
              <span className="text-xs text-gray-300 font-medium">ONDE VOCÊ ESTÁ?</span>
            </div>
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-3 py-2 border border-gray-700">
              <span className="text-sm text-white truncate flex-1">
                {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Carregando...'}
              </span>
              <button className="text-xs text-yellow-500 ml-2">[Alterar]</button>
            </div>
          </div>

          {/* Para onde você vai */}
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-red-400 text-sm">🎯</span>
              <span className="text-xs text-gray-300 font-medium">PARA ONDE VOCÊ VAI?</span>
            </div>
            <div className="flex items-center justify-between bg-[#1a1a1a] rounded-xl px-3 py-2 border border-gray-700">
              <input
                type="text"
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="Para onde vai?"
                className="flex-1 bg-transparent text-sm text-white outline-none placeholder-gray-500"
              />
              <button className="text-xs text-yellow-500 ml-2">[Selecionar]</button>
            </div>
          </div>

          {/* Botão Chamar */}
          <button
            onClick={handleRequestRide}
            disabled={isRequesting}
            className={`w-full py-3 rounded-xl font-bold text-base transition-all ${
              !isRequesting 
                ? 'bg-yellow-500 text-black hover:bg-yellow-400' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'
            }`}
          >
            {isRequesting ? 'Procurando motorista...' : '🚗 Chamar ObaLeva'}
          </button>
        </div>

        {/* ESPAÇO PUBLICITÁRIO */}
        <div className="flex-shrink-0 bg-black/50 backdrop-blur-sm border-t border-gray-800 flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">🔥</span>
              <span className="text-xs text-gray-300"><strong className="text-yellow-500">10% OFF</strong> 1ª corrida</span>
            </div>
            <div className="flex items-center gap-1">
              <span className="text-yellow-500 text-xs">🛡️</span>
              <span className="text-xs text-gray-400">Segurança 24h</span>
            </div>
          </div>
          <button className="text-xs text-yellow-500">Saiba mais →</button>
        </div>
      </div>
    </div>
  );
}