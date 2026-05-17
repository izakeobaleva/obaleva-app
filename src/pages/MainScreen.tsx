import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, LogOut, Home, Search, User, Menu, Eye, EyeOff, MapPin, Navigation, Shield, Star, Zap, Chrome } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import RotatingBanner from '../components/RotatingBanner';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: Menu },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 transition-all ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={24} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-xs font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-2 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA PRINCIPAL (HOME)
// ============================================
const HomeScreen = ({ user, onSignOut }: any) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const carregarCorridaAtiva = async () => {
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
  };

  const handleRequestRide = async () => {
    if (!user) { alert('Faça login primeiro!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('Selecione origem e destino no mapa!'); return; }
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
        alert('✅ Corrida solicitada!');
      }
    } catch (error: any) { alert('❌ Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  const handleCancelRide = async () => {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) { alert('Corrida cancelada'); setShowRideModal(false); setActiveRide(null); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); } 
      else { alert('Erro ao cancelar'); }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
            <Car size={18} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button onClick={onSignOut} className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm hover:bg-red-500/30 transition">
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Mapa */}
      <div className="relative h-[220px] rounded-xl overflow-hidden mb-3 shadow-lg">
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
          <div className="bg-black/60 backdrop-blur-md rounded-xl px-4 py-1.5 border border-[#F4D03F]/40">
            <div className="flex items-center gap-2"><Car className="text-[#F4D03F] w-5 h-5" /><span className="text-white font-bold">OBALEVA</span></div>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-3 border border-[#F4D03F]/15">
        <div className="bg-white/10 rounded-lg mb-2">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none" value={pickupAddress} onChange={e => setPickupAddress(e.target.value)} />
          </div>
        </div>
        <div className="bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} />
          </div>
        </div>
      </div>

      {/* Botão Solicitar */}
      <button onClick={handleRequestRide} disabled={solicitando || !pickupLocation || !dropoffLocation} className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] disabled:opacity-50">
        {solicitando ? 'Buscando motorista...' : '🚗 SOLICITAR CORRIDA'}
      </button>

      {/* Banner Rotativo */}
      <RotatingBanner />

      {/* Modal da Corrida */}
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreen = ({ user, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-6 text-center border border-[#F4D03F]/20 shadow-xl">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
        <User size={40} className="text-[#F4D03F]" />
      </div>
      <h2 className="text-white text-xl font-bold mt-4">{user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#F4D03F]/20">
        <span className="text-[#F4D03F] text-xs font-bold">PASSAGEIRO</span>
      </div>
      <button onClick={onSignOut} className="mt-8 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold hover:bg-red-500/30 transition">
        SAIR DA CONTA
      </button>
    </div>
  </div>
);

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-gray-400 mt-2">Em breve: histórico e lugares favoritos</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-gray-400 mt-2">Em breve: ajuda, indicação e configurações</p>
    </div>
  </div>
);

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onLogin, onGoogleLogin, onSignUp }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
          </div>

          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? "🙈" : "👁️"}</button>
          </div>

          <button onClick={async () => { setLoading(true); await onLogin(email, password); setLoading(false); }} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm py-2">Criar nova conta</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO
// ============================================
const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      alert('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      alert('Senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome } } });
      if (error) throw error;
      if (data.user) {
        await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, email: email, tipo: 'passageiro' });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="text-[#A0A0B0] mb-4">← Voltar</button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Criar Conta</h2>
          <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <input type="password" placeholder="Senha (mínimo 6 caracteres)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4" value={password} onChange={e => setPassword(e.target.value)} />
          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      window.location.reload();
    } else {
      alert('❌ E-mail ou senha inválidos');
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} onSignOut={handleSignOut} />}
        {activeTab === 'perfil' && <ProfileScreen user={user} onSignOut={handleSignOut} />}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'menu' && <MenuScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />;
  }

  return <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};