import React, { useEffect, useRef, useState } from 'react';
import { Map, AlertTriangle, Crosshair, RefreshCw, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const MapSection: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const pulseCircleRef = useRef<any>(null);
  const pulseIntervalRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 }),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Carregar Google Maps
  useEffect(() => {
    if (!apiKey) {
      setMapsLoaded(true);
      setMapsError('Chave do Google Maps não configurada');
      return;
    }

    if (window.google?.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapSection`;
    script.async = true;
    script.defer = true;
    (window as any).initMapSection = () => setMapsLoaded(true);
    script.onerror = () => {
      setMapsLoaded(true);
      setMapsError('Erro ao carregar Google Maps');
    };
    document.head.appendChild(script);

    return () => {
      delete (window as any).initMapSection;
    };
  }, [apiKey]);

  // Inicializar mapa
  useEffect(() => {
    if (!mapsLoaded || mapsError || !mapRef.current || !userLocation) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapInstanceRef.current = map;

      // Marcador azul
      new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Você está aqui',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });

      // Círculo pulsante
      let size = 30;
      let growing = true;
      const pulseCircle = new window.google.maps.Circle({
        map,
        center: userLocation,
        radius: size,
        fillColor: '#F4D03F',
        fillOpacity: 0.35,
        strokeColor: '#F4D03F',
        strokeOpacity: 0.9,
        strokeWeight: 2,
      });
      pulseCircleRef.current = pulseCircle;

      pulseIntervalRef.current = setInterval(() => {
        size += growing ? 2 : -2;
        if (size >= 55) growing = false;
        if (size <= 30) growing = true;
        pulseCircle.setRadius(size);
      }, 60);

    } catch (err) {
      console.error('Erro ao criar mapa:', err);
      setMapsError('Falha ao inicializar mapa');
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [mapsLoaded, mapsError, userLocation]);

  const handleRetry = () => {
    window.location.reload();
  };

  // ✅ Mapa funcionando
  if (mapsLoaded && !mapsError && userLocation) {
    return (
      <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full absolute inset-0" />
        <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1.5 border border-white/10 z-10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">📍 Transporte ao vivo</span>
          </div>
        </div>
      </div>
    );
  }

  // ✅ Fallback visual bonito
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] relative">
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(244, 208, 63, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        }} />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 px-6"
      >
        <div className="w-20 h-20 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30">
          <AlertTriangle size={36} className="text-red-400" />
        </div>
        <h3 className="text-lg font-bold text-white mb-2">Mapa indisponível</h3>
        <p className="text-sm text-[#A0A0B0] mb-1 max-w-xs mx-auto">
          {mapsError || 'O mapa não pôde ser carregado no momento.'}
        </p>
        <p className="text-xs text-[#A0A0B0]/60 mb-5">
          Digite os endereços manualmente abaixo
        </p>
        {userLocation && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-[#1A1528]/80 rounded-xl px-4 py-2 border border-white/10 mx-auto max-w-[200px]">
            <MapPin size={14} className="text-green-400" />
            <span className="text-xs text-[#A0A0B0]">
              📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        )}
        <button
          onClick={handleRetry}
          className="px-6 py-2.5 rounded-2xl font-medium bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center gap-2 mx-auto text-sm"
        >
          <RefreshCw size={16} />
          Tentar Novamente
        </button>
      </motion.div>
    </div>
  );
};

export default MapSection;