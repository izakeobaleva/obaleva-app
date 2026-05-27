import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRideRequest } from '../hooks/useRideRequest';
import { MapSection } from '../components/Home/MapSection';
import { LocationInput } from '../components/Home/LocationInput';
import { PriceEstimate } from '../components/Home/PriceEstimate';
import { LogOut, Car, Bell, User, Megaphone } from 'lucide-react';
import { toast } from 'sonner';

export default function Home() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { mapsLoaded, mapsTimeout, buscarSugestoes, reverseGeocode } = useGoogleMaps();
  const { userLocation, getCurrentLocation } = useGeolocation();
  const { solicitando, solicitarCorrida } = useRideRequest();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [editingOrigem, setEditingOrigem] = useState(false);
  const [editingDestino, setEditingDestino] = useState(false);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);
  const [showSugestoesOrigem, setShowSugestoesOrigem] = useState(false);
  const [showSugestoesDestino, setShowSugestoesDestino] = useState(false);

  const debounceOrigem = useRef<NodeJS.Timeout>();
  const debounceDestino = useRef<NodeJS.Timeout>();
  const enderecoBuscado = useRef(false);

  // Buscar endereço atual assim que tiver localização
  useEffect(() => {
    if (userLocation && !origem && !enderecoBuscado.current) {
      enderecoBuscado.current = true;
      setBuscandoEndereco(true);
      reverseGeocode(userLocation.lat, userLocation.lng).then((endereco) => {
        setOrigem(endereco);
        setBuscandoEndereco(false);
      });
    }
  }, [userLocation, origem, reverseGeocode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  // ====== AUTOCOMPLETE ======
  const handleInputChange = (value: string, type: 'origem' | 'destino') => {
    if (type === 'origem') setOrigem(value);
    else setDestino(value);

    const debounceRef = type === 'origem' ? debounceOrigem : debounceDestino;
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(async () => {
      const sugestoes = await buscarSugestoes(value);
      if (type === 'origem') {
        setSugestoesOrigem(sugestoes);
        setShowSugestoesOrigem(sugestoes.length > 0);
      } else {
        setSugestoesDestino(sugestoes);
        setShowSugestoesDestino(sugestoes.length > 0);
      }
    }, 300);
  };

  const handleSelectSugestao = (sugestao: any, type: 'origem' | 'destino') => {
    if (type === 'origem') {
      setOrigem(sugestao.description);
      setShowSugestoesOrigem(false);
      setEditingOrigem(false);
    } else {
      setDestino(sugestao.description);
      setShowSugestoesDestino(false);
      setEditingDestino(false);
    }
  };

  const handleGetCurrentLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setBuscandoEndereco(true);
      const endereco = await reverseGeocode(loc.lat, loc.lng);
      setOrigem(endereco);
      setBuscandoEndereco(false);
      toast.success('📍 Localização atualizada!');
    } else {
      toast.error('Erro ao obter localização. Verifique o GPS.');
    }
  }, [getCurrentLocation, reverseGeocode]);

  const handleSolicitarCorrida = () => {
    solicitarCorrida({ userId: user?.id, origem, destino });
  };

  // Preço estimado
  const precoEstimado = (origem || destino) ? 20.50 : null;

  return (
    <div className="h-screen w-full flex flex-col bg-[#0F0B1A] overflow-hidden">
      {/* ===== 1. TOP BAR - FIXO NO TOPO ===== */}
      <header className="h-14 bg-[#1A1528]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-30 shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition"
            title="Sair"
          >
            <LogOut size={14} className="text-red-400" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-lg flex items-center justify-center">
            <svg className="w-5 h-5 text-[#1E1E2F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
            </svg>
          </div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-lg font-bold text-[#F4D03F]"
            style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
          >
            ObaLeva
          </motion.h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition relative">
            <Bell size={16} className="text-[#F4D03F]" />
            <span className="absolute -top-0.5 -right-0.5 w-3 h-3 bg-red-500 rounded-full text-[8px] flex items-center justify-center text-white font-bold">3</span>
          </button>
          <button 
            onClick={() => navigate('/profile')}
            className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4D03F] to-amber-500 flex items-center justify-center"
          >
            <User size={16} className="text-[#1E1E2F]" />
          </button>
        </div>
      </header>

      {/* ===== 2. MAPA AO VIVO - OCUPA TODO O ESPAÇO RESTANTE ===== */}
      <div className="flex-1 relative w-full" style={{ minHeight: '300px' }}>
        <MapSection
          userLocation={userLocation}
          mapsLoaded={mapsLoaded}
          mapsTimeout={mapsTimeout}
          onGetCurrentLocation={handleGetCurrentLocation}
        />
      </div>

      {/* ===== 3. OVERLAY COM INPUTS - fundo escuro sólido para evitar glitch ===== */}
      <div className="bg-[#1A1528] border-t border-white/10 px-4 pt-3 pb-2 shrink-0 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
        {/* Campo Origem */}
        <LocationInput
          type="origem"
          value={origem}
          editing={editingOrigem}
          placeholder="Onde você está?"
          loading={buscandoEndereco}
          onEditToggle={() => setEditingOrigem(true)}
          onConfirm={() => { setEditingOrigem(false); setShowSugestoesOrigem(false); }}
          onChange={(v) => handleInputChange(v, 'origem')}
          onFocus={() => { setEditingOrigem(true); if (sugestoesOrigem.length > 0) setShowSugestoesOrigem(true); }}
          onBlur={() => setTimeout(() => setShowSugestoesOrigem(false), 200)}
          sugestoes={sugestoesOrigem}
          showSugestoes={showSugestoesOrigem}
          onSelectSugestao={(s) => handleSelectSugestao(s, 'origem')}
        />

        {/* Campo Destino */}
        <LocationInput
          type="destino"
          value={destino}
          editing={editingDestino}
          placeholder="Para onde vai?"
          onEditToggle={() => setEditingDestino(true)}
          onConfirm={() => { setEditingDestino(false); setShowSugestoesDestino(false); }}
          onChange={(v) => handleInputChange(v, 'destino')}
          onFocus={() => { setEditingDestino(true); if (sugestoesDestino.length > 0) setShowSugestoesDestino(true); }}
          onBlur={() => setTimeout(() => setShowSugestoesDestino(false), 200)}
          sugestoes={sugestoesDestino}
          showSugestoes={showSugestoesDestino}
          onSelectSugestao={(s) => handleSelectSugestao(s, 'destino')}
        />

        {/* Preço estimado */}
        <PriceEstimate preco={precoEstimado} visible={!!(origem || destino)} />

        {/* Botão Chamar */}
        <button
          onClick={handleSolicitarCorrida}
          disabled={solicitando || !destino}
          className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-base shadow-lg flex items-center justify-center gap-2 mb-2"
        >
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando motorista...</>
          ) : (
            <><Car size={20} /> Chamar ObaLeva</>
          )}
        </button>
      </div>

      {/* ===== 4. BANNER PUBLICITÁRIO NO FUNDO (substituiu o perfil) ===== */}
      <div className="h-10 bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-t border-white/10 flex items-center justify-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Megaphone size={14} className="text-[#F4D03F]" />
          <span className="text-xs text-white/60">
            📢 Baixe o app e ganhe <strong className="text-[#F4D03F]">R$ 10</strong> na primeira corrida!
          </span>
        </div>
      </div>
    </div>
  );
}