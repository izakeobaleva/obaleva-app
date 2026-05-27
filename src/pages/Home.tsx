import { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRideRequest } from '../hooks/useRideRequest';
import { MapSection } from '../components/Home/MapSection';
import { LocationInput } from '../components/Home/LocationInput';
import { PriceEstimate } from '../components/Home/PriceEstimate';
import { BottomNavBar } from '../components/Home/BottomNavBar';
import { LogOut, Car } from 'lucide-react';
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
  if (userLocation && !origem && !enderecoBuscado.current) {
    enderecoBuscado.current = true;
    setBuscandoEndereco(true);
    reverseGeocode(userLocation.lat, userLocation.lng).then((endereco) => {
      setOrigem(endereco);
      setBuscandoEndereco(false);
    });
  }

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
      {/* MAPA */}
      <MapSection
        userLocation={userLocation}
        mapsLoaded={mapsLoaded}
        mapsTimeout={mapsTimeout}
        onGetCurrentLocation={handleGetCurrentLocation}
      />

      {/* HEADER */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/60 to-transparent p-4 pb-12 z-10 pointer-events-none">
        <div className="flex items-center justify-between pointer-events-auto">
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

      {/* PAINEL INFERIOR */}
      <div className="bg-[#1A1528]/95 backdrop-blur-xl border-t border-white/10 px-4 pt-4 pb-2 z-10">
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

        {/* Preço */}
        <PriceEstimate preco={precoEstimado} visible={!!(origem || destino)} />

        {/* Botão Chamar */}
        <button
          onClick={handleSolicitarCorrida}
          disabled={solicitando || !destino}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 text-lg shadow-lg flex items-center justify-center gap-2"
        >
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando motorista...</>
          ) : (
            <><Car size={22} /> Chamar ObaLeva</>
          )}
        </button>

        {/* Bottom Nav */}
        <BottomNavBar />
      </div>
    </div>
  );
}
</dyad-file>

Pronto! Refatorei a Home.tsx em componentes modulares:

**📁 Novos Componentes Criados:**
- `src/components/Home/MapSection.tsx` → Mapa com marcador azul, círculo pulsante e botão de centralizar localização
- `src/components/Home/LocationInput.tsx` → Campo de endereço com botões Editar/Confirmar e dropdown de sugestões
- `src/components/Home/PriceEstimate.tsx` → Card de preço estimado com animação
- `src/components/Home/BottomNavBar.tsx` → Barra de navegação inferior

**📁 Novos Hooks Criados:**
- `src/hooks/useGoogleMaps.ts` → Serviços do Google Maps (autocomplete, geocodificação)
- `src/hooks/useGeolocation.ts` → Gerenciamento de localização do usuário
- `src/hooks/useRideRequest.ts` → Lógica de solicitar corrida

**✅ Benefícios:**
- Código mais limpo e testável
- Componentes reutilizáveis em outras telas
- Responsabilidades bem separadas (mapa, formulário, hooks)
- Facilidade para manutenção futura

<dyad-command type="restart"></dyad-command><dyad-write path="src/components/Home/PriceEstimate.tsx">
import { DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

interface PriceEstimateProps {
  preco: number | null;
  visible: boolean;
}

export function PriceEstimate({ preco, visible }: PriceEstimateProps) {
  if (!visible || !preco) return null;

  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-2.5 rounded-xl border border-white/10 mb-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DollarSign size={18} className="text-[#F4D03F]" />
          <span className="font-bold text-base text-white">R$ {preco.toFixed(2)}</span>
          <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
        </div>
        <span className="text-xs text-[#A0A0B0]">~15 min</span>
      </div>
    </motion.div>
  );
}