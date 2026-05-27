import { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Navigation, DollarSign, History, LogOut, Car, Crosshair, X, Edit2, Map, Search } from 'lucide-react';
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
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [origemSugestoes, setOrigemSugestoes] = useState<any[]>([]);
  const [destinoSugestoes, setDestinoSugestoes] = useState<any[]>([]);
  const [showOrigemSugestoes, setShowOrigemSugestoes] = useState(false);
  const [showDestinoSugestoes, setShowDestinoSugestoes] = useState(false);
  const [origemFocused, setOrigemFocused] = useState(false);
  const [destinoFocused, setDestinoFocused] = useState(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const debounceOrigem = useRef<NodeJS.Timeout>();
  const debounceDestino = useRef<NodeJS.Timeout>();
  const autocompleteService = useRef<any>(null);
  const geocoderService = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // Inicializa serviços do Google Maps quando carregar
  const initMapsServices = useCallback(() => {
    if (window.google && window.google.maps && window.google.maps.places && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoderService.current = new window.google.maps.Geocoder();
      setMapsLoaded(true);
    }
  }, []);

  // Carrega Google Maps
  useEffect(() => {
    if (!apiKey) {
      setMapsLoaded(true);
      setMapsTimeout(true);
      return;
    }

    if (window.google && window.google.maps && window.google.maps.places) {
      initMapsServices();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapsCallback`;
    script.async = true;
    script.defer = true;

    (window as any).initMapsCallback = () => {
      initMapsServices();
    };

    script.onerror = () => {
      setMapsLoaded(true);
      setMapsTimeout(true);
    };

    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      if (!mapsLoaded) {
        setMapsLoaded(true);
        setMapsTimeout(true);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      delete (window as any).initMapsCallback;
    };
  }, [apiKey, initMapsServices, mapsLoaded]);

  // Busca endereço automático baseado na localização usando Google Geocoding
  const buscarEnderecoAtual = useCallback(async (lat: number, lng: number) => {
    setBuscandoEndereco(true);

    try {
      // Tenta Google Geocoding primeiro
      if (geocoderService.current) {
        const results = await new Promise<any[]>((resolve) => {
          geocoderService.current.geocode(
            { location: { lat, lng }, language: 'pt-BR' },
            (results: any, status: string) => {
              if (status === 'OK' && results?.[0]) {
                resolve(results);
              } else {
                resolve([]);
              }
            }
          );
        });

        if (results.length > 0) {
          setOrigem(results[0].formatted_address);
          setBuscandoEndereco(false);
          return;
        }
      }

      // Fallback: Nominatim (OpenStreetMap)
      const url = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`;
      const res = await fetch(url);
      const data = await res.json();
      if (data?.display_name) {
        setOrigem(data.display_name);
      } else {
        setOrigem(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
      }
    } catch {
      setOrigem(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    }
    setBuscandoEndereco(false);
  }, []);

  // Pega localização do usuário
  useEffect(() => {
    if (navigator.geolocation) {
      const watchId = navigator.geolocation.watchPosition(
        (position) => {
          const loc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(loc);

          // Só busca endereço se ainda não tiver (primeira vez)
          if (!origem) {
            buscarEnderecoAtual(loc.lat, loc.lng);
          }
        },
        () => {
          setUserLocation({ lat: -23.5505, lng: -46.6333 });
        },
        {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0,
        }
      );

      return () => navigator.geolocation.clearWatch(watchId);
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, [buscarEnderecoAtual, origem]);

  // Busca sugestões de endereço (Google Places Autocomplete)
  const buscarSugestoes = async (input: string, type: 'origem' | 'destino') => {
    if (input.length < 3 || !autocompleteService.current) return;

    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        {
          input,
          types: ['geocode', 'establishment'],
          componentRestrictions: { country: 'br' },
          language: 'pt-BR',
        },
        (predictions: any[] | null, status: string) => {
          if (status === 'OK' && predictions) {
            const sugestoes = predictions.map((p) => ({
              place_id: p.place_id,
              description: p.description,
            }));

            if (type === 'origem') {
              setOrigemSugestoes(sugestoes);
              setShowOrigemSugestoes(true);
            } else {
              setDestinoSugestoes(sugestoes);
              setShowDestinoSugestoes(true);
            }
          }
        }
      );
    } else {
      // Fallback: Nominatim
      try {
        const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(input)}&limit=5&countrycodes=br`;
        const res = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
        const data = await res.json();
        const sugestoes = data.map((item: any) => ({
          place_id: item.place_id,
          description: item.display_name,
        }));

        if (type === 'origem') {
          setOrigemSugestoes(sugestoes);
          setShowOrigemSugestoes(true);
        } else {
          setDestinoSugestoes(sugestoes);
          setShowDestinoSugestoes(true);
        }
      } catch {
        // Silencia erro
      }
    }
  };

  const handleOrigemChange = (value: string) => {
    setOrigem(value);
    if (debounceOrigem.current) clearTimeout(debounceOrigem.current);
    debounceOrigem.current = setTimeout(() => buscarSugestoes(value, 'origem'), 300);
  };

  const handleDestinoChange = (value: string) => {
    setDestino(value);
    if (debounceDestino.current) clearTimeout(debounceDestino.current);
    debounceDestino.current = setTimeout(() => buscarSugestoes(value, 'destino'), 300);
  };

  const handleSelectOrigem = async (sugestao: any) => {
    setOrigem(sugestao.description);
    setShowOrigemSugestoes(false);

    // Busca coordenadas
    if (geocoderService.current) {
      geocoderService.current.geocode(
        { address: sugestao.description, language: 'pt-BR' },
        (results: any, status: string) => {
          if (status === 'OK' && results?.[0]) {
            const location = results[0].geometry.location;
            setUserLocation({ lat: location.lat(), lng: location.lng() });
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter({ lat: location.lat(), lng: location.lng() });
              mapInstanceRef.current.setZoom(16);
            }
          }
        }
      );
    }
  };

  const handleSelectDestino = (sugestao: any) => {
    setDestino(sugestao.description);
    setShowDestinoSugestoes(false);
  };

  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setUserLocation({ lat, lng });
        buscarEnderecoAtual(lat, lng);

        if (mapInstanceRef.current && window.google) {
          mapInstanceRef.current.setCenter({ lat, lng });
          mapInstanceRef.current.setZoom(17);
        }

        toast.success('📍 Localização atualizada!');
      },
      (error) => {
        let msg = 'Erro ao obter localização. ';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            msg += 'Permissão negada. Ative o GPS nas configurações.';
            break;
          case error.POSITION_UNAVAILABLE:
            msg += 'GPS indisponível.';
            break;
          case error.TIMEOUT:
            msg += 'Tempo esgotado. Tente novamente.';
            break;
        }
        toast.error(msg);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };

  // Cria mapa quando Google Maps carregar
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation || !window.google || !window.google.maps) return;

    try {
      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
      });
      mapInstanceRef.current = map;

      const pulseCircle = new window.google.maps.Circle({
        map,
        center: userLocation,
        radius: 30,
        fillColor: '#F4D03F',
        fillOpacity: 0.35,
        strokeColor: '#F4D03F',
        strokeOpacity: 0.9,
        strokeWeight: 2,
      });

      let size = 30;
      let growing = true;
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
    if (!destino) {
      toast.error('Digite o destino');
      return;
    }
    setSolicitando(true);
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id,
        origem: origem || 'Local atual',
        destino,
        status: 'pendente',
        valor: precoEstimado || 20,
      });
      if (error) throw error;
      toast.success('✅ Corrida solicitada! Aguardando motorista...');
      fetchRecentTrips();
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    }
    setSolicitando(false);
  }, [destino, origem, precoEstimado, user?.id]);

  if (loading)
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      {/* HEADER */}
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
        {/* Mapa */}
        <div className="bg-[#1A1528] rounded-2xl overflow-hidden border border-white/10 h-56 relative">
          {mapsLoaded && !mapsTimeout && userLocation && window.google?.maps ? (
            <div ref={mapRef} className="w-full h-full" />
          ) : (
            <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
              <div className="text-center">
                <Map size={48} className="mx-auto mb-2 text-[#F4D03F]/40" />
                <p className="text-sm text-[#A0A0B0]">
                  {mapsTimeout ? 'Mapa indisponível' : 'Carregando mapa...'}
                </p>
                {userLocation && (
                  <p className="text-xs text-[#A0A0B0]/60 mt-1">
                    📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                  </p>
                )}
                {!mapsLoaded && (
                  <p className="text-xs text-yellow-400 mt-2">
                    ⚠️ Configure a chave do Google Maps no .env
                  </p>
                )}
              </div>
            </div>
          )}
          <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-xs text-white font-medium">Online</span>
          </div>
          {userLocation && (
            <div className="absolute bottom-3 right-3 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 border border-white/10">
              <span className="text-xs text-[#F4D03F] font-medium">
                📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </span>
            </div>
          )}
        </div>

        {/* Inputs de endereço */}
        <div className="bg-[#1A1528] rounded-2xl p-4 border border-white/10 space-y-3">
          {/* ORIGEM */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#A0A0B0]">📍 Origem</label>
              <div className="flex items-center gap-1">
                {buscandoEndereco && (
                  <div className="animate-spin w-3 h-3 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
                )}
                <button
                  onClick={getCurrentLocation}
                  className="text-green-400 hover:text-white transition p-1"
                  title="Usar localização atual"
                >
                  <Crosshair size={14} />
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <MapPin size={16} className="text-green-400 shrink-0" />
              <input
                type="text"
                placeholder={buscandoEndereco ? 'Buscando endereço...' : 'Onde você está?'}
                value={origem}
                onChange={(e) => handleOrigemChange(e.target.value)}
                onFocus={() => {
                  setOrigemFocused(true);
                  if (origemSugestoes.length > 0) setShowOrigemSugestoes(true);
                }}
                onBlur={() => setTimeout(() => setShowOrigemSugestoes(false), 200)}
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                autoComplete="off"
              />
              {origem && (
                <button
                  onClick={() => {
                    setOrigem('');
                    setOrigemSugestoes([]);
                  }}
                  className="text-gray-400 hover:text-red-400 transition p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sugestões Origem */}
            {showOrigemSugestoes && origemSugestoes.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-[#1A1528] border border-white/10 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                {origemSugestoes.map((s) => (
                  <button
                    key={s.place_id}
                    onMouseDown={() => handleSelectOrigem(s)}
                    className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/5 transition border-b border-white/5 last:border-0 flex items-center gap-3"
                  >
                    <MapPin size={14} className="text-green-400 shrink-0" />
                    <span className="truncate">{s.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="border-l-2 border-dashed border-white/20 ml-3 h-4" />

          {/* DESTINO */}
          <div className="relative">
            <div className="flex items-center justify-between mb-1">
              <label className="text-xs text-[#A0A0B0]">🏁 Destino</label>
            </div>

            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
              <Navigation size={16} className="text-red-400 shrink-0" />
              <input
                type="text"
                placeholder="Para onde vai?"
                value={destino}
                onChange={(e) => handleDestinoChange(e.target.value)}
                onFocus={() => {
                  setDestinoFocused(true);
                  if (destinoSugestoes.length > 0) setShowDestinoSugestoes(true);
                }}
                onBlur={() => setTimeout(() => setShowDestinoSugestoes(false), 200)}
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                autoComplete="off"
              />
              {destino && (
                <button
                  onClick={() => {
                    setDestino('');
                    setDestinoSugestoes([]);
                  }}
                  className="text-gray-400 hover:text-red-400 transition p-1"
                >
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Sugestões Destino */}
            {showDestinoSugestoes && destinoSugestoes.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-[#1A1528] border border-white/10 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
                {destinoSugestoes.map((s) => (
                  <button
                    key={s.place_id}
                    onMouseDown={() => handleSelectDestino(s)}
                    className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/5 transition border-b border-white/5 last:border-0 flex items-center gap-3"
                  >
                    <Navigation size={14} className="text-red-400 shrink-0" />
                    <span className="truncate">{s.description}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

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
                  <span className="font-bold text-lg text-white">
                    R$ {precoEstimado.toFixed(2)}
                  </span>
                  <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
                </div>
                <span className="text-xs text-[#A0A0B0]">~15 min</span>
              </div>
            </motion.div>
          )}
        </div>

        {/* Botão solicitar */}
        <button
          onClick={solicitarCorrida}
          disabled={solicitando || !destino}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {solicitando ? (
            <>
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Buscando motorista...
            </>
          ) : (
            <>
              <Car size={22} /> Solicitar ObaLeva
            </>
          )}
        </button>

        {/* Últimas corridas */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="font-semibold text-white flex items-center gap-2">
              <History size={16} className="text-[#F4D03F]" />
              Últimas corridas
            </h2>
            <button onClick={() => navigate('/trips')} className="text-xs text-[#F4D03F] hover:underline">
              Ver todas
            </button>
          </div>
          {recentTrips.length === 0 ? (
            <div className="bg-[#1A1528]/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <p className="text-sm text-[#A0A0B0]">Nenhuma corrida ainda</p>
              <p className="text-xs text-[#A0A0B0] mt-1">Solicite sua primeira corrida!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrips.map((trip) => (
                <button
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="w-full text-left bg-[#1A1528] rounded-xl p-3 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="bg-purple-900/40 p-2 rounded-full">
                        <Navigation size={16} className="text-[#F4D03F]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-white truncate max-w-[180px]">
                          {trip.destino}
                        </p>
                        <p className="text-xs text-[#A0A0B0]">
                          {new Date(trip.created_at).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                    </div>
                    <span className="font-bold text-sm text-white">
                      R$ {trip.valor?.toFixed(2) || '0.00'}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="passageiro" />
    </div>
  );
}