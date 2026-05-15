import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, MapPin, Navigation, User, Truck, Shield, Star, Zap, Gift, ChevronRight, Chrome, Home, Search, Menu as MenuIcon, LogOut, ChevronLeft, Video, Megaphone, Coffee, Heart } from 'lucide-react';
import { toast } from 'sonner';

// ==================== COMPONENTES INTERNOS ====================

// BottomNav (barra fixa inferior principal) - ALINHADA LATERALMENTE
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1528] border-t border-white/10 z-50">
      <div className="flex justify-between items-center max-w-md mx-auto px-6 py-2">
        {tabs.map((tab) => {
          const isActive = active === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 transition-colors ${isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}
              style={{ minHeight: '56px', minWidth: '64px' }}
            >
              <tab.icon size={22} strokeWidth={isActive ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {isActive && <div className="w-1 h-1 rounded-full bg-[#F4D03F] mt-1" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};

// DiscoverBar (cards roláveis)
const DiscoverBar = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
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
    <div className="mt-6">
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm hover:bg-black/70 transition"
        >
          <ChevronLeft size={20} className="text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-3 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="min-w-[calc(50%-6px)] max-w-[calc(50%-6px)] snap-start bg-[#1A1528] rounded-2xl p-3 border border-white/10 hover:border-[#F4D03F]/50 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `${card.color}20` }}>
                  <div style={{ color: card.color }}>{card.icon}</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                  <p className="text-[#A0A0B0] text-xs mt-1">{card.description}</p>
                  {card.type === 'video' && <div className="mt-1 text-[#F4D03F] text-xs">▶️ Assistir</div>}
                  {card.type === 'promo' && <div className="mt-1 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-xs px-2 py-0.5 rounded-full">Promoção</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm hover:bg-black/70 transition"
        >
          <ChevronRight size={20} className="text-white" />
        </button>
      </div>
    </div>
  );
};

// Componente de mapa ao vivo com LOGO SOBREPOSTO NO TOPO
const LiveMap = () => {
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        (err) => console.error('Erro ao obter localização:', err)
      );
    }
  }, []);

  return (
    <div className="relative h-64 w-full bg-gradient-to-br from-[#2a1a3a] to-[#1a1a2e] rounded-2xl flex flex-col items-center justify-center overflow-hidden mb-4">
      {/* Elementos de mapa animados */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-32 h-32 rounded-full bg-[#F4D03F]/10 animate-pulse" />
        <div className="absolute w-8 h-8 rounded-full bg-[#F4D03F] flex items-center justify-center shadow-lg">
          <MapPin size={16} className="text-black" />
        </div>
      </div>

      {/* Localização atual (canto inferior esquerdo) */}
      <div className="absolute bottom-3 left-3 z-10 bg-black/50 backdrop-blur-sm px-3 py-1.5 rounded-full">
        <p className="text-white text-xs flex items-center gap-1">
          <MapPin size={12} className="text-[#F4D03F]" />
          📍 {userLocation ? `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}` : 'Buscando localização...'}
        </p>
      </div>

      {/* LOGO E SLOGAN SOBREPOSTOS NO TOPO DO MAPA */}
      <div className="absolute top-4 left-0 right-0 z-10 text-center">
        <div className="flex items-center justify-center gap-2 mb-1">
          <Car className="text-[#F4D03F]" size={28} />
          <h1 className="text-2xl font-bold text-white drop-shadow-lg">OBALEVA</h1>
        </div>
        <p className="text-white/80 text-xs drop-shadow-lg">Mobilidade premium para sua cidade</p>
      </div>
    </div>
  );
};

// Tela de login
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-5 border border-white/10 shadow-xl">
    <div className="text-center mb-4">
      <h2 className="text-lg font-bold text-white">Bem-vindo</h2>
      <p className="text-[#A0A0B0] text-xs">Entre para solicitar corridas</p>
    </div>
    <div className="space-y-3">
      <button onClick={onGoogleLogin} className="w-full py-2.5 rounded-xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition text-sm">
        <Chrome size={16} /> Entrar com Google
      </button>
      <div className="relative my-3"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-xs"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div></div>
      <form onSubmit={onEmailLogin} className="space-y-2">
        <input type="email" placeholder="E-mail" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
        <button type="submit" disabled={loginLoading} className="btn-amarelo w-full py-2.5 rounded-xl font-bold text-sm">Entrar com E-mail</button>
      </form>
    </div>
  </div>
);

// Dashboard do passageiro
const PassengerDashboard = () => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
    <div className="space-y-3">
      <div className="flex items-center gap-3 bg-[#0F0B1A] p-2.5 rounded-xl">
        <MapPin size={18} className="text-[#F4D03F]" />
        <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none text-sm" defaultValue="Local atual" />
      </div>
      <div className="flex items-center gap-3 bg-[#0F0B1A] p-2.5 rounded-xl">
        <Navigation size={18} className="text-[#6B2D8C]" />
        <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none text-sm" />
      </div>
      <button className="btn-amarelo w-full py-2.5 rounded-xl font-bold text-sm flex items-center justify-center gap-2">
        <Car size={16} /> Solicitar ObaLeva
      </button>
    </div>
  </div>
);

// Cadastro rápido
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
    <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10">
      <h2 className="text-white font-bold text-base mb-3">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Nome completo" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-2.5 rounded-xl bg-[#0F0B1A] border border-white/10 text-white text-sm" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="btn-amarelo w-full py-2.5 rounded-xl font-bold text-sm">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

// ==================== TELA PRINCIPAL ====================

export const MainScreen = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  useEffect(() => {
    let inactivityTimer: NodeJS.Timeout;
    const resetTimer = () => {
      if (inactivityTimer) clearTimeout(inactivityTimer);
      inactivityTimer = setTimeout(() => {
        if (user) handleLogout();
      }, 5 * 60 * 1000);
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
    <div className="min-h-screen bg-[#0F0B1A] pb-20">
      {/* CONTAINER PRINCIPAL (SIMULA TELA DE CELULAR) */}
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* MAPA COM LOGO SOBREPOSTO */}
        <LiveMap />

        {/* ÁREA DE AÇÃO (LOGIN / DASHBOARD) */}
        {!user ? (
          <LoginScreen
            onGoogleLogin={async () => {
              const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
              if (error) toast.error('Erro ao logar com Google');
            }}
            onEmailLogin={async (e) => {
              e.preventDefault();
              setLoginLoading(true);
              const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
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
          <div className="space-y-3">
            <div className="flex gap-3">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white bg-[#1A1528] text-sm">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-2.5 rounded-xl border border-white/20 text-white bg-[#1A1528] text-sm">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
            <Truck className="text-[#F4D03F] w-10 h-10 mx-auto mb-2" />
            <h2 className="text-white font-bold text-base">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-xs">Aguardando aprovação</p>
            <button className="mt-3 px-5 py-1.5 rounded-full bg-green-600 text-white text-sm">🟢 Online</button>
          </div>
        ) : (
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-2xl p-4 border border-white/10 text-center">
            <Shield className="text-[#F4D03F] w-10 h-10 mx-auto mb-2" />
            <h2 className="text-white font-bold text-base">Painel Administrativo</h2>
          </div>
        )}

        {/* CARDS ROLÁVEIS (DESCOBRIR) */}
        <DiscoverBar />
      </div>

      {/* BOTTOM NAV (ALINHADA LATERALMENTE) */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};