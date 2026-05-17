import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, LogOut, Home, Search, User, Menu, Eye, EyeOff } from 'lucide-react';

// ============================================
// TELA PRINCIPAL (HOME)
// ============================================
const HomeScreen = ({ user, onSignOut }: any) => {
  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button 
          onClick={onSignOut} 
          className="px-4 py-2 rounded-lg bg-red-500/30 border border-red-500 text-red-400 text-sm font-bold hover:bg-red-500/50 transition"
        >
          <LogOut size={14} className="inline mr-1" /> SAIR
        </button>
      </div>

      {/* Mapa */}
      <div className="h-[220px] rounded-xl bg-gradient-to-br from-[#1A1528] to-[#2D2342] flex items-center justify-center mb-3 border border-[#F4D03F]/20">
        <div className="text-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-2">
            <Car size={32} className="text-[#F4D03F]" />
          </div>
          <p className="text-white text-sm">🗺️ Mapa</p>
          <p className="text-[#A0A0B0] text-xs">Logado: {user?.email}</p>
        </div>
      </div>

      {/* Campos */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20">
        <div className="bg-white/10 rounded-lg mb-2 p-3">
          <input type="text" placeholder="Onde você está?" className="w-full bg-transparent text-white outline-none" />
        </div>
        <div className="bg-white/10 rounded-lg p-3">
          <input type="text" placeholder="Para onde vai?" className="w-full bg-transparent text-white outline-none" />
        </div>
      </div>

      {/* Botão Solicitar */}
      <button className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
        🚗 SOLICITAR CORRIDA
      </button>
    </div>
  );
};

// ============================================
// TELA DE PERFIL
// ============================================
const ProfileScreen = ({ user, profile, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
        <User size={40} className="text-[#F4D03F]" />
      </div>
      <h2 className="text-white text-xl font-bold">{profile?.nome_completo || user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <button onClick={onSignOut} className="mt-6 w-full py-3 rounded-xl bg-red-500/30 border border-red-500 text-red-400 font-bold">
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
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
    </div>
  </div>
);

const MenuScreen = () => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
      <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
      <h2 className="text-white text-xl font-bold">☰ Menu</h2>
      <p className="text-gray-400 mt-2">Em breve</p>
    </div>
  </div>
);

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
              <tab.icon size={24} />
              <span className="text-xs">{tab.label}</span>
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
const LoginScreen = ({ onLogin, onGoogleLogin, onSignUp }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await onLogin(email, password);
    if (error) {
      alert('❌ E-mail ou senha inválidos');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0]">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <form onSubmit={handleSubmit}>
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" 
              value={email} 
              onChange={e => setEmail(e.target.value)} 
              required 
            />
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                placeholder="Senha" 
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10" 
                value={password} 
                onChange={e => setPassword(e.target.value)} 
                required 
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
              {loading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm py-2">Criar nova conta</button>
          <button onClick={onGoogleLogin} className="w-full mt-2 py-2 rounded-xl border border-white/15 text-white">
            Entrar com Google
          </button>
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
// MAIN SCREEN PRINCIPAL
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  // Verificar sessão ao iniciar
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
      }
      setLoading(false);
    };
    
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      // Recarregar para atualizar o estado
      window.location.reload();
    }
    return { error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setProfile(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-[#F4D03F] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white">Carregando...</p>
        </div>
      </div>
    );
  }

  // ✅ USUÁRIO LOGADO → TELA PRINCIPAL
  if (user) {
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

  // Tela de login/cadastro
  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />;
  }

  return (
    <LoginScreen 
      onLogin={handleLogin} 
      onGoogleLogin={handleGoogleLogin} 
      onSignUp={() => setShowSignUp(true)} 
    />
  );
};