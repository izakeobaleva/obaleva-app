import { useEffect, useRef } from 'react';

interface MapBackgroundProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

export default function MapBackground({ center = { lat: -23.5505, lng: -46.6333 }, zoom = 14 }: MapBackgroundProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapRef.current) return;

    if (window.google?.maps) {
      initializeMap();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapBackground`;
    script.async = true;
    script.defer = true;
    (window as any).initMapBackground = initializeMap;
    document.head.appendChild(script);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const initializeMap = () => {
    if (!mapRef.current || mapInstanceRef.current) return;
    try {
      mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
        center,
        zoom,
        disableDefaultUI: true,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
    } catch (err) {
      console.error('Erro ao criar mapa:', err);
    }
  };

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="text-center">
          <div className="w-full h-full bg-[#0F0B1A]" />
        </div>
      </div>
    );
  }

  return (
    <div 
      ref={mapRef} 
      className="w-full h-full"
      style={{ filter: 'blur(1px) brightness(0.7)' }}
    />
  );
}