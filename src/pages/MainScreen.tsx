import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car } from 'lucide-react';

// TELA PRINCIPAL (quando logado)
const HomePage = ({ user, onLogout }: any) => {
  return (
    <div className="min-h-screen bg-[#0F0B1A] p-4">
      <div className="max-w-md mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <Car className="text-[#F4D03F]" />
            <h1 className="text-white text-xl font-bold">OBALEVA</h1>
          </div>
          <button 
            onClick={onLogout}
            className="bg-red-500/30 px-4 py-2 rounded-lg text-red-400"
          >
            SAIR
          </button>
        </div>
        
        <div className="bg-[#1A1528] h-[200px] rounded-xl flex items-center justify-center mb-4">
          <p className="text-white">🗺️ MAPA</p>
        </div>
        
        <div className="bg-[#1A1528] rounded-xl p-3 mb-3">
          <input type="text" placeholder="Onde você está?" className="w-full bg-transparent text-white p-2 border-b border-white/20" />
          <input type="text" placeholder="Para onde vai?" className="w-full bg-transparent text-white p-2 mt-2" />
        </div>
        
        <button className="w-full py-3 bg-[#F4D03F] rounded-xl text-black font-bold">
          SOLICITAR CORRIDA
        </button>
        
        <p className="text-center text-gray-500 text-xs mt-4">
          Logado: {user?.email}
        </p>
      </div>
    </div>
  );
};

// TELA DE LOGIN
const LoginPage = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <Car size={48} className="text-[#F4D03F] mx-auto" />
          <h1 className="text-3xl font-bold text-white mt-4">OBALEVA</h1>
          <p className="text-gray-400 mt-2">Sua corrida de confiança</p>
        </div>
        
        <div className="bg-[#1A1528] rounded-2xl p-6">
          <input 
            type="email" 
            placeholder="E-mail" 
            className="w-full p-3 rounded-xl bg-white/10 text-white mb-3"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full p-3 rounded-xl bg-white/10 text-white mb-4"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />
          <button 
            onClick={async () => {
              setLoading(true);
              const { error } = await onLogin(email, password);
              if (error) alert('❌ E-mail ou senha inválidos');
              setLoading(false);
            }}
            className="w-full py-3 bg-[#F4D03F] rounded-xl text-black font-bold"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
          
          <button 
            onClick={async () => {
              await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
            }}
            className="w-full mt-3 py-2 rounded-xl border border-white/20 text-white"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};

// COMPONENTE PRINCIPAL
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão ao carregar
    supabase.auth.getSession().then(({ data: { session } }) => {
      console.log('Sessão encontrada:', session?.user?.email);
      setUser(session?.user || null);
      setLoading(false);
    });

    // Ouvir mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, session?.user?.email);
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) {
      // Aguardar o estado atualizar
      setTimeout(() => {
        window.location.reload();
      }, 500);
    }
    return { error };
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  if (user) {
    return <HomePage user={user} onLogout={handleLogout} />;
  }

  return <LoginPage onLogin={handleLogin} />;
};