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
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
          console.error('Google Maps API não carregada completamente');
          return;
        }
        
        if (window.google?.maps?.places) {
          // Usar AutocompleteSuggestion (novo) se disponível
          if (window.google.maps.places.AutocompleteSuggestion && !autocompleteService.current) {
            autocompleteService.current = new window.google.maps.places.AutocompleteSuggestion();
          } else if (!autocompleteService.current) {
            autocompleteService.current = new window.google.maps.places.AutocompleteService();
          }
          
          if (!geocoderService.current) {
            geocoderService.current = new window.google.maps.Geocoder();
          }
          setMapsLoaded(true);
        }
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
      }
    };

    // Se já carregou, só inicia os serviços
    if (window.google?.maps?.places) {
      initServices();
      return;
    }

    // Flag global para evitar carregar o script mais de uma vez
    if (!(window as any).__googleMapsScriptLoaded) {
      (window as any).__googleMapsScriptLoaded = true;
      
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapsCallback&loading=async`;
      script.async = true;
      script.defer = true;
      
      (window as any).initMapsCallback = initServices;
      
      script.onerror = () => { 
        try {
          (window as any).__googleMapsScriptLoaded = false;
          setMapsLoaded(true); 
          setMapsTimeout(true);
        } catch (e: any) {
          if (!e.message?.includes('No Listener')) throw e;
        }
      };
      
      document.head.appendChild(script);
    } else {
      // Script já foi inserido, aguardar callback
      const checkInterval = setInterval(() => {
        if (window.google?.maps?.places) {
          clearInterval(checkInterval);
          initServices();
        }
      }, 200);
      
      // Timeout de segurança
      setTimeout(() => {
        clearInterval(checkInterval);
        if (!mapsLoaded) {
          setMapsLoaded(true);
          setMapsTimeout(true);
        }
      }, 10000);
    }

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
    };
  }, [apiKey]); // Só executa se apiKey mudar

  const buscarSugestoes = (input: string): Promise<any[]> => {
    return new Promise((resolve) => {
      try {
        if (!autocompleteService.current || input.length < 3) { resolve([]); return; }

        // AutocompleteSuggestion usa API diferente
        if (window.google?.maps?.places?.AutocompleteSuggestion && 
            !(autocompleteService.current instanceof window.google.maps.places.AutocompleteService)) {
          // Nova API: AutocompleteSuggestion
          autocompleteService.current.getPlacePredictions(
            { input, types: ['geocode', 'establishment'], componentRestrictions: { country: 'br' }, language: 'pt-BR' },
            (predictions: any[] | null, status: string) => {
              try {
                if (status === 'OK' && predictions) {
                  resolve(predictions.map((p: any) => ({ 
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
        } else {
          // API antiga: AutocompleteService
          autocompleteService.current.getPlacePredictions(
            { input, types: ['geocode', 'establishment'], componentRestrictions: { country: 'br' }, language: 'pt-BR' },
            (predictions: any[] | null, status: string) => {
              try {
                if (status === 'OK' && predictions) {
                  resolve(predictions.map((p: any) => ({ 
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
        }
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