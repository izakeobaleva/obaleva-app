import React, { useEffect, useRef, useState } from 'react';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';

const libraries: ("places")[] = ["places"];

const containerStyle = {
  width: '100%',
  height: '100%',
};

const defaultCenter = {
  lat: -23.5505,
  lng: -46.6333,
};

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  pickupLocation?: { lat: number; lng: number; address: string } | null;
  dropoffLocation?: { lat: number; lng: number; address: string } | null;
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = ({
  onLocationSelect,
  pickupLocation,
  dropoffLocation,
  onPickupChange,
  onDropoffChange,
}) => {
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [mapError, setMapError] = useState(false);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(pos);
          if (map) map.panTo(pos);
        },
        () => console.log('Usando localização padrão')
      );
    }
  }, [map]);

  const onLoad = React.useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = React.useCallback(() => {
    setMap(null);
  }, []);

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-400 text-sm">&#9888;&#65039; Configurar Google Maps</p>
          <p className="text-gray-400 text-xs">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      libraries={libraries}
      onError={() => setMapError(true)}
    >
      {!mapError ? (
        <div className="relative w-full h-full rounded-xl overflow-hidden">
          {/* Campos de endereço */}
          <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 p-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <input
                  type="text"
                  placeholder="Onde você está?"
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                  onChange={(e) => onPickupChange?.(e.target.value)}
                />
              </div>
            </div>
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 p-2">
                <div className="w-2 h-2 rounded-full bg-red-500" />
                <input
                  type="text"
                  placeholder="Para onde vai?"
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                  onChange={(e) => onDropoffChange?.(e.target.value)}
                />
              </div>
            </div>
          </div>

          <GoogleMap
            mapContainerStyle={containerStyle}
            center={userLocation}
            zoom={14}
            onLoad={onLoad}
            onUnmount={onUnmount}
            options={{
              styles: [
                {
                  featureType: 'poi',
                  stylers: [{ visibility: 'off' }],
                },
              ],
              disableDefaultUI: true,
              zoomControl: true,
              zoomControlOptions: {
                position: google.maps.ControlPosition.RIGHT_BOTTOM,
              },
            }}
          >
            <Marker
              position={userLocation}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
            {pickupLocation && (
              <Marker
                position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: new google.maps.Size(32, 32),
                }}
              />
            )}
            {dropoffLocation && (
              <Marker
                position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
                icon={{
                  url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new google.maps.Size(32, 32),
                }}
              />
            )}
          </GoogleMap>
        </div>
      ) : (
        <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
          <div className="text-center p-4">
            <p className="text-red-400 text-sm">&#10060; Erro ao carregar mapa</p>
            <p className="text-gray-400 text-xs">Verifique sua chave de API</p>
          </div>
        </div>
      )}
    </LoadScript>
  );
};

export default MapComponent;