import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Home, Search, User, Menu, LogOut, MapPin, Navigation, 
  ArrowRight, Shield, Star, Zap, Chrome, Mail, Lock, Eye, EyeOff,
  ArrowLeft, Check, Gift, Coffee, Heart, Truck, Phone, Map
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import RotatingBanner from '../components/RotatingBanner';
import OnboardingWizard from '../components/OnboardingWizard';
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
// TELA DE LOGIN
// ============================================
const LoginScreen = ({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, onSignUpClick }: any) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-2xl animate-bounce">
            <Car size={48} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          <h2 className="text-xl font-bold text-white text-center mb-6">Bem-vindo de volta!</h2>
          
          <div className="space-y-4">
            <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02] group">
              <Chrome size={20} className="group-hover:scale-110 transition" />
              <span>Entrar com Google</span>
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
            </div>

            <form onSubmit={onEmailLogin} className="space-y-3">
              <div className="relative">
                <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type="email" placeholder="E-mail" className="w-full p-3 pl-10 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition-all outline-none" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
              </div>
              
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#A0A0B0]" />
                <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 pl-10 pr-12 rounded-xl bg-white/10 border border-white/15 text-white focus:border-[#F4D03F] transition-all outline-none" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button type="submit" disabled={loginLoading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base transition-all hover:scale-[1.02]">
                {loginLoading ? <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin mx-auto" /> : 'Entrar'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button onClick={onSignUpClick} className="text-[#F4D03F] text-sm hover:underline transition-all inline-flex items-center gap-1">
                Criar nova conta <ArrowRight size={14} />
              </button>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1"><Shield size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Seguro total</span></div>
              <div className="flex items-center gap-1"><Star size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Motoristas top</span></div>
              <div className="flex items-center gap-1"><Zap size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Chegada rápida</span></div>
            </div>
          </div>
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
        alert('🚗 Corrida solicitada!');
      }
    } catch (error: any) { alert('Erro: ' + error.message); } 
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

      <div className="relative h-[220px] rounded-xl overflow-hidden mb-3">
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
            <input type="text" placeholder="Para onde você vai?" className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={dropoffAddress} onChange={e => setDropoffAddress(e.target.value)} autoFocus />
          </div>
        </div>
      </div>

      <button onClick={handleRequestRide} disabled={solicitando || !pickupLocation || !dropoffLocation} className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02] disabled:opacity-50">
        {solicitando ? (
          <div className="flex items-center justify-center gap-2">
            <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" /> Buscando motorista...
          </div>
        ) : (
          '🚗 SOLICITAR CORRIDA'
        )}
      </button>

      <RotatingBanner />

      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

// ============================================
// TELA PERFIL
// ============================================
const ProfileScreen = ({ user, profile, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-6 border border-[#F4D03F]/20 mt-4 text-center shadow-xl">
      <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
        {profile?.tipo === 'motorista' ? <Truck size={40} className="text-[#F4D03F]" /> : <User size={40} className="text-[#F4D03F]" />}
      </div>
      <h2 className="text-white text-2xl font-bold mt-4">{profile?.nome_completo || user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <div className="inline-block mt-3 px-4 py-1 rounded-full bg-[#F4D03F]/20">
        <span className="text-[#F4D03F] text-xs font-bold">{profile?.tipo?.toUpperCase() || 'PASSAGEIRO'}</span>
      </div>
      <button onClick={onSignOut} className="mt-8 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold hover:bg-red-500/30 transition">
        <span className="flex items-center justify-center gap-2"><LogOut size={16} /> Sair da conta</span>
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
      <p className="text-[#A0A0B0] mt-2">Em breve: histórico e lugares favoritos</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-[#A0A0B0] mt-2">Em breve: ajuda, indicação e configurações</p>
    </div>
  </div>
);

// ============================================
// MAIN SCREEN - VERSÃO COM DEPURAÇÃO
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Logs de depuração
  console.log('\n========== 🖥️ MAINSCREEN ==========');
  console.log('👤 user:', user?.email || 'null');
  console.log('📋 profile:', profile?.nome_completo || 'null');
  console.log('⏳ loading:', loading);
  console.log('=====================================\n');

  const handleSignOut = async () => {
    try {
      await signOut();
      localStorage.removeItem('onboarding_data');
      window.location.reload();
    } catch (err) {
      window.location.reload();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 animate-bounce mx-auto mb-3" />
          <p className="text-white">Carregando ObaLeva...</p>
        </div>
      </div>
    );
  }

  // ✅ USUÁRIO LOGADO E COM PERFIL COMPLETO → VAI DIRETO PARA HOME
  if (user && profile) {
    console.log('✅ USUÁRIO COM PERFIL → Indo para HomeScreen');
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} onSignOut={handleSignOut} />}
        {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={handleSignOut} />}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'menu' && <MenuScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  // ✅ USUÁRIO LOGADO MAS SEM PERFIL → MOSTRA WIZARD
  if (user && !profile) {
    console.log('📝 USUÁRIO SEM PERFIL → Indo para OnboardingWizard');
    return <OnboardingWizard onComplete={() => window.location.reload()} />;
  }

  // ✅ USUÁRIO NÃO LOGADO → MOSTRA LOGIN
  if (showSignUp) {
    console.log('🔐 MOSTRANDO SIGNUP');
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
              <Car size={40} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-2xl font-bold text-white">Criar Conta</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Cadastre-se para começar</p>
          </div>

          <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
            <div className="space-y-3">
              <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" />
              <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" />
              <input type="password" placeholder="Senha (mínimo 6 caracteres)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" />
              <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1A1528] font-bold transition-all hover:shadow-lg">Criar conta</button>
              <div className="text-center"><button onClick={() => setShowSignUp(false)} className="text-gray-400 text-sm hover:text-[#F4D03F] transition font-medium">← Já tenho conta</button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  console.log('🔐 MOSTRANDO LOGIN');
  return (
    <LoginScreen 
      onSignUpClick={() => setShowSignUp(true)} 
      onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }} 
      onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) alert('E-mail ou senha inválidos'); setLoginLoading(false); }} 
      loginEmail={loginEmail} setLoginEmail={setLoginEmail} loginPassword={loginPassword} setLoginPassword={setLoginPassword} loginLoading={loginLoading} 
    />
  );
};