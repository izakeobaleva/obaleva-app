import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Chrome, Eye, EyeOff, Truck, Home, Search, User, Menu, MapPin, DollarSign, Calendar } from 'lucide-react';

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
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4">
        <div className="flex justify-between px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={22} />
              <span className="text-[10px]">{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DO PASSAGEIRO
// ============================================
const PassengerScreen = ({ user, onLogout }: any) => {
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
        <button onClick={onLogout} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold">
          SAIR
        </button>
      </div>

      <div className="h-[200px] rounded-xl bg-[#1A1528] flex items-center justify-center mb-3 border border-[#F4D03F]/20">
        <div className="text-center">
          <MapPin size={32} className="text-[#F4D03F] mx-auto mb-2" />
          <p className="text-white text-sm">🗺️ Mapa será carregado</p>
          <p className="text-gray-500 text-xs mt-1">{user?.email}</p>
        </div>
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20">
        <h2 className="text-white font-bold text-lg mb-3">Para onde você vai agora?</h2>
        <input
          type="text"
          placeholder="Digite seu destino..."
          className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <button onClick={handleConfirmar} className="w-full mt-4 py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
          Confirmar corrida
        </button>
        {mensagem && (
          <div className="mt-3 p-2 text-center text-sm text-white bg-green-500/30 rounded">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================
// TELA DO MOTORISTA
// ============================================
const DriverScreen = ({ user, onLogout }: any) => {
  const [online, setOnline] = useState(true);
  const [stats, setStats] = useState({
    hoje: { corridas: 0, valor: 0 },
    semana: { corridas: 0, valor: 0 },
    solicitacoes: 0
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Truck size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button onClick={onLogout} className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold">
          SAIR
        </button>
      </div>

      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border border-[#F4D03F]/20 text-center mb-4">
        <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
          <Truck size={32} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-white text-xl font-bold">PAINEL DO MOTORISTA</h2>
        <div className="flex items-center justify-center gap-2 mt-2">
          <div className={`w-2 h-2 rounded-full animate-pulse ${online ? 'bg-green-500' : 'bg-red-500'}`} />
          <span className={`text-sm ${online ? 'text-green-400' : 'text-red-400'}`}>
            {online ? '🟢 Online' : '🔴 Offline'}
          </span>
        </div>
        <p className="text-[#A0A0B0] text-xs mt-1">{user?.email}</p>
      </div>

      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
          <DollarSign size={20} className="text-[#F4D03F] mx-auto mb-1" />
          <p className="text-white text-lg font-bold">R$ {stats.hoje.valor}</p>
          <p className="text-[#A0A0B0] text-xs">Hoje</p>
          <p className="text-[#A0A0B0] text-[10px]">{stats.hoje.corridas} corridas</p>
        </div>
        <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
          <Calendar size={20} className="text-[#F4D03F] mx-auto mb-1" />
          <p className="text-white text-lg font-bold">R$ {stats.semana.valor}</p>
          <p className="text-[#A0A0B0] text-xs">Esta semana</p>
          <p className="text-[#A0A0B0] text-[10px]">{stats.semana.corridas} corridas</p>
        </div>
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 mb-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-white font-bold">🚗 Solicitações pendentes</h3>
          <span className="bg-[#F4D03F]/20 text-[#F4D03F] text-xs px-2 py-1 rounded-full">
            {stats.solicitacoes}
          </span>
        </div>
        {stats.solicitacoes === 0 ? (
          <p className="text-[#A0A0B0] text-sm text-center py-4">
            Nenhuma solicitação no momento
          </p>
        ) : (
          <div className="space-y-2">
            {/* Aqui viriam as solicitações */}
            <p className="text-[#A0A0B0] text-sm">Solicitações aparecerão aqui</p>
          </div>
        )}
      </div>

      <button
        onClick={() => setOnline(!online)}
        className={`w-full py-3 rounded-xl font-bold transition ${online ? 'bg-red-500/20 border border-red-500 text-red-400' : 'bg-green-500/20 border border-green-500 text-green-400'}`}
      >
        {online ? '🔴 Ficar Offline' : '🟢 Ficar Online'}
      </button>
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreen = ({ user, onLogout }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
        <User size={40} className="text-[#F4D03F]" />
      </div>
      <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <button onClick={onLogout} className="mt-6 w-full py-3 rounded-xl bg-red-500 text-white font-bold">
        SAIR
      </button>
    </div>
  </div>
);

const SearchScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
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
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2">
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div>
          </div>

          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={async () => {
            setError('');
            setLoading(true);
            const result = await onLogin(email, password);
            if (result?.error) setError('E-mail ou senha inválidos');
            setLoading(false);
          }} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm">Criar conta</button>
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
        <button onClick={onBack} className="text-[#A0A0B0] mb-4">← Voltar</button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-xl font-bold text-white text-center mb-6">Criar Conta</h2>
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          <input type="text" placeholder="Nome completo" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={nome} onChange={e => setNome(e.target.value)} />
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} />
          <div className="relative">
            <input type={showPassword ? "text" : "password"} placeholder="Senha (mínimo 6)" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <button onClick={handleSignUp} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
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
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          setUser(session.user);
          const { data } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
          setProfile(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();
        setProfile(data);
      } else {
        setUser(null);
        setProfile(null);
      }
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

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  // Usuário logado
  if (user) {
    // Verifica se é motorista
    const isMotorista = profile?.tipo === 'motorista';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && (isMotorista ? <DriverScreen user={user} onLogout={handleLogout} /> : <PassengerScreen user={user} onLogout={handleLogout} />)}
        {activeTab === 'perfil' && <ProfileScreen user={user} onLogout={handleLogout} />}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'menu' && <MenuScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  // Não logado
  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => { setShowSignUp(false); window.location.reload(); }} />;
  }

  return <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};