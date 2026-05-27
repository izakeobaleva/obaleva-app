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
      <header className="h-16 bg-[#1A1528]/95 backdrop-blur-xl border-b border-white/10 flex items-center justify-between px-4 z-30 shrink-0">
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

      {/* ===== 2. ESPAÇO PUBLICITÁRIO ===== */}
      <div className="h-10 bg-gradient-to-r from-[#1A1528] to-[#2D2342] border-b border-white/10 flex items-center justify-center px-4 shrink-0">
        <div className="flex items-center gap-2">
          <Megaphone size={14} className="text-[#F4D03F]" />
          <span className="text-xs text-white/60">
            📢 Baixe o app e ganhe <strong className="text-[#F4D03F]">R$ 10</strong> na primeira corrida!
          </span>
        </div>
      </div>

      {/* ===== 3. MAPA AO VIVO - OCUPA TODO O ESPAÇO RESTANTE ===== */}
      <div className="flex-1 relative w-full min-h-0">
        <MapSection
          userLocation={userLocation}
          mapsLoaded={mapsLoaded}
          mapsTimeout={mapsTimeout}
          onGetCurrentLocation={handleGetCurrentLocation}
        />
      </div>

      {/* ===== 4. INPUTS + PREÇO + BOTÃO ===== */}
      <div className="bg-[#1A1528]/95 border-t border-white/10 px-4 pt-3 pb-2 shrink-0">
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

      {/* ===== 5. BOTTOM BAR - PERFIL + GOOGLE ===== */}
      <div className="h-14 bg-[#1A1528]/95 backdrop-blur-xl border-t border-white/10 px-4 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#F4D03F] to-amber-500 flex items-center justify-center shrink-0">
            <User size={18} className="text-[#1E1E2F]" />
          </div>
          <div className="min-w-0">
            <p className="text-white text-sm font-medium truncate">
              {user?.email?.split('@')[0] || 'Usuário'}
            </p>
            <p className="text-[#A0A0B0] text-xs truncate">
              {user?.email || 'Não logado'}
            </p>
          </div>
        </div>
        <button
          onClick={() => {
            if (!user) navigate('/login');
            else navigate('/profile');
          }}
          className="px-4 py-2.5 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-xs shrink-0"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          {user ? 'Perfil' : 'Entrar'}
        </button>
      </div>
    </div>
  );
}