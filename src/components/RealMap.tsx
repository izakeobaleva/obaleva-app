import React, { useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

interface RealMapProps {
  center?: { lat: number; lng: number };
  zoom?: number;
  onLoad?: (map: google.maps.Map) => void;
  showUserLocation?: boolean;
}

const RealMap: React.FC<RealMapProps> = ({ 
  center = defaultCenter, 
  zoom = 14,
  onLoad,
  showUserLocation = false
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  const mapRef = useRef<google.maps.Map | null>(null);
  const circleRef = useRef<google.maps.Circle | null>(null);

  const handleMapLoad = (map: google.maps.Map) => {
    mapRef.current = map;
    if (onLoad) onLoad(map);
  };

  // Adicionar círculo pulsante na localização atual
  useEffect(() => {
    if (isLoaded && mapRef.current && showUserLocation && center !== defaultCenter) {
      // Remove círculo anterior se existir
      if (circleRef.current) {
        circleRef.current.setMap(null);
      }

      // Cria círculo pulsante amarelo translúcido
      const circle = new google.maps.Circle({
        map: mapRef.current,
        center: center,
        radius: 50,
        fillColor: '#facc15',
        fillOpacity: 0.2,
        strokeColor: '#facc15',
        strokeOpacity: 0.5,
        strokeWeight: 2,
      });
      
      circleRef.current = circle;

      // Animação de pulso (aumenta e diminui o raio)
      let growing = true;
      const interval = setInterval(() => {
        if (circleRef.current) {
          const currentRadius = circleRef.current.getRadius();
          if (growing) {
            if (currentRadius < 100) {
              circleRef.current.setRadius(currentRadius + 2);
            } else {
              growing = false;
            }
          } else {
            if (currentRadius > 50) {
              circleRef.current.setRadius(currentRadius - 2);
            } else {
              growing = true;
            }
          }
        }
      }, 50);

      return () => {
        clearInterval(interval);
        if (circleRef.current) circleRef.current.setMap(null);
      };
    }
  }, [isLoaded, showUserLocation, center]);

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-4xl mb-2">⚠️</div>
          <p className="text-gray-400 text-sm">Erro ao carregar o mapa</p>
          <p className="text-gray-500 text-xs mt-1">Verifique a chave da API</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400 text-sm">Carregando mapa...</p>
        </div>
      </div>
    );
  }

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={zoom}
      options={{
        disableDefaultUI: true,
        zoomControl: false,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
      onLoad={handleMapLoad}
    />
  );
};

export default RealMap;