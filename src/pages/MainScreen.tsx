import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, MapPin, Navigation, User, Truck, Shield, Star, Zap, 
  Gift, Chrome, Home, Search, Menu as MenuIcon, LogOut, 
  ChevronLeft, Video, Megaphone, Coffee, Heart 
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import MapComponent from '../components/MapComponent';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="flex justify-center">
      <div className="bg-[#1A1528] border border-white/10 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-4 py-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
                }`}
              >
                <tab.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && <div className="w-1.5 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DISCOVER BAR - CARDS ROLÁVEIS
// ============================================
const DiscoverBar = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ 
        left: direction === 'left' ? -scrollAmount : scrollAmount, 
        behavior: 'smooth' 
      });
    }
  };

  const cards = [
    { icon: <Gift size={24} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F", type: "promo" },
    { icon: <Shield size={24} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#6B2D8C", type: "info" },
    { icon: <Star size={24} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F", type: "info" },
    { icon: <Zap size={24} />, title: "Rápido", description: "Chegada em minutos", color: "#9B59B6", type: "info" },
    { icon: <Video size={24} />, title: "Como funciona?", description: "Assista ao vídeo", color: "#F4D03F", type: "video" },
    { icon: <Megaphone size={24} />, title: "Indique e ganhe", description: "R$ 10 de crédito", color: "#6B2D8C", type: "promo" },
    { icon: <Coffee size={24} />, title: "Parceiros", description: "Descontos exclusivos", color: "#9B59B6", type: "promo" },
    { icon: <Heart size={24} />, title: "ObaLeva Solidário", description: "Doação por corrida", color: "#F4D03F", type: "promo" },
  ];

  return (
    <div className="relative">
      <button
        onClick={() => scroll('left')}
        className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-1.5 backdrop-blur-sm"
      >
        <ChevronLeft size={18} className="text-white" />
      </button>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-2.5 pb-1 snap-x snap-mandatory"
      >
        {cards.map((card, idx) => (
          <div
            key={idx}
            className="min-w-[calc(50%-3px)] max-w-[calc(50%-3px)] snap-start bg-[#1A1528] rounded-xl p-4 border border-white/10"
          >
            <div className="flex items-start gap-3">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`} 
                   style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                <p className="text-[#A0A0B0] text-xs mt-0.5">{card.description}</p>
                {card.type === 'promo' && (
                  <div className="mt-1 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-[10px] px-2 py-0.5 rounded-full">
                    Promoção
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={() => scroll('right')}
        className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-1.5 backdrop-blur-sm"
      >
        <ChevronRight size={18} className="text-white" />
      </button>
    </div>
  );
};

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
    <div className="text-center mb-3">
      <h2 className="text-base font-bold text-white">Bem-vindo</h2>
      <p className="text-[#A0A0B0] text-xs">Entre para solicitar corridas</p>
    </div>
    <div className="space-y-3">
      <button onClick={onGoogleLogin} className="w-full py-2.5 rounded-lg border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition text-sm">
        <Chrome size={16} /> Entrar com Google
      </button>
      <div className="relative my-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10"></div>
        </div>
        <div className="relative flex justify-center text-[10px]">
          <span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span>
        </div>
      </div>
      <form onSubmit={onEmailLogin} className="space-y-2">
        <input 
          type="email" 
          placeholder="E-mail" 
          autoComplete="username"
          className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" 
          value={loginEmail} 
          onChange={e => setLoginEmail(e.target.value)} 
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          autoComplete="current-password"
          className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" 
          value={loginPassword} 
          onChange={e => setLoginPassword(e.target.value)} 
          required 
        />
        <button type="submit" disabled={loginLoading} className="btn-amarelo w-full py-2 rounded-lg font-bold text-sm">
          {loginLoading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>
    </div>
  </div>
);

// ============================================
// DASHBOARD DO PASSAGEIRO
// ============================================
const PassengerDashboard = ({ 
  pickupLocation, dropoffLocation, setPickupLocation, setDropoffLocation, 
  pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, 
  onRequestRide 
}: any) => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
    <div className="space-y-3">
      <div className="flex items-center gap-2.5 bg-[#0F0B1A] p-2 rounded-lg">
        <MapPin size={16} className="text-green-500" />
        <input 
          type="text" 
          placeholder="Onde você está?" 
          className="flex-1 bg-transparent text-white outline-none text-sm"
          value={pickupAddress}
          onChange={(e) => setPickupAddress(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-2.5 bg-[#0F0B1A] p-2 rounded-lg">
        <Navigation size={16} className="text-red-500" />
        <input 
          type="text" 
          placeholder="Para onde vai?" 
          className="flex-1 bg-transparent text-white outline-none text-sm"
          value={dropoffAddress}
          onChange={(e) => setDropoffAddress(e.target.value)}
        />
      </div>
      <button onClick={onRequestRide} className="btn-amarelo w-full py-2 rounded-lg font-bold text-sm flex items-center justify-center gap-2">
        <Car size={14} /> Solicitar ObaLeva
      </button>
    </div>
  </div>
);

// ============================================
// TELA PRINCIPAL
// ============================================
export const MainScreen = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  const handleRequestRide = () => {
    if (!pickupAddress || !dropoffAddress) {
      toast.error('Por favor, preencha a origem e o destino!');
      return;
    }
    toast.success(`Corrida solicitada! 🚗\nDe: ${pickupAddress}\nPara: ${dropoffAddress}`);
  };

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => { if (user) handleLogout(); }, 5 * 60 * 1000);
    };
    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keydown', resetTimer);
    window.addEventListener('click', resetTimer);
    resetTimer();
    return () => {
      clearTimeout(inactivityTimer);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keydown', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [user]);

  if (loading) return <div className="flex items-center justify-center min-h-screen text-white">Carregando...</div>;

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-md mx-auto px-4">
        {/* MAPA - altura 220px com fundo de teste */}
        <div className="h-[220px] rounded-xl overflow-hidden shadow-lg bg-amber-500/30">
          {/* Se você vir uma área amarelada, o container existe */}
          <MapComponent
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onPickupChange={setPickupAddress}
            onDropoffChange={setDropoffAddress}
            onLocationSelect={(location: any) => {
              if (!dropoffAddress) {
                setPickupLocation(location);
                setPickupAddress(location.address);
              } else {
                setDropoffLocation(location);
                setDropoffAddress(location.address);
              }
            }}
          />
        </div>

        {/* ÁREA DE AÇÃO - com mt-1 (4px) */}
        <div className="mt-1">
          {!user ? (
            <LoginScreen
              onGoogleLogin={async () => { 
                const { error } = await supabase.auth.signInWithOAuth({ 
                  provider: 'google', 
                  options: { redirectTo: window.location.origin } 
                }); 
                if (error) toast.error('Erro ao logar com Google'); 
              }}
              onEmailLogin={async (e: React.FormEvent) => { 
                e.preventDefault(); 
                setLoginLoading(true); 
                const { error } = await supabase.auth.signInWithPassword({ 
                  email: loginEmail, 
                  password: loginPassword 
                }); 
                if (error) toast.error('E-mail ou senha inválidos'); 
                setLoginLoading(false); 
              }}
              loginEmail={loginEmail} 
              setLoginEmail={setLoginEmail}
              loginPassword={loginPassword} 
              setLoginPassword={setLoginPassword}
              loginLoading={loginLoading}
            />
          ) : !profile ? (
            <div className="space-y-2">
              <div className="flex gap-2">
                <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-2 rounded-lg border border-white/20 text-white bg-[#1A1528] text-sm">Passageiro</button>
                <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-2 rounded-lg border border-white/20 text-white bg-[#1A1528] text-sm">Motorista</button>
              </div>
              {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
              {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
            </div>
          ) : profile.tipo === 'passageiro' ? (
            <PassengerDashboard
              pickupLocation={pickupLocation}
              dropoffLocation={dropoffLocation}
              setPickupLocation={setPickupLocation}
              setDropoffLocation={setDropoffLocation}
              pickupAddress={pickupAddress}
              setPickupAddress={setPickupAddress}
              dropoffAddress={dropoffAddress}
              setDropoffAddress={setDropoffAddress}
              onRequestRide={handleRequestRide}
            />
          ) : profile.tipo === 'motorista' ? (
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <Truck className="text-[#F4D03F] w-8 h-8 mx-auto mb-1.5" />
              <h2 className="text-white font-bold text-sm">Painel do Motorista</h2>
              <p className="text-[#A0A0B0] text-xs">Aguardando aprovação</p>
              <button className="mt-2 px-4 py-1 rounded-full bg-green-600 text-white text-xs">🟢 Online</button>
            </div>
          ) : (
            <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10 text-center">
              <Shield className="text-[#F4D03F] w-8 h-8 mx-auto mb-1.5" />
              <h2 className="text-white font-bold text-sm">Painel Administrativo</h2>
            </div>
          )}
        </div>

        {/* CARDS ROLÁVEIS - com mt-1 (4px) */}
        <div className="mt-1">
          <DiscoverBar />
        </div>
      </div>

      {/* BOTTOM NAV - com mt-1 (4px) */}
      <div className="mt-1">
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    </div>
  );
};

// ============================================
// COMPONENTE DE CADASTRO RÁPIDO
// ============================================
const CadastroRapido = ({ tipo, onSuccess }: { tipo: 'passageiro' | 'motorista'; onSuccess: () => void }) => {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo: nome, tipo } } 
      });
      if (error) throw error;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      
      await supabase.from('usuarios').insert({ 
        id: auth.user.id, 
        nome_completo: nome, 
        cpf, 
        telefone, 
        email, 
        tipo 
      });
      
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: auth.user.id });
      } else {
        await supabase.from('motoristas').insert({ 
          id: auth.user.id, 
          status: 'pendente', 
          dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } 
        });
      }
      
      toast.success('Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h2 className="text-white font-bold text-sm mb-3">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Nome completo" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="btn-amarelo w-full py-2 rounded-lg font-bold text-sm">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

// Importar ChevronRight
const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);