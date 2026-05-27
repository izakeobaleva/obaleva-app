import { useEffect, useRef, useCallback } from 'react';
import { Map, Crosshair, MapPin, RefreshCw, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

interface MapSectionProps {
  userLocation: { lat: number; lng: number } | null;
  mapsLoaded: boolean;
  mapsTimeout: boolean;
  mapsError?: string | null;
  onGetCurrentLocation: () => void;
  onRetry?: () => void;
}

export function MapSection({ userLocation, mapsLoaded, mapsTimeout, mapsError, onGetCurrentLocation, onRetry }: MapSectionProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout>();
  const userMarkerRef = useRef<any>(null);
  const resizeObserverRef = useRef<ResizeObserver | null>(null);

  const handleResize = useCallback(() => {
    if (mapInstanceRef.current && window.google?.maps?.event) {
      window.google.maps.event.trigger(mapInstanceRef.current, 'resize');
    }
  }, []);

  // Criar mapa quando carregar
  useEffect(() => {
    if (!mapsLoaded || mapsTimeout || mapsError || !mapRef.current || !userLocation || !window.google?.maps) return;

    if (mapInstanceRef.current) {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
      mapInstanceRef.current = null;
    }

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        zoomControlOptions: {
          position: window.google.maps.ControlPosition.RIGHT_BOTTOM,
        },
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        clickableIcons: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapInstanceRef.current = map;

      setTimeout(() => {
        window.google.maps.event.trigger(map, 'resize');
        map.setCenter(userLocation);
      }, 100);

      // Usar AdvancedMarkerElement (novo) se disponível
      try {
        if (window.google.maps.marker?.AdvancedMarkerElement) {
          const { AdvancedMarkerElement } = window.google.maps.marker;
          userMarkerRef.current = new AdvancedMarkerElement({
            position: userLocation,
            map,
            title: 'Sua localização',
          });
        } else {
          userMarkerRef.current = new window.google.maps.Marker({
            position: userLocation,
            map,
            title: 'Sua localização',
            icon: {
              path: window.google.maps.SymbolPath.CIRCLE,
              scale: 10,
              fillColor: '#4285F4',
              fillOpacity: 1,
              strokeColor: '#FFFFFF',
              strokeWeight: 3,
            },
          });
        }
      } catch {
        userMarkerRef.current = new window.google.maps.Marker({
          position: userLocation,
          map,
          title: 'Sua localização',
          icon: {
            path: window.google.maps.SymbolPath.CIRCLE,
            scale: 10,
            fillColor: '#4285F4',
            fillOpacity: 1,
            strokeColor: '#FFFFFF',
            strokeWeight: 3,
          },
        });
      }

      // Círculo pulsante
      let size = 30;
      let growing = true;
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      
      pulseCircleRef.current = new window.google.maps.Circle({
        map,
        center: userLocation,
        radius: size,
        fillColor: '#F4D03F',
        fillOpacity: 0.35,
        strokeColor: '#F4D03F',
        strokeOpacity: 0.9,
        strokeWeight: 2,
      });

      pulseIntervalRef.current = setInterval(() => {
        size += growing ? 2 : -2;
        if (size >= 55) growing = false;
        if (size <= 30) growing = true;
        pulseCircleRef.current?.setRadius(size);
      }, 60);

      if (mapRef.current && window.ResizeObserver) {
        resizeObserverRef.current = new ResizeObserver(() => {
          handleResize();
        });
        resizeObserverRef.current.observe(mapRef.current);
      }
    } catch (err) {
      console.error('Erro ao criar mapa:', err);
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
      if (resizeObserverRef.current) resizeObserverRef.current.disconnect();
    };
  }, [mapsLoaded, mapsTimeout, mapsError, userLocation, handleResize]);

  // Atualizar posição do marcador se userLocation mudar
  useEffect(() => {
    if (!mapInstanceRef.current || !userLocation || mapsTimeout || mapsError) return;
    
    try {
      if (userMarkerRef.current) {
        if (userMarkerRef.current.position !== undefined) {
          userMarkerRef.current.position = { lat: userLocation.lat, lng: userLocation.lng };
        }
      }
      if (pulseCircleRef.current) {
        pulseCircleRef.current.setCenter(userLocation);
      }
      mapInstanceRef.current.panTo(userLocation);
    } catch (err) {
      console.error('Erro ao atualizar posição:', err);
    }
  }, [userLocation, mapsTimeout, mapsError]);

  // ✅ MAPA FUNCIONANDO NORMALMENTE
  if (mapsLoaded && !mapsTimeout && !mapsError && userLocation && window.google?.maps) {
    return (
      <div className="w-full h-full relative" style={{ minHeight: '100%' }}>
        <div 
          ref={mapRef} 
          className="w-full h-full absolute inset-0"
          style={{ minHeight: '300px' }}
        />
        <button
          onClick={onGetCurrentLocation}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1A1528]/90 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#1A1528] transition shadow-lg z-10"
          title="Centralizar na minha localização"
        >
          <Crosshair size={20} className="text-[#F4D03F]" />
        </button>
        <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10 z-10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">Mapa ativo</span>
        </div>
      </div>
    );
  }

  // ✅ FALLBACK VISUAL BONITO - Mapa indisponível
  return (
    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] relative" style={{ minHeight: '300px' }}>
      {/* Grid decorativo de fundo */}
      <div className="absolute inset-0 opacity-10">
        <div className="w-full h-full" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(244, 208, 63, 0.1) 0%, transparent 50%),
                            radial-gradient(circle at 75% 75%, rgba(139, 92, 246, 0.1) 0%, transparent 50%)`,
        }} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center relative z-10 px-6"
      >
        {/* Ícone grande */}
        <div className="w-20 h-20 mx-auto mb-4 bg-red-900/30 rounded-full flex items-center justify-center border border-red-500/30">
          <AlertTriangle size={36} className="text-red-400" />
        </div>

        <h3 className="text-lg font-bold text-white mb-2">
          Mapa indisponível
        </h3>

        <p className="text-sm text-[#A0A0B0] mb-1 max-w-xs mx-auto">
          {mapsError === 'Chave de API não configurada'
            ? 'A chave do Google Maps não foi configurada. Adicione VITE_GOOGLE_MAPS_API_KEY no .env'
            : 'O mapa não pôde ser carregado no momento.'}
        </p>
        <p className="text-xs text-[#A0A0B0]/60 mb-5">
          Você ainda pode digitar os endereços manualmente abaixo
        </p>

        {/* Localização atual (se tiver GPS) */}
        {userLocation && (
          <div className="flex items-center justify-center gap-2 mb-4 bg-[#1A1528]/80 rounded-xl px-4 py-2 border border-white/10 mx-auto max-w-[200px]">
            <MapPin size={14} className="text-green-400" />
            <span className="text-xs text-[#A0A0B0]">
              📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </span>
          </div>
        )}

        {/* Botão Tentar Novamente */}
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-6 py-2.5 rounded-2xl font-medium bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all flex items-center gap-2 mx-auto text-sm"
          >
            <RefreshCw size={16} />
            Tentar Novamente
          </button>
        )}

        {/* Inputs de texto SEMPRE funcionam (independente do mapa) */}
        <div className="mt-4 text-xs text-[#A0A0B0]/40">
          ↓ Digite seu endereço nos campos abaixo ↓
        </div>
      </motion.div>
    </div>
  );
}