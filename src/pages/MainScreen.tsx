import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Car, Home, Search, User, Menu as MenuIcon, LogOut } from 'lucide-react';
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

  const handleSignOut = async () => {
    await signOut();
    window.location.reload();
  };

  const handleRefresh = () => {
    setRefreshKey(prev => prev + 1);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-pulse flex flex-col items-center"><div className="w-16 h-16 rounded-full bg-[#F4D03F]/30 flex items-center justify-center animate-bounce"><Car className="text-[#F4D03F] w-8 h-8" /></div><p className="text-white text-base mt-3 font-medium">Carregando ObaLeva...</p></div></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreen user={user} onSignOut={handleSignOut} />}
      {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={handleSignOut} onRefresh={handleRefresh} />}
      {activeTab === 'buscar' && <div className="max-w-md mx-auto px-3 pb-28"><div className="bg-[#1A1528] rounded-xl p-8 text-center mt-4"><h2 className="text-white text-xl font-bold">🔍 Buscar</h2><p className="text-gray-400 mt-2">Em breve: histórico de corridas e lugares favoritos</p></div></div>}
      {activeTab === 'menu' && <div className="max-w-md mx-auto px-3 pb-28"><div className="bg-[#1A1528] rounded-xl p-8 text-center mt-4"><h2 className="text-white text-xl font-bold">☰ Menu</h2><p className="text-gray-400 mt-2">Em breve: ajuda, indicação e configurações</p></div></div>}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};