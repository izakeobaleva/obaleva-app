import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Car, Home, Search, User, Menu as MenuIcon } from 'lucide-react';
import WelcomeScreen from '../components/WelcomeScreen';
import TutorialScreen from '../components/TutorialScreen';
import BonusModal from '../components/BonusModal';
import HomeScreen from '../screens/HomeScreen';
import ProfileScreen from '../screens/ProfileScreen';

const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] to-transparent pt-3 z-50">
      <div className="bg-[#1A1528] border border-[#F4D03F]/30 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-5 py-3">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => onNavigate(tab.id)} className={`flex flex-col items-center gap-1 transition-all duration-200 ${active === tab.id ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`}>
              <tab.icon size={26} strokeWidth={active === tab.id ? 2 : 1.5} />
              <span className="text-sm font-medium">{tab.label}</span>
              {active === tab.id && <div className="w-2 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWelcome, setShowWelcome] = useState(!user);
  const [showTutorial, setShowTutorial] = useState(false);
  const [showBonus, setShowBonus] = useState(false);
  const [bonusData, setBonusData] = useState({ code: '', value: 20 });
  const [showAuthSignUp, setShowAuthSignUp] = useState(false);

  useEffect(() => {
    if (user && profile && !showWelcome && !showTutorial && !showBonus) {
      checkNewUser();
    }
  }, [user, profile]);

  const checkNewUser = async () => {
    const { data: tutorial } = await supabase
      .from('tutorial_status')
      .select('concluido')
      .eq('usuario_id', user.id)
      .single();

    if (!tutorial) {
      setShowTutorial(true);
      return;
    }

    const { data: bonus } = await supabase
      .from('bonus')
      .select('codigo, valor, usado')
      .eq('usuario_id', user.id)
      .eq('usado', false)
      .single();

    if (bonus && !bonus.usado) {
      setBonusData({ code: bonus.codigo, value: bonus.valor });
      setShowBonus(true);
    }
  };

  const handleCompleteTutorial = async () => {
    try {
      await supabase.from('tutorial_status').insert({
        usuario_id: user.id,
        concluido: true,
        concluido_em: new Date().toISOString()
      });
      
      const bonusCode = `BEMVINDO${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      await supabase.from('bonus').insert({
        usuario_id: user.id,
        codigo: bonusCode,
        tipo: 'primeira_corrida',
        valor: 20,
        usado: false,
        expira_em: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
      });
      
      setBonusData({ code: bonusCode, value: 20 });
      setShowTutorial(false);
      setShowBonus(true);
    } catch (err: any) {
      console.error('Erro ao completar tutorial:', err);
      setShowTutorial(false);
    }
  };

  const handleSkipTutorial = () => {
    setShowTutorial(false);
  };

  const handleUseBonus = () => {
    setShowBonus(false);
  };

  const handleSignUp = () => {
    setShowWelcome(false);
    setShowAuthSignUp(true);
  };

  const handleLogin = () => {
    setShowWelcome(false);
    setShowAuthSignUp(true);
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/30 flex items-center justify-center animate-bounce">
            <Car className="text-[#F4D03F] w-8 h-8" />
          </div>
          <p className="text-white text-base mt-3 font-medium">Carregando ObaLeva...</p>
        </div>
      </div>
    );
  }

  if (!user && showWelcome) {
    return <WelcomeScreen onSignUp={handleSignUp} onLogin={handleLogin} />;
  }

  if (showTutorial && user) {
    return <TutorialScreen onComplete={handleCompleteTutorial} onSkip={handleSkipTutorial} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreen key={refreshKey} user={user} onSignOut={signOut} />}
      {activeTab === 'perfil' && <ProfileScreen key={refreshKey} user={user} profile={profile} onSignOut={signOut} onRefresh={handleRefresh} />}
      {activeTab === 'buscar' && <div className="max-w-md mx-auto px-3 pb-28"><div className="bg-[#1A1528] rounded-xl p-8 text-center mt-4"><h2 className="text-white text-xl font-bold">🔍 Buscar</h2><p className="text-gray-400 mt-2">Em breve: histórico de corridas e lugares favoritos</p></div></div>}
      {activeTab === 'menu' && <div className="max-w-md mx-auto px-3 pb-28"><div className="bg-[#1A1528] rounded-xl p-8 text-center mt-4"><h2 className="text-white text-xl font-bold">☰ Menu</h2><p className="text-gray-400 mt-2">Em breve: ajuda, indicação e configurações</p></div></div>}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
      
      {showBonus && user && (
        <BonusModal
          onClose={() => setShowBonus(false)}
          onUseNow={handleUseBonus}
          bonusCode={bonusData.code}
          bonusValue={bonusData.value}
        />
      )}
    </div>
  );
};