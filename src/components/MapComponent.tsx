import React, { useEffect, useRef, useState, useCallback } from 'react';

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  pickupLocation?: { lat: number; lng: number; address: string } | null;
  dropoffLocation?: { lat: number; lng: number; address: string } | null;
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onPickupChange,
  onDropoffChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [mapError, setMapError] = useState(false);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Carregar o script do Google Maps apenas uma vez
  useEffect(() => {
    if (!apiKey) {
      setMapError(true);
      return;
    }

    // Verificar se já está carregado
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Verificar se o script já foi adicionado
    if (document.querySelector('#google-maps-script')) {
      const checkInterval = setInterval(() => {
        if (window.google && window.google.maps) {
          clearInterval(checkInterval);
          setMapLoaded(true);
        }
      }, 100);
      return () => clearInterval(checkInterval);
    }

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      setMapLoaded(true);
    };
    
    script.onerror = () => {
      setMapError(true);
    };
    
    document.head.appendChild(script);

    return () => {
      // Não remover o script
    };
  }, [apiKey]);

  // Inicializar o mapa
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google || !window.google.maps) return;

    const defaultPos = { lat: -23.5505, lng: -46.6333 };

    const map = new google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      styles: [
        {
          featureType: 'poi',
          stylers: [{ visibility: 'off' }],
        },
      ],
    });

    mapInstanceRef.current = map;

    // Tentar obter localização do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userPos);
          
          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new google.maps.Marker({
            position: userPos,
            map: map,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            },
          });
        },
        () => {
          markerRef.current = new google.maps.Marker({
            position: defaultPos,
            map: map,
            icon: {
              url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              scaledSize: new google.maps.Size(32, 32),
            },
          });
        }
      );
    }
  }, []);

  // Inicializar quando o mapa estiver carregado
  useEffect(() => {
    if (!mapLoaded) return;

    const timer = setTimeout(() => {
      initMap();
    }, 100);

    return () => clearTimeout(timer);
  }, [mapLoaded, initMap]);

  if (mapError || !apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
            <span className="text-3xl">🗺️</span>
          </div>
          <p className="text-[#F4D03F] text-sm font-medium">Configurar Google Maps</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  if (!mapLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-white text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      {/* Campos de endereço */}
      <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
        <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 p-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <input
              type="text"
              placeholder="Onde você está?"
              className="flex-1 bg-transparent text-white text-sm outline-none"
              onChange={(e) => onPickupChange?.(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
          <div className="flex items-center gap-2 p-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <input
              type="text"
              placeholder="Para onde vai?"
              className="flex-1 bg-transparent text-white text-sm outline-none"
              onChange={(e) => onDropoffChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Container do Mapa */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;