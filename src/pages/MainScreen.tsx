import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Chrome, Eye, EyeOff, LogOut } from 'lucide-react';

// ============================================
// TELA DE LOGIN SIMPLIFICADA
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
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          {error && <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">{error}</div>}
          
          <button onClick={onGoogleLogin} className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2">
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
            <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
          </div>

          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3"
            value={email} 
            onChange={e => setEmail(e.target.value)} 
          />
          
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Senha" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10"
              value={password} 
              onChange={e => setPassword(e.target.value)} 
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400">
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button onClick={handleLogin} disabled={loading} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm">Criar conta</button>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE CADASTRO SIMPLIFICADA
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
// TELA PRINCIPAL (HOME) - SEM MAPA PARA TESTAR
// ============================================
const HomeScreen = ({ user }: any) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-28">
        <div className="flex justify-between items-center py-3">
          <div className="flex items-center gap-2">
            <Car size={24} className="text-[#F4D03F]" />
            <h1 className="text-xl font-bold text-white">OBALEVA</h1>
          </div>
          <button 
            onClick={() => {
              localStorage.clear();
              sessionStorage.clear();
              window.location.href = '/';
            }}
            className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold"
          >
            SAIR
          </button>
        </div>

        <div className="bg-[#1A1528] rounded-xl p-4 text-center">
          <p className="text-white text-lg">✅ App funcionando!</p>
          <p className="text-[#A0A0B0] text-sm mt-2">Logado como: {user?.email}</p>
        </div>

        <div className="bg-[#1A1528] rounded-xl p-4 mt-4 border border-[#F4D03F]/20">
          <h2 className="text-white font-bold text-lg mb-3">Para onde você vai agora?</h2>
          <input
            type="text"
            placeholder="Digite seu destino..."
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none"
          />
          <button className="w-full mt-4 py-3 rounded-xl bg-[#F4D03F] text-black font-bold">
            Confirmar corrida
          </button>
        </div>

        <div className="mt-4 flex justify-around">
          <span className="text-[#A0A0B0] text-xs">🏠 Início</span>
          <span className="text-[#A0A0B0] text-xs">🔍 Buscar</span>
          <span className="text-[#A0A0B0] text-xs">👤 Perfil</span>
          <span className="text-[#A0A0B0] text-xs">☰ Menu</span>
        </div>
      </div>
    </div>
  );
};

// ============================================
// TELA DE SPLASH
// ============================================
const SplashScreen = () => (
  <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
    <div className="text-center">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 animate-pulse">
        <Car size={40} className="text-[#F4D03F]" />
      </div>
      <h1 className="text-2xl font-bold text-white">OBALEVA</h1>
      <p className="text-[#A0A0B0] text-sm mt-2">Carregando...</p>
    </div>
  </div>
);

// ============================================
// MAIN SCREEN PRINCIPAL
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        setUser(session?.user || null);
      } catch (err) {
        console.error("Erro:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

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

  if (loading) {
    return <SplashScreen />;
  }

  if (user) {
    return <HomeScreen user={user} />;
  }

  if (showSignUp) {
    return <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => { setShowSignUp(false); window.location.reload(); }} />;
  }

  return <LoginScreen onLogin={handleLogin} onGoogleLogin={handleGoogleLogin} onSignUp={() => setShowSignUp(true)} />;
};