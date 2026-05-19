import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Eye, EyeOff, Home, Search, ClipboardList, User, Bell, MapPin, ChevronRight } from 'lucide-react';
import MapComponent from '../components/MapComponent';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'atividade', label: 'Atividade', icon: ClipboardList },
    { id: 'perfil', label: 'Perfil', icon: User },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/20 rounded-2xl max-w-md w-full mx-4">
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

// ============================================
// TELA PRINCIPAL (MAPA + ONDE VOCÊ ESTÁ)
// ============================================
const HomeScreen = ({ user, onLogout, showFullUI }: any) => {
  const [destino, setDestino] = useState('');
  const [origem, setOrigem] = useState(localStorage.getItem('user_address') || 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoEditado, setEnderecoEditado] = useState(origem);

  const handleChamarObaLeva = () => {
    if (!destino) {
      alert('Digite um destino primeiro!');
      return;
    }
    alert(`🚗 Corrida solicitada de: ${origem}\nPara: ${destino}`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      <div className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        {showFullUI && (
          <div className="flex items-center gap-3">
            <button className="text-[#A0A0B0] text-xs">Mudar passageiro</button>
            <button onClick={onLogout || handleLogout} className="text-red-400 text-xs font-bold">SAIR</button>
          </div>
        )}
      </div>

      <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
        <button className="absolute bottom-3 right-3 bg-[#1A1528] rounded-full p-2 shadow-lg border border-[#F4D03F]/30">
          <MapPin size={20} className="text-[#F4D03F]" />
        </button>
      </div>

      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setModoEdicao(!modoEdicao)} className="text-[#F4D03F] text-xs hover:underline">
              {modoEdicao ? 'Cancelar' : '✏️ Editar'}
            </button>
            {modoEdicao && (
              <button onClick={() => { setOrigem(enderecoEditado); setModoEdicao(false); }} className="text-green-400 text-xs hover:underline">
                ✅ Confirmar
              </button>
            )}
          </div>
        </div>
        {modoEdicao ? (
          <input type="text" className="w-full bg-white/10 text-white p-2 rounded-lg outline-none" value={enderecoEditado} onChange={(e) => setEnderecoEditado(e.target.value)} />
        ) : (
          <div className="flex items-center gap-2"><span className="text-white text-sm flex-1">{origem}</span></div>
        )}
      </div>

      {showFullUI && (
        <>
          <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span>
            </div>
            <input
              type="text"
              placeholder="Digite o endereço ou cidade..."
              className="w-full bg-white/10 text-white p-2 rounded-lg outline-none"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
          </div>

          <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3">
            <Car size={18} /> CHAMAR OBALEVALe
          </button>

          <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center">
            <div><div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div><p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p></div>
            <ChevronRight size={20} className="text-[#F4D03F]" />
          </div>
        </>
      )}
    </div>
  );
};

const ProfileScreen = ({ user, onLogout }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3"><User size={40} className="text-[#F4D03F]" /></div>
      <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <button onClick={onLogout} className="mt-6 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold">SAIR</button>
    </div>
  </div>
);

const SearchScreen = () => (<div className="max-w-md mx-auto px-4 pb-28 mt-8"><div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20"><Search size={48} className="text-[#F4D03F] mx-auto mb-4" /><h2 className="text-white text-xl font-bold">🔍 Buscar</h2></div></div>);
const ActivityScreen = () => (<div className="max-w-md mx-auto px-4 pb-28 mt-8"><div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20"><ClipboardList size={48} className="text-[#F4D03F] mx-auto mb-4" /><h2 className="text-white text-xl font-bold">📋 Atividade</h2><p className="text-gray-400 mt-2">Histórico de corridas</p></div></div>);

const LocationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center pointer-events-auto">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-6 pb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4"><MapPin size={32} className="text-[#F4D03F]" /></div>
        <h2 className="text-white text-xl font-bold text-center mb-2">Permitir acesso à localização?</h2>
        <p className="text-[#A0A0B0] text-sm text-center mb-6">Para assegurar que o aplicativo possa enviar corridas e planejar rotas.</p>
        <div className="space-y-3">
          <button onClick={() => { onAllow('exact'); }} className="w-full py-4 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left"><div className="flex flex-col"><span className="text-base">📍 Permitir (Exata)</span><span className="text-xs text-black/70 font-normal">DURANTE O USO DO APP</span></div></button>
          <button onClick={() => { onAllow('approximate'); }} className="w-full py-4 px-4 rounded-xl border border-white/20 text-white font-bold text-left"><div className="flex flex-col"><span className="text-base">📍 Permitir (Aproximada)</span><span className="text-xs text-[#A0A0B0] font-normal">APENAS ESTA VEZ</span></div></button>
          <button onClick={onDeny} className="w-full py-4 px-4 rounded-xl text-[#A0A0B0] text-left">NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

const NotificationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center pointer-events-auto">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30">
      <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-6 pb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4"><Bell size={32} className="text-[#F4D03F]" /></div>
        <h2 className="text-white text-xl font-bold text-center mb-2">Permitir notificações?</h2>
        <p className="text-[#A0A0B0] text-sm text-center mb-4">Para receber alertas importantes como:</p>
        <div className="bg-white/5 rounded-xl p-3 mb-6 space-y-2">
          <p className="text-white text-sm">• 🚗 "Motorista a caminho"</p>
          <p className="text-white text-sm">• 📍 "Estou chegando!"</p>
          <p className="text-white text-sm">• ✅ "Corrida confirmada"</p>
          <p className="text-white text-sm">• 💰 "Promoções e descontos"</p>
        </div>
        <div className="space-y-3">
          <button onClick={onAllow} className="w-full py-4 rounded-xl bg-[#F4D03F] text-black font-bold">PERMITIR</button>
          <button onClick={onDeny} className="w-full py-4 rounded-xl border border-white/20 text-white font-bold">NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

const SignUpModal = ({ onSuccess }: any) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleCreateAccount = async () => {
    setError('');
    if (!phoneNumber || !password || !confirmPassword) { setError('Preencha todos os campos'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem'); return; }
    if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres'); return; }
    if (!agreeTerms) { setError('Aceite os termos de uso'); return; }

    setLoading(true);
    const phoneDigits = phoneNumber.replace(/\D/g, '');
    const tempEmail = `user_${phoneDigits}@obaleva.com`;

    try {
      const { error: signUpError } = await supabase.auth.signUp({ email: tempEmail, password, options: { data: { telefone: phoneNumber, nome_completo: 'Usuário ObaLeva' } } });
      if (signUpError && !signUpError.message.includes('already registered')) throw signUpError;
      const { error: signInError } = await supabase.auth.signInWithPassword({ email: tempEmail, password });
      if (signInError) throw signInError;
      localStorage.setItem('obaleva_phone', phoneNumber);
      localStorage.setItem('obaleva_onboarding', 'true');
      localStorage.setItem('location_permission_asked', 'true');
      onSuccess();
    } catch (err: any) { setError(err.message || 'Erro ao criar conta'); }
    finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 max-h-[85vh] overflow-y-auto">
        <div className="p-3 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-6 pb-8">
          <div className="text-center mb-4"><div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3"><Car size={32} className="text-[#F4D03F]" /></div><h2 className="text-white text-xl font-bold">Criar sua conta</h2><p className="text-[#A0A0B0] text-sm">Comece a usar o ObaLeva</p></div>
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          <div className="space-y-3">
            <button onClick={handleGoogleLogin} className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-3"><svg className="w-5 h-5" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg><span>Entrar com Google</span></button>
            <div className="relative my-3"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div></div>
            <div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center px-3 py-3"><span className="text-white font-bold mr-2">+55</span><input type="tel" placeholder="(11) 99999-9999" className="flex-1 bg-transparent text-white outline-none" value={phoneNumber} onChange={(e) => setPhoneNumber(formatPhoneNumber(e.target.value))} maxLength={15} /></div></div>
            <div className="relative"><input type={showPassword ? "text" : "password"} placeholder="Senha *" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <div className="relative"><input type={showPassword ? "text" : "password"} placeholder="Confirmar senha *" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button></div>
            <label className="flex items-center gap-2 py-2"><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-4 h-4" /><span className="text-[#A0A0B0] text-xs">Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span> e a <span className="text-[#F4D03F]">Política de Privacidade</span></span></label>
            <button onClick={handleCreateAccount} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">{loading ? 'Criando conta...' : '✅ CRIAR CONTA'}</button>
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
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      
      const completed = localStorage.getItem('obaleva_onboarding') === 'true';
      const locationAsked = localStorage.getItem('location_permission_asked') === 'true';
      
      setOnboardingCompleted(completed || !!session?.user);
      
      if (!completed && !session?.user) {
        if (!locationAsked) setShowLocationModal(true);
        else setShowNotificationModal(true);
      }
      setLoading(false);
    };
    checkStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setOnboardingCompleted(true);
        localStorage.setItem('obaleva_onboarding', 'true');
        setShowLocationModal(false);
        setShowNotificationModal(false);
        setShowSignUpModal(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLocationAllow = (type: string) => {
    localStorage.setItem('location_permission_asked', 'true');
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {});
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleLocationDeny = () => {
    localStorage.setItem('location_permission_asked', 'true');
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleNotificationAllow = () => {
    if ('Notification' in window) Notification.requestPermission();
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleNotificationDeny = () => {
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpModal(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (loading) return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;

  const showFullUI = onboardingCompleted || !!user;

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} onLogout={user ? handleLogout : undefined} showFullUI={showFullUI} />}
        {activeTab === 'perfil' && user && <ProfileScreen user={user} onLogout={handleLogout} />}
        {activeTab === 'buscar' && showFullUI && <SearchScreen />}
        {activeTab === 'atividade' && showFullUI && <ActivityScreen />}
        {showFullUI && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
      </div>

      {!showFullUI && showLocationModal && <LocationModal onAllow={handleLocationAllow} onDeny={handleLocationDeny} />}
      {!showFullUI && showNotificationModal && <NotificationModal onAllow={handleNotificationAllow} onDeny={handleNotificationDeny} />}
      {!showFullUI && showSignUpModal && <SignUpModal onSuccess={handleSignUpSuccess} />}
    </>
  );
};