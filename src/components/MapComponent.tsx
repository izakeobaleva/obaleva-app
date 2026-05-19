import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      console.error('❌ API Key não encontrada');
      setMapError(true);
      setLoading(false);
      return;
    }

    // Verificar se o mapa já foi carregado
    if (mapRef.current && (window as any).google) {
      try {
        new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
        });
        setLoading(false);
        return;
      } catch (err) {
        console.error('Erro ao criar mapa:', err);
      }
    }

    // Carregar o script do Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      console.error('❌ Erro ao carregar Google Maps');
      setMapError(true);
      setLoading(false);
    };

    script.onload = () => {
      if (mapRef.current && (window as any).google) {
        try {
          new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: -23.5505, lng: -46.6333 },
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
          });
          setLoading(false);
        } catch (err) {
          console.error('Erro ao criar mapa:', err);
          setMapError(true);
          setLoading(false);
        }
      }
    };

    document.head.appendChild(script);

    return () => {
      // Limpeza
      const scriptElement = document.querySelector('script[src*="maps.googleapis.com"]');
      if (scriptElement) scriptElement.remove();
    };
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-red-500/20 flex items-center justify-center mb-3">
            <span className="text-2xl">🗺️</span>
          </div>
          <p className="text-red-400 text-sm font-medium">Erro ao carregar o mapa</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Verifique sua conexão com a internet</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
          <p className="text-white text-sm">Carregando mapa...</p>
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