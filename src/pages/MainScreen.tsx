import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapBackground } from '../components/MapBackground';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { Toaster, toast } from 'sonner';
import { Car, MapPin, Navigation, DollarSign, Gift, ShieldCheck, User } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

const MainScreen = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [origin, setOrigin] = useState<string>('R. Santo Antônio, 1091 - Bela Vista');
  const [destination, setDestination] = useState<string>('');
  const [price, setPrice] = useState<number | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [showOriginPicker, setShowOriginPicker] = useState(false);
  const [showDestPicker, setShowDestPicker] = useState(false);
  
  const { userLocation, getCurrentLocation } = useGeolocation();
  const { isLoaded, geocodeAddress, reverseGeocode } = useGoogleMaps();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  useEffect(() => {
    if (userLocation && origin === 'R. Santo Antônio, 1091 - Bela Vista') {
      reverseGeocode(userLocation.lat, userLocation.lng).then(address => {
        if (address) setOrigin(address);
      });
    }
  }, [userLocation]);

  const handlePickOrigin = async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      const address = await reverseGeocode(loc.lat, loc.lng);
      if (address) setOrigin(address);
    }
    setShowOriginPicker(false);
  };

  const handlePlaceSelected = async (lat: number, lng: number, address: string, type: 'origin' | 'destination') => {
    if (type === 'origin') setOrigin(address);
    else setDestination(address);
  };

  const handleRequestRide = () => {
    if (!destination) { toast.error('Digite um destino'); return; }
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Procurando motorista... 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* TOP BAR */}
      <div className="h-[60px] flex-shrink-0 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 shadow-lg z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold text-yellow-400">ObaLeva</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-300">
            {user?.email?.split('@')[0] || 'Passageiro'}
          </span>
          <button onClick={() => user ? navigate('/profile') : navigate('/login')} className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center">
            <User className="w-4 h-4 text-yellow-400" />
          </button>
        </div>
      </div>

      {/* MAPA */}
      <div className="flex-1 relative">
        {isLoaded && userLocation ? (
          <MapBackground 
            center={{ lat: userLocation.lat, lng: userLocation.lng }}
            zoom={15}
          />
        ) : (
          <div className="w-full h-full bg-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Navigation className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-400">Carregando mapa...</p>
              <p className="text-gray-500 text-xs mt-1">📍 Aguardando localização</p>
            </div>
          </div>
        )}
        
        {/* Marcador central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* PAINEL INFERIOR */}
      <div className="flex-shrink-0 bg-gray-900 px-4 py-3 border-t border-gray-800 shadow-2xl">
        
        {showOriginPicker ? (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">ONDE VOCÊ ESTÁ?</span>
            </div>
            <div className="flex gap-2">
              <div className="flex-1 bg-gray-800 rounded-xl border border-gray-700 overflow-hidden">
                <LocationAutocomplete
                  placeholder="Digite seu endereço"
                  onPlaceSelected={(lat, lng, address) => handlePlaceSelected(lat, lng, address, 'origin')}
                />
              </div>
              <button 
                onClick={handlePickOrigin}
                className="px-3 py-2 bg-blue-600 rounded-xl text-white text-xs font-medium hover:bg-blue-500 transition"
              >
                🎯 GPS
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-3" onClick={() => setShowOriginPicker(true)}>
            <div className="flex items-center gap-2 mb-1">
              <MapPin className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">ONDE VOCÊ ESTÁ?</span>
            </div>
            <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700 cursor-pointer">
              <span className="text-sm text-white truncate flex-1">{origin}</span>
              <span className="text-xs text-yellow-400 font-medium ml-2">[Alterar]</span>
            </div>
          </div>
        )}

        {showDestPicker ? (
          <div className="mb-3">
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">PARA ONDE VOCÊ VAI?</span>
            </div>
            <LocationAutocomplete
              placeholder="Digite seu destino"
              onPlaceSelected={(lat, lng, address) => handlePlaceSelected(lat, lng, address, 'destination')}
            />
          </div>
        ) : (
          <div className="mb-3" onClick={() => setShowDestPicker(true)}>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="w-4 h-4 text-red-400" />
              <span className="text-xs text-gray-400">PARA ONDE VOCÊ VAI?</span>
            </div>
            <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2.5 border border-gray-700 cursor-pointer">
              <span className={`text-sm ${destination ? 'text-white' : 'text-gray-500'} truncate flex-1`}>
                {destination || 'Para onde vai?'}
              </span>
              <span className="text-xs text-yellow-400 font-medium ml-2">{destination ? '[Alterar]' : '[Selecionar]'}</span>
            </div>
          </div>
        )}

        <button
          onClick={handleRequestRide}
          disabled={isRequesting || !destination}
          className={`w-full py-3.5 rounded-2xl font-bold text-base transition-all ${
            destination && !isRequesting 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-400/20' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'
          }`}
        >
          {isRequesting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              Procurando motorista...
            </div>
          ) : (
            '🚗 Chamar ObaLeva'
          )}
        </button>
      </div>

      {/* RODAPÉ */}
      <div className="h-[50px] flex-shrink-0 bg-gray-800 border-t border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5">
            <Gift className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-300">
              <strong className="text-yellow-400">10% OFF</strong> 1ª corrida
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-yellow-400" />
            <span className="text-xs text-gray-400">Segurança 24h</span>
          </div>
        </div>
        <button className="text-xs text-yellow-400 font-medium">Saiba mais →</button>
      </div>
    </div>
  );
};

export default MainScreen;