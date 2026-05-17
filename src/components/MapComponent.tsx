import React, { useEffect, useRef } from 'react';

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
}

const MapComponent: React.FC<MapComponentProps> = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey || !mapRef.current) return;

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.google && mapRef.current) {
        new window.google.maps.Map(mapRef.current, {
          center: { lat: -23.5505, lng: -46.6333 },
          zoom: 14,
          disableDefaultUI: true,
          zoomControl: true,
        });
      }
    };
    document.head.appendChild(script);
  }, []);

  return <div ref={mapRef} className="w-full h-full rounded-xl" />;
};

export default MapComponent;