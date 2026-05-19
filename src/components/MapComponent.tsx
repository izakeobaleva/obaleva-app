import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const pulseCircleRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Buscar endereço a partir das coordenadas
  const buscarEnderecoPorCoordenadas = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      if (!window.google) {
        resolve('Carregando mapa...');
        return;
      }
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === 'OK' && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve('Endereço não encontrado');
        }
      });
    });
  };

  // Obter localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          // Salvar no localStorage para uso no HomeScreen
          const endereco = await buscarEnderecoPorCoordenadas(pos.lat, pos.lng);
          localStorage.setItem('user_address', endereco);
        },
        () => {
          const defaultPos = { lat: -23.5505, lng: -46.6333 };
          setUserLocation(defaultPos);
          localStorage.setItem('user_address', 'São Paulo, SP');
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

  // Criar mapa com marcador e círculo pulsante
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Marcador gotinha padrão
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

    // Círculo pulsante (onda sonora)
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

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center"><p className="text-yellow-400">⚠️ Configurar API Key</p></div>
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