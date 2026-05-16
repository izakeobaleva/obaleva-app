import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, Autocomplete } from '@react-google-maps/api';

const containerStyle = { width: '100%', height: '100%' };
const defaultCenter = { lat: -23.5505, lng: -46.6333 };

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
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const pos = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(pos);
          if (map) map.panTo(pos);
        },
        () => console.log('Usando localização padrão')
      );
    }
  }, [map]);

  const onLoad = useCallback((map: google.maps.Map) => setMap(map), []);
  const onUnmount = useCallback(() => setMap(null), []);

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
      if (place.geometry?.location) {
        const location = {
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
          address: place.formatted_address || place.name || '',
        };
        if (onLocationSelect) onLocationSelect(location);
        if (map) map.panTo({ lat: location.lat, lng: location.lng });
      }
    }
  };

  if (!apiKey) {
    return (
      <div className="w-full h-full bg-[#1A1528] rounded-xl flex items-center justify-center">
        <div className="text-center p-4">
          <p className="text-yellow-400 text-sm">⚠️ API Key não configurada</p>
          <p className="text-gray-400 text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-green-500 shadow-lg shadow-green-500/30" />
              <Autocomplete onLoad={onPickupLoad} onPlaceChanged={() => onPlaceChanged('pickup')}>
                <input
                  type="text"
                  placeholder="Onde você está?"
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
                  onChange={(e) => onPickupChange?.(e.target.value)}
                />
              </Autocomplete>
            </div>
          </div>
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
            <div className="flex items-center gap-2 p-2">
              <div className="w-2 h-2 rounded-full bg-red-500 shadow-lg shadow-red-500/30" />
              <Autocomplete onLoad={onDropoffLoad} onPlaceChanged={() => onPlaceChanged('dropoff')}>
                <input
                  type="text"
                  placeholder="Para onde vai?"
                  className="flex-1 bg-transparent text-white text-sm outline-none placeholder-gray-400"
                  onChange={(e) => onDropoffChange?.(e.target.value)}
                />
              </Autocomplete>
            </div>
          </div>
        </div>

        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={15}
          onLoad={onLoad}
          onUnmount={onUnmount}
          options={{ disableDefaultUI: true, zoomControl: true }}
        >
          <Marker position={userLocation} />
          {pickupLocation && <Marker position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }} />}
          {dropoffLocation && <Marker position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }} />}
        </GoogleMap>
      </div>
    </LoadScript>
  );
};

export default MapComponent;