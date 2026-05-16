import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, User, Truck, Shield, Star, Zap, Gift, 
  Home, Search, Menu as MenuIcon, LogOut, ChevronLeft, 
  Video, Megaphone, Coffee, Heart, Eye, EyeOff, Map, ArrowRight
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';

const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-5 py-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => onNavigate(tab.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
              }`}
            >
              <tab.icon size={26} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-sm font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-2 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const DiscoverBar = () => {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  const cards = [
    { emoji: "🎁", title: "1ª corrida grátis", desc: "Até R$ 20 de desconto", color: "#F4D03F" },
    { emoji: "🛡️", title: "Seguro ObaLeva", desc: "Proteção total durante a corrida", color: "#8B5CF6" },
    { emoji: "⭐", title: "Avaliação 4.8★", desc: "Motoristas qualificados e educados", color: "#F4D03F" },
    { emoji: "⚡", title: "Rápido", desc: "Chegada em poucos minutos", color: "#A855F7" },
    { emoji: "📹", title: "Como funciona?", desc: "Veja o passo a passo", color: "#F4D03F" },
    { emoji: "📢", title: "Indique e ganhe", desc: "Ganhe R$ 10 por indicação", color: "#8B5CF6" },
    { emoji: "☕", title: "Parceiros", desc: "Descontos exclusivos", color: "#A855F7" },
    { emoji: "❤️", title: "ObaLeva Solidário", desc: "Doamos 5% para instituições", color: "#F4D03F" },
  ];

  return (
    <div className="relative mt-4 mb-24">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-2 backdrop-blur-sm border border-[#F4D03F]/40 shadow-lg">
        <ChevronLeft size={18} className="text-[#F4D03F]" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-2">
        {cards.map((card, idx) => (
          <div key={idx} className="min-w-[155px] max-w-[155px] bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15 shadow-md">
            <div className="flex items-start gap-2.5">
              <div className="w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-xl" style={{ backgroundColor: `${card.color}25` }}>
                {card.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-sm truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-xs truncate mt-0.5">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-2 backdrop-blur-sm border border-[#F4D03F]/40 shadow-lg">
        <ChevronRight size={18} className="text-[#F4D03F]" />
      </button>
    </div>
  );
};

const LocationInputs = ({ pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, disabled }: any) => (
  <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 shadow-lg">
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
      <Map size={16} className="text-[#F4D03F]" />
      <span className="text-white font-bold text-sm">Definir sua rota</span>
    </div>
    
    <div className="bg-white/10 rounded-xl border border-white/15 mb-2">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
        <input 
          type="text" 
          placeholder="Digite onde você está..." 
          className="flex-1 bg-transparent text-white outline-none text-base font-medium"
          value={pickupAddress} 
          onChange={(e) => setPickupAddress(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
    
    <div className="bg-white/10 rounded-xl border border-white/15">
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <input 
          type="text" 
          placeholder="Digite seu destino..." 
          className="flex-1 bg-transparent text-white outline-none text-base font-medium"
          value={dropoffAddress} 
          onChange={(e) => setDropoffAddress(e.target.value)}
          disabled={disabled}
        />
      </div>
    </div>
    
    <button 
      onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} 
      className="mt-3 w-full text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition py-1.5 font-medium"
      disabled={disabled}
    >
      🔄 Inverter origem e destino
    </button>
  </div>
);

const ActionButton = ({ onRequestRide, disabled, loading }: any) => (
  <button 
    onClick={onRequestRide} 
    disabled={disabled || loading} 
    className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-extrabold flex items-center justify-center gap-3 text-lg transition-all duration-200 ${
      (disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-xl'
    }`}
  >
    {loading ? (
      <>
        <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
        Buscando motorista...
      </>
    ) : (
      <>
        <Car size={22} /> SOLICITAR CORRIDA <ArrowRight size={18} />
      </>
    )}
  </button>
);

const LoginForm = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="bg-[#1A1528] rounded-xl p-5 border border-[#F4D03F]/20 mt-3 shadow-lg">
      <div className="text-center mb-4">
        <div className="w-16 h-16 mx-auto mb-2 rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center">
          <Car className="text-[#F4D03F] w-8 h-8" />
        </div>
        <h2 className="text-xl font-bold text-white">Bem-vindo ao ObaLeva!</h2>
        <p className="text-[#A0A0B0] text-sm mt-1">Faça login para solicitar sua corrida</p>
      </div>
      <div className="space-y-3">
        <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-3 text-base font-medium hover:bg-white/20 transition-all">
          <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg>
          Continuar com Google
        </button>
        <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/15"></div></div><div className="relative flex justify-center text-sm"><span className="bg-[#1A1528] px-3 text-[#A0A0B0]">ou</span></div></div>
        <form onSubmit={onEmailLogin} className="space-y-2">
          <div className="bg-white/10 rounded-xl border border-white/15"><div className="flex items-center gap-3 px-4 py-3"><span className="text-lg">📧</span><input type="email" placeholder="Seu e-mail" className="flex-1 bg-transparent text-white outline-none text-base" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required /></div></div>
          <div className="bg-white/10 rounded-xl border border-white/15"><div className="flex items-center gap-3 px-4 py-3"><span className="text-lg">🔒</span><input type={showPassword ? "text" : "password"} placeholder="Sua senha" className="flex-1 bg-transparent text-white outline-none text-base" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required /><button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div></div>
          <button type="submit" disabled={loginLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base">{loginLoading ? 'Entrando...' : 'Entrar'}</button>
        </form>
      </div>
    </div>
  );
};

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
      alert('✅ Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      alert('❌ Erro: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 mt-2 shadow-lg">
      <h2 className="text-white font-bold text-base mb-3">Cadastro de {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base pr-10" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-[#A0A0B0]">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
        </div>
        {tipo === 'motorista' && <input placeholder="Placa do veículo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-base" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
};

const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  async function carregarCorridaAtiva() {
    if (user?.id) {
      const corrida = await buscarCorridaAtiva(user.id);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setActiveRide(updatedRide);
          if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
            setTimeout(() => { setShowRideModal(false); setActiveRide(null); }, 3000);
          }
        });
      }
    }
  }

  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const handleRequestRide = async () => {
    if (!user) { alert('🔐 Faça login para solicitar uma corrida!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('📍 Selecione a origem e destino no mapa!'); return; }
    setSolicitando(true);
    try {
      const corrida = await solicitarCorrida(user.id, pickupLocation, dropoffLocation);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        setPickupAddress('');
        setDropoffAddress('');
        setPickupLocation(null);
        setDropoffLocation(null);
        alert('🚗 Corrida solicitada! Buscando motorista...');
      }
    } catch (error: any) { alert('❌ Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  async function handleCancelRide() {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) { alert('✅ Corrida cancelada'); setShowRideModal(false); setActiveRide(null); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); } 
      else { alert('❌ Erro ao cancelar corrida'); }
    }
  }

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-[#F4D03F]/30 flex items-center justify-center animate-bounce"><Car className="text-[#F4D03F] w-8 h-8" /></div><p className="text-white text-base mt-3 font-medium">Carregando ObaLeva...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-3 pb-28">
        <div className="py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-5 h-5" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
          </div>
          {user && <button onClick={signOut} className="text-[#A0A0B0] text-sm flex items-center gap-1 hover:text-red-400 transition px-3 py-1 rounded-full bg-white/5"><LogOut size={14} /> Sair</button>}
        </div>

        <div className="relative h-[220px] rounded-xl overflow-hidden shadow-lg mb-3">
          <MapComponent
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            onPickupChange={setPickupAddress}
            onDropoffChange={setDropoffAddress}
            onLocationSelect={(location: any) => {
              if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } 
              else { setDropoffLocation(location); setDropoffAddress(location.address); }
            }}
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="bg-black/60 backdrop-blur-md rounded-2xl px-5 py-2 border-2 border-[#F4D03F]/50 shadow-xl">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
                  <Car className="text-[#F4D03F] w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
                  <p className="text-[#F4D03F] text-[10px] text-center font-bold tracking-wider">SUA CORRIDA DE CONFIANÇA</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <LocationInputs pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress} disabled={false} />
        
        <div className="mt-3">
          <ActionButton onRequestRide={handleRequestRide} disabled={!pickupLocation || !dropoffLocation} loading={solicitando} />
        </div>

        {!user && <LoginForm onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }} onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) alert('❌ E-mail ou senha inválidos'); setLoginLoading(false); }} loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} loginLoading={loginLoading} />}

        {user && !profile && (<div className="space-y-2 mt-3"><div className="flex gap-2"><button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-3 rounded-xl border-2 border-[#F4D03F]/30 text-white bg-white/10 text-base font-medium">Sou Passageiro</button><button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-3 rounded-xl border-2 border-[#F4D03F]/30 text-white bg-white/10 text-base font-medium">Sou Motorista</button></div>{showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}{showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}</div>)}

        {user && profile?.tipo === 'motorista' && (<div className="bg-[#1A1528] rounded-xl p-5 text-center border-2 border-[#F4D03F]/30 mt-3 shadow-lg"><Truck className="text-[#F4D03F] w-12 h-12 mx-auto mb-2" /><h2 className="text-white font-bold text-lg">Painel do Motorista</h2><p className="text-[#A0A0B0] text-sm mt-1">Aguardando aprovação da equipe ObaLeva</p><button className="mt-3 px-4 py-1.5 rounded-full bg-green-600 text-white text-sm font-medium">🟢 Online</button></div>)}

        <DiscoverBar />
      </div>
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};