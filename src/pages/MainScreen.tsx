import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, User, Truck, Shield, Star, Zap, Gift, 
  Home, Search, Menu as MenuIcon, LogOut, ChevronLeft, 
  Video, Megaphone, Coffee, Heart, Eye, EyeOff, Map, ArrowRight
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import MapComponent from '../components/MapComponent';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride, Location } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';

// ============================================
// BOTTOM NAVIGATION - FAIXA FIXA
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-2 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-2 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-xl max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between items-center px-3 py-1.5">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-0.5 transition-all duration-200 ${
                active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
              }`}
            >
              <tab.icon size={22} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-[10px] font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-1 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DISCOVER BAR - CARDS ROLÁVEIS (COMPACTADO)
// ============================================
const DiscoverBar = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const cards = [
    { emoji: "🎁", title: "1ª grátis", desc: "R$20 off", color: "#F4D03F" },
    { emoji: "🛡️", title: "Seguro", desc: "Proteção", color: "#8B5CF6" },
    { emoji: "⭐", title: "4.8★", desc: "Top", color: "#F4D03F" },
    { emoji: "⚡", title: "Rápido", desc: "Minutos", color: "#A855F7" },
    { emoji: "📹", title: "Como funciona?", desc: "Watch", color: "#F4D03F" },
    { emoji: "📢", title: "Indique", desc: "R$10", color: "#8B5CF6" },
    { emoji: "☕", title: "Parceiros", desc: "Off", color: "#A855F7" },
    { emoji: "❤️", title: "Solidário", desc: "Doação", color: "#F4D03F" },
  ];

  return (
    <div className="relative mt-2 mb-20">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronLeft size={14} className="text-[#F4D03F]" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-1.5 pb-1 px-1">
        {cards.map((card, idx) => (
          <div key={idx} className="min-w-[105px] max-w-[105px] bg-[#1A1528] rounded-lg p-1.5 border border-[#F4D03F]/10">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-base" style={{ backgroundColor: `${card.color}20` }}>
                {card.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-[10px] truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[8px] truncate">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronRight size={14} className="text-[#F4D03F]" />
      </button>
    </div>
  );
};

// ============================================
// LOCATION INPUTS (COMPACTADO)
// ============================================
const LocationInputs = ({ pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, disabled }: any) => (
  <div className="bg-[#1A1528] rounded-xl p-2 border border-[#F4D03F]/15">
    <div className="flex items-center gap-1.5 mb-1 pb-0.5 border-b border-white/10">
      <Map size={12} className="text-[#F4D03F]" />
      <span className="text-white text-[10px] font-medium">Definir rota</span>
    </div>
    
    <div className="bg-white/5 rounded-lg border border-white/10 mb-1">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
        <input 
          type="text" 
          placeholder="Onde você está?" 
          className="flex-1 bg-transparent text-white outline-none text-xs"
          value={pickupAddress} 
          onChange={(e) => setPickupAddress(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
    
    <div className="bg-white/5 rounded-lg border border-white/10">
      <div className="flex items-center gap-2 px-2 py-1.5">
        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
        <input 
          type="text" 
          placeholder="Para onde vai?" 
          className="flex-1 bg-transparent text-white outline-none text-xs"
          value={dropoffAddress} 
          onChange={(e) => setDropoffAddress(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
    
    <button 
      onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} 
      className="mt-1 w-full text-center text-[9px] text-[#A0A0B0] hover:text-[#F4D03F] transition py-0.5"
      disabled={disabled}
    >
      ↕️ Trocar
    </button>
  </div>
);

// ============================================
// ACTION BUTTON (COMPACTADO)
// ============================================
const ActionButton = ({ onRequestRide, disabled, loading }: any) => (
  <button 
    onClick={onRequestRide} 
    disabled={disabled} 
    className={`w-full py-2 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold flex items-center justify-center gap-2 text-sm transition-all duration-200 ${
      disabled ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.01] active:scale-[0.99] shadow-md'
    }`}
  >
    {loading ? (
      <><svg className="animate-spin h-4 w-4" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando...</>
    ) : (
      <><Car size={16} /> SOLICITAR OBALEVALe <ArrowRight size={14} /></>
    )}
  </button>
);

// ============================================
// LOGIN FORM (COMPACTADO)
// ============================================
const LoginForm = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15 mt-2">
      <div className="text-center mb-2">
        <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-gradient-to-br from-[#F4D03F]/20 to-[#8B5CF6]/20 flex items-center justify-center">
          <Car className="text-[#F4D03F] w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-white">Bem-vindo</h2>
        <p className="text-[#A0A0B0] text-[10px]">Faça login para solicitar</p>
      </div>
      
      <div className="space-y-2">
        <button onClick={onGoogleLogin} className="w-full py-1.5 rounded-lg border border-[#F4D03F]/30 bg-white/5 text-white flex items-center justify-center gap-2 text-xs">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
            <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
          </svg>
          Google
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[9px]"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div>
        </div>

        <form onSubmit={onEmailLogin} className="space-y-1.5">
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="text-xs">📧</span>
              <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none text-xs" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="text-xs">🔒</span>
              <input type={showPassword ? "text" : "password"} placeholder="Senha" className="flex-1 bg-transparent text-white outline-none text-xs" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0]">{showPassword ? <EyeOff size={12} /> : <Eye size={12} />}</button>
            </div>
          </div>
          
          <button type="submit" disabled={loginLoading} className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-xs">
            {loginLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL - LAYOUT COMPACTADO
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  
  // Estado do fluxo de corrida
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Verificar se há corrida ativa ao carregar
  useEffect(() => {
    if (user?.id) {
      carregarCorridaAtiva();
    }
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [user]);

  async function carregarCorridaAtiva() {
    const corrida = await buscarCorridaAtiva(user!.id);
    if (corrida) {
      setActiveRide(corrida);
      setShowRideModal(true);
      subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
        setActiveRide(updatedRide);
        if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
          setTimeout(() => {
            setShowRideModal(false);
            setActiveRide(null);
          }, 3000);
        }
      });
    }
  }

  async function handleRequestRide() {
    if (!user) {
      toast.error('🔐 Faça login para solicitar uma corrida!');
      return;
    }
    
    if (!pickupAddress || !dropoffAddress) {
      toast.error('📍 Preencha a origem e o destino!');
      return;
    }
    
    // Simular coordenadas a partir do endereço (em produção seria geocoding)
    const mockLocation = (address: string): Location => ({
      lat: -23.5505 + Math.random() * 0.02,
      lng: -46.6333 + Math.random() * 0.02,
      address: address,
    });
    
    const origemLoc = mockLocation(pickupAddress);
    const destinoLoc = mockLocation(dropoffAddress);
    
    setSolicitando(true);
    
    try {
      const corrida = await solicitarCorrida(user.id, origemLoc, destinoLoc);
      
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        setPickupAddress('');
        setDropoffAddress('');
        
        toast.success('🚗 Corrida solicitada! Buscando motorista...');
        
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setActiveRide(updatedRide);
          
          if (updatedRide.status === 'motorista_em_rota') {
            toast.success('👨‍✈️ Motorista encontrado! A caminho...');
          } else if (updatedRide.status === 'motorista_chegou') {
            toast.success('✅ Motorista chegou!');
          } else if (updatedRide.status === 'em_andamento') {
            toast.info('🚗 Corrida em andamento');
          } else if (updatedRide.status === 'finalizada') {
            toast.success('🎉 Corrida finalizada! Obrigado!');
            setTimeout(() => {
              setShowRideModal(false);
              setActiveRide(null);
            }, 3000);
          } else if (updatedRide.status === 'cancelada') {
            toast.error('❌ Corrida cancelada');
            setShowRideModal(false);
            setActiveRide(null);
          }
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar corrida');
    } finally {
      setSolicitando(false);
    }
  }

  async function handleCancelRide() {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) {
        toast.info('Corrida cancelada');
        setShowRideModal(false);
        setActiveRide(null);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      } else {
        toast.error('Erro ao cancelar corrida');
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
            <Car className="text-[#F4D03F] w-5 h-5" />
          </div>
          <p className="text-white text-xs mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <Toaster position="top-center" richColors />
      <div className="max-w-md mx-auto px-3 pb-24">
        
        {/* CABEÇALHO */}
        <div className="py-2 flex justify-between items-center">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-3 h-3" />
            </div>
            <h1 className="text-base font-bold text-white">OBALEVA</h1>
          </div>
          {user && (
            <button onClick={signOut} className="text-[#A0A0B0] text-[9px] flex items-center gap-0.5 hover:text-red-400 transition">
              <LogOut size={10} /> Sair
            </button>
          )}
        </div>

        {/* MAPA - 180px */}
        <div className="relative h-[180px] rounded-xl overflow-hidden shadow-md mb-2">
          <MapComponent />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/50 backdrop-blur-md rounded-xl px-3 py-1 border border-[#F4D03F]/40">
              <div className="flex items-center gap-1.5">
                <div className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
                  <Car className="text-[#F4D03F] w-3.5 h-3.5" />
                </div>
                <div>
                  <h1 className="text-sm font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
                  <p className="text-[#F4D03F] text-[7px] text-center">MOBILIDADE PREMIUM</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ORIGEM E DESTINO */}
        <LocationInputs 
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
          dropoffAddress={dropoffAddress}
          setDropoffAddress={setDropoffAddress}
          disabled={false}
        />

        {/* BOTÃO SOLICITAR */}
        <div className="mt-2">
          <ActionButton 
            onRequestRide={handleRequestRide} 
            disabled={solicitando || !pickupAddress || !dropoffAddress}
            loading={solicitando}
          />
        </div>

        {/* LOGIN (se não logado) */}
        {!user && (
          <LoginForm
            onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }}
            onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) toast.error('E-mail ou senha inválidos'); setLoginLoading(false); }}
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        )}

        {/* CADASTRO (se logado sem perfil) */}
        {user && !profile && (
          <div className="space-y-1.5 mt-2">
            <div className="flex gap-1.5">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-1.5 rounded-lg border border-[#F4D03F]/30 text-white bg-white/5 text-xs">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-1.5 rounded-lg border border-[#F4D03F]/30 text-white bg-white/5 text-xs">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        )}

        {/* PAINEL DO MOTORISTA */}
        {user && profile?.tipo === 'motorista' && (
          <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15 mt-2">
            <Truck className="text-[#F4D03F] w-8 h-8 mx-auto mb-1" />
            <h2 className="text-white font-bold text-sm">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-[10px]">Aguardando aprovação</p>
            <button className="mt-2 px-2 py-0.5 rounded-full bg-green-600 text-white text-[10px]">🟢 Online</button>
          </div>
        )}

        {/* DISCOVER BAR */}
        <DiscoverBar />
      </div>

      {/* BOTTOM NAV */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />

      {/* MODAL DE CORRIDA EM TEMPO REAL */}
      {showRideModal && activeRide && (
        <RideStatusModal
          ride={activeRide}
          onClose={() => setShowRideModal(false)}
          onCancel={handleCancelRide}
        />
      )}
    </div>
  );
};

// ============================================
// CADASTRO RÁPIDO (COMPACTADO)
// ============================================
const CadastroRapido = ({ tipo, onSuccess }: { tipo: 'passageiro' | 'motorista'; onSuccess: () => void }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: auth, error } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome, tipo } } });
      if (error) throw error;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      await supabase.from('usuarios').insert({ id: auth.user.id, nome_completo: nome, cpf, telefone, email, tipo });
      if (tipo === 'passageiro') await supabase.from('passageiros').insert({ id: auth.user.id });
      else await supabase.from('motoristas').insert({ id: auth.user.id, status: 'pendente', dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } });
      toast.success('Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15">
      <h2 className="text-white font-bold text-sm mb-2">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <input placeholder="Nome completo" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs pr-7" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-[#A0A0B0]">{showPassword ? <EyeOff size={12} /> : <Eye size={12} />}</button>
        </div>
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-xs">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

// ============================================
// ICONE CHEVRON RIGHT
// ============================================
const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);