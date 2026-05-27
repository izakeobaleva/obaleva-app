import { useState, useEffect } from 'react';

export function useGeolocation() {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
      setLocationError('Geolocalização não suportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationError(null);
      },
      (error) => {
        setUserLocation({ lat: -23.5505, lng: -46.6333 });
        let msg = 'Erro ao obter localização';
        if (error.code === error.PERMISSION_DENIED) msg = 'Permissão negada';
        else if (error.code === error.POSITION_UNAVAILABLE) msg = 'GPS indisponível';
        else if (error.code === error.TIMEOUT) msg = 'Tempo esgotado';
        setLocationError(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  }, []);

  const getCurrentLocation = (): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      if (!navigator.geolocation) { resolve(null); return; }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          resolve(loc);
        },
        () => resolve(null),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    });
  };

  return { userLocation, locationError, getCurrentLocation };
}