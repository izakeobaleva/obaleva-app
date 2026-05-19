import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const markerRef = useRef<any>(null);
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
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 })
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

  // Criar mapa e marcador animado com pulso
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // Criar marcador personalizado (círculo animado)
    const marker = new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Sua localização',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 12,
        fillColor: '#F4D03F',
        fillOpacity: 1,
        strokeColor: '#1A1528',
        strokeWeight: 2,
      },
      animation: window.google.maps.Animation.DROP,
    });
    markerRef.current = marker;

    // Animação de pulso (círculo que expande e contrai como batimento cardíaco)
    let pulseSize = 12;
    let growing = true;
    const pulseInterval = setInterval(() => {
      if (!markerRef.current) return;
      
      if (growing) {
        pulseSize += 0.8;
        if (pulseSize >= 22) growing = false;
      } else {
        pulseSize -= 0.8;
        if (pulseSize <= 12) growing = true;
      }
      
      markerRef.current.setIcon({
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: pulseSize,
        fillColor: '#F4D03F',
        fillOpacity: 0.9,
        strokeColor: '#F4D03F',
        strokeWeight: 3,
        strokeOpacity: 0.7,
      });
    }, 60);

    // Círculo de precisão (sombra/área) com animação
    const precisionCircle = new window.google.maps.Circle({
      map: map,
      center: userLocation,
      radius: 80,
      fillColor: '#F4D03F',
      fillOpacity: 0.08,
      strokeColor: '#F4D03F',
      strokeOpacity: 0.3,
      strokeWeight: 1,
    });

    // Animação do círculo de precisão (pulsa também)
    let circleRadius = 80;
    let circleGrowing = true;
    const circleInterval = setInterval(() => {
      if (circleGrowing) {
        circleRadius += 2;
        if (circleRadius >= 120) circleGrowing = false;
      } else {
        circleRadius -= 2;
        if (circleRadius <= 80) circleGrowing = true;
      }
      precisionCircle.setRadius(circleRadius);
    }, 100);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(circleInterval);
    };
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