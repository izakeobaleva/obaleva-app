import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { supabase } from '../lib/supabaseClient';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { MapPin, Navigation, DollarSign, History, LogOut, Bell, User, Car } from 'lucide-react';
import { toast } from 'sonner';

const requestCache = new Map<string, any>();
async function fetchWithCache(key: string, fetcher: () => Promise<any>, ttl = 30000) {
  const cached = requestCache.get(key);
  if (cached && Date.now() - cached.timestamp < ttl) return cached.data;
  const data = await fetcher();
  requestCache.set(key, { data, timestamp: Date.now() });
  return data;
}

export function PassengerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [solicitando, setSolicitando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => {
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Load Google Maps
  useEffect(() => {
    if (!apiKey) return;
    
    if (window.google && window.google.maps) {
      setMapsLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = true;
    script.defer = true;
    
    (window as any).initMap = () => {
      setMapsLoaded(true);
    };
    
    document.head.appendChild(script);
  }, [apiKey]);

  // Create map
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: userLocation,
      zoom: 15,
      disableDefaultUI: true,
      zoomControl: true,
      streetViewControl: false,
      mapTypeControl: false,
      fullscreenControl: false,
    });

    mapInstanceRef.current = map;

    new window.google.maps.Marker({
      position: userLocation,
      map: map,
      title: 'Sua localização',
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: '#F4D03F',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
      },
    });
  }, [mapsLoaded, userLocation]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    fetchRecentTrips();
    return () => clearTimeout(timer);
  }, []);

  async function fetchRecentTrips() {
    if (!user) return;
    const { data } = await fetchWithCache(
      `trips_${user.id}`,
      () => supabase.from('corridas').select('*').eq('passageiro_id', user.id).order('created_at', { ascending: false }).limit(5).then(r => r),
      60000
    );
    if (data) setRecentTrips(data);
  }

  const precoEstimado = useMemo(
    () => origem || destino ? calcularPrecoCorrida({ distanciaKm: 5.2, tempoMin: 15 }) : null,
    [origem, destino]
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const solicitarCorrida = useCallback(async () => {
    if (!destino) {
      toast.error('Digite o destino');
      return;
    }
    setSolicitando(true);
    
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id,
        origem: origem || 'Local atual',
        destino: destino,
        status: 'pendente',
        valor: precoEstimado || 20,
      });
      
      if (error) throw error;
      toast.success('✅ Corrida solicitada! Aguardando motorista...');
      setOrigem('');
      setDestino('');
      requestCache.delete(`trips_${user?.id}`);
      fetchRecentTrips();
    } catch (err: any) {
      toast.error('Erro ao solicitar: ' + err.message);
    }
    setSolicitando(false);
  }, [destino, origem, precoEstimado, user?.id]);

  const handleOriginSelect = (lat: number, lng: number, address: string) => {
    setOrigem(address);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat, lng });
      mapInstanceRef.current.setZoom(16);
    }
  };

  const handleDestinoSelect = (lat: number, lng: number, address: string) => {
    setDestino(address);
    if (mapInstanceRef.current) {
      mapInstanceRef.current.setCenter({ lat, lng });
      mapInstanceRef.current.setZoom(14);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      <header className="sticky top-0 z-20 bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 flex justify-between items-center px-4 py-3">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="text-xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          ObaLeva
        </motion.h1>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => navigate('/profile')} 
            className="w-9 h-9 rounded-full bg-[#F4D03F]/10 border border-[#F4D03F]/20 flex items-center justify-center"
          >
            <User size={16} className="text-[#F4D03F]" />
          </button>
          <button 
            onClick={handleSignOut} 
            className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center"
          >
            <LogOut size={16} className="text-red-400" />
          </button>
        </div>
      </header>

      <div className="mx-4 mt-4 space-y-4">
        {/* Mapa ao vivo */}
        <div className="bg-[#1A1528] rounded-2xl overflow-hidden border border-white/10 h-56">
          {!apiKey ? (
            <div className="h-full flex items-center justify-center">
              <div className="text-center">
                <MapPin size={32} className="mx-auto mb-2 text-[#A0A0B0]" />
                <p className="text-sm text-[#A0A0B0]">Configure a chave do Google Maps</p>
              </div>
            </div>
          ) : !mapsLoaded ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}

          {/* Status badge */}
          <div className="absolute mt-2 ml-2 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">Online</span>
          </div>
        </div>

        {/* Campos de endereço com Autocomplete */}
        <div className="bg-[#1A1528] rounded-2xl p-4 border border-white/10 space-y-3">
          <LocationAutocomplete
            placeholder="Onde você está?"
            value={origem}
            onChange={setOrigem}
            icon="origin"
            onPlaceSelected={handleOriginSelect}
          />
          <div className="border-l-2 border-dashed border-white/20 ml-3 h-4" />
          <LocationAutocomplete
            placeholder="Para onde vai?"
            value={destino}
            onChange={setDestino}
            icon="destination"
            onPlaceSelected={handleDestinoSelect}
          />

          {/* Preço estimado */}
          {precoEstimado && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }} 
              animate={{ height: 'auto', opacity: 1 }} 
              className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-3 rounded-xl border border-white/10 mt-2"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={20} className="text-[#F4D03F]" />
                  <span className="font-bold text-lg text-white">R$ {precoEstimado.toFixed(2)}</span>
                  <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
                </div>
                <span className="text-xs text-[#A0A0B0]">~15 min</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Botão solicitar */}
        <motion.button 
          whileTap={{ scale: 0.98 }} 
          onClick={solicitarCorrida} 
          disabled={solicitando} 
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {solicitando ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Buscando motorista...
            </span>
          ) : (
            <>
              <Car size={22} />
              Solicitar ObaLeva
            </>
          )}
        </motion.button>

        {/* Últimas corridas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <History size={16} className="text-[#F4D03F]" />
              Últimas corridas
            </h2>
            <button onClick={() => navigate('/trips')} className="text-xs text-[#F4D03F] hover:underline">Ver todas</button>
          </div>
          
          {recentTrips.length === 0 ? (
            <div className="bg-[#1A1528]/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <History size={32} className="mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-[#A0A0B0]">Nenhuma corrida ainda</p>
              <p className="text-xs text-[#A0A0B0] mt-1">Solicite sua primeira corrida!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrips.map((trip, index) => (
                <motion.button 
                  key={trip.id} 
                  initial={{ opacity: 0, x: -20 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: index * 0.1 }} 
                  onClick={() => navigate(`/trips/${trip.id}`)} 
                  className="w-full text-left bg-[#1A1528] rounded-xl p-3 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-900/40 p-2 rounded-full">
                        <Navigation size={16} className="text-[#F4D03F]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">{trip.destino}</p>
                        <p className="text-xs text-[#A0A0B0]">{new Date(trip.created_at).toLocaleDateString('pt-BR')}</p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-white">R$ {trip.valor?.toFixed(2) || '0.00'}</span>
                  </div>
                </motion.button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="passageiro" />
    </div>
  )
}