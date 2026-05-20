import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { HomeScreen } from '../components/screens/HomeScreen';
import { SearchScreen } from '../components/screens/SearchScreen';
import { ActivityScreen } from '../components/screens/ActivityScreen';
import { BottomNav } from '../components/navigation/BottomNav';
import { LocationModal } from '../components/modals/LocationModal';
import { NotificationModal } from '../components/modals/NotificationModal';
import { SignUpModal } from '../components/modals/SignUpModal';
import ProfileScreen from '../components/ProfileScreen';

// ============================================
// MAIN SCREEN PRINCIPAL (MODULAR)
// ============================================
export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [showNotificationModal, setShowNotificationModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [onboardingCompleted, setOnboardingCompleted] = useState(false);

  useEffect(() => {
    const checkStatus = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);

      if (session?.user) {
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
      }

      const completed = localStorage.getItem('obaleva_onboarding') === 'true';
      const locationAsked = localStorage.getItem('location_permission_asked') === 'true';
      setOnboardingCompleted(completed || !!session?.user);

      if (!completed && !session?.user) {
        if (!locationAsked) setShowLocationModal(true);
        else setShowNotificationModal(true);
      }
      setLoading(false);
    };
    checkStatus();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        const { data } = await supabase.from('usuarios').select('*').eq('id', session.user.id).maybeSingle();
        setProfile(data);
        setOnboardingCompleted(true);
        localStorage.setItem('obaleva_onboarding', 'true');
        setShowLocationModal(false);
        setShowNotificationModal(false);
        setShowSignUpModal(false);
      } else {
        setUser(null);
        setProfile(null);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLocationAllow = () => {
    localStorage.setItem('location_permission_asked', 'true');
    if (navigator.geolocation) navigator.geolocation.getCurrentPosition(() => {}, () => {});
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleLocationDeny = () => {
    localStorage.setItem('location_permission_asked', 'true');
    setShowLocationModal(false);
    setShowNotificationModal(true);
  };

  const handleNotificationAllow = () => {
    if ('Notification' in window) Notification.requestPermission();
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleNotificationDeny = () => {
    setShowNotificationModal(false);
    setShowSignUpModal(true);
  };

  const handleSignUpSuccess = () => {
    setShowSignUpModal(false);
    window.location.reload();
  };

  const handleLogout = async () => {
    console.log("🔴 Logout");
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  const showFullUI = onboardingCompleted || !!user;

  return (
    <>
      {activeTab === 'home' && <HomeScreen user={user} onLogout={user ? handleLogout : undefined} showFullUI={showFullUI} />}
      {activeTab === 'perfil' && user && <ProfileScreen user={user} profile={profile} onLogout={handleLogout} onRefresh={() => {}} />}
      {activeTab === 'buscar' && showFullUI && <SearchScreen />}
      {activeTab === 'atividade' && showFullUI && <ActivityScreen />}
      {showFullUI && <BottomNav active={activeTab} onNavigate={setActiveTab} />}

      {!showFullUI && showLocationModal && <LocationModal onAllow={handleLocationAllow} onDeny={handleLocationDeny} />}
      {!showFullUI && showNotificationModal && <NotificationModal onAllow={handleNotificationAllow} onDeny={handleNotificationDeny} />}
      {!showFullUI && showSignUpModal && <SignUpModal onSuccess={handleSignUpSuccess} />}
    </>
  );
};