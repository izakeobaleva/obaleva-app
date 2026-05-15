import { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, Marker, Autocomplete, useJsApiLoader, Circle } from '@react-google-maps/api';
import { Loader2, MapPin } from 'lucide-react';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '0.75rem',
};

const darkMapStyles: google.maps.MapTypeStyle[] = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#a0a0b0' }] },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#2a1a3a' }],
  },
  { featureType: 'road', elementType: 'labels.icon', stylers: [{ visibility: 'off' }] },
  { featureType: 'road', elementType: 'labels.text.fill', stylers: [{ color: '#9b59b6' }] },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#1a1528' }],
  },
  { featureType: 'poi', elementType: 'labels.text.fill', stylers: [{ color: '#6b2d8c' }] },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#0f0b1a' }],
  },
  { featureType: 'water', elementType: 'labels.text.fill', stylers: [{ color: '#6b2d8c' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry',
    stylers: [{ color: '#1a1528' }],
  },
  { featureType: 'administrative', elementType: 'labels.text.fill', stylers: [{ color: '#a0a0b0' }] },
  { featureType: 'transit', stylers: [{ visibility: 'off' }] },
];

const defaultCenter = { lat: -23.5505, lng: -46.6333 }; // São Paulo

interface MapComponentProps {
  onOriginChange?: (address: string) => void;
  onDestinationChange?: (address: string) => void;
  height?: string;
}

export default function MapComponent({ onOriginChange, onDestinationChange, height = 'h-56' }: MapComponentProps) {
  const { isLoaded, loadError } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'AIzaSyBXC6y3jWxCFBMeV77L1F0E4fgu_q6QCaM',
    libraries: ['places'],
  });

  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [userLocation, setUserLocation] = useState(defaultCenter);
  const [originPosition, setOriginPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [destinationPosition, setDestinationPosition] = useState<google.maps.LatLngLiteral | null>(null);
  const [originValue, setOriginValue] = useState('');
  const [destinationValue, setDestinationValue] = useState('');
  
  const originAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const destinationAutocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const originInputRef = useRef<HTMLInputElement>(null);
  const destinationInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(loc);
          setOriginPosition(loc);
          setOriginValue(`${loc.lat.toFixed(4)}, ${loc.lng.toFixed(4)}`);
          if (map) map.panTo(loc);
        },
        () => console.warn('Geolocation não disponível'),
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }
  }, [map]);

  const onLoad = useCallback((mapInstance: google.maps.Map) => {
    setMap(mapInstance);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const onOriginAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    originAutocompleteRef.current = autocomplete;
  };

  const onDestinationAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    destinationAutocompleteRef.current = autocomplete;
  };

  const onOriginPlaceChanged = () => {
    if (originAutocompleteRef.current) {
      const place = originAutocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        setOriginPosition({ lat, lng });
        setOriginValue(address);
        map?.panTo({ lat, lng });
        map?.setZoom(15);
        if (onOriginChange) onOriginChange(address);
      }
    }
  };

  const onDestinationPlaceChanged = () => {
    if (destinationAutocompleteRef.current) {
      const place = destinationAutocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        const address = place.formatted_address || place.name || '';
        setDestinationPosition({ lat, lng });
        setDestinationValue(address);
        if (onDestinationChange) onDestinationChange(address);
        
        if (originPosition) {
          const bounds = new google.maps.LatLngBounds();
          bounds.extend(originPosition);
          bounds.extend({ lat, lng });
          map?.fitBounds(bounds);
        } else {
          map?.panTo({ lat, lng });
          map?.setZoom(15);
        }
      }
    }
  };

  if (loadError) {
    return (
      <div className={`${height} w-full bg-gradient-to-br from-[#2a1a3a] to-[#1a1a2e] rounded-xl flex items-center justify-center`}>
        <div className="text-center">
          <MapPin size={28} className="text-[#F4D03F]/50 mx-auto mb-2" />
          <p className="text-white/50 text-xs">Erro ao carregar mapa</p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`${height} w-full bg-gradient-to-br from-[#2a1a3a] to-[#1a1a2e] rounded-xl flex items-center justify-center`}>
        <Loader2 size={28} className="text-[#F4D03F] animate-spin" />
      </div>
    );
  }

  return (
    <div className={`${height} w-full rounded-xl overflow-hidden relative`}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={userLocation}
        zoom={14}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: darkMapStyles,
          disableDefaultUI: true,
          zoomControl: false,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        }}
      >
        {/* Marcador de localização do usuário */}
        {originPosition && (
          <Marker
            position={originPosition}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#22C55E',
              fillOpacity: 0.8,
              strokeColor: '#22C55E',
              strokeWeight: 2,
            }}
            title="Sua localização"
          />
        )}

        {/* Marcador de destino */}
        {destinationPosition && (
          <Marker
            position={destinationPosition}
            icon={{
              path: google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#EF4444',
              fillOpacity: 0.8,
              strokeColor: '#EF4444',
              strokeWeight: 2,
            }}
            title="Destino"
          />
        )}

        {/* Círculo de precisão */}
        {originPosition && (
          <Circle
            center={originPosition}
            radius={50}
            options={{
              fillColor: '#22C55E',
              fillOpacity: 0.08,
              strokeColor: '#22C55E',
              strokeOpacity: 0.2,
              strokeWeight: 1,
            }}
          />
        )}
      </GoogleMap>

      {/* Inputs de autocomplete sobrepostos (mobile) */}
      <div className="absolute top-2 left-2 right-2 z-10 space-y-1.5">
        <Autocomplete
          onLoad={onOriginAutocompleteLoad}
          onPlaceChanged={onOriginPlaceChanged}
        >
          <input
            ref={originInputRef}
            type="text"
            placeholder="Onde você está?"
            value={originValue}
            onChange={(e) => setOriginValue(e.target.value)}
            className="w-full bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#F4D03F]/50"
          />
        </Autocomplete>

        <Autocomplete
          onLoad={onDestinationAutocompleteLoad}
          onPlaceChanged={onDestinationPlaceChanged}
        >
          <input
            ref={destinationInputRef}
            type="text"
            placeholder="Para onde vai?"
            value={destinationValue}
            onChange={(e) => setDestinationValue(e.target.value)}
            className="w-full bg-black/60 backdrop-blur-sm border border-white/20 rounded-lg px-3 py-1.5 text-white text-xs placeholder-white/40 focus:outline-none focus:border-[#F4D03F]/50"
          />
        </Autocomplete>
      </div>

      {/* Indicador de localização */}
      <div className="absolute bottom-2 left-2 z-10 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-full">
        <p className="text-white text-[8px] flex items-center gap-0.5">
          <MapPin size={8} className="text-[#F4D03F]" />
          📍 {userLocation ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` : 'Buscando...'}
        </p>
      </div>
    </div>
  );
}