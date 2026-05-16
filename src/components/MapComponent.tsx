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
      <div className="w-full h-full bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-xl flex items-center justify-center">
        <div className="text-center">
          <p className="text-yellow-400 text-sm">🗺️ Configurar Google Maps</p>
          <p className="text-gray-400 text-xs mt-1">Adicione VITE_GOOGLE_MAPS_API_KEY no .env</p>
        </div>
      </div>
    );
  }

  return (
    <LoadScript googleMapsApiKey={apiKey} libraries={['places']}>
      <div className="relative w-full h-full rounded-xl overflow-hidden">
        <GoogleMap
          mapContainerStyle={containerStyle}
          center={userLocation}
          zoom={14}
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