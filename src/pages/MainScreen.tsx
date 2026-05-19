import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  Car, Chrome, Eye, EyeOff, Home, Search, ClipboardList, User, 
  Bell, Settings, Gift, MessageCircle, CreditCard, Tag, DollarSign, 
  HelpCircle, Shield, Camera, Users, Truck, ChevronRight, Key, 
  ArrowLeft, LogOut, Star, MapPin
} from 'lucide-react';
import MapComponent from '../components/MapComponent';
import OnboardingFlow from '../components/OnboardingFlow';

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
// FUNÇÃO DE LOGOUT
// ============================================
const fazerLogout = async () => {
  await supabase.auth.signOut();
  localStorage.clear();
  sessionStorage.clear();
  window.location.href = '/';
};

// ============================================
// TELA PRINCIPAL COM MAPA, ENDEREÇO, DESTINO E BOTÃO CHAMAR
// ============================================
const HomeScreenFunc = ({ user }: any) => {
  const [origem, setOrigem] = useState('Buscando endereço...');
  const [destino, setDestino] = useState('');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoEditado, setEnderecoEditado] = useState('');
  const destinoInputRef = useRef<HTMLInputElement>(null);

  // Ouvir evento de endereço vindo do MapComponent
  useEffect(() => {
    const handler = (e: any) => {
      const endereco = e.detail?.endereco;
      if (endereco) {
        setOrigem(endereco);
        setEnderecoEditado(endereco);
      }
    };
    window.addEventListener('enderecoAtualizado', handler);
    return () => window.removeEventListener('enderecoAtualizado', handler);
  }, []);

  // Autocomplete para destino
  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places && destinoInputRef.current) {
        clearInterval(checkGoogleMaps);
        const destinoAuto = new window.google.maps.places.Autocomplete(destinoInputRef.current, {
          fields: ['formatted_address', 'geometry', 'name'],
        });
        destinoAuto.addListener('place_changed', () => {
          const place = destinoAuto.getPlace();
          if (place.geometry) {
            setDestino(place.formatted_address || place.name || '');
          }
        });
      }
    }, 500);
    return () => clearInterval(checkGoogleMaps);
  }, []);

  const handleChamarObaLeva = async () => {
    if (!destino) {
      alert('Digite um destino!');
      return;
    }
    alert(`🚗 Corrida solicitada!\n\n📍 Origem: ${origem}\n📍 Destino: ${destino}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button onClick={fazerLogout} className="text-red-400 text-xs hover:underline">Sair</button>
      </div>

      {/* Mapa com gotinha azul e círculo pulsante */}
      <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
        <div className="absolute bottom-3 right-3 bg-[#1A1528] rounded-full p-2 shadow-lg border border-[#F4D03F]/30">
          <MapPin size={20} className="text-[#F4D03F]" />
        </div>
      </div>

      {/* ONDE VOCÊ ESTÁ? - Endereço automático com botão Editar/Confirmar */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={() => setModoEdicao(!modoEdicao)}
              className="text-[#F4D03F] text-xs hover:underline"
            >
              {modoEdicao ? 'Cancelar' : '✏️ Editar'}
            </button>
            {modoEdicao && (
              <button 
                onClick={() => {
                  setOrigem(enderecoEditado);
                  setModoEdicao(false);
                }}
                className="text-green-400 text-xs hover:underline"
              >
                ✅ Confirmar
              </button>
            )}
          </div>
        </div>
        
        {modoEdicao ? (
          <input
            type="text"
            className="w-full bg-white/10 text-white p-2 rounded-lg outline-none"
            value={enderecoEditado}
            onChange={(e) => setEnderecoEditado(e.target.value)}
          />
        ) : (
          <div className="flex items-center gap-2">
            <span className="text-white text-sm flex-1">{origem}</span>
          </div>
        )}
      </div>

      {/* PARA ONDE VAI? - Campo com autocomplete */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-white text-xs font-bold">PARA ONDE VAI?</span>
        </div>
        <input
          ref={destinoInputRef}
          type="text"
          placeholder="Digite seu destino..."
          className="w-full bg-transparent text-white text-sm outline-none placeholder-[#A0A0B0]"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
      </div>

      {/* BOTÃO CHAMAR OBALEVALe */}
      <button
        onClick={handleChamarObaLeva}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"
      >
        <Car size={18} /> CHAMAR OBALEVALe
      </button>

      {/* Banner de promoção */}
      <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 mb-2 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-2xl">🍔</span>
            <span className="text-white font-bold text-sm">Almoço com até 50% OFF</span>
          </div>
          <p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p>
        </div>
        <ChevronRight size={20} className="text-[#F4D03F]" />
      </div>
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreenFunc = ({ user }: any) => {
  const menuItems = [
    { icon: ClipboardList, label: "Solicitações", color: "#F4D03F" },
    { icon: MessageCircle, label: "Mensagens", color: "#F4D03F" },
    { icon: CreditCard, label: "99Pay", color: "#F4D03F" },
    { icon: Tag, label: "Descontos", color: "#F4D03F" },
    { icon: DollarSign, label: "Pagamento", color: "#F4D03F" },
    { icon: Settings, label: "Configurações", color: "#F4D03F" },
    { icon: HelpCircle, label: "Ajuda", color: "#F4D03F" },
    { icon: Shield, label: "Segurança", color: "#F4D03F" },
    { icon: Camera, label: "Escanear", color: "#F4D03F" },
  ];

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      <div className="flex justify-between items-center py-3">
        <div>
          <h2 className="text-white text-lg font-bold">{user?.email?.split('@')[0]}</h2>
          <button className="text-[#F4D03F] text-xs flex items-center gap-1"><Key size={12} /> Criar chave de acesso</button>
        </div>
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-[#A0A0B0]" />
          <Settings size={20} className="text-[#A0A0B0]" />
        </div>
      </div>

      <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-4 mb-4 flex justify-between items-center">
        <div><div className="flex items-center gap-2"><Gift size={20} className="text-[#F4D03F]" /><span className="text-white font-bold">Clube</span></div><p className="text-[#F4D03F] text-sm font-bold">Receba cupons de R$90</p></div>
        <ChevronRight size={20} className="text-[#F4D03F]" />
      </div>

      <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden mb-4">
        {menuItems.map((item, index) => (
          <button key={index} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10 last:border-0">
            <div className="flex items-center gap-3"><item.icon size={18} style={{ color: item.color }} /><span className="text-white text-sm">{item.label}</span></div>
            <ChevronRight size={16} className="text-[#A0A0B0]" />
          </button>
        ))}
      </div>

      <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden mb-4">
        <div className="p-3 border-b border-white/10"><span className="text-white font-bold text-sm">🌟 OUTROS RECURSOS</span></div>
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10"><div className="flex items-center gap-3"><Users size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Convide Amigos</span></div><ChevronRight size={16} className="text-[#A0A0B0]" /></button>
        <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition"><div className="flex items-center gap-3"><Truck size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Seja Motorista</span></div><ChevronRight size={16} className="text-[#A0A0B0]" /></button>
      </div>

      <button onClick={fazerLogout} className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold">SAIR DA CONTA</button>
    </div>
  );
};

// ============================================
// TELAS PLACEHOLDER
// ============================================
const SearchScreenFunc = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
    </div>
  </div>
);

const ActivityScreenFunc = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <ClipboardList size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">📋 Atividade</h2>
      <p className="text-gray-400 mt-2">Histórico de corridas</p>
    </div>
  </div>
);

// ============================================
// TELA DE LOGIN
// ============================================
const LoginScreenFunc = ({ onLogin, onGoogleLogin, onSignUp }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-gray-400 mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6">
          {error && <div className="mb-3 text-center text-sm text-red-400 bg-red-500/10 rounded p-2">{error}</div>}
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2 mb-4"><Chrome size={20} /> Entrar com Google</button>
          <div className="relative mb-4"><div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10" /></div><div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div></div>
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative mb-4">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <button onClick={async () => { setError(''); setLoading(true); const result = await onLogin(email, password); if (result?.error) setError('E-mail ou senha inválidos'); setLoading(false); }} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">{loading ? 'Entrando...' : 'Entrar'}</button>
          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm font-medium">Criar conta</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO
// ============================================
const SignUpScreenFunc = ({ onBack, onSuccess }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!nome || !email || !password) { setError('Preencha todos os campos'); return; }
    if (password.length < 6) { setError('Senha: mínimo 6 caracteres'); return; }
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome } } });
      if (error) throw error;
      if (data.user) {
        await supabase.from('usuarios').insert({ id: data.user.id, nome_completo: nome, email, tipo: 'passageiro' });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) { setError(error.message.includes('already') ? 'E-mail já cadastrado' : error.message); }
    finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="flex items-center gap-1 text-[#A0A0B0] mb-4 hover:text-[#F4D03F] transition"><ArrowLeft size={18} /> Voltar</button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-xl font-bold text-white text-center mb-6">Criar Conta</h2>
          {error && <div className="mb-3 text-center text-sm text-red-400 bg-red-500/10 rounded p-2">{error}</div>}
          <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative mb-4">
            <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">{showPassword ? <EyeOff size={18} /> : <Eye size={18} />}</button>
          </div>
          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">{loading ? 'Criando...' : 'Cadastrar'}</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN PRINCIPAL
// ============================================
const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);
  const [checkingOnboarding, setCheckingOnboarding] = useState(true);

  useEffect(() => {
    const checkStatus = async () => {
      const completed = localStorage.getItem('obaleva_onboarding') === 'true';
      setOnboardingCompleted(completed);
      
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        localStorage.setItem('obaleva_onboarding', 'true');
        setOnboardingCompleted(true);
      } else if (!completed) {
        setShowOnboarding(true);
      }
      
      setCheckingOnboarding(false);
      setLoading(false);
    };
    
    checkStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) window.location.reload();
    return { error: !!error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (loading || checkingOnboarding) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
            <Car size={32} className="text-[#F4D03F]" />
          </div>
          <div className="w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-[#A0A0B0] text-sm mt-3">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se NÃO completou onboarding E NÃO está logado: mostrar onboarding sobreposto + tela de login
  if (!onboardingCompleted && !user) {
    return (
      <>
        <LoginScreenFunc 
          onLogin={handleLogin} 
          onGoogleLogin={handleGoogleLogin} 
          onSignUp={() => setShowSignUp(true)} 
        />
        <OnboardingFlow 
          isVisible={showOnboarding} 
          onComplete={() => {
            setShowOnboarding(false);
            setOnboardingCompleted(true);
            window.location.reload();
          }} 
        />
      </>
    );
  }

  // Se está logado
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreenFunc user={user} />}
        {activeTab === 'perfil' && <ProfileScreenFunc user={user} />}
        {activeTab === 'buscar' && <SearchScreenFunc />}
        {activeTab === 'atividade' && <ActivityScreenFunc />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  // Tela de cadastro
  if (showSignUp) {
    return <SignUpScreenFunc onBack={() => setShowSignUp(false)} onSuccess={() => { setShowSignUp(false); window.location.reload(); }} />;
  }

  // Tela de login padrão
  return <LoginScreenFunc onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};

export { MainScreen };
export default MainScreen;