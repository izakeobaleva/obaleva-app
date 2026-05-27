import { useEffect, useRef } from 'react';
import { Map, Crosshair } from 'lucide-react';

interface MapSectionProps {
  userLocation: { lat: number; lng: number } | null;
  mapsLoaded: boolean;
  mapsTimeout: boolean;
  onGetCurrentLocation: () => void;
}

export function MapSection({ userLocation, mapsLoaded, mapsTimeout, onGetCurrentLocation }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout>();
  const userMarkerRef = useRef<any>(null);

  // Criar mapa quando carregar
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation || !window.google?.maps) return;

    try {
      if (mapInstanceRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapInstanceRef.current = map;

      // Marcador azul do usuário
      userMarkerRef.current = new window.google.maps.Marker({
        position: userLocation,
        map,
        title: 'Sua localização',
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: '#4285F4',
          fillOpacity: 1,
          strokeColor: '#FFFFFF',
          strokeWeight: 3,
        },
      });

      // Círculo pulsante amarelo
      let size = 30;
      let growing = true;
      pulseCircleRef.current = new window.google.maps.Circle({
        map,
        center: userLocation,
        radius: size,
        fillColor: '#F4D03F',
        fillOpacity: 0.35,
        strokeColor: '#F4D03F',
        strokeOpacity: 0.9,
        strokeWeight: 2,
      });

      pulseIntervalRef.current = setInterval(() => {
        size += growing ? 2 : -2;
        if (size >= 55) growing = false;
        if (size <= 30) growing = true;
        pulseCircleRef.current?.setRadius(size);
      }, 60);
    } catch (err) {
      console.error('Erro ao criar mapa:', err);
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [mapsLoaded, userLocation]);

  // Atualizar posição do marcador se userLocation mudar
  useEffect(() => {
    if (!userMarkerRef.current || !pulseCircleRef.current || !userLocation) return;
    userMarkerRef.current.setPosition(userLocation);
    pulseCircleRef.current.setCenter(userLocation);
    
    // Centralizar mapa na nova localização
    if (mapInstanceRef.current) {
      mapInstanceRef.current.panTo(userLocation);
    }
  }, [userLocation]);

  if (mapsLoaded && !mapsTimeout && userLocation && window.google?.maps) {
    return (
      <div className="w-full h-full relative">
        <div ref={mapRef} className="w-full h-full" />
        <button
          onClick={onGetCurrentLocation}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1A1528]/90 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#1A1528] transition shadow-lg z-10"
          title="Centralizar na minha localização"
        >
          <Crosshair size={20} className="text-[#F4D03F]" />
        </button>
      </div>
    );
  }

  // Placeholder quando mapa não está disponível
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <div className="text-center">
        <Map size={48} className="mx-auto mb-2 text-[#F4D03F]/40" />
        <p className="text-sm text-[#A0A0B0]">{mapsTimeout ? 'Mapa indisponível' : 'Carregando mapa...'}</p>
        {userLocation && (
          <p className="text-xs text-[#A0A0B0]/60 mt-1">📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
        )}
        {!mapsLoaded && <p className="text-xs text-yellow-400 mt-2">⚠️ Configure a chave do Google Maps no .env</p>}
      </div>
    </div>
  );
}