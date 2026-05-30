"use client";

import { useEffect, useRef, useState } from 'react';

export function MapSection({ onLocationSelect }: { onLocationSelect?: (lat: number, lng: number) => void }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const mapInstanceRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Obter localização
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          if (mapInstanceRef.current) mapInstanceRef.current.setCenter(pos);
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

    if (window.google?.maps?.places) {
      setMapsLoaded(true);
      return;
    }

    if (document.querySelector('#gmaps-script')) {
      const check = setInterval(() => {
        if (window.google?.maps?.places) { clearInterval(check); setMapsLoaded(true); }
      }, 200);
      return () => clearInterval(check);
    }

    const script = document.createElement('script');
    script.id = 'gmaps-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initGmaps`;
    script.async = true;
    script.defer = true;
    (window as any).initGmaps = () => setMapsLoaded(true);
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
      zoomControlOptions: { position: window.google.maps.ControlPosition.RIGHT_BOTTOM },
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });
    mapInstanceRef.current = map;

    // Marcador do usuário com pulsação
    new window.google.maps.Marker({
      position: userLocation,
      map,
      title: 'Você está aqui',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#3B82F6',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
      animation: window.google.maps.Animation.DROP,
    });

    // Círculo pulsante
    let size = 30;
    let growing = true;
    const pulse = new window.google.maps.Circle({
      map,
      center: userLocation,
      radius: size,
      fillColor: '#3B82F6',
      fillOpacity: 0.15,
      strokeColor: '#3B82F6',
      strokeOpacity: 0.5,
      strokeWeight: 2,
    });
    const interval = setInterval(() => {
      if (growing) { size += 2; if (size >= 50) growing = false; }
      else { size -= 2; if (size <= 30) growing = true; }
      pulse.setRadius(size);
    }, 60);

    // Botão centralizar
    const centerBtn = document.createElement('button');
    centerBtn.innerHTML = '📍';
    centerBtn.title = 'Centralizar na minha localização';
    centerBtn.style.cssText = `background:rgba(0,0,0,0.6);backdrop-filter:blur(8px);border:none;border-radius:50%;width:40px;height:40px;font-size:20px;cursor:pointer;box-shadow:0 2px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center;margin-bottom:8px;`;
    centerBtn.onclick = () => {
      navigator.geolocation.getCurrentPosition(
        (pos) => { map.setCenter({ lat: pos.coords.latitude, lng: pos.coords.longitude }); map.setZoom(16); },
        () => {}
      );
    };
    map.controls[window.google.maps.ControlPosition.RIGHT_BOTTOM].push(centerBtn);

    return () => clearInterval(interval);
  }, [mapsLoaded, userLocation]);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3">🗺️</div>
          <p className="text-yellow-400 text-sm font-medium">Configure a chave da API do Google Maps</p>
          <p className="text-gray-500 text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <div ref={mapRef} className="w-full h-full" />
      {/* Overlay suave no topo para contraste */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/40 to-transparent pointer-events-none" />
    </div>
  );
}