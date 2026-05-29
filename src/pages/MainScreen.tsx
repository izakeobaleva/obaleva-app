import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useGeolocation } from '../hooks/useGeolocation';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { MapBackground } from '../components/MapBackground';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { Toaster, toast } from 'sonner';
import { Car, MapPin, Navigation, DollarSign, Bell, Award, Shield, Sparkles, ChevronRight } from 'lucide-react';

// ============================================
// LAYOUT FIXO COM CONTAINERS
// ┌─────────────────────────────┐
// │ TOP BAR (60dp)              │ ← FIXO
// ├─────────────────────────────┤
// │ MAPA (flex-1)               │ ← OCUPA TUDO
// ├─────────────────────────────┤
// │ ORIGEM + DESTINO            │ ← wrap_content
// ├─────────────────────────────┤
// │ ESPAÇO PUBLICITÁRIO (50dp)  │ ← FIXO INTERATIVO
// └─────────────────────────────┘
// ============================================

export const MainScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [destination, setDestination] = useState<{ lat: number; lng: number; address: string } | null>(null);
  const [price, setPrice] = useState<number | null>(null);
  const [isRequesting, setIsRequesting] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);
  
  const { location, loading: locationLoading } = useGeolocation();
  const { isLoaded } = useGoogleMaps();

  const bannerSlides = [
    { icon: Sparkles, title: '🔥 10% OFF na 1ª corrida!', color: '#F59E0B' },
    { icon: Shield, title: '🛡️ Segurança 24h monitorada', color: '#3B82F6' },
    { icon: Award, title: '⭐ Motoristas nota 4.8', color: '#10B981' },
    { icon: DollarSign, title: '💰 Preço justo sem taxas', color: '#8B5CF6' },
  ];

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

  // Banner auto-play
  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestRide = async () => {
    if (!origin || !destination) {
      toast.error('Selecione origem e destino');
      return;
    }
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Procurando motorista... 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  const slide = bannerSlides[bannerIndex];
  const SlideIcon = slide.icon;

  return (
    <div className="h-screen w-full bg-gray-900 flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* ========================================== */}
      {/* 1. TOP BAR - 60dp FIXO */}
      {/* ========================================== */}
      <div className="h-[60px] flex-shrink-0 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-4 z-50">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-400 rounded-lg flex items-center justify-center">
            <Car className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-xl font-bold text-yellow-400">ObaLeva</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="text-xs bg-yellow-400/10 text-yellow-400 px-3 py-1.5 rounded-lg border border-yellow-400/20 hover:bg-yellow-400/20 transition font-medium">
            {user?.email?.split('@')[0] || 'Entrar'}
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* 2. MAPA - OCUPA TODO ESPAÇO (flex-1) */}
      {/* ========================================== */}
      <div className="flex-1 relative min-h-0">
        {isLoaded && location ? (
          <MapBackground 
            center={{ lat: location.lat, lng: location.lng }}
            zoom={15}
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800 flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-700 rounded-full flex items-center justify-center mx-auto mb-3">
                <Navigation className="w-8 h-8 text-yellow-400 animate-pulse" />
              </div>
              <p className="text-gray-400">Carregando mapa...</p>
              <p className="text-gray-500 text-xs mt-1">📍 Sua localização</p>
            </div>
          </div>
        )}
        
        {/* Marcador de localização central */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none">
          <div className="relative">
            <div className="w-6 h-6 bg-blue-500 rounded-full border-2 border-white shadow-lg"></div>
            <div className="absolute -top-1 -left-1 w-8 h-8 bg-blue-500 rounded-full opacity-30 animate-ping"></div>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. ORIGEM + DESTINO - wrap_content */}
      {/* ========================================== */}
      <div className="flex-shrink-0 bg-gray-900 px-4 py-3 border-t border-gray-800">
        {/* Origem */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-medium">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2 border border-gray-700">
            <span className="text-sm text-white truncate flex-1">
              {origin?.address || (locationLoading ? 'Obtendo localização...' : 'Toque para selecionar')}
            </span>
            <button 
              onClick={() => document.getElementById('origin-input')?.click()}
              className="text-xs text-green-400 font-medium ml-2 bg-green-500/10 px-2 py-1 rounded-lg hover:bg-green-500/20 transition"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Destino */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-medium">PARA ONDE VOCÊ VAI?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2 border border-gray-700">
            <span className="text-sm text-white truncate flex-1">
              {destination?.address || 'Digite seu destino'}
            </span>
            <button 
              onClick={() => document.getElementById('destination-input')?.click()}
              className="text-xs text-red-400 font-medium ml-2 bg-red-500/10 px-2 py-1 rounded-lg hover:bg-red-500/20 transition"
            >
              Editar
            </button>
          </div>
        </div>

        {/* Preço (só aparece se tiver destino) */}
        {destination && price && (
          <div className="mb-3 flex items-center justify-between bg-gray-800 rounded-xl px-3 py-2 border border-green-500/30">
            <div className="flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-green-400" />
              <span className="text-xs text-gray-400">Valor estimado:</span>
            </div>
            <span className="text-green-400 font-bold text-base">R$ {price.toFixed(2)}</span>
          </div>
        )}

        {/* Botão Chamar */}
        <button
          onClick={handleRequestRide}
          disabled={isRequesting || !destination}
          className={`
            w-full py-3 rounded-xl font-bold text-base transition-all
            ${destination && !isRequesting 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 active:scale-[0.98] shadow-lg shadow-yellow-400/20' 
              : 'bg-gray-700 text-gray-500 cursor-not-allowed'}
          `}
        >
          {isRequesting ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
              Procurando motorista...
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <Car size={18} className="text-gray-900" />
              Chamar ObaLeva
            </div>
          )}
        </button>
      </div>

      {/* ========================================== */}
      {/* 4. ESPAÇO PUBLICITÁRIO - 50dp FIXO INTERATIVO */}
      {/* ========================================== */}
      <div className="h-[50px] flex-shrink-0 bg-gray-800 border-t border-gray-700 flex items-center px-4 relative overflow-hidden group cursor-pointer hover:bg-gray-750 transition-all"
        onClick={() => toast.info('Em breve mais novidades! 🎉')}
      >
        {/* Gradiente animado */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-purple-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3 w-full relative z-10">
          <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ backgroundColor: `${slide.color}15` }}>
            <SlideIcon size={14} style={{ color: slide.color }} />
          </div>
          <span className="text-sm font-medium text-white truncate flex-1">{slide.title}</span>
          <ChevronRight size={14} className="text-gray-500 group-hover:text-gray-300 transition shrink-0" />
        </div>
        
        {/* Indicadores de slide */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {bannerSlides.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full transition-all duration-500 ${i === bannerIndex ? 'w-3 bg-yellow-400' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* INPUTS OCULTOS PARA AUTOCOMPLETE */}
      {/* ========================================== */}
      <div className="hidden">
        <LocationAutocomplete
          id="origin-input"
          placeholder="Onde você está?"
          onSelect={(address, lat, lng) => {
            setOrigin({ lat, lng, address });
            toast.success('📍 Origem confirmada!');
          }}
        />
        <LocationAutocomplete
          id="destination-input"
          placeholder="Para onde você vai?"
          onSelect={(address, lat, lng) => {
            setDestination({ lat, lng, address });
            toast.success('🎯 Destino confirmado!');
          }}
        />
      </div>
    </div>
  );
};

export default MainScreen;