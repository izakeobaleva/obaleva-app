import { useState, useEffect, useRef } from 'react';

export function useGoogleMaps() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsTimeout, setMapsTimeout] = useState(false);
  const autocompleteService = useRef<any>(null);
  const geocoderService = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey) {
      setMapsLoaded(true);
      setMapsTimeout(true);
      return;
    }

    const initServices = () => {
      try {
        // Usar AutocompleteSuggestion (novo) se disponível, senão fallback para o antigo
        if (window.google?.maps?.places) {
          if (window.google.maps.places.AutocompleteSuggestion) {
            autocompleteService.current = new window.google.maps.places.AutocompleteSuggestion();
          } else {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
          }
          geocoderService.current = new window.google.maps.Geocoder();
          setMapsLoaded(true);
        }
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
      }
    };

    if (window.google?.maps?.places) {
      initServices();
      return;
    }

    const script = document.createElement('script');
    // Adicionar loading=async para melhor performance
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapsCallback&loading=async`;
    script.async = true;
    script.defer = true;
    
    (window as any).initMapsCallback = initServices;
    
    script.onerror = () => { 
      try {
        setMapsLoaded(true); 
        setMapsTimeout(true);
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
      }
    };
    
    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      try {
        if (!mapsLoaded) { 
          setMapsLoaded(true); 
          setMapsTimeout(true); 
        }
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      delete (window as any).initMapsCallback;
    };
  }, [apiKey]);

  const buscarSugestoes = (input: string): Promise<any[]> => {
    return new Promise((resolve) => {
      try {
        if (!autocompleteService.current || input.length < 3) { resolve([]); return; }

        autocompleteService.current.getPlacePredictions(
          { input, types: ['geocode', 'establishment'], componentRestrictions: { country: 'br' }, language: 'pt-BR' },
          (predictions: any[] | null, status: string) => {
            try {
              if (status === 'OK' && predictions) {
                resolve(predictions.map(p => ({ 
                  place_id: p.place_id, 
                  description: p.description 
                })));
              } else {
                resolve([]);
              }
            } catch (e: any) {
              if (!e.message?.includes('No Listener')) throw e;
            }
          }
        );
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
        resolve([]);
      }
    });
  };

  const geocodeAddress = (address: string): Promise<{ lat: number; lng: number; address: string } | null> => {
    return new Promise((resolve) => {
      try {
        if (!geocoderService.current) { resolve(null); return; }
        
        geocoderService.current.geocode(
          { address, language: 'pt-BR' },
          (results: any, status: string) => {
            try {
              if (status === 'OK' && results?.[0]) {
                const loc = results[0].geometry.location;
                resolve({ 
                  lat: loc.lat(), 
                  lng: loc.lng(), 
                  address: results[0].formatted_address 
                });
              } else {
                resolve(null);
              }
            } catch (e: any) {
              if (!e.message?.includes('No Listener')) throw e;
            }
          }
        );
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
        resolve(null);
      }
    });
  };

  const reverseGeocode = async (lat: number, lng: number): Promise<string> => {
    return new Promise((resolve) => {
      try {
        if (!geocoderService.current) { 
          resolve(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`); 
          return; 
        }
        
        geocoderService.current.geocode(
          { location: { lat, lng }, language: 'pt-BR' },
          (results: any, status: string) => {
            try {
              if (status === 'OK' && results?.[0]) {
                resolve(results[0].formatted_address);
              } else {
                resolve(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
              }
            } catch (e: any) {
              if (!e.message?.includes('No Listener')) throw e;
              resolve(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
            }
          }
        );
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
        resolve(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    });
  };

  return {
    mapsLoaded,
    mapsTimeout,
    autocompleteService,
    geocoderService,
    buscarSugestoes,
    geocodeAddress,
    reverseGeocode,
  };
}