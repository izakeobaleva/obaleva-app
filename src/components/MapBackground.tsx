"use client";

import { useEffect, useRef } from 'react';

export function MapBackground({ center = { lat: -23.5505, lng: -46.6333 }, zoom = 14 }) {
  const mapRef = useRef<HTMLDivElement>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    const initMap = () => {
      if (!window.google?.maps) return;
      
      const map = new window.google.maps.Map(mapRef.current!, {
        center,
        zoom,
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', stylers: [{ visibility: 'off' }] },
        ],
      });
    };

    if (window.google?.maps) {
      initMap();
      return;
    }

    if (document.querySelector('#gmaps-bg-script')) {
      const check = setInterval(() => {
        if (window.google?.maps) {
          clearInterval(check);
          initMap();
        }
      }, 200);
      return () => clearInterval(check);
    }

    const script = document.createElement('script');
    script.id = 'gmaps-bg-script';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=initMapBg&v=weekly`;
    script.async = true;
    (window as any).initMapBg = initMap;
    document.head.appendChild(script);
  }, [apiKey, center.lat, center.lng, zoom]);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1a0a2e] to-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-3">🗺️</div>
          <p className="text-yellow-400 text-sm">Configure a chave VITE_GOOGLE_MAPS_API_KEY</p>
        </div>
      </div>
    );
  }

  return <div ref={mapRef} className="w-full h-full" />;
}