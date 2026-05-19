import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Erro ao obter localização:', error);
          // Localização padrão (São Paulo)
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Carregar Google Maps
  useEffect(() => {
    if (!apiKey) {
      console.error('❌ API Key não encontrada');
      return;
    }

    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

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

  // Criar mapa e adicionar marcador
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    // Criar o mapa centralizado na localização do usuário
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Adicionar marcador (pontinho azul) da localização atual
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Sua localização',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(32, 32),
      },
      animation: window.google.maps.Animation.DROP,
    });

    // Opcional: adicionar círculo de precisão
    new window.google.maps.Circle({
      map: map,
      center: userLocation,
      radius: 50,
      fillColor: '#4285F4',
      fillOpacity: 0.1,
      strokeColor: '#4285F4',
      strokeOpacity: 0.5,
      strokeWeight: 1,
    });

  }, [mapsLoaded, userLocation]);

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