import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const pulseCircleRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Buscar endereço a partir das coordenadas (geocodificação reversa)
  const buscarEnderecoPorCoordenadas = async (lat: number, lng: number) => {
    try {
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          const endereco = results[0].formatted_address;
          // Disparar evento customizado para o HomeScreen ouvir
          window.dispatchEvent(new CustomEvent('enderecoAtualizado', { detail: { endereco } }));
        }
      });
    } catch (err) {
      console.error('Erro ao buscar endereço:', err);
    }
  };

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          if (window.google && window.google.maps) {
            buscarEnderecoPorCoordenadas(pos.lat, pos.lng);
          }
        },
        () => {
          const defaultPos = { lat: -23.5505, lng: -46.6333 };
          setUserLocation(defaultPos);
        }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Carregar Google Maps
  useEffect(() => {
    if (!apiKey) return;
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    (window as any).initMap = () => setMapsLoaded(true);
    document.head.appendChild(script);
  }, [apiKey]);

  // Criar mapa e marcador
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // MARCADOR GOTINHA PADRÃO DO GOOGLE MAPS
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

    // CÍRCULO PULSANTE (ONDA SONORA) - expande e contrai como coração
    let pulseSize = 30;
    let growing = true;
    
    const circle = new window.google.maps.Circle({
      map: map,
      center: userLocation,
      radius: pulseSize,
      fillColor: '#F4D03F',
      fillOpacity: 0.2,
      strokeColor: '#F4D03F',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });

    // Animação de pulso
    const pulseInterval = setInterval(() => {
      if (growing) {
        pulseSize += 3;
        if (pulseSize >= 60) growing = false;
      } else {
        pulseSize -= 3;
        if (pulseSize <= 30) growing = true;
      }
      circle.setRadius(pulseSize);
      circle.setOptions({
        fillOpacity: 0.3 - (pulseSize / 200),
        strokeOpacity: 0.9 - (pulseSize / 100),
      });
    }, 80);

    pulseCircleRef.current = circle;

    return () => clearInterval(pulseInterval);
  }, [mapsLoaded, userLocation]);

  // Buscar endereço quando o mapa carregar
  useEffect(() => {
    if (mapsLoaded && userLocation) {
      buscarEnderecoPorCoordenadas(userLocation.lat, userLocation.lng);
    }
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