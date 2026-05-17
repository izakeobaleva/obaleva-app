import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, Home, Search, User, Menu, LogOut } from 'lucide-react';

// ============================================
// COMPONENTE PRINCIPAL - SIMPLIFICADO
// ============================================
export const MainScreen = () => {
  const { user, loading } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Buscar perfil diretamente (sem depender do AuthContext)
  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setProfile(null);
        setProfileLoading(false);
        return;
      }
      
      try {
        const { data, error } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        
        if (error) throw error;
        
        // Se não tiver perfil, criar um automaticamente
        if (!data) {
          console.log('📝 Criando perfil automaticamente para:', user.email);
          const { data: newUser } = await supabase
            .from('usuarios')
            .insert({
              id: user.id,
              nome_completo: user.user_metadata?.nome_completo || user.email?.split('@')[0],
              email: user.email,
              tipo: 'passageiro'
            })
            .select()
            .single();
          
          await supabase.from('passageiros').insert({ id: user.id });
          setProfile(newUser);
          console.log('✅ Perfil criado com sucesso!');
        } else {
          setProfile(data);
          console.log('✅ Perfil encontrado:', data.nome_completo);
        }
      } catch (err) {
        console.error('Erro ao buscar perfil:', err);
      } finally {
        setProfileLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  // Tela de loading
  if (loading || profileLoading) {
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
  if (user && profile) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-28">
          {/* Header com botão Sair */}
          <div className="flex justify-between items-center py-3">
            <div className="flex items-center gap-2">
              <Car size={24} className="text-[#F4D03F]" />
              <h1 className="text-xl font-bold text-white">OBALEVA</h1>
            </div>
            <button onClick={handleSignOut} className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm">
              <LogOut size={14} className="inline mr-1" /> Sair
            </button>
          </div>

          {/* Mapa placeholder */}
          <div className="h-[220px] rounded-xl bg-gradient-to-br from-[#1A1528] to-[#2D2342] flex items-center justify-center mb-3">
            <div className="text-center">
              <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center mx-auto mb-2">
                <Car size={32} className="text-[#F4D03F]" />
              </div>
              <p className="text-white text-sm">🗺️ Mapa será carregado</p>
              <p className="text-[#A0A0B0] text-xs">Localização: {profile?.nome_completo}</p>
            </div>
          </div>

          {/* Campos de endereço */}
          <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20">
            <div className="bg-white/10 rounded-lg mb-2 p-3">
              <input 
                type="text" 
                placeholder="Onde você está?" 
                className="w-full bg-transparent text-white outline-none" 
              />
            </div>
            <div className="bg-white/10 rounded-lg p-3">
              <input 
                type="text" 
                placeholder="Para onde vai?" 
                className="w-full bg-transparent text-white outline-none text-base font-medium" 
                autoFocus
              />
            </div>
          </div>

          {/* Botão Solicitar */}
          <button className="w-full py-3 mt-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            🚗 SOLICITAR CORRIDA
          </button>

          <p className="text-center text-[#A0A0B0] text-xs mt-4">
            Logado como: {user.email}
          </p>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3">
          <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4">
            <div className="flex justify-between px-5 py-3">
              <button onClick={() => setActiveTab('home')} className={`flex flex-col items-center ${activeTab === 'home' ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
                <Home size={24} /><span className="text-xs">Início</span>
              </button>
              <button onClick={() => setActiveTab('buscar')} className={`flex flex-col items-center ${activeTab === 'buscar' ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
                <Search size={24} /><span className="text-xs">Buscar</span>
              </button>
              <button onClick={() => setActiveTab('perfil')} className={`flex flex-col items-center ${activeTab === 'perfil' ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
                <User size={24} /><span className="text-xs">Perfil</span>
              </button>
              <button onClick={() => setActiveTab('menu')} className={`flex flex-col items-center ${activeTab === 'menu' ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
                <Menu size={24} /><span className="text-xs">Menu</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Tela de login
  return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-[#A0A0B0]">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <form onSubmit={async (e) => {
            e.preventDefault();
            setLoginLoading(true);
            const { error } = await supabase.auth.signInWithPassword({ 
              email: loginEmail, 
              password: loginPassword 
            });
            if (error) {
              alert('❌ E-mail ou senha inválidos');
            } else {
              window.location.reload();
            }
            setLoginLoading(false);
          }}>
            <input 
              type="email" 
              placeholder="E-mail" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3" 
              value={loginEmail} 
              onChange={e => setLoginEmail(e.target.value)} 
              required 
            />
            <input 
              type="password" 
              placeholder="Senha" 
              className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4" 
              value={loginPassword} 
              onChange={e => setLoginPassword(e.target.value)} 
              required 
            />
            <button 
              type="submit" 
              disabled={loginLoading} 
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold"
            >
              {loginLoading ? 'Entrando...' : 'Entrar'}
            </button>
          </form>
          
          <div className="text-center mt-3">
            <button onClick={() => setShowSignUp(true)} className="text-[#F4D03F] text-sm hover:underline">
              Criar nova conta
            </button>
          </div>
          
          <button 
            onClick={async () => { 
              await supabase.auth.signInWithOAuth({ 
                provider: 'google', 
                options: { redirectTo: window.location.origin } 
              }); 
            }} 
            className="w-full mt-3 py-2 rounded-xl border border-white/15 text-white"
          >
            Entrar com Google
          </button>
        </div>
      </div>
    </div>
  );
};