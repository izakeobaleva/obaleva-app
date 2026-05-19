import React, { useEffect, useRef, useState } from 'react';

const MapComponent: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

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
          if (mapInstanceRef.current) {
            mapInstanceRef.current.setCenter(pos);
          }
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

    mapInstanceRef.current = map;

    setTimeout(() => {
      const zoomControls = document.querySelectorAll('.gm-control-active');
      zoomControls.forEach((control) => {
        (control as HTMLElement).style.backgroundColor = 'rgba(0,0,0,0.3)';
        (control as HTMLElement).style.backdropFilter = 'blur(4px)';
        (control as HTMLElement).style.borderRadius = '8px';
        (control as HTMLElement).style.margin = '2px 0';
      });
    }, 100);

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

    // Botão de centralização de localização
    const locationButton = document.createElement('button');
    locationButton.innerHTML = '📍';
    locationButton.title = 'Centralizar na minha localização';
    locationButton.style.cssText = `
      background: rgba(0,0,0,0.5);
      backdrop-filter: blur(4px);
      border: none;
      border-radius: 50%;
      width: 40px;
      height: 40px;
      font-size: 20px;
      cursor: pointer;
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      transition: all 0.2s ease;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-bottom: 8px;
    `;
    locationButton.onmouseenter = () => {
      locationButton.style.background = 'rgba(0,0,0,0.7)';
      locationButton.style.transform = 'scale(1.05)';
    };
    locationButton.onmouseleave = () => {
      locationButton.style.background = 'rgba(0,0,0,0.5)';
      locationButton.style.transform = 'scale(1)';
    };
    locationButton.onclick = () => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };
            map.setCenter(pos);
            map.setZoom(16);
          },
          () => {
            alert('Não foi possível obter sua localização. Verifique as permissões.');
          }
        );
      } else {
        alert('Seu navegador não suporta geolocalização.');
      }
    };

    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(locationButton);

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