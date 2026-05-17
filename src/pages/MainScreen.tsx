import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, Home, Search, User, Menu as MenuIcon, Map, ArrowRight, LogOut, Truck } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import RotatingBanner from '../components/RotatingBanner';
import ProfileScreen from '../screens/ProfileScreen';
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

const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, onSignUpClick }: any) => {
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-6 border-2 border-[#F4D03F]/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-3">
            <Car className="w-8 h-8 text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-xl font-bold">Bem-vindo ao ObaLeva!</h2>
          <p className="text-[#A0A0B0] text-sm">Faça login para solicitar corridas</p>
        </div>
        
        <div className="space-y-3">
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border-2 border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2 font-medium">
            <svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg>
            Entrar com Google
          </button>
          
          <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-xs text-[#A0A0B0]">ou</span></div></div>

          <form onSubmit={onEmailLogin} className="space-y-2">
            <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            <div className="relative">
              <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? "🙈" : "👁️"}</button>
            </div>
            <button type="submit" disabled={loginLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
              {loginLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <div className="text-center mt-4">
            <p className="text-[#A0A0B0] text-sm">
              Não tem uma conta?{' '}
              <button type="button" onClick={onSignUpClick} className="text-[#F4D03F] font-bold hover:underline">
                Criar conta grátis
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const SignUpScreen = ({ onBack, onSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    if (!nome || !email || !password) {
      alert('Preencha todos os campos');
      return;
    }

    if (password.length < 6) {
      alert('A senha deve ter no mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    
    try {
      const { data: auth, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome, tipo: 'passageiro' } }
      });
      
      if (signUpError) throw signUpError;
      
      if (auth.user) {
        await supabase.from('usuarios').insert({
          id: auth.user.id,
          nome_completo: nome,
          email: email,
          tipo: 'passageiro'
        });
        await supabase.from('passageiros').insert({ id: auth.user.id });
        alert('✅ Conta criada com sucesso! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      alert('❌ Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28 mt-8">
      <div className="bg-[#1A1528] rounded-2xl p-6 border-2 border-[#F4D03F]/30">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-3">
            <Car className="w-8 h-8 text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-xl font-bold">Criar Conta</h2>
          <p className="text-[#A0A0B0] text-sm">Cadastre-se para solicitar corridas</p>
        </div>

        <div className="space-y-3">
          <div className="bg-white/10 rounded-xl border border-white/15">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">👤</span>
              <input type="text" placeholder="Nome completo" className="flex-1 bg-transparent text-white outline-none" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          </div>

          <div className="bg-white/10 rounded-xl border border-white/15">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">📧</span>
              <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

          <div className="bg-white/10 rounded-xl border border-white/15">
            <div className="flex items-center gap-3 px-4 py-3">
              <span className="text-lg">🔒</span>
              <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6 caracteres)" className="flex-1 bg-transparent text-white outline-none" value={password} onChange={(e) => setPassword(e.target.value)} />
              <button type="button" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Criando conta...' : '✅ CRIAR MINHA CONTA'}
          </button>

          <div className="text-center">
            <button onClick={onBack} className="text-[#A0A0B0] text-sm hover:text-[#F4D03F] transition">
              ← Já tenho conta, fazer login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border-2 border-[#F4D03F]/30">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-gray-400 mt-2">Em breve: histórico de corridas e lugares favoritos</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border-2 border-[#F4D03F]/30">
      <MenuIcon size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-gray-400 mt-2">Em breve: indicação, ajuda e configurações</p>
    </div>
  </div>
);

const HomeScreenContent = ({ user, onSignOut }: any) => {
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

  const LocationInputs = ({ pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, disabled }: any) => (
    <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 shadow-lg">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
        <Map size={16} className="text-[#F4D03F]" />
        <span className="text-white font-bold text-sm">Definir sua rota</span>
      </div>
      <div className="bg-white/10 rounded-xl border border-white/15 mb-2">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <input type="text" placeholder="Digite onde você está..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="bg-white/10 rounded-xl border border-white/15">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <input type="text" placeholder="Digite seu destino..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} disabled={disabled} />
        </div>
      </div>
      <button onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} className="mt-3 w-full text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition py-1.5 font-medium">🔄 Inverter origem e destino</button>
    </div>
  );

  const ActionButton = ({ onRequestRide, disabled, loading }: any) => (
    <button onClick={onRequestRide} disabled={disabled || loading} className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-extrabold flex items-center justify-center gap-3 text-lg transition-all duration-200 ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-xl'}`}>
      {loading ? (<><div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" /> Buscando motorista...</>) : (<><Car size={22} /> SOLICITAR CORRIDA <ArrowRight size={18} /></>)}
    </button>
  );

  return (
    <div className="max-w-md mx-auto px-3 pb-28">
      <div className="py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
            <Car className="text-[#F4D03F] w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
        </div>
        {user && <button onClick={onSignOut} className="text-[#A0A0B0] text-sm flex items-center gap-1 hover:text-red-400 transition px-3 py-1 rounded-full bg-white/5"><LogOut size={14} /> Sair</button>}
      </div>

      <div className="relative h-[220px] rounded-xl overflow-hidden shadow-lg mb-3">
        <MapComponent pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} onPickupChange={setPickupAddress} onDropoffChange={setDropoffAddress} onLocationSelect={(location: any) => { if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } else { setDropoffLocation(location); setDropoffAddress(location.address); } }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-5 py-2 border-2 border-[#F4D03F]/50 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/30 flex items-center justify-center"><Car className="text-[#F4D03F] w-6 h-6" /></div>
              <div><h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1><p className="text-[#F4D03F] text-[10px] text-center font-bold tracking-wider">SUA CORRIDA DE CONFIANÇA</p></div>
            </div>
          </div>
        </div>
      </div>

      <LocationInputs pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress} disabled={false} />
      <div className="mt-3"><ActionButton onRequestRide={handleRequestRide} disabled={!pickupLocation || !dropoffLocation} loading={solicitando} /></div>
      <RotatingBanner />
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-pulse"><Car className="w-12 h-12 text-[#F4D03F] animate-bounce" /><p className="text-white mt-2">Carregando...</p></div></div>;
  }

  if (!user && showSignUp) {
    return (
      <>
        <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  if (!user) {
    return (
      <>
        <LoginScreen
          onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }}
          onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) alert('E-mail ou senha inválidos'); setLoginLoading(false); }}
          loginEmail={loginEmail} setLoginEmail={setLoginEmail}
          loginPassword={loginPassword} setLoginPassword={setLoginPassword}
          loginLoading={loginLoading}
          onSignUpClick={() => setShowSignUp(true)}
        />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreenContent user={user} onSignOut={signOut} />}
      {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={signOut} onRefresh={handleRefresh} />}
      {activeTab === 'buscar' && <SearchScreen />}
      {activeTab === 'menu' && <MenuScreen />}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};