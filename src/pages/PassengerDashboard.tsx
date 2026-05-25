import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { supabase } from '../lib/supabaseClient';
import { LocationAutocomplete } from '../components/LocationAutocomplete';
import { MapPin, Navigation, DollarSign, History, LogOut, Car, Crosshair, X } from 'lucide-react';
import { toast } from 'sonner';

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
  const [mapsTimeout, setMapsTimeout] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Pega localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 }),
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // Carrega Google Maps com timeout
  useEffect(() => {
    if (!apiKey) { 
      setMapsLoaded(true); 
      setMapsTimeout(true);
      return; 
    }
    if (window.google && window.google.maps && window.google.maps.places) { 
      setMapsLoaded(true); 
      return; 
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMap`;
    script.async = true; script.defer = true;
    
    (window as any).initMap = () => setMapsLoaded(true);
    script.onerror = () => {
      setMapsLoaded(true);
      setMapsTimeout(true);
    };
    document.head.appendChild(script);

    // Timeout de 10 segundos
    const timeout = setTimeout(() => {
      if (!mapsLoaded) {
        setMapsLoaded(true);
        setMapsTimeout(true);
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [apiKey]);

  // Tenta criar o mapa quando o Google Maps carregar
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation || !window.google || !window.google.maps) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation, zoom: 16,
        disableDefaultUI: true, zoomControl: true, streetViewControl: false,
        mapTypeControl: false, fullscreenControl: false,
      });
      mapInstanceRef.current = map;

      const pulseCircle = new window.google.maps.Circle({
        map, center: userLocation, radius: 30,
        fillColor: '#F4D03F', fillOpacity: 0.35,
        strokeColor: '#F4D03F', strokeOpacity: 0.9, strokeWeight: 2,
      });

      let size = 30, growing = true;
      const interval = setInterval(() => {
        size += growing ? 2 : -2;
        if (size >= 50) growing = false;
        if (size <= 30) growing = true;
        pulseCircle.setRadius(size);
      }, 60);

      return () => clearInterval(interval);
    } catch (err) {
      console.error('Erro ao criar mapa:', err);
      setMapsTimeout(true);
    }
  }, [mapsLoaded, userLocation]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    fetchRecentTrips();
    return () => clearTimeout(timer);
  }, []);

  async function fetchRecentTrips() {
    if (!user) return;
    const { data } = await supabase
      .from('corridas')
      .select('*')
      .eq('passageiro_id', user.id)
      .order('created_at', { ascending: false })
      .limit(5);
    if (data) setRecentTrips(data);
  }

  const precoEstimado = useMemo(
    () => (origem || destino) ? calcularPrecoCorrida({ distanciaKm: 5.2, tempoMin: 15 }) : null,
    [origem, destino]
  );

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const solicitarCorrida = useCallback(async () => {
    if (!destino) { toast.error('Digite o destino'); return; }
    setSolicitando(true);
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id, origem: origem || 'Local atual',
        destino, status: 'pendente', valor: precoEstimado || 20,
      });
      if (error) throw error;
      toast.success('✅ Corrida solicitada! Aguardando motorista...');
      setOrigem(''); setDestino('');
      fetchRecentTrips();
    } catch (err: any) { toast.error('Erro: ' + err.message); }
    setSolicitando(false);
  }, [destino, origem, precoEstimado, user?.id]);

  const handleOriginSelect = (lat: number, lng: number, address: string) => {
    setOrigem(address);
    if (mapInstanceRef.current && window.google) {
      mapInstanceRef.current.setCenter({ lat, lng });
      mapInstanceRef.current.setZoom(16);
    }
  };

  const handleDestinoSelect = (lat: number, lng: number, address: string) => {
    setDestino(address);
    if (mapInstanceRef.current && window.google) {
      mapInstanceRef.current.setCenter({ lat, lng });
      mapInstanceRef.current.setZoom(14);
    }
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocalização não suportada'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ lat, lng });
        // Buscar endereço via Nominatim (OpenStreetMap)
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt`)
          .then(res => res.json())
          .then(data => {
            if (data?.display_name) setOrigem(data.display_name);
          })
          .catch(() => setOrigem(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`));
        if (mapInstanceRef.current && window.google) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(16);
        }
      },
      () => toast.error('Erro ao obter localização'),
      { enableHighAccuracy: true }
    );
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] p-4 space-y-4">
      <Skeleton className="h-12 w-full" />
      <Skeleton className="h-56 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-24 w-full rounded-2xl" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      {/* HEADER LIMPO */}
      <header className="sticky top-0 z-20 bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 flex justify-between items-center px-4 py-3">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }} 
          animate={{ opacity: 1, x: 0 }} 
          className="text-xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent"
        >
          ObaLeva
        </motion.h1>
        <button 
          onClick={handleSignOut} 
          className="w-9 h-9 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition"
          title="Sair"
        >
          <LogOut size={16} className="text-red-400" />
        </button>
      </header>

      <div className="mx-4 mt-4 space-y-4">
        {/* Mapa com fallback */}
        <div className="bg-[#1A1528] rounded-2xl overflow-hidden border border-white/10 h-56 relative">
          {!apiKey || mapsTimeout ? (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#1A1528] to-[#2D2342]">
              <div className="text-center">
                <MapPin size={48} className="mx-auto mb-2 text-[#F4D03F]/50" />
                <p className="text-sm text-[#A0A0B0]">
                  {mapsTimeout ? 'Mapa indisponível' : 'Configure a chave do Google Maps'}
                </p>
                <p className="text-xs text-[#A0A0B0]/60 mt-1">
                  Digite os endereços manualmente
                </p>
              </div>
            </div>
          ) : !mapsLoaded ? (
            <div className="h-full flex items-center justify-center">
              <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
            </div>
          ) : (
            <div ref={mapRef} className="w-full h-full" />
          )}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">Online</span>
          </div>
        </div>

        {/* Inputs de endereço */}
        <div className="bg-[#1A1528] rounded-2xl p-4 border border-white/10 space-y-3">
          <div className="relative">
            <label className="block text-xs text-[#A0A0B0] mb-1">📍 Origem</label>
            <div className="relative">
              <LocationAutocomplete
                placeholder="Onde você está?"
                value={origem} onChange={setOrigem} icon="origin"
                onPlaceSelected={handleOriginSelect}
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-1">
                <button onClick={getCurrentLocation} className="p-1 text-[#F4D03F] hover:text-white transition" title="Usar minha localização">
                  <Crosshair size={16} />
                </button>
                {origem && (
                  <button onClick={() => setOrigem('')} className="p-1 text-gray-400 hover:text-red-400 transition">
                    <X size={14} />
                  </button>
                )}
              </div>
            </div>
          </div>
          <div className="border-l-2 border-dashed border-white/20 ml-3 h-4" />
          <div>
            <label className="block text-xs text-[#A0A0B0] mb-1">🏁 Destino</label>
            <div className="relative">
              <LocationAutocomplete
                placeholder="Para onde vai?"
                value={destino} onChange={setDestino} icon="destination"
                onPlaceSelected={handleDestinoSelect}
              />
              {destino && (
                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button onClick={() => setDestino('')} className="p-1 text-gray-400 hover:text-red-400 transition">
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>

          {precoEstimado && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
              className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-3 rounded-xl border border-white/10 mt-2">
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

        {/* Botão solicitar corrida */}
        <button onClick={solicitarCorrida} disabled={solicitando || !destino}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2">
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"/><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/></svg> Buscando motorista...</>
          ) : (<><Car size={22} /> Solicitar ObaLeva</>)}
        </button>

        {/* Botão "Torne-se um Parceiro" */}
        <button onClick={() => navigate('/cadastro-motorista')}
          className="w-full bg-transparent border-2 border-[#F4D03F] text-[#F4D03F] font-bold py-3 rounded-2xl hover:bg-[#F4D03F]/10 transition-all flex items-center justify-center gap-2">
          <Car size={18} /> Torne-se um Parceiro
        </button>

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
              <p className="text-sm text-[#A0A0B0]">Nenhuma corrida ainda</p>
              <p className="text-xs text-[#A0A0B0] mt-1">Solicite sua primeira corrida!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrips.map((trip) => (
                <button key={trip.id} onClick={() => navigate(`/trips/${trip.id}`)}
                  className="w-full text-left bg-[#1A1528] rounded-xl p-3 border border-white/10 hover:border-[#F4D03F]/30 transition-all">
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
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="passageiro" />
    </div>
  )
}