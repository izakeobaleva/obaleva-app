import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, MapPin, Navigation, User, Truck, Shield, Star, Zap, Gift, Chrome, Home, Search, Menu as MenuIcon, LogOut, ChevronLeft, ChevronRight, Video, Megaphone, Coffee, Heart } from 'lucide-react';
import { toast } from 'sonner';

// ==================== COMPONENTES INTERNOS ====================

// BottomNav (barra fixa inferior) - ALINHADA COM O CONTAINER
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-[#1A1528] border-t border-white/10 z-50">
      <div className="max-w-md mx-auto px-6 py-1.5">
        <div className="flex justify-between items-center">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-0.5 transition-colors ${isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}
                style={{ minHeight: '48px', minWidth: '56px' }}
              >
                <tab.icon size={20} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-[10px] font-medium">{tab.label}</span>
                {isActive && <div className="w-1 h-0.5 rounded-full bg-[#F4D03F] mt-0.5" />}
              </button>
            );
          })}
        </div>
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
    { icon: <Gift size={18} />, title: "1ª grátis", description: "Até R$ 20", color: "#F4D03F", type: "promo" },
    { icon: <Shield size={18} />, title: "Seguro", description: "Proteção total", color: "#6B2D8C", type: "info" },
    { icon: <Star size={18} />, title: "4.8★", description: "Motoristas top", color: "#F4D03F", type: "info" },
    { icon: <Zap size={18} />, title: "Rápido", description: "Chegada ágil", color: "#9B59B6", type: "info" },
    { icon: <Video size={18} />, title: "Tutorial", description: "Como usar", color: "#F4D03F", type: "video" },
    { icon: <Megaphone size={18} />, title: "Indique", description: "Ganhe R$ 10", color: "#6B2D8C", type: "promo" },
    { icon: <Coffee size={18} />, title: "Parceiros", description: "Descontos", color: "#9B59B6", type: "promo" },
    { icon: <Heart size={18} />, title: "Solidário", description: "Doação", color: "#F4D03F", type: "promo" },
  ];

  return (
    <div className="mt-3">
      <div className="relative">
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-0.5 backdrop-blur-sm hover:bg-black/80 transition"
        >
          <ChevronLeft size={14} className="text-white" />
        </button>
        <div
          ref={scrollRef}
          className="flex overflow-x-auto scrollbar-hide gap-2 snap-x snap-mandatory"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {cards.map((card, idx) => (
            <div
              key={idx}
              className="min-w-[calc(50%-4px)] max-w-[calc(50%-4px)] snap-start bg-[#1A1528] rounded-xl p-2 border border-white/10 hover:border-[#F4D03F]/50 transition-all cursor-pointer"
            >
              <div className="flex items-start gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `${card.color}20` }}>
                  <div style={{ color: card.color }}>{card.icon}</div>
                </div>
                <div className="flex-1">
                  <h4 className="text-white font-semibold text-[11px]">{card.title}</h4>
                  <p className="text-[#A0A0B0] text-[9px] mt-0.5 leading-tight">{card.description}</p>
                  {card.type === 'video' && <div className="mt-0.5 text-[#F4D03F] text-[8px]">▶️ Assistir</div>}
                  {card.type === 'promo' && <div className="mt-0.5 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-[8px] px-1 py-0.5 rounded-full">Promo</div>}
                </div>
              </div>
            </div>
          ))}
        </div>
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 rounded-full p-0.5 backdrop-blur-sm hover:bg-black/80 transition"
        >
          <ChevronRight size={14} className="text-white" />
        </button>
      </div>
    </div>
  );
};

// Componente de mapa ao vivo
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
    <div className="relative h-48 w-full bg-gradient-to-br from-[#2a1a3a] to-[#1a1a2e] rounded-xl flex flex-col items-center justify-center overflow-hidden mb-3">
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-24 h-24 rounded-full bg-[#F4D03F]/10 animate-pulse" />
        <div className="absolute w-6 h-6 rounded-full bg-[#F4D03F] flex items-center justify-center shadow-lg">
          <MapPin size={12} className="text-black" />
        </div>
      </div>

      <div className="absolute bottom-1.5 left-1.5 z-10 bg-black/50 backdrop-blur-sm px-1.5 py-0.5 rounded-full">
        <p className="text-white text-[8px] flex items-center gap-0.5">
          <MapPin size={8} className="text-[#F4D03F]" />
          📍 {userLocation ? `${userLocation.lat.toFixed(2)}, ${userLocation.lng.toFixed(2)}` : 'Buscando...'}
        </p>
      </div>

      <div className="absolute top-1 left-0 right-0 z-10 text-center">
        <div className="flex items-center justify-center gap-1 mb-0">
          <Car className="text-[#F4D03F]" size={18} />
          <h1 className="text-base font-bold text-white drop-shadow-lg">OBALEVA</h1>
        </div>
        <p className="text-white/70 text-[8px] drop-shadow-lg">Mobilidade premium</p>
      </div>
    </div>
  );
};

// Tela de login
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-3 border border-white/10">
    <div className="text-center mb-2">
      <h2 className="text-sm font-bold text-white">Bem-vindo</h2>
      <p className="text-[#A0A0B0] text-[10px]">Entre para solicitar corridas</p>
    </div>
    <div className="space-y-2">
      <button onClick={onGoogleLogin} className="w-full py-1.5 rounded-lg border border-white/20 bg-white/5 text-white flex items-center justify-center gap-1.5 hover:bg-white/10 transition text-xs">
        <Chrome size={14} /> Entrar com Google
      </button>
      <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center text-[8px]"><span className="bg-[#1A1528] px-1.5 text-[#A0A0B0]">ou</span></div></div>
      <form onSubmit={onEmailLogin} className="space-y-1.5">
        <input type="email" placeholder="E-mail" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
        <button type="submit" disabled={loginLoading} className="btn-amarelo w-full py-1.5 rounded-lg font-bold text-xs">Entrar</button>
      </form>
    </div>
  </div>
);

// Dashboard do passageiro
const PassengerDashboard = () => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-3 border border-white/10">
    <div className="space-y-2">
      <div className="flex items-center gap-2 bg-[#0F0B1A] p-1.5 rounded-lg">
        <MapPin size={14} className="text-[#F4D03F]" />
        <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none text-xs" defaultValue="Local atual" />
      </div>
      <div className="flex items-center gap-2 bg-[#0F0B1A] p-1.5 rounded-lg">
        <Navigation size={14} className="text-[#6B2D8C]" />
        <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none text-xs" />
      </div>
      <button className="btn-amarelo w-full py-1.5 rounded-lg font-bold text-xs flex items-center justify-center gap-1.5">
        <Car size={12} /> Solicitar
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
    <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-3 border border-white/10">
      <h2 className="text-white font-bold text-xs mb-2">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <input placeholder="Nome" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={password} onChange={e => setPassword(e.target.value)} required />
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-1.5 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-xs" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="btn-amarelo w-full py-1.5 rounded-lg font-bold text-xs">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
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
    <div className="min-h-screen bg-[#0F0B1A] pb-14">
      <div className="max-w-md mx-auto px-4 pt-2">
        <LiveMap />
        
        {!user ? (
          <LoginScreen
            onGoogleLogin={async () => { const { error } = await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); if (error) toast.error('Erro'); }}
            onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) toast.error('E-mail ou senha inválidos'); setLoginLoading(false); }}
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        ) : !profile ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-1.5 rounded-lg border border-white/20 text-white bg-[#1A1528] text-xs">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-1.5 rounded-lg border border-white/20 text-white bg-[#1A1528] text-xs">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
            <Truck className="text-[#F4D03F] w-6 h-6 mx-auto mb-1" />
            <h2 className="text-white font-bold text-xs">Motorista</h2>
            <p className="text-[#A0A0B0] text-[9px]">Aguardando aprovação</p>
            <button className="mt-1.5 px-3 py-0.5 rounded-full bg-green-600 text-white text-[9px]">🟢 Online</button>
          </div>
        ) : (
          <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-3 border border-white/10 text-center">
            <Shield className="text-[#F4D03F] w-6 h-6 mx-auto mb-1" />
            <h2 className="text-white font-bold text-xs">Admin</h2>
          </div>
        )}

        <DiscoverBar />
      </div>
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};