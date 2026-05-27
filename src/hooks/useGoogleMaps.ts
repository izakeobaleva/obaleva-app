import { useState, useEffect, useRef, useCallback } from 'react';

export function useGoogleMaps() {
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsTimeout, setMapsTimeout] = useState(false);
  const [mapsError, setMapsError] = useState<string | null>(null);
  const autocompleteService = useRef<any>(null);
  const geocoderService = useRef<any>(null);

  // ✅ Sempre pegar do import.meta.env - NUNCA hardcoded
  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  const handleMapLoadError = useCallback((error?: string) => {
    console.warn('⚠️ Google Maps falhou ao carregar:', error || 'Erro desconhecido');
    setMapsError(error || 'Falha ao carregar mapa');
    setMapsLoaded(true);
    setMapsTimeout(true);
    // Limpar flag para tentar novamente depois
    (window as any).__googleMapsScriptLoaded = false;
  }, []);

  useEffect(() => {
    // Se não tem chave, já falha graciosamente
    if (!apiKey) {
      console.warn('⚠️ Nenhuma chave VITE_GOOGLE_MAPS_API_KEY encontrada no .env');
      handleMapLoadError('Chave de API não configurada');
      return;
    }

    const initServices = () => {
      try {
        if (typeof google === 'undefined' || typeof google.maps === 'undefined') {
          handleMapLoadError('Google Maps API não carregada');
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
          setMapsTimeout(false);
          setMapsError(null);
        } else {
          handleMapLoadError('Biblioteca places não disponível');
        }
      } catch (e: any) {
        if (!e.message?.includes('No Listener')) throw e;
        handleMapLoadError(e.message);
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
      
      script.onerror = (event) => { 
        const errorMsg = (event as any)?.message || 'Erro ao carregar script do Google Maps';
        handleMapLoadError(errorMsg);
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
        if (!mapsLoaded && !mapsError) {
          handleMapLoadError('Tempo esgotado ao carregar mapa');
        }
      }, 12000);
    }

    const timeout = setTimeout(() => {
      if (!mapsLoaded && !mapsError) {
        handleMapLoadError('Tempo esgotado ao carregar mapa');
      }
    }, 12000);

    return () => {
      clearTimeout(timeout);
    };
  }, [apiKey, handleMapLoadError, mapsLoaded, mapsError]);

  const buscarSugestoes = (input: string): Promise<any[]> => {
    return new Promise((resolve) => {
      try {
        if (!autocompleteService.current || input.length < 3) { resolve([]); return; }

        if (window.google?.maps?.places?.AutocompleteSuggestion && 
            !(autocompleteService.current instanceof window.google.maps.places.AutocompleteService)) {
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

  const reverseGeocode = (lat: number, lng: number): Promise<string> => {
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

  const tentarNovamente = useCallback(() => {
    setMapsLoaded(false);
    setMapsTimeout(false);
    setMapsError(null);
    (window as any).__googleMapsScriptLoaded = false;
    // Recarregar a página para limpar qualquer estado residual do Maps
    window.location.reload();
  }, []);

  return {
    mapsLoaded,
    mapsTimeout,
    mapsError,
    autocompleteService,
    geocoderService,
    buscarSugestoes,
    geocodeAddress,
    reverseGeocode,
    tentarNovamente,
  };
}