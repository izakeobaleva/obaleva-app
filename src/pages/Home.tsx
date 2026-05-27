import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { 
  MapPin, Navigation, DollarSign, Crosshair, 
  X, Edit2, Check, LogOut, Car, Map, History 
} from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [editingOrigem, setEditingOrigem] = useState(false);
  const [editingDestino, setEditingDestino] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [mapsLoaded, setMapsLoaded] = useState(false);
  const [mapsTimeout, setMapsTimeout] = useState(false);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);
  const [showSugestoesOrigem, setShowSugestoesOrigem] = useState(false);
  const [showSugestoesDestino, setShowSugestoesDestino] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const debounceOrigem = useRef<NodeJS.Timeout>();
  const debounceDestino = useRef<NodeJS.Timeout>();
  const autocompleteService = useRef<any>(null);
  const geocoderService = useRef<any>(null);
  const pulseCircleRef = useRef<any>(null);
  const pulseIntervalRef = useRef<NodeJS.Timeout>();
  const userMarkerRef = useRef<any>(null);

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

  // ====== INICIALIZAR SERVIÇOS DO MAPA ======
  const initMapsServices = () => {
    if (window.google?.maps?.places && !autocompleteService.current) {
      autocompleteService.current = new window.google.maps.places.AutocompleteService();
      geocoderService.current = new window.google.maps.Geocoder();
      setMapsLoaded(true);
    }
  };

  // ====== CARREGAR GOOGLE MAPS ======
  useEffect(() => {
    if (!apiKey) {
      setMapsLoaded(true);
      setMapsTimeout(true);
      return;
    }

    if (window.google?.maps?.places) {
      initMapsServices();
      return;
    }

    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry&callback=initMapsCallback`;
    script.async = true;
    script.defer = true;
    (window as any).initMapsCallback = initMapsServices;
    script.onerror = () => { setMapsLoaded(true); setMapsTimeout(true); };
    document.head.appendChild(script);

    const timeout = setTimeout(() => {
      if (!mapsLoaded) { setMapsLoaded(true); setMapsTimeout(true); }
    }, 10000);

    return () => { clearTimeout(timeout); delete (window as any).initMapsCallback; };
  }, [apiKey]);

  // ====== GEOCODING REVERSO (endereço a partir de lat/lng) ======
  const buscarEnderecoAtual = async (lat: number, lng: number) => {
    setBuscandoEndereco(true);
    try {
      if (geocoderService.current) {
        const results = await new Promise<any[]>(resolve => {
          geocoderService.current.geocode(
            { location: { lat, lng }, language: 'pt-BR' },
            (results: any, status: string) => resolve(status === 'OK' && results?.[0] ? results : [])
          );
        });
        if (results.length > 0) { setOrigem(results[0].formatted_address); setBuscandoEndereco(false); return; }
      }
      // Fallback Nominatim
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=pt-BR`);
      const data = await res.json();
      setOrigem(data?.display_name || `📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`);
    } catch { setOrigem(`📍 ${lat.toFixed(4)}, ${lng.toFixed(4)}`); }
    setBuscandoEndereco(false);
  };

  // ====== OBTER LOCALIZAÇÃO DO USUÁRIO ======
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
          setUserLocation(loc);
          buscarEnderecoAtual(loc.lat, loc.lng);
        },
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 }),
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  // ====== CRIAR MAPA ======
  useEffect(() => {
    if (!mapsLoaded || !mapRef.current || !userLocation || !window.google?.maps) return;

    try {
      if (mapInstanceRef.current) return;

      const map = new window.google.maps.Map(mapRef.current, {
        center: userLocation,
        zoom: 16,
        disableDefaultUI: true,
        zoomControl: true,
        streetViewControl: false,
        mapTypeControl: false,
        fullscreenControl: false,
        styles: [
          { featureType: 'poi', elementType: 'labels', stylers: [{ visibility: 'off' }] },
          { featureType: 'transit', elementType: 'labels', stylers: [{ visibility: 'off' }] },
        ],
      });
      mapInstanceRef.current = map;

      // Marcador azul do usuário
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

      // Círculo pulsante
      let size = 30;
      let growing = true;
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
    } catch (err) {
      console.error('Erro ao criar mapa:', err);
      setMapsTimeout(true);
    }

    return () => {
      if (pulseIntervalRef.current) clearInterval(pulseIntervalRef.current);
    };
  }, [mapsLoaded, userLocation]);

  // ====== AUTOCOMPLETE ======
  const buscarSugestoes = (input: string, type: 'origem' | 'destino') => {
    if (input.length < 3) return;

    if (autocompleteService.current) {
      autocompleteService.current.getPlacePredictions(
        { input, types: ['geocode', 'establishment'], componentRestrictions: { country: 'br' }, language: 'pt-BR' },
        (predictions: any[] | null, status: string) => {
          if (status === 'OK' && predictions) {
            if (type === 'origem') { setSugestoesOrigem(predictions); setShowSugestoesOrigem(true); }
            else { setSugestoesDestino(predictions); setShowSugestoesDestino(true); }
          }
        }
      );
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
    setShowSugestoesOrigem(false);
    setEditingOrigem(false);
    if (geocoderService.current) {
      geocoderService.current.geocode(
        { address: sugestao.description, language: 'pt-BR' },
        (results: any, status: string) => {
          if (status === 'OK' && results?.[0]) {
            const loc = results[0].geometry.location;
            setUserLocation({ lat: loc.lat(), lng: loc.lng() });
            if (mapInstanceRef.current) {
              mapInstanceRef.current.setCenter({ lat: loc.lat(), lng: loc.lng() });
              mapInstanceRef.current.setZoom(16);
              userMarkerRef.current?.setPosition({ lat: loc.lat(), lng: loc.lng() });
              pulseCircleRef.current?.setCenter({ lat: loc.lat(), lng: loc.lng() });
            }
          }
        }
      );
    }
  };

  const handleSelectDestino = (sugestao: any) => {
    setDestino(sugestao.description);
    setShowSugestoesDestino(false);
    setEditingDestino(false);
  };

  // ====== ATUALIZAR LOCALIZAÇÃO ======
  const getCurrentLocation = () => {
    if (!navigator.geolocation) { toast.error('Geolocalização não suportada'); return; }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const loc = { lat: position.coords.latitude, lng: position.coords.longitude };
        setUserLocation(loc);
        buscarEnderecoAtual(loc.lat, loc.lng);
        if (mapInstanceRef.current) {
          mapInstanceRef.current.setCenter(loc);
          mapInstanceRef.current.setZoom(17);
          userMarkerRef.current?.setPosition(loc);
          pulseCircleRef.current?.setCenter(loc);
        }
        toast.success('📍 Localização atualizada!');
      },
      () => toast.error('Erro ao obter localização. Verifique o GPS.'),
      { enableHighAccuracy: true, timeout: 15000 }
    );
  };

  // ====== LOGOUT ======
  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // ====== PREÇO ESTIMADO ======
  const precoEstimado = (origem || destino) ? calcularPrecoCorrida({ distanciaKm: 5.2, tempoMin: 15 }) : null;

  // ====== SOLICITAR CORRIDA ======
  const solicitarCorrida = async () => {
    if (!destino) { toast.error('Digite o destino'); return; }
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
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    }
    setSolicitando(false);
  };

  // ====== SUGESTÕES DROPDOWN ======
  const SugestoesDropdown = ({ sugestoes, onSelect, onClose }: { sugestoes: any[]; onSelect: (s: any) => void; onClose: () => void }) => (
    sugestoes.length > 0 ? (
      <div className="absolute z-50 mt-1 w-full bg-[#1A1528] border border-white/10 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
        {sugestoes.map((s) => (
          <button
            key={s.place_id}
            onMouseDown={() => onSelect(s)}
            className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/5 transition border-b border-white/5 last:border-0 flex items-center gap-3"
          >
            <MapPin size={14} className="text-[#A0A0B0] shrink-0" />
            <span className="truncate">{s.description}</span>
          </button>
        ))}
      </div>
    ) : null
  );

  return (
    <div className="h-screen w-full flex flex-col bg-[#0F0B1A] overflow-hidden">
      {/* ====== MAPA ====== */}
      <div className="flex-1 relative">
        {mapsLoaded && !mapsTimeout && userLocation && window.google?.maps ? (
          <div ref={mapRef} className="w-full h-full" />
        ) : (
          <div className="h-full flex items-center justify-center bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
            <div className="text-center">
              <Map size={48} className="mx-auto mb-2 text-[#F4D03F]/40" />
              <p className="text-sm text-[#A0A0B0]">{mapsTimeout ? 'Mapa indisponível' : 'Carregando mapa...'}</p>
              {userLocation && (
                <p className="text-xs text-[#A0A0B0]/60 mt-1">📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              )}
              {!mapsLoaded && <p className="text-xs text-yellow-400 mt-2">⚠️ Configure a chave do Google Maps no .env</p>}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 pb-12">
          <div className="flex items-center justify-between">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
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
          </div>
        </div>

        {/* Botão centralizar localização */}
        <button
          onClick={getCurrentLocation}
          className="absolute bottom-4 right-4 w-12 h-12 rounded-full bg-[#1A1528]/90 backdrop-blur-md border border-white/20 flex items-center justify-center hover:bg-[#1A1528] transition shadow-lg"
          title="Centralizar na minha localização"
        >
          <Crosshair size={20} className="text-[#F4D03F]" />
        </button>

        {/* Indicador online */}
        <div className="absolute top-16 left-4 bg-black/60 backdrop-blur-md rounded-full px-3 py-1 flex items-center gap-2 border border-white/10">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
          <span className="text-xs text-white font-medium">Online</span>
        </div>
      </div>

      {/* ====== PAINEL INFERIOR ====== */}
      <div className="bg-[#1A1528]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-4 pb-2">
        {/* CAMPO ORIGEM */}
        <div className="mb-3">
          <label className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
            <MapPin size={12} className="text-green-400" />
            ONDE VOCÊ ESTÁ?
          </label>
          <div className="relative">
            <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${editingOrigem ? 'border-[#F4D03F] ring-2 ring-[#F4D03F]/20' : 'border-white/10'} rounded-2xl px-4 py-3 transition-all`}>
              <MapPin size={16} className="text-green-400 shrink-0" />
              <input
                type="text"
                placeholder={buscandoEndereco ? 'Buscando endereço...' : 'Onde você está?'}
                value={origem}
                onChange={(e) => handleOrigemChange(e.target.value)}
                onFocus={() => { setEditingOrigem(true); if (sugestoesOrigem.length > 0) setShowSugestoesOrigem(true); }}
                onBlur={() => setTimeout(() => setShowSugestoesOrigem(false), 200)}
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                autoComplete="off"
                readOnly={!editingOrigem}
              />
              {editingOrigem ? (
                <button
                  onClick={() => { setEditingOrigem(false); setShowSugestoesOrigem(false); }}
                  className="bg-[#22C55E] text-white p-1.5 rounded-xl hover:bg-[#16A34A] transition flex items-center gap-1 text-xs font-medium px-3"
                >
                  <Check size={14} /> Confirmar
                </button>
              ) : (
                <button
                  onClick={() => setEditingOrigem(true)}
                  className="bg-white/10 text-white p-1.5 rounded-xl hover:bg-white/20 transition flex items-center gap-1 text-xs font-medium px-3"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
            </div>
            <SugestoesDropdown sugestoes={sugestoesOrigem} onSelect={handleSelectOrigem} onClose={() => setShowSugestoesOrigem(false)} />
          </div>
        </div>

        {/* CAMPO DESTINO */}
        <div className="mb-3">
          <label className="text-xs text-[#A0A0B0] mb-1 flex items-center gap-1">
            <Navigation size={12} className="text-red-400" />
            PARA ONDE VOCÊ VAI?
          </label>
          <div className="relative">
            <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${editingDestino ? 'border-[#F4D03F] ring-2 ring-[#F4D03F]/20' : 'border-white/10'} rounded-2xl px-4 py-3 transition-all`}>
              <Navigation size={16} className="text-red-400 shrink-0" />
              <input
                type="text"
                placeholder="Para onde vai?"
                value={destino}
                onChange={(e) => handleDestinoChange(e.target.value)}
                onFocus={() => { setEditingDestino(true); if (sugestoesDestino.length > 0) setShowSugestoesDestino(true); }}
                onBlur={() => setTimeout(() => setShowSugestoesDestino(false), 200)}
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
                autoComplete="off"
                readOnly={!editingDestino}
              />
              {editingDestino ? (
                <button
                  onClick={() => { setEditingDestino(false); setShowSugestoesDestino(false); }}
                  className="bg-[#22C55E] text-white p-1.5 rounded-xl hover:bg-[#16A34A] transition flex items-center gap-1 text-xs font-medium px-3"
                >
                  <Check size={14} /> Confirmar
                </button>
              ) : (
                <button
                  onClick={() => setEditingDestino(true)}
                  className="bg-white/10 text-white p-1.5 rounded-xl hover:bg-white/20 transition flex items-center gap-1 text-xs font-medium px-3"
                >
                  <Edit2 size={14} /> Editar
                </button>
              )}
            </div>
            <SugestoesDropdown sugestoes={sugestoesDestino} onSelect={handleSelectDestino} onClose={() => setShowSugestoesDestino(false)} />
          </div>
        </div>

        {/* Preço estimado */}
        {precoEstimado && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-2.5 rounded-xl border border-white/10 mb-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={18} className="text-[#F4D03F]" />
                <span className="font-bold text-base text-white">R$ {precoEstimado.toFixed(2)}</span>
                <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
              </div>
              <span className="text-xs text-[#A0A0B0]">~15 min</span>
            </div>
          </motion.div>
        )}

        {/* Botão Chamar ObaLeva */}
        <button
          onClick={solicitarCorrida}
          disabled={solicitando || !destino}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando motorista...</>
          ) : (
            <><Car size={22} /> Chamar ObaLeva</>
          )}
        </button>

        {/* Bottom Navigation */}
        <div className="flex justify-around pt-3 pb-1">
          {[
            { icon: Map, label: 'Início', active: true, path: '/' },
            { icon: Search, label: 'Buscar', active: false, path: null },
            { icon: History, label: 'Atividade', active: false, path: '/trips' },
            { icon: MapPin, label: 'Perfil', active: false, path: '/profile' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => item.path && navigate(item.path)}
              className={`flex flex-col items-center gap-0.5 transition-all ${item.active ? 'text-[#F4D03F]' : 'text-[#A0A0B0] hover:text-white'}`}
            >
              <item.icon size={20} />
              <span className="text-[10px] font-medium">{item.label}</span>
              {item.active && <div className="w-1 h-1 rounded-full bg-[#F4D03F]" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

// Import necessário (lucide-react tem Search)
import { Search } from 'lucide-react';