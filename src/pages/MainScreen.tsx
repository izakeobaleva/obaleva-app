import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Chrome } from 'lucide-react';

export const MainScreen = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      window.location.reload();
    }
    return { error: !!error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  // TELA PRINCIPAL (LOGADO)
  if (user) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Car className="text-[#F4D03F]" size={28} />
              <h1 className="text-white text-2xl font-bold">OBALEVA</h1>
            </div>
            <button
              onClick={async () => {
                await supabase.auth.signOut();
                localStorage.clear();
                window.location.reload();
              }}
              className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold"
            >
              SAIR
            </button>
          </div>
          <div className="bg-[#1A1528] h-[200px] rounded-xl flex items-center justify-center mb-4">
            <p className="text-white text-center">
              🗺️ MAPA<br />
              Logado: {user.email}
            </p>
          </div>
          <div className="bg-[#1A1528] rounded-xl p-4">
            <input
              type="text"
              placeholder="Para onde você vai agora?"
              className="w-full p-3 rounded-lg bg-white/10 text-white mb-3"
            />
            <button className="w-full py-3 bg-[#F4D03F] text-black font-bold rounded-lg">
              Confirmar corrida
            </button>
          </div>
        </div>
      </div>
    );
  }

  // TELA DE LOGIN
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
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 rounded-xl border border-white/20 text-white flex items-center justify-center gap-2"
          >
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span>
            </div>
          </div>

          <LoginForm onLogin={handleLogin} />

          <button className="w-full mt-3 text-[#F4D03F] text-sm">Criar conta</button>
        </div>
      </div>
    </div>
  );
};

// Componente de formulário de login
const LoginForm = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      {error && (
        <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">
          {error}
        </div>
      )}
      <input
        type="email"
        placeholder="E-mail"
        className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <div className="relative">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4 pr-10"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-3 top-3 text-gray-400"
        >
          {showPassword ? '🙈' : '👁️'}
        </button>
      </div>
      <button
        onClick={async () => {
          setError('');
          setLoading(true);
          const result = await onLogin(email, password);
          if (result?.error) setError('E-mail ou senha inválidos');
          setLoading(false);
        }}
        disabled={loading}
        className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
      >
        {loading ? 'Entrando...' : 'Entrar'}
      </button>
    </>
  );
};