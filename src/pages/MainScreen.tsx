import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { BottomNav } from '../components/navigation/BottomNav';
import { HomeScreen } from '../components/screens/HomeScreen';
import { ProfileScreen } from '../components/screens/ProfileScreen';
import { SearchScreen } from '../components/screens/SearchScreen';
import { ActivityScreen } from '../components/screens/ActivityScreen';
import { LocationModal } from '../components/modals/LocationModal';
import { NotificationModal } from '../components/modals/NotificationModal';
import { SignUpModal } from '../components/modals/SignUpModal';
import { Car } from 'lucide-react';

export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
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

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      if (session?.user) {
        setOnboardingCompleted(true);
        localStorage.setItem('obaleva_onboarding', 'true');
        setShowLocationModal(false);
        setShowNotificationModal(false);
        setShowSignUpModal(false);
      }
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleLocationAllow = (type: string) => {
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

  const handleLoginClick = () => {
    setShowSignUpModal(false);
    setOnboardingCompleted(true);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  );

  const showFullUI = onboardingCompleted || !!user;

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

      {!showFullUI && showLocationModal && (
        <LocationModal onAllow={handleLocationAllow} onDeny={handleLocationDeny} />
      )}
      {!showFullUI && showNotificationModal && (
        <NotificationModal onAllow={handleNotificationAllow} onDeny={handleNotificationDeny} />
      )}
      {!showFullUI && showSignUpModal && (
        <SignUpModal onSuccess={handleSignUpSuccess} onLoginClick={handleLoginClick} />
      )}
    </>
  );
};