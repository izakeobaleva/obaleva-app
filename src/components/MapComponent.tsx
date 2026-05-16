import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onPickupChange,
  onDropoffChange,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setError(true);
      setLoading(false);
      return;
    }

    // Verificar se já está carregado
    if (window.google?.maps) {
      initMap();
      return;
    }

    // Carregar script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMapCallback`;
    script.async = true;
    script.defer = true;
    
    window.initMapCallback = () => {
      initMap();
    };
    
    script.onerror = () => {
      setError(true);
      setLoading(false);
    };
    
    document.head.appendChild(script);
    
    return () => {
      delete window.initMapCallback;
    };
  }, [apiKey]);

  const initMap = () => {
    if (!mapRef.current || !window.google?.maps) return;

    const defaultPos = { lat: -23.5505, lng: -46.6333 };

    const map = new google.maps.Map(mapRef.current, {
      center: defaultPos,
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Marcador
    new google.maps.Marker({
      position: defaultPos,
      map: map,
      title: 'Sua localização',
    });

    // Geolocalização
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          map.setCenter(userPos);
          new google.maps.Marker({
            position: userPos,
            map: map,
            title: 'Você está aqui',
          });
        },
        () => console.log('Usando localização padrão')
      );
    }

    setLoading(false);
  };

  if (error || !apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-400 text-sm">⚠️ Configurar Google Maps</p>
          <p className="text-gray-400 text-xs">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-white text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center gap-2 p-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <input
              type="text"
              placeholder="Onde você está?"
              className="flex-1 bg-transparent text-white outline-none text-sm"
              onChange={(e) => onPickupChange?.(e.target.value)}
            />
          </div>
        </div>
        <div className="bg-black/80 backdrop-blur-sm rounded-lg border border-white/20">
          <div className="flex items-center gap-2 p-2">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <input
              type="text"
              placeholder="Para onde vai?"
              className="flex-1 bg-transparent text-white outline-none text-sm"
              onChange={(e) => onDropoffChange?.(e.target.value)}
            />
          </div>
        </div>
      </div>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;