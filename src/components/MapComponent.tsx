import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

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
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
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
        () => console.log('Usando localização padrão (São Paulo)')
      );
    }
  }, [map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onPickupLoad = (autocomplete: google.maps.places.Autocomplete) => {
    pickupAutocompleteRef.current = autocomplete;
  };

  const onDropoffLoad = (autocomplete: google.maps.places.Autocomplete) => {
    dropoffAutocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = (type: 'pickup' | 'dropoff') => {
    const autocomplete = type === 'pickup' ? pickupAutocompleteRef.current : dropoffAutocompleteRef.current;
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry && place.geometry.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || place.name || '',
        };
        if (onLocationSelect) onLocationSelect(location);
        if (map) map.panTo({ lat: location.lat, lng: location.lng });
        map?.setZoom(15);
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
            <span className="text-2xl">🗺️</span>
          </div>
          <p className="text-[#F4D03F] text-sm font-medium">Configurar Google Maps</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  if (mapError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-red-500/20 flex items-center justify-center">
            <span className="text-2xl">⚠️</span>
          </div>
          <p className="text-red-400 text-sm font-medium">Erro ao carregar mapa</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Verifique sua chave de API</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={apiKey} 
      libraries={['places']}
      onError={() => setMapError(true)}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        {/* Campos de endereço sobrepostos */}
        <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <Autocomplete onLoad={onPickupLoad} onPlaceChanged={() => onPlaceChanged('pickup')}>
                <input
                  type="text"
                  placeholder="Onde você está?"
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                  onChange={(e) => onPickupChange?.(e.target.value)}
                />
              </Autocomplete>
            </div>
          </div>
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <Autocomplete onLoad={onDropoffLoad} onPlaceChanged={() => onPlaceChanged('dropoff')}>
                <input
                  type="text"
                  placeholder="Para onde vai?"
                  className="flex-1 bg-transparent text-white text-sm outline-none"
                  onChange={(e) => onDropoffChange?.(e.target.value)}
                />
              </Autocomplete>
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
              scaledSize: new google.maps.Size(36, 36),
            }}
          />
          
          {pickupLocation && (
            <Marker
              position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/green-dot.png',
                scaledSize: new google.maps.Size(36, 36),
              }}
            />
          )}
          
          {dropoffLocation && (
            <Marker
              position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
              icon={{
                url: 'https://maps.google.com/mapfiles/ms/icons/red-dot.png',
                scaledSize: new google.maps.Size(36, 36),
              }}
            />
          )}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;