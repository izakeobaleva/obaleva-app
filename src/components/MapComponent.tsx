import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      console.error('❌ API Key não encontrada');
      return;
    }

    // Verificar se já está carregado
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    // Carregar o script com Places API e callback
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;

    (window as any).initMap = () => {
      setMapsLoaded(true);
    };

    script.onerror = () => {
      console.error('❌ Erro ao carregar Google Maps');
    };

    document.head.appendChild(script);
  }, [apiKey]);

  useEffect(() => {
    if (!mapsLoaded || !mapRef.current) return;

    // Criar o mapa
    new window.google.maps.Map(mapRef.current, {
      center: { lat: -23.5505, lng: -46.6333 },
      zoom: 14,
      disableDefaultUI: true,
      zoomControl: true,
    });
  }, [mapsLoaded]);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-yellow-900/20 border border-yellow-500/30 flex items-center justify-center mb-3">
            <span className="text-3xl">🗺️</span>
          </div>
          <p className="text-yellow-400 text-sm font-medium">Chave da API não encontrada</p>
          <p className="text-gray-500 text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;