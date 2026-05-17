import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Home, Search, User, Menu, LogOut, MapPin, Chrome, Eye, EyeOff } from 'lucide-react';
import MapComponent from '../components/MapComponent';

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
        <div className="flex justify-between px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={22} />
              <span className="text-[10px]">{tab.label}</span>
              {active === tab.id && <div className="w-1.5 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
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
const HomeScreen = ({ user, onLogout }: any) => {
  const [destino, setDestino] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleConfirmar = () => {
    if (!destino.trim()) {
      setMensagem('❌ Digite um destino');
      setTimeout(() => setMensagem(''), 2000);
      return;
    }
    setMensagem(`✅ Corrida para: ${destino}`);
    setTimeout(() => setMensagem(''), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button 
          onClick={onLogout}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
        >
          SAIR
        </button>
      </div>

      <div className="h-[200px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
      </div>

      <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528]/80 rounded-xl p-4 border border-[#F4D03F]/20">
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <MapPin size={20} className="text-[#F4D03F]" /> Para onde você vai agora?
        </h2>
        <input
          type="text"
          placeholder="Digite seu destino..."
          className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none focus:border-[#F4D03F] transition"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <button onClick={handleConfirmar} className="w-full mt-4 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold hover:scale-[1.02] transition">
          Confirmar corrida
        </button>
        {mensagem && (
          <div className="mt-3 p-2 text-center text-sm text-white bg-green-500/30 rounded-lg">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreen = ({ user, onLogout }: any) => (
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
      <button onClick={onLogout} className="mt-8 w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold hover:bg-red-500/30 transition">
        SAIR
      </button>
    </div>
  </div>
);

const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
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
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await onLogin(email, password);
    if (result?.error) setError('E-mail ou senha inválidos');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-xl">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold mt-4 bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded-lg">{error}</div>}
          
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2 transition-all hover:scale-[1.02]">
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
          </div>

          <div className="relative">
            <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3 focus:border-[#F4D03F] transition outline-none" value={email} onChange={e => setEmail(e.target.value)} />
          </div>
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10 focus:border-[#F4D03F] transition outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-[#F4D03F] transition">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02]">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm hover:underline transition">Criar nova conta</button>
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
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = async () => {
    setError('');
    if (!nome || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      setError('Senha: mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome } }
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nome_completo: nome,
          email: email,
          tipo: 'passageiro'
        });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message.includes('already') ? 'E-mail já cadastrado' : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="text-[#A0A0B0] mb-4 flex items-center gap-1 hover:text-[#F4D03F] transition">← Voltar</button>
        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          <h2 className="text-2xl font-bold text-white text-center mb-6">Criar Conta</h2>
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded-lg">{error}</div>}
          <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3 focus:border-[#F4D03F] transition outline-none" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3 focus:border-[#F4D03F] transition outline-none" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10 focus:border-[#F4D03F] transition outline-none" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-[#F4D03F] transition">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all hover:scale-[1.02]">
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// SPLASH SCREEN
// ============================================
const SplashScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-bounce">
        <Car size={40} className="text-[#F4D03F]" />
      </div>
      <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
      <p className="text-[#A0A0B0] text-sm mt-2">Carregando...</p>
    </div>
  </div>
);

// ============================================
// MAIN SCREEN
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    // Verificar sessão ao carregar
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error(err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkSession();

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      window.location.reload();
    }
    return { error: !!error };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ 
      provider: 'google', 
      options: { redirectTo: window.location.origin } 
    });
  };

  if (loading) {
    return <SplashScreen />;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreen user={user} onLogout={handleLogout} />}
        {activeTab === 'perfil' && <ProfileScreen user={user} onLogout={handleLogout} />}
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