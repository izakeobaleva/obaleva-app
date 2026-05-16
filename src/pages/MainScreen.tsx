import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, User, Truck, Shield, Star, Zap, Gift, Chrome, 
  Home, Search, Menu as MenuIcon, LogOut, ChevronLeft, 
  Video, Megaphone, Coffee, Heart, Eye, EyeOff, Map, ArrowRight
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
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-4 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-4 py-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
              }`}
            >
              <tab.icon size={24} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-1.5 h-1 rounded-full bg-[#F4D03F] mt-0.5 animate-pulse" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DISCOVER BAR
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
    { icon: <Gift size={20} />, title: "1ª corrida grátis", description: "Até R$ 20 off", color: "#F4D03F", badge: "🔥" },
    { icon: <Shield size={20} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#8B5CF6", badge: "✓" },
    { icon: <Star size={20} />, title: "Avaliação 4.8★", description: "Motoristas top", color: "#F4D03F", badge: "⭐" },
    { icon: <Zap size={20} />, title: "Rápido", description: "Chegada rápida", color: "#A855F7", badge: "⚡" },
    { icon: <Video size={20} />, title: "Como funciona?", description: "Assista", color: "#F4D03F", badge: "▶️" },
    { icon: <Megaphone size={20} />, title: "Indique e ganhe", description: "R$ 10", color: "#8B5CF6", badge: "🎁" },
    { icon: <Coffee size={20} />, title: "Parceiros", description: "Descontos", color: "#A855F7", badge: "☕" },
    { icon: <Heart size={20} />, title: "Solidário", description: "Doação", color: "#F4D03F", badge: "❤️" },
  ];

  return (
    <div className="relative mt-4 mb-28">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1.5 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronLeft size={16} className="text-[#F4D03F]" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-2 pb-2 px-1">
        {cards.map((card, idx) => (
          <div key={idx} className="min-w-[150px] max-w-[150px] bg-[#1A1528] rounded-xl p-2 border border-[#F4D03F]/10">
            <div className="flex items-start gap-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0`} style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-xs truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[9px] truncate">{card.description}</p>
                <span className="text-[10px] text-[#F4D03F]">{card.badge}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1.5 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronRight size={16} className="text-[#F4D03F]" />
      </button>
    </div>
  );
};

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20">
      <div className="text-center mb-5">
        <div className="w-16 h-16 mx-auto mb-3 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
          <Car className="text-[#F4D03F] w-8 h-8" />
        </div>
        <h2 className="text-lg font-bold text-white">Bem-vindo</h2>
        <p className="text-[#A0A0B0] text-xs">Entre para solicitar corridas</p>
      </div>
      
      <div className="space-y-3">
        <button onClick={onGoogleLogin} className="w-full py-2.5 rounded-xl border border-[#F4D03F]/30 bg-white/5 text-white flex items-center justify-center gap-2 text-sm">
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
            <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
          </svg>
          Entrar com Google
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-xs"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div>
        </div>

        <form onSubmit={onEmailLogin} className="space-y-2">
          <div className="bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 px-3 py-2">
              <span>📧</span>
              <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none text-sm" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-xl border border-white/10">
            <div className="flex items-center gap-2 px-3 py-2">
              <span>🔒</span>
              <input type={showPassword ? "text" : "password"} placeholder="Senha" className="flex-1 bg-transparent text-white outline-none text-sm" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0]">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button>
            </div>
          </div>
          
          <button type="submit" disabled={loginLoading} className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-sm">
            {loginLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD DO PASSAGEIRO
// ============================================
const PassengerDashboard = ({ pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, onRequestRide }: any) => (
  <div className="space-y-3">
    {/* 1. MAPA COM LOGO */}
    <div className="relative h-[220px] rounded-2xl overflow-hidden shadow-xl">
      <MapComponent />
      {/* LOGO SOBREPOSTA */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md rounded-2xl px-5 py-2 border border-[#F4D03F]/40">
          <div className="flex items-center gap-2">
            <Car className="text-[#F4D03F] w-6 h-6" />
            <div>
              <h1 className="text-xl font-bold text-white">OBALEVA</h1>
              <p className="text-[#F4D03F] text-[8px] text-center">mobilidade premium</p>
            </div>
          </div>
        </div>
      </div>
    </div>

    {/* 2. ORIGEM E DESTINO */}
    <div className="bg-[#1A1528] rounded-2xl p-3 border border-[#F4D03F]/20">
      <div className="flex items-center gap-2 mb-2 pb-1 border-b border-white/10">
        <Map size={14} className="text-[#F4D03F]" />
        <span className="text-white text-xs font-medium">Definir rota</span>
      </div>
      
      <div className="bg-white/5 rounded-lg border border-white/10 mb-2">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-green-500" />
          <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none text-sm" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} />
        </div>
      </div>
      
      <div className="bg-white/5 rounded-lg border border-white/10">
        <div className="flex items-center gap-2 px-3 py-2">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none text-sm" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} />
        </div>
      </div>
      
      <button onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} className="mt-2 w-full text-center text-[10px] text-[#A0A0B0] hover:text-[#F4D03F]">
        ↕️ Trocar origem e destino
      </button>
    </div>

    {/* 3. BOTÃO SOLICITAR */}
    <button onClick={onRequestRide} disabled={!pickupAddress || !dropoffAddress} className={`w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold flex items-center justify-center gap-2 ${(!pickupAddress || !dropoffAddress) ? 'opacity-50' : 'hover:scale-[1.02]'}`}>
      <Car size={18} /> SOLICITAR OBALEVALe <ArrowRight size={16} />
    </button>
  </div>
);

// ============================================
// CADASTRO RÁPIDO
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
    <div className="bg-[#1A1528] rounded-2xl p-4 border border-[#F4D03F]/20">
      <h2 className="text-white font-bold text-base mb-3">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Nome completo" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm pr-8" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-[#A0A0B0]">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
        </div>
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-2 rounded-lg bg-white/5 border border-white/10 text-white text-sm" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="w-full py-2 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-sm">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL
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

  const handleRequestRide = () => {
    if (!pickupAddress || !dropoffAddress) {
      toast.error('📍 Preencha origem e destino!');
      return;
    }
    toast.success(`🚗 Corrida solicitada!\nDe: ${pickupAddress}\nPara: ${dropoffAddress}`);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-pulse"><Car className="text-[#F4D03F] w-10 h-10 animate-bounce mx-auto" /><p className="text-white mt-2">Carregando...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <Toaster position="top-center" richColors />
      <div className="max-w-md mx-auto px-4 pb-32">
        
        {/* CABEÇALHO */}
        <div className="py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-3.5 h-3.5" />
            </div>
            <h1 className="text-lg font-bold text-white">OBALEVA</h1>
          </div>
          {user && <button onClick={signOut} className="text-[#A0A0B0] text-[10px] flex items-center gap-1"><LogOut size={12} /> Sair</button>}
        </div>

        {/* CONTEÚDO */}
        {!user ? (
          <LoginScreen
            onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }}
            onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) toast.error('E-mail ou senha inválidos'); setLoginLoading(false); }}
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        ) : !profile ? (
          <div className="space-y-2">
            <div className="flex gap-2">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-2 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-2 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard
            pickupAddress={pickupAddress} setPickupAddress={setPickupAddress}
            dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress}
            onRequestRide={handleRequestRide}
          />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-[#1A1528] rounded-2xl p-5 text-center border border-[#F4D03F]/20">
            <Truck className="text-[#F4D03F] w-10 h-10 mx-auto mb-2" />
            <h2 className="text-white font-bold">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-xs">Aguardando aprovação</p>
            <button className="mt-3 px-3 py-1 rounded-full bg-green-600 text-white text-xs">🟢 Online</button>
          </div>
        ) : (
          <div className="bg-[#1A1528] rounded-2xl p-5 text-center border border-[#F4D03F]/20">
            <Shield className="text-[#F4D03F] w-10 h-10 mx-auto mb-2" />
            <h2 className="text-white font-bold">Painel Administrativo</h2>
          </div>
        )}

        {/* DISCOVER BAR */}
        <DiscoverBar />
      </div>

      {/* BOTTOM NAV */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
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