import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BottomNav } from '../components/navigation/BottomNav';
import { HomeScreen } from '../components/screens/HomeScreen';
import { ProfileScreen } from '../components/screens/ProfileScreen';
import { SearchScreen } from '../components/screens/SearchScreen';
import { ActivityScreen } from '../components/screens/ActivityScreen';

export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setLoading(false);
    };
    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  );

  const showFullUI = !!user;

  const renderTab = () => {
    switch (activeTab) {
      case 'home':
        return <HomeScreen user={user} showFullUI={showFullUI} onLogout={user ? handleLogout : undefined} />;
      case 'perfil':
        return user ? <ProfileScreen user={user} onLogout={handleLogout} /> : null;
      case 'buscar':
        return showFullUI ? <SearchScreen /> : null;
      case 'atividade':
        return showFullUI ? <ActivityScreen /> : null;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {renderTab()}
        {showFullUI && <BottomNav active={activeTab} onNavigate={setActiveTab} />}
      </div>
    </>
  );
};