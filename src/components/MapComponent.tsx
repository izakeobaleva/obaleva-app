import React, { useEffect, useRef, useState } from 'react';

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  pickupLocation?: { lat: number; lng: number; address: string } | null;
  dropoffLocation?: { lat: number; lng: number; address: string } | null;
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(true);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    // Carregar script do Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && mapRef.current) {
        const map = new window.google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
        });
        
        // Adicionar marcador
        new window.google.maps.Marker({
          position: { lat: -23.5505, lng: -46.6333 },
          map: map,
          title: 'Você está aqui',
        });
        
        setLoading(false);
      }
    };
    document.head.appendChild(script);
  }, [apiKey]);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-400 text-sm">⚠️ Configurar Google Maps</p>
          <p className="text-gray-400 text-xs">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
      {loading && (
        <div className="absolute inset-0 bg-[#1A1528] flex items-center justify-center">
          <div className="text-center">
            <div className="w-8 h-8 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
            <p className="text-white text-xs">Carregando mapa...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;