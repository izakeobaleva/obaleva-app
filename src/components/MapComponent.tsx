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
  const pickupAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const dropoffAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);

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
        () => console.error('Erro ao obter localização')
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
      }
    }
  };

  const handleScriptLoad = () => {
    setIsScriptLoaded(true);
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      libraries={['places']}
      onLoad={handleScriptLoad}
    >
      {isScriptLoaded && (
        <div className="relative w-full h-[400px] rounded-xl overflow-hidden">
          <div className="absolute top-3 left-3 right-3 z-10 space-y-2">
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-lg border border-white/10 overflow-hidden">
              <div className="flex items-center gap-2 p-2">
                <div className="w-2 h-2 rounded-full bg-green-500" />
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
            zoom={15}
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
            }}
          >
            <Marker
              position={userLocation}
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
                scaledSize: new google.maps.Size(32, 32),
              }}
            />
            {pickupLocation && (
              <Marker
                position={{ lat: pickupLocation.lat, lng: pickupLocation.lng }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                  scaledSize: new google.maps.Size(32, 32),
                }}
              />
            )}
            {dropoffLocation && (
              <Marker
                position={{ lat: dropoffLocation.lat, lng: dropoffLocation.lng }}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  scaledSize: new google.maps.Size(32, 32),
                }}
              />
            )}
          </GoogleMap>

          <div className="absolute bottom-3 left-3 right-3 z-10">
            <button className="btn-amarelo w-full py-2 rounded-lg font-bold text-sm">
              Solicitar ObaLeva
            </button>
          </div>
        </div>
      )}
    </LoadScript>
  );
};

export default MapComponent;