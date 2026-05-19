import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const pulseCircleRef = useRef<any>(null);
  const rippleCircleRef = useRef<any>(null);
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
        () => {
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
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

  // Criar mapa e marcador com ondas mais visíveis
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
    });

    // MARCADOR GOTINHA AZUL
    const marker = new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Sua localização',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
      },
      animation: window.google.maps.Animation.DROP,
    });

    // ============================================
    // ONDA 1: CÍRCULO PULSANTE (bate como coração)
    // ============================================
    let pulseSize = 35;
    let growing = true;
    
    const pulseCircle = new window.google.maps.Circle({
      map: map,
      center: userLocation,
      radius: pulseSize,
      fillColor: '#F4D03F',
      fillOpacity: 0.35,
      strokeColor: '#F4D03F',
      strokeOpacity: 0.9,
      strokeWeight: 3,
    });
    pulseCircleRef.current = pulseCircle;

    // ============================================
    // ONDA 2: CÍRCULO DE ONDA EXPANSIVA (maior)
    // ============================================
    let rippleSize = 50;
    let rippleGrowing = true;
    
    const rippleCircle = new window.google.maps.Circle({
      map: map,
      center: userLocation,
      radius: rippleSize,
      fillColor: '#F4D03F',
      fillOpacity: 0.15,
      strokeColor: '#FFD966',
      strokeOpacity: 0.8,
      strokeWeight: 2,
    });
    rippleCircleRef.current = rippleCircle;

    // ANIMAÇÃO DO PULSO
    const pulseInterval = setInterval(() => {
      if (growing) {
        pulseSize += 2;
        if (pulseSize >= 55) growing = false;
      } else {
        pulseSize -= 2;
        if (pulseSize <= 35) growing = true;
      }
      pulseCircle.setRadius(pulseSize);
      const opacity = 0.35 - (pulseSize / 200);
      pulseCircle.setOptions({
        fillOpacity: Math.max(0.15, opacity),
        strokeOpacity: 0.7 + (pulseSize / 100),
      });
    }, 60);

    // ANIMAÇÃO DA ONDA EXPANSIVA
    const rippleInterval = setInterval(() => {
      if (rippleGrowing) {
        rippleSize += 4;
        if (rippleSize >= 100) {
          rippleGrowing = false;
        }
      } else {
        rippleSize -= 4;
        if (rippleSize <= 50) {
          rippleGrowing = true;
        }
      }
      rippleCircle.setRadius(rippleSize);
      const opacity = 0.2 - (rippleSize / 200);
      rippleCircle.setOptions({
        fillOpacity: Math.max(0.05, opacity),
        strokeOpacity: 0.6 - (rippleSize / 200),
      });
    }, 80);

    return () => {
      clearInterval(pulseInterval);
      clearInterval(rippleInterval);
    };
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