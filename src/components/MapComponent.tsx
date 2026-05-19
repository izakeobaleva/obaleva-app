import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    if (!apiKey) {
      setError('API Key do Google Maps não configurada');
      console.error('❌ VITE_GOOGLE_MAPS_API_KEY não encontrada no .env');
      return;
    }

    if (!mapRef.current) return;

    // Se o Google Maps já estiver carregado, inicializa direto
    if ((window as any).google?.maps) {
      initMap();
      return;
    }

    // Função de callback global
    (window as any).initMap = () => {
      initMap();
    };

    // Carregar script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMap&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onerror = () => {
      setError('Erro ao carregar Google Maps');
      setLoaded(true);
    };
    document.head.appendChild(script);

    function initMap() {
      if (mapRef.current && (window as any).google?.maps) {
        try {
          new (window as any).google.maps.Map(mapRef.current, {
            center: { lat: -23.5505, lng: -46.6333 },
            zoom: 14,
            disableDefaultUI: true,
            zoomControl: true,
            mapTypeId: 'roadmap',
            styles: [
              { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
              { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
              {
                featureType: "administrative.locality",
                elementType: "labels.text.fill",
                stylers: [{ color: "#d59563" }],
              },
              {
                featureType: "road",
                elementType: "geometry",
                stylers: [{ color: "#38414e" }],
              },
              {
                featureType: "road",
                elementType: "geometry.stroke",
                stylers: [{ color: "#212a37" }],
              },
              {
                featureType: "road",
                elementType: "labels.text.fill",
                stylers: [{ color: "#9ca5b3" }],
              },
              {
                featureType: "water",
                elementType: "geometry",
                stylers: [{ color: "#17263c" }],
              },
              {
                featureType: "water",
                elementType: "labels.text.fill",
                stylers: [{ color: "#515c6d" }],
              },
            ],
          });
          setLoaded(true);
          console.log('✅ Google Maps carregado com sucesso!');
        } catch (err) {
          setError('Erro ao inicializar mapa');
          console.error('❌ Erro ao criar mapa:', err);
        }
      }
    }

    return () => {
      delete (window as any).initMap;
    };
  }, []);

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full rounded-xl"
      style={{ minHeight: '200px', background: '#1A1528' }}
    >
      {!loaded && !error && (
        <div className="w-full h-full flex items-center justify-center bg-[#1A1528]">
          <div className="text-center">
            <div className="w-12 h-12 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">🗺️</span>
            </div>
            <p className="text-white text-sm">Carregando mapa...</p>
            <p className="text-[#A0A0B0] text-xs mt-1">Aguarde</p>
          </div>
        </div>
      )}
      {error && (
        <div className="w-full h-full flex items-center justify-center bg-[#1A1528]">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center mx-auto mb-2">
              <span className="text-2xl">⚠️</span>
            </div>
            <p className="text-red-400 text-sm font-bold">Mapa indisponível</p>
            <p className="text-[#A0A0B0] text-xs mt-1">{error}</p>
            <p className="text-[#A0A0B0] text-xs mt-2">
              Configure a chave VITE_GOOGLE_MAPS_API_KEY no arquivo .env
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MapComponent;