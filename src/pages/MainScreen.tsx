import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, Chrome, Eye, EyeOff } from 'lucide-react';

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
        window.location.reload();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email, password) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (!error) window.location.reload();
    return { error: !!error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-2">
              <Car className="text-[#F4D03F]" size={28} />
              <h1 className="text-white text-2xl font-bold">OBALEVA</h1>
            </div>
            <button onClick={async () => {
              await supabase.auth.signOut();
              localStorage.clear();
              sessionStorage.clear();
              window.location.reload();
            }} className="bg-red-500 text-white px-4 py-2 rounded-lg font-bold">SAIR</button>
          </div>
          <div className="bg-[#1A1528] h-[200px] rounded-xl flex items-center justify-center mb-4">
            <p className="text-white text-center">🗺️ MAPA<br/>Logado: {user.email}</p>
          </div>
          <div className="bg-[#1A1528] rounded-xl p-4">
            <input type="text" placeholder="Para onde você vai agora?" className="w-full p-3 rounded-lg bg-white/10 text-white" />
            <button className="w-full mt-3 py-3 bg-[#F4D03F] text-black font-bold rounded-lg">Confirmar corrida</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <Car size={48} className="text-[#F4D03F] mx-auto mb-4" />
        <h1 className="text-3xl font-bold text-white mb-8">OBALEVA</h1>
        <div className="bg-[#1A1528] rounded-2xl p-6">
          <button onClick={handleGoogleLogin} className="w-full py-3 rounded-xl border border-white/20 text-white mb-4">Entrar com Google</button>
          <div className="text-gray-500 text-sm my-2">ou</div>
          <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 text-white mb-3" id="email" />
          <input type="password" placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 text-white mb-4" id="password" />
          <button onClick={async () => {
            const email = (document.getElementById('email')).value;
            const password = (document.getElementById('password')).value;
            await handleLogin(email, password);
          }} className="w-full py-3 bg-[#F4D03F] text-black font-bold rounded-lg">Entrar</button>
          <button className="w-full mt-3 text-[#F4D03F] text-sm">Criar conta</button>
        </div>
      </div>
    </div>
  );
};
