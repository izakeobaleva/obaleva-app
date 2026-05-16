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
  const [mapStatus, setMapStatus] = useState<'loading' | 'loaded' | 'error'>('loading');
  const [fallbackMode, setFallbackMode] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    // Se não tem API Key, usa fallback imediatamente
    if (!apiKey) {
      setFallbackMode(true);
      setMapStatus('loaded');
      return;
    }

    // Verificar se já existe o script
    if (window.google && window.google.maps) {
      initMap();
      return;
    }

    // Carregar script do Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    
    script.onload = () => {
      initMap();
    };
    
    script.onerror = () => {
      console.error('Erro ao carregar Google Maps');
      setFallbackMode(true);
      setMapStatus('loaded');
    };
    
    document.head.appendChild(script);

    function initMap() {
      if (!mapRef.current) return;
      
      try {
        const map = new google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
          zoomControlOptions: {
            position: google.maps.ControlPosition.RIGHT_BOTTOM,
          },
        });
        
        new google.maps.Marker({
          position: { lat: -23.5505, lng: -46.6333 },
          map: map,
          title: 'Você está aqui',
        });
        
        setMapStatus('loaded');
      } catch (error) {
        console.error('Erro ao inicializar mapa:', error);
        setFallbackMode(true);
        setMapStatus('loaded');
      }
    }
  }, [apiKey]);

  // Fallback: Mapa estático quando API não funciona
  if (fallbackMode) {
    return (
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A1528] to-[#2D2342]">
          {/* Grid decorativo */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 border border-white/20 rounded-full"></div>
            <div className="absolute top-1/3 left-1/2 w-40 h-40 border border-white/20 rounded-full"></div>
            <div className="absolute bottom-1/4 right-1/4 w-28 h-28 border border-white/20 rounded-full"></div>
          </div>
          
          {/* Mensagem */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
              <svg className="w-8 h-8 text-[#F4D03F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            </div>
            <p className="text-[#F4D03F] text-sm font-medium">Mapa será carregado</p>
            <p className="text-[#A0A0B0] text-[10px] mt-1">Configure a chave da API</p>
          </div>
        </div>
      </div>
    );
  }

  if (mapStatus === 'loading') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-white text-xs">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default MapComponent;