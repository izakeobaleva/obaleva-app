import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Car, LogOut, Home, Search, User, Menu } from 'lucide-react';

// ============================================
// COMPONENTE HOME SIMPLIFICADO
// ============================================
const HomeScreenSimple = ({ user, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 pt-4">
    <div className="flex justify-between items-center">
      <div className="flex items-center gap-2">
        <Car size={24} className="text-[#F4D03F]" />
        <h1 className="text-xl font-bold text-white">OBALEVA</h1>
      </div>
      <button 
        onClick={onSignOut} 
        className="px-4 py-2 rounded-lg bg-red-500/30 border border-red-500 text-red-400 text-sm font-bold"
      >
        <LogOut size={14} className="inline mr-1" /> SAIR
      </button>
    </div>
    
    <div className="h-[220px] bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl mt-4 flex items-center justify-center border border-[#F4D03F]/20">
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-2">
          <Car size={32} className="text-[#F4D03F]" />
        </div>
        <p className="text-white text-sm">🗺️ Mapa</p>
      </div>
    </div>
    
    <div className="mt-4 bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20">
      <div className="bg-white/10 rounded-lg mb-2 p-3">
        <input type="text" placeholder="Onde você está?" className="w-full bg-transparent text-white outline-none" />
      </div>
      <div className="bg-white/10 rounded-lg p-3">
        <input type="text" placeholder="Para onde vai?" className="w-full bg-transparent text-white outline-none" />
      </div>
    </div>
    
    <button className="w-full mt-3 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
      🚗 SOLICITAR CORRIDA
    </button>
    
    <p className="text-center text-[#A0A0B0] text-xs mt-4">Logado: {user?.email}</p>
  </div>
);

// ============================================
// TELA DE PERFIL SIMPLIFICADA
// ============================================
const ProfileScreenSimple = ({ user, onSignOut }: any) => (
  <div className="max-w-md mx-auto px-4 pb-28 mt-8">
    <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
      <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
        <User size={40} className="text-[#F4D03F]" />
      </div>
      <h2 className="text-white text-xl font-bold">{user?.email?.split('@')[0]}</h2>
      <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
      <button 
        onClick={onSignOut} 
        className="mt-6 w-full py-3 rounded-xl bg-red-500/30 border border-red-500 text-red-400 font-bold"
      >
        SAIR DA CONTA
      </button>
    </div>
  </div>
);

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNavSimple = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
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
// TELA DE LOGIN SIMPLIFICADA
// ============================================
const LoginScreenSimple = ({ onLogin }: any) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Preencha todos os campos');
      return;
    }
    await onLogin(email, password);
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
            <input type="email" placeholder="E-mail" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" value={email} onChange={e => setEmail(e.target.value)} required />
            <input type="password" placeholder="Senha" className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="submit" className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Entrar</button>
          </form>
        </div>
      </div>
    </div>
  );
};

// ============================================
// MAIN SCREEN (VERSÃO ULTRA SIMPLIFICADA)
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    // Carregar sessão
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user || null);
      setLoading(false);
    });

    // Ouvir mudanças de auth
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    
    if (!error && data?.session) {
      setUser(data.session.user);
      window.location.reload();
    } else {
      alert('❌ E-mail ou senha inválidos');
    }
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
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

  // Usuário logado
  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' && <HomeScreenSimple user={user} onSignOut={handleSignOut} />}
        {activeTab === 'perfil' && <ProfileScreenSimple user={user} onSignOut={handleSignOut} />}
        {activeTab === 'buscar' && (
          <div className="max-w-md mx-auto px-4 pb-28 mt-8">
            <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
              <Search size={48} className="text-[#F4D03F] mx-auto mb-4" />
              <h2 className="text-white text-xl font-bold">🔍 Buscar</h2>
              <p className="text-gray-400 mt-2">Em breve</p>
            </div>
          </div>
        )}
        {activeTab === 'menu' && (
          <div className="max-w-md mx-auto px-4 pb-28 mt-8">
            <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
              <Menu size={48} className="text-[#F4D03F] mx-auto mb-4" />
              <h2 className="text-white text-xl font-bold">☰ Menu</h2>
              <p className="text-gray-400 mt-2">Em breve</p>
            </div>
          </div>
        )}
        <BottomNavSimple active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  // Tela de login
  return <LoginScreenSimple onLogin={handleLogin} />;
};