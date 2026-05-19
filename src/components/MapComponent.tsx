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

  // Criar mapa
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    // Criar mapa com zoom transparente e sem botões extras
    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 16,
      disableDefaultUI: true,
      zoomControl: true,
      zoomControlOptions: {
        position: google.maps.ControlPosition.RIGHT_BOTTOM,
      },
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    // ESTILIZAR O CONTROLE DE ZOOM (fundo transparente)
    setTimeout(() => {
      const zoomControls = document.querySelectorAll('.gm-control-active');
      zoomControls.forEach((control) => {
        (control as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.3)';
        (control as HTMLElement).style.backdropFilter = 'blur(4px)';
        (control as HTMLElement).style.borderRadius = '8px';
        (control as HTMLElement).style.margin = '2px 0';
      });
    }, 100);

    // Marcador gotinha azul
    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Sua localização',
      icon: {
        url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
        scaledSize: new window.google.maps.Size(40, 40),
      },
      animation: window.google.maps.Animation.DROP,
    });

    // Círculo pulsante
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
      strokeWeight: 2,
    });

    const pulseInterval = setInterval(() => {
      if (growing) {
        pulseSize += 2;
        if (pulseSize >= 55) growing = false;
      } else {
        pulseSize -= 2;
        if (pulseSize <= 35) growing = true;
      }
      pulseCircle.setRadius(pulseSize);
    }, 60);

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