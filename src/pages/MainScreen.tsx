import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, LogOut } from 'lucide-react';

export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Ouvir mudanças
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN') {
        setUser(session?.user || null);
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
      </div>
    );
  }

  // Tela principal (quando logado)
  if (user) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4">
        <div className="max-w-md mx-auto">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Car className="text-[#F4D03F]" />
              <h1 className="text-white text-xl font-bold">OBALEVA</h1>
            </div>
            <button 
              onClick={handleLogout}
              className="bg-red-500/30 px-4 py-2 rounded-lg text-red-400"
            >
              <LogOut size={16} className="inline mr-1" /> SAIR
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
            Logado: {user.email}
          </p>
        </div>
      </div>
    );
  }

  // Tela de login
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
            id="loginEmail"
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="w-full p-3 rounded-xl bg-white/10 text-white mb-4"
            id="loginPassword"
          />
          <button 
            onClick={async () => {
              const email = (document.getElementById('loginEmail') as HTMLInputElement).value;
              const password = (document.getElementById('loginPassword') as HTMLInputElement).value;
              const { error } = await supabase.auth.signInWithPassword({ email, password });
              if (error) {
                alert('❌ E-mail ou senha inválidos');
              }
            }}
            className="w-full py-3 bg-[#F4D03F] rounded-xl text-black font-bold"
          >
            Entrar
          </button>
        </div>
      </div>
    </div>
  );
};