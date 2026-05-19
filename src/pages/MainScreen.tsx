import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Chrome, Eye, EyeOff, Home, Search, ClipboardList, User, Bell, MapPin, ChevronRight } from 'lucide-react';
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

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      <div className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold text-white">ObaLeva</h1>
        {showFullUI && (
          <div className="flex items-center gap-3">
            <button className="text-[#A0A0B0] text-xs">Mudar passageiro</button>
            <button onClick={onLogout} className="text-red-400 text-xs font-bold">SAIR</button>
          </div>
        )}
      </div>

      <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
      </div>

      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500" /><span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span></div>
          <div className="flex gap-2">
            <button onClick={() => setModoEdicao(!modoEdicao)} className="text-[#F4D03F] text-xs hover:underline">{modoEdicao ? 'Cancelar' : '✏️ Editar'}</button>
            {modoEdicao && <button onClick={() => { setOrigem(enderecoEditado); setModoEdicao(false); }} className="text-green-400 text-xs hover:underline">✅ Confirmar</button>}
          </div>
        </div>
        {modoEdicao ? <input type="text" className="w-full bg-white/10 text-white p-2 rounded-lg outline-none" value={enderecoEditado} onChange={(e) => setEnderecoEditado(e.target.value)} /> : <div className="flex items-center gap-2"><span className="text-white text-sm flex-1">{origem}</span></div>}
      </div>

      {showFullUI && (
        <>
          <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
            <div className="flex items-center gap-2 mb-1"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span></div>
            <input type="text" placeholder="Digite o endereço ou cidade..." className="w-full bg-white/10 text-white p-2 rounded-lg outline-none" value={destino} onChange={(e) => setDestino(e.target.value)} />
          </div>
          <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"><Car size={18} /> Chamar ObaLeva</button>
          <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center">
            <div><div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div><p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p></div>
            <ChevronRight size={20} className="text-[#F4D03F]" />
          </div>
        </>
      )}
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
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

// ============================================
// MODAL DE LOCALIZAÇÃO (ALINHADO COM O MAPA)
// ============================================
const LocationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 mx-4">
      <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2"><MapPin size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Acesso à localização</h2></div>
        <p className="text-[#A0A0B0] text-xs mb-3">Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.</p>
        <div className="space-y-1.5">
          <button onClick={() => { onAllow('exact'); }} className="w-full py-1.5 px-4 rounded-xl bg-[#F4D03F] text-black font-bold text-left flex justify-between items-center">
            <div className="flex flex-col"><span className="text-sm">📍 SEMPRE PERMITIR</span><span className="text-[10px] text-black/70 font-normal">O app pode usar sua localização a qualquer momento</span></div>
          </button>
          <button onClick={() => { onAllow('approximate'); }} className="w-full py-1.5 px-4 rounded-xl border border-white/20 text-white font-bold text-left flex justify-between items-center">
            <div className="flex flex-col"><span className="text-sm">📍 SÓ DESTA VEZ</span><span className="text-[10px] text-[#A0A0B0] font-normal">O app usa sua localização apenas agora</span></div>
          </button>
          <button onClick={onDeny} className="w-full py-1.5 px-4 rounded-xl text-[#A0A0B0] text-left text-sm">🚫 NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL DE NOTIFICAÇÕES (ALINHADO COM O MAPA)
// ============================================
const NotificationModal = ({ onAllow, onDeny }: any) => (
  <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
    <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 mx-4">
      <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
      <div className="px-4 pb-4">
        <div className="flex items-center gap-2 mb-2"><Bell size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Permitir notificações?</h2></div>
        <p className="text-[#A0A0B0] text-xs mb-2">Para receber alertas importantes como:</p>
        <div className="bg-white/5 rounded-xl p-2 mb-3 space-y-0.5">
          <p className="text-white text-xs">• 🚗 "Motorista a caminho"</p>
          <p className="text-white text-xs">• 📍 "Estou chegando!"</p>
          <p className="text-white text-xs">• ✅ "Corrida confirmada"</p>
          <p className="text-white text-xs">• 💰 "Promoções e descontos"</p>
        </div>
        <div className="space-y-1.5">
          <button onClick={onAllow} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">PERMITIR</button>
          <button onClick={onDeny} className="w-full py-1.5 rounded-xl border border-white/20 text-white font-bold text-sm">NÃO PERMITIR</button>
        </div>
      </div>
    </div>
  </div>
);

// ============================================
// MODAL DE CRIAÇÃO DE CONTA (ALINHADO COM O MAPA)
// ============================================
const SignUpModal = ({ onSuccess }: any) => {
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [isLoginMode, setIsLoginMode] = useState(false);

  const formatPhoneNumber = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 6) return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    if (numbers.length <= 10) return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7, 11)}`;
  };

  const handleLogin = async () => {
    setError('');
    if (!email || !password) { setError('Preencha e-mail e senha'); return; }
    setLoading(true);
    try {
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) throw signInError;
      localStorage.setItem('obaleva_onboarding', 'true');
      localStorage.setItem('location_permission_asked', 'true');
      onSuccess();
    } catch (err: any) { setError(err.message || 'Erro ao fazer login'); }
    finally { setLoading(false); }
  };

  const handleCreateAccount = async () => {
    setError('');
    if (!nome || !email || !password || !confirmPassword) { setError('Preencha todos os campos obrigatórios'); return; }
    if (password !== confirmPassword) { setError('As senhas não coincidem'); return; }
    if (password.length < 6) { setError('A senha deve ter no mínimo 6 caracteres'); return; }
    if (!agreeTerms) { setError('Aceite os termos de uso'); return; }

    setLoading(true);
    try {
      const { data, error: signUpError } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome, telefone: telefone.replace(/\D/g, '') } } });
      if (signUpError) throw signUpError;
      if (data.user) {
        await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, email, telefone: telefone.replace(/\D/g, ''), tipo: 'passageiro' });
        await supabase.from('passageiros').insert({ id: data.user.id });
        localStorage.setItem('obaleva_onboarding', 'true');
        localStorage.setItem('location_permission_asked', 'true');
        alert('✅ Conta criada! Faça login.');
        setIsLoginMode(true);
        setError('Conta criada! Agora faça login.');
      }
    } catch (err: any) {
      if (err.message.includes('already registered')) { setError('Este e-mail já está cadastrado.'); setIsLoginMode(true); }
      else { setError(err.message || 'Erro ao criar conta'); }
    } finally { setLoading(false); }
  };

  const handleGoogleLogin = async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); };

  if (isLoginMode) {
    return (
      <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
        <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 mx-4">
          <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
          <div className="px-4 pb-4">
            <div className="flex items-center gap-2 mb-2"><Car size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Fazer login</h2></div>
            {error && <div className="mb-2 p-1.5 text-center text-xs text-red-400 bg-red-500/10 rounded">{error}</div>}
            <div className="space-y-1.5">
              <div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center px-3 py-1.5"><span className="text-white mr-2 text-sm">📧</span><input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
              <div className="relative"><input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
              <button onClick={handleLogin} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Entrando...' : '🚪 ENTRAR'}</button>
              <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-gray-400">ou</span></div></div>
              <div className="flex gap-2"><button onClick={handleGoogleLogin} className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white text-sm">🌐 Google</button><button onClick={() => { setIsLoginMode(false); setError(''); }} className="flex-1 py-1.5 rounded-xl border border-white/20 text-white text-sm">✨ Criar conta</button></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/70 z-50 flex items-end justify-center pointer-events-auto">
      <div className="bg-[#1A1528] w-full max-w-md rounded-t-2xl border-t border-[#F4D03F]/30 mx-4">
        <div className="p-1.5 flex justify-center"><div className="w-12 h-1 bg-[#F4D03F]/50 rounded-full" /></div>
        <div className="px-4 pb-4">
          <div className="flex items-center gap-2 mb-2"><Car size={24} className="text-[#F4D03F]" /><h2 className="text-white text-base font-bold">Criar sua conta</h2></div>
          <p className="text-[#A0A0B0] text-xs ml-7 mb-2">Preencha seus dados para começar</p>
          {error && <div className="mb-2 p-1.5 text-center text-xs text-red-400 bg-red-500/10 rounded">{error}{error.includes('já cadastrado') && <button onClick={() => setIsLoginMode(true)} className="ml-2 text-[#F4D03F] underline font-bold">Faça login</button>}</div>}
          <div className="space-y-1.5">
            <div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center px-3 py-1.5"><span className="text-white mr-2 text-sm">👤</span><input type="text" placeholder="Nome completo *" className="flex-1 bg-transparent text-white outline-none text-sm" value={nome} onChange={(e) => setNome(e.target.value)} /></div></div>
            <div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center px-3 py-1.5"><span className="text-white mr-2 text-sm">📧</span><input type="email" placeholder="E-mail *" className="flex-1 bg-transparent text-white outline-none text-sm" value={email} onChange={(e) => setEmail(e.target.value)} /></div></div>
            <div className="bg-white/5 rounded-xl border border-white/15"><div className="flex items-center px-3 py-1.5"><span className="text-white mr-2 text-sm">📱</span><input type="tel" placeholder="Telefone (opcional)" className="flex-1 bg-transparent text-white outline-none text-sm" value={telefone} onChange={(e) => setTelefone(formatPhoneNumber(e.target.value))} maxLength={15} /></div></div>
            <div className="flex gap-2">
              <div className="flex-1 relative"><input type={showPassword ? 'text' : 'password'} placeholder="Senha *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={password} onChange={(e) => setPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
              <div className="flex-1 relative"><input type={showPassword ? 'text' : 'password'} placeholder="Confirmar *" className="w-full py-1.5 px-3 rounded-xl bg-white/10 border border-white/15 text-white pr-7 text-sm" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} /><button onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-gray-400">{showPassword ? <EyeOff size={14} /> : <Eye size={14} />}</button></div>
            </div>
            <label className="flex items-center gap-1.5 py-1"><input type="checkbox" checked={agreeTerms} onChange={(e) => setAgreeTerms(e.target.checked)} className="w-3 h-3" /><span className="text-[#A0A0B0] text-[10px]">Li e aceito os <span className="text-[#F4D03F]">Termos de Uso</span></span></label>
            <button onClick={handleCreateAccount} disabled={loading} className="w-full py-1.5 rounded-xl bg-[#F4D03F] text-black font-bold text-sm">{loading ? 'Criando conta...' : '✅ CRIAR CONTA'}</button>
            <div className="relative my-1.5"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-2 text-[10px] text-gray-400">ou</span></div></div>
            <div className="flex gap-2"><button onClick={handleGoogleLogin} className="flex-1 py-1.5 rounded-xl bg-white/10 border border-white/20 text-white flex items-center justify-center gap-1 text-sm"><svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/><path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/><path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/></svg><span>Google</span></button><button onClick={() => setIsLoginMode(true)} className="flex-1 py-1.5 rounded-xl border border-white/20 text-white text-sm">🔐 Já tenho conta</button></div>
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

  const handleLocationAllow = () => {
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