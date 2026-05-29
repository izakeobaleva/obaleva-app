import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapBackground } from '../components/MapBackground';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import BottomNav from '../components/BottomNav';
import { Toaster, toast } from 'sonner';
import { Car, MapPin, Navigation, DollarSign } from 'lucide-react';

const MainScreen: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  
  const { location, loading: locationLoading } = useGeolocation();
  const { isLoaded } = useGoogleMaps();

  useEffect(() => {
    if (location && !origin) {
      setOrigin({
        lat: location.lat,
        lng: location.lng,
        address: 'Sua localização atual'
      });
    }
  }, [location, origin]);

  useEffect(() => {
    if (origin && destination) {
      const distanceInKm = Math.random() * 10 + 2;
      const basePrice = 5.00;
      const pricePerKm = 2.50;
      const calculatedPrice = basePrice + (distanceInKm * pricePerKm);
      setPrice(calculatedPrice);
    } else {
      setPrice(null);
    }
  }, [origin, destination]);

  const handleRequestRide = async () => {
    if (!origin || !destination) {
      toast.error('Selecione origem e destino');
      return;
    }

    setIsRequesting(true);
    
    try {
      toast.success('Procurando motorista...');
      setTimeout(() => {
        toast.success('Motorista encontrado! 🚗');
        setIsRequesting(false);
      }, 2000);
    } catch (error) {
      toast.error('Erro ao solicitar corrida');
      setIsRequesting(false);
    }
  };

  return (
    <>
      <Toaster position="top-center" richColors />
      
      <div className="h-screen w-full flex flex-col bg-gray-900 overflow-hidden">
        <div className="flex-shrink-0 h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shadow-lg z-50">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
              <Car className="w-5 h-5 text-gray-900" />
            </div>
            <span className="text-xl font-bold text-yellow-400">ObaLeva</span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-300 hidden sm:block">
              Olá, {user?.email?.split('@')[0] || 'Passageiro'}
            </span>
            <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
              <span className="text-yellow-400 text-sm font-bold">
                {user?.email?.charAt(0).toUpperCase() || 'P'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 relative">
          {isLoaded && location ? (
            <MapBackground center={{ lat: location.lat, lng: location.lng }} zoom={15} />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <div className="text-center">
                <Navigation className="w-12 h-12 text-yellow-400 mx-auto mb-2 animate-pulse" />
                <p className="text-gray-400">Carregando mapa...</p>
              </div>
            </div>
          )}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
            <div className="relative">
              <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
              <div className="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
            </div>
          </div>
        </div>

        <div className="absolute left-4 right-4 top-24 z-20 space-y-3">
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-green-500/20 rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-green-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Onde você está?</p>
                {locationLoading ? <p className="text-sm text-gray-300">Obtendo localização...</p> : origin ? <p className="text-sm text-gray-200 truncate">{origin.address}</p> : <p className="text-sm text-gray-400">Selecione sua localização</p>}
              </div>
              <button onClick={() => document.getElementById('origin-input')?.click()} className="text-xs bg-gray-700 px-3 py-1 rounded-lg text-yellow-400">Editar</button>
            </div>
          </div>
          <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 border border-gray-700 shadow-lg">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-red-500/20 rounded-full flex items-center justify-center">
                <Navigation className="w-4 h-4 text-red-400" />
              </div>
              <div className="flex-1">
                <p className="text-xs text-gray-400">Para onde você vai?</p>
                {destination ? <p className="text-sm text-gray-200 truncate">{destination.address}</p> : <p className="text-sm text-gray-400">Digite seu destino</p>}
              </div>
              <button onClick={() => document.getElementById('destination-input')?.click()} className="text-xs bg-gray-700 px-3 py-1 rounded-lg text-yellow-400">Editar</button>
            </div>
          </div>
        </div>

        <div className="hidden">
          <LocationAutocomplete id="origin-input" placeholder="Onde você está?" onSelect={(address, lat, lng) => { setOrigin({ lat, lng, address }); toast.success('Origem confirmada!'); }} />
          <LocationAutocomplete id="destination-input" placeholder="Para onde você vai?" onSelect={(address, lat, lng) => { setDestination({ lat, lng, address }); toast.success('Destino confirmado!'); }} />
        </div>

        <div className="absolute bottom-20 left-4 right-4 z-20">
          {destination && price && (
            <div className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-3 mb-3 border border-gray-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-5 h-5 text-green-400" />
                <span className="text-white font-bold">Valor estimado:</span>
              </div>
              <span className="text-yellow-400 font-bold text-xl">R$ {price.toFixed(2)}</span>
            </div>
          )}
          <button onClick={handleRequestRide} disabled={isRequesting || !destination} className={`w-full py-4 rounded-xl font-bold text-lg transition-all ${destination && !isRequesting ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 active:scale-95' : 'bg-gray-700 text-gray-400 cursor-not-allowed'}`}>
            {isRequesting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
                Procurando motorista...
              </div>
            ) : '🚗 Chamar ObaLeva'}
          </button>
        </div>

        <div className="flex-shrink-0">
          <BottomNav />
        </div>
      </div>
    </>
  );
};

export default MainScreen;