import React from 'react';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

// ============================================
// COMPONENTE MAP BACKGROUND - OBALEVÁ
// ============================================
// EXPORTAÇÃO COM NOME (NAMED EXPORT)
// Isso resolve o erro do import { MapBackground }
// ============================================

const mapContainerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333, // São Paulo
};

interface MapBackgroundProps {
  center?: { lat: number; lng: number };
  zoom?: number;
}

export const MapBackground: React.FC<MapBackgroundProps> = ({ 
  center = defaultCenter, 
  zoom = 14 
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '',
  });

  if (loadError) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <p className="text-red-400">Erro ao carregar o mapa</p>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-yellow-400 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-gray-400">Carregando mapa...</p>
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
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      }}
    />
  );
};

// Também exporta como default para compatibilidade
export default MapBackground;