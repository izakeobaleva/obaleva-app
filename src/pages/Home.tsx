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
import { LogOut, Car, Bell, Megaphone } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar';
import { toast } from 'sonner';

export default function Home() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { mapsLoaded, mapsTimeout, mapsError, buscarSugestoes, reverseGeocode, tentarNovamente } = useGoogleMaps();
  const { userLocation, getCurrentLocation } = useGeolocation();
  const { solicitando, precoEstimado, solicitarCorrida, calcularPreco } = useRideRequest();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [origemCoord, setOrigemCoord] = useState<{ lat: number; lng: number } | null>(null);
  const [editingOrigem, setEditingOrigem] = useState(false);
  const [editingDestino, setEditingDestino] = useState(false);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);
  const [showSugestoesOrigem, setShowSugestoesOrigem] = useState(false);
  const [showSugestoesDestino, setShowSugestoesDestino] = useState(false);

  const debounceOrigem = useRef<NodeJS.Timeout>();
  const debounceDestino = useRef<NodeJS.Timeout>();
  const debouncePreco = useRef<NodeJS.Timeout>();
  const enderecoBuscado = useRef(false);

  // Buscar endereço atual assim que tiver localização
  useEffect(() => {
    if (userLocation && !origem && !enderecoBuscado.current) {
      enderecoBuscado.current = true;
      setBuscandoEndereco(true);
      setOrigemCoord(userLocation);
      reverseGeocode(userLocation.lat, userLocation.lng).then((endereco) => {
        if (endereco) setOrigem(endereco);
        setBuscandoEndereco(false);
      });
    }
  }, [userLocation, origem, reverseGeocode]);

  // Calcular preço quando origem e destino mudarem
  useEffect(() => {
    if (debouncePreco.current) clearTimeout(debouncePreco.current);
    
    if (origem && destino) {
      debouncePreco.current = setTimeout(() => {
        calcularPreco(origem, destino);
      }, 1000);
    }
  }, [origem, destino, calcularPreco]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

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

  const handleSelectSugestao = async (sugestao: any, type: 'origem' | 'destino') => {
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
      setOrigemCoord(loc);
      setBuscandoEndereco(true);
      const endereco = await reverseGeocode(loc.lat, loc.lng);
      if (endereco) setOrigem(endereco);
      setBuscandoEndereco(false);
      toast.success('📍 Localização atualizada!');
    } else {
      toast.error('Erro ao obter localização. Verifique o GPS.');
    }
  }, [getCurrentLocation, reverseGeocode]);

  const handleSolicitarCorrida = async () => {
    if (!destino) {
      toast.error('Digite o destino');
      return;
    }
    
    const success = await solicitarCorrida({ 
      userId: user?.id, 
      origem, 
      destino,
      origemLat: origemCoord?.lat,
      origemLng: origemCoord?.lng,
    });
    
    if (success) {
      setDestino('');
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#0F0B1A] flex flex-col">
      {/* ===== 1. TOP BAR ===== */}
      <header className="sticky top-0 z-30 h-14 shrink-0 bg-[#1A1528]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={handleSignOut}
            className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition"
            title="Sair"
          >
            <LogOut size={14} className="text-red-400" />
          </button>
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
          >
            <UserAvatar 
              url={profile?.avatar_url} 
              name={profile?.nome_completo} 
              size="sm" 
            />
          </button>
        </div>
      </header>

      {/* ===== 2. MAPA - ocupa todo o espaço disponível ===== */}
      <div className="flex-1 relative w-full min-h-[200px]">
        <MapSection
          userLocation={userLocation}
          mapsLoaded={mapsLoaded}
          mapsTimeout={mapsTimeout}
          mapsError={mapsError}
          onGetCurrentLocation={handleGetCurrentLocation}
          onRetry={tentarNovamente}
        />
      </div>

      {/* ===== 3. INPUTS + BOTÃO ===== */}
      <div className="shrink-0 bg-[#1A1528] border-t border-white/10 px-4 pt-3 pb-2 shadow-[0_-4px_20px_rgba(0,0,0,0.5)]">
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

        <PriceEstimate preco={precoEstimado} visible={!!(origem && destino)} />

        <button
          onClick={handleSolicitarCorrida}
          disabled={solicitando || !destino}
          className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-base shadow-lg flex items-center justify-center gap-2"
        >
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando motorista...</>
          ) : (
            <><Car size={20} /> Chamar ObaLeva</>
          )}
        </button>
      </div>

      {/* ===== 4. BANNER INFERIOR ===== */}
      <div className="shrink-0 h-10 bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-t border-white/10 flex items-center justify-center px-4">
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