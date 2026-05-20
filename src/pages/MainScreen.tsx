import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Chrome, Eye, EyeOff, Home, Search, ClipboardList, User, 
  Bell, MapPin, ChevronRight, LogOut, Edit, CreditCard, History, 
  Truck, X, ArrowLeft, Upload, Key, Shield, Calendar, Phone, Mail, 
  Map, Smartphone
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import DriverRegistrationModal from '../components/DriverRegistrationModal';

const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'atividade', label: 'Atividade', icon: ClipboardList },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4 shadow-lg">
        <div className="flex justify-between px-6 py-2">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-0.5 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={22} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

const HomeScreen = ({ user, onLogout, showFullUI }: any) => {
  const [destino, setDestino] = useState('');
  const [origem, setOrigem] = useState(localStorage.getItem('user_address') || 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoEditado, setEnderecoEditado] = useState(origem);
  const origemInputRef = useRef<HTMLInputElement>(null);
  const destinoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMaps);
        if (origemInputRef.current) new window.google.maps.places.Autocomplete(origemInputRef.current, { fields: ['formatted_address'] });
        if (destinoInputRef.current) new window.google.maps.places.Autocomplete(destinoInputRef.current, { fields: ['formatted_address'] });
      }
    }, 100);
    return () => clearInterval(checkGoogleMaps);
  }, []);

  const handleChamarObaLeva = () => { if (!destino) { alert('Digite um destino primeiro!'); return; } alert(`🚗 Corrida solicitada de: ${origem}\nPara: ${destino}`); };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-xl font-bold text-white">ObaLeva</h1>
          {showFullUI && <div className="flex items-center gap-3"><button className="text-[#A0A0B0] text-xs">Mudar passageiro</button><button onClick={onLogout} className="text-red-400 text-xs font-bold">SAIR</button></div>}
        </div>
        <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg"><MapComponent /></div>
        <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
          <div className="flex items-center justify-between mb-1"><div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span></div><button onClick={() => setModoEdicao(!modoEdicao)} className="text-[#F4D03F] text-xs hover:underline">{modoEdicao ? 'Cancelar' : '✏️ Editar'}</button></div>
          {modoEdicao ? <input type="text" className="w-full bg-white/10 text-white p-2 rounded-lg outline-none text-base" value={enderecoEditado} onChange={(e) => setEnderecoEditado(e.target.value)} /> : <input ref={origemInputRef} type="text" className="w-full bg-white/10 text-white p-2 rounded-lg outline-none text-base" value={origem} onChange={(e) => setOrigem(e.target.value)} />}
        </div>
        {showFullUI && (
          <>
            <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3"><div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span></div><input ref={destinoInputRef} type="text" placeholder="Digite o endereço ou cidade..." className="w-full bg-white/10 text-white p-2 rounded-lg outline-none text-base" value={destino} onChange={(e) => setDestino(e.target.value)} /></div>
            <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"><Car size={18} /> Chamar ObaLeva</button>
            <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center"><div><div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div><p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p></div><ChevronRight size={20} className="text-[#F4D03F]" /></div>
          </>
        )}
      </div>
    </div>
  );
};

const ProfileScreen = ({ user, onLogout, onSejaMotorista }: any) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { supabase.from('usuarios').select('*').eq('id', user.id).single().then(({ data }) => { setProfile(data); setLoading(false); }); }, [user]);

  if (loading) return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24 pt-4">
        <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border-2 border-[#F4D03F]/30 shadow-xl">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50"><User size={40} className="text-[#F4D03F]" /></div>
          <div className="text-center mt-3"><h2 className="text-white text-lg font-bold">{profile?.nome_completo || user.email}</h2><p className="text-[#A0A0B0] text-xs mt-1">{user.email}</p><div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20"><span className="text-[#F4D03F] text-xs font-bold">{profile?.tipo === 'motorista' ? 'MOTORISTA' : 'PASSAGEIRO'}</span></div></div>
        </div>
        <div className="mt-4 bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-2"><Edit size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Editar perfil</span></div><ChevronRight size={14} className="text-gray-500" /></button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-2"><CreditCard size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Formas de pagamento</span></div><ChevronRight size={14} className="text-gray-500" /></button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-2"><History size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Histórico de corridas</span></div><ChevronRight size={14} className="text-gray-500" /></button>
          {profile?.tipo !== 'motorista' && <button onClick={onSejaMotorista} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-2"><Truck size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Seja Motorista</span></div><ChevronRight size={14} className="text-gray-500" /></button>}
          <button onClick={onLogout} className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 transition"><div className="flex items-center gap-2"><LogOut size={16} className="text-red-400" /><span className="text-red-400 text-sm">Sair da conta</span></div><ChevronRight size={14} className="text-red-400" /></button>
        </div>
      </div>
    </div>
  );
};

const SearchScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]"><div className="max-w-md mx-auto px-4 pb-24 pt-8"><div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20"><Search size={48} className="text-[#F4D03F] mx-auto mb-4" /><h2 className="text-white text-xl font-bold">🔍 Buscar</h2></div></div></div>
);

const ActivityScreen = () => (
  <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]"><div className="max-w-md mx-auto px-4 pb-24 pt-8"><div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20"><ClipboardList size={48} className="text-[#F4D03F] mx-auto mb-4" /><h2 className="text-white text-xl font-bold">📋 Atividade</h2><p className="text-gray-400 mt-2">Histórico de corridas</p></div></div></div>
);

// ============================================
// MODAL INFERIOR DE LOCALIZAÇÃO (RESTAURADO)
// ============================================
const LocationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-2"><MapPin size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Acesso à localização</h2></div>
        <p className="text-[#A0A0B0] text-xs mb-3">Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
        <div className="space-y-2">
          <button onClick={() => { onAllow('exact'); }} className="w-full py-2 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center">
            <div className="flex flex-col"><span className="text-sm">📍 SEMPRE PERMITIR</span><span className="text-[10px] text-black/70 font-normal">O app pode usar sua localização a qualquer momento</span></div>
          </button>
          <button onClick={() => { onAllow('approximate'); }} className="w-full py-2 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center">
            <div className="flex flex-col"><span className="text-sm">📍 SÓ DESTA VEZ</span><span className="text-[10px] text-[#A0A0B0] font-normal">O app usa sua localização apenas agora</span></div>
          </button>
          <button onClick={onDeny} className="w-full py-2 px-4 rounded-xl text-[#A0A0B0] text-left text-sm">🚫 NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL INFERIOR DE NOTIFICAÇÕES (RESTAURADO)
// ============================================
const NotificationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-5 pb-5">
        <div className="flex items-center gap-2 mb-2"><Bell size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Permitir notificações?</h2></div>
        <p className="text-[#A0A0B0] text-xs mb-2">Para receber alertas importantes como:</p>
        <div className="bg-white/5 rounded-lg p-2 mb-3 space-y-1">
          <p className="text-white text-xs">• 🚗 "Motorista a caminho"</p>
          <p className="text-white text-xs">• 📍 "Estou chegando!"</p>
          <p className="text-white text-xs">• ✅ "Corrida confirmada"</p>
          <p className="text-white text-xs">• 💰 "Promoções e descontos"</p>
        </div>
        <div className="space-y-2">
          <button onClick={onAllow} className="w-full py-2 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">PERMITIR</button>
          <button onClick={onDeny} className="w-full py-2 rounded-xl border border-white/20 text-white font-bold text-sm">NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL INFERIOR DE CRIAÇÃO DE CONTA (RESTAURADO)
// ============================================
const SignUpModal = ({ onSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) { localStorage.setItem('obaleva_onboarding', 'true'); onSuccess(); } else setError('E-mail ou senha inválidos');
    setLoading(false);
  };

  const handleGoogleLogin = async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); };

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
        <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-5 pb-5">
          <div className="flex items-center gap-2 mb-2"><Car size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Criar sua conta</h2></div>
          {error && <div className="mb-2 p-2 text-center text-xs text-red-400 bg-red-500/10 rounded">{error}</div>}
          <div className="space-y-2">
            <button onClick={handleGoogleLogin} className="w-full py-2 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-2 text-sm">
              <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg>
              <span>Entrar com Google</span>
            </button>
            <div className="relative"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-gray-400">ou</span></div></div>
            <input type="email" placeholder="E-mail" className="w-full p-2 rounded-xl bg-white/10 border border-white/15 text-white text-sm" value={email} onChange={(e) => setEmail(e.target.value)} />
            <div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="Senha" className="w-full p-2 rounded-xl bg-white/10 border border-white/15 text-white pr-8 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-2 text-gray-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
            <button onClick={handleLogin} disabled={loading} className="w-full py-2 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Entrando...' : 'ENTRAR'}</button>
            <button className="w-full text-[#F4D03F] text-xs text-center">Criar nova conta</button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN PRINCIPAL
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showDriverModal, setShowDriverModal] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      const completed = localStorage.getItem('obaleva_onboarding') === 'true';
      const locationAsked = localStorage.getItem('location_permission_asked') === 'true';
      setOnboardingCompleted(completed || !!session?.user);
      if (!completed && !session?.user) { if (!locationAsked) setShowLocationModal(true); else setShowNotificationModal(true); }
      setLoading(false);
    })();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) { setOnboardingCompleted(true); setShowLocationModal(false); setShowNotificationModal(false); setShowSignUpModal(false); }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLocationAllow = () => { localStorage.setItem('location_permission_asked', 'true'); if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {}); setShowLocationModal(false); setShowNotificationModal(true); };
  const handleLocationDeny = () => { localStorage.setItem('location_permission_asked', 'true'); setShowLocationModal(false); setShowNotificationModal(true); };
  const handleNotificationAllow = () => { if ('Notification' in window) Notification.requestPermission(); setShowNotificationModal(false); setShowSignUpModal(true); };
  const handleNotificationDeny = () => { setShowNotificationModal(false); setShowSignUpModal(true); };
  const handleSignUpSuccess = () => { setShowSignUpModal(false); window.location.reload(); };
  const handleLogout = async () => { await supabase.auth.signOut(); localStorage.clear(); sessionStorage.clear(); window.location.reload(); };

  if (loading) return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;

  const showFullUI = onboardingCompleted || !!user;

  return (
    <>
      {activeTab === 'home' && <HomeScreen user={user} onLogout={user ? handleLogout : undefined} showFullUI={showFullUI} />}
      {activeTab === 'perfil' && user && <ProfileScreen user={user} onLogout={handleLogout} onSejaMotorista={() => setShowDriverModal(true)} />}
      {activeTab === 'buscar' && showFullUI && <SearchScreen />}
      {activeTab === 'atividade' && showFullUI && <ActivityScreen />}
      {showFullUI && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
      {!showFullUI && showLocationModal && <LocationModal onAllow={handleLocationAllow} onDeny={handleLocationDeny} />}
      {!showFullUI && showNotificationModal && <NotificationModal onAllow={handleNotificationAllow} onDeny={handleNotificationDeny} />}
      {!showFullUI && showSignUpModal && <SignUpModal onSuccess={handleSignUpSuccess} />}
      {showDriverModal && <DriverRegistrationModal user={user} onClose={() => setShowDriverModal(false)} onSuccess={() => setShowDriverModal(false)} />}
    </>
  );
};