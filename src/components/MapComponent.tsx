import React, { useEffect, useRef, useState } from 'react';

declare global {
  interface Window {
    google: any;
    initMap: () => void;
  }
}

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapError, setMapError] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    
    console.log('🔍 Verificando API Key:', apiKey ? '✅ Configurada' : '❌ Não encontrada');

    if (!apiKey) {
      console.error('❌ VITE_GOOGLE_MAPS_API_KEY não está configurada no .env');
      setMapError(true);
      setLoading(false);
      return;
    }

    if (!mapRef.current) {
      console.error('❌ Referência do mapa não encontrada');
      return;
    }

    async function initMap() {
      try {
        if ((window as any).google?.maps) {
          createMap();
          return;
        }

        console.log('📥 Carregando script do Google Maps...');
        
        await new Promise<void>((resolve, reject) => {
          const script = document.createElement('script');
          script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
          script.async = true;
          script.defer = true;
          script.onload = () => {
            console.log('✅ Script Google Maps carregado');
            resolve();
          };
          script.onerror = () => {
            console.error('❌ Erro ao carregar script do Google Maps');
            reject(new Error('Falha ao carregar Google Maps'));
          };
          document.head.appendChild(script);
        });

        createMap();
      } catch (err) {
        console.error('❌ Erro:', err);
        setMapError(true);
        setLoading(false);
      }
    }

    function createMap() {
      if (!mapRef.current || !(window as any).google?.maps) {
        console.error('❌ Google Maps não disponível');
        return;
      }

      try {
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
        });
        
        console.log('✅ Mapa criado com sucesso!');
        setLoading(false);
      } catch (err) {
        console.error('❌ Erro ao criar mapa:', err);
        setMapError(true);
        setLoading(false);
      }
    }

    // Pequeno delay para garantir que o DOM está pronto
    setTimeout(initMap, 100);

    return () => {
      // Cleanup
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
    <div className="w-full h-full rounded-xl overflow-hidden" style={{ minHeight: '200px' }}>
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;