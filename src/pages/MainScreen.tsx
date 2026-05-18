import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { SplashScreen } from '../screens/SplashScreen';
import { LoginScreen } from '../screens/LoginScreen';
import { SignUpScreen } from '../screens/SignUpScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { DriverDashboard } from '../screens/DriverDashboard';
import { ProfileScreen } from '../screens/ProfileScreen';
import { SearchScreen } from '../screens/SearchScreen';
import { MenuScreen } from '../screens/MenuScreen';
import { BottomNav } from '../components/BottomNav';

export const MainScreen = () => {
  const [user, setUser] = useState<any>(null);
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          setUser(session.user);
          const { data: userData } = await supabase
            .from('usuarios')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          if (userData) setProfile(userData);
        } else {
          setUser(null);
          setProfile(null);
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        setUser(null);
        setProfile(null);
      } finally {
        setLoading(false);
      }
    };

    checkSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        setUser(session.user);
        const { data: userData } = await supabase
          .from('usuarios')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (userData) setProfile(userData);
      } else {
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const fazerLogout = async () => {
    try {
      await supabase.auth.signOut();
    } catch (e) {
      console.log('Erro no signOut:', e);
    }
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  const handleLogin = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (data?.user) {
      setUser(data.user);
      const { data: userData } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (userData) setProfile(userData);
      window.location.reload();
    }
    return { error: !!error };
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: window.location.origin },
    });
  };

  const tipoUsuario = profile?.tipo || 'passageiro';

  if (loading) return <SplashScreen />;

  if (user) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        {activeTab === 'home' &&
          (tipoUsuario === 'motorista' ? (
            <DriverDashboard user={user} onSignOut={fazerLogout} />
          ) : (
            <HomeScreen user={user} onSignOut={fazerLogout} />
          ))}
        {activeTab === 'perfil' && (
          <ProfileScreen user={user} tipo={tipoUsuario} onSignOut={fazerLogout} />
        )}
        {activeTab === 'buscar' && <SearchScreen />}
        {activeTab === 'menu' && <MenuScreen />}
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    );
  }

  if (showSignUp) {
    return (
      <SignUpScreen
        onBack={() => setShowSignUp(false)}
        onSuccess={() => {
          setShowSignUp(false);
          window.location.reload();
        }}
      />
    );
  }

  return (
    <LoginScreen
      onLogin={handleLogin}
      onGoogleLogin={handleGoogleLogin}
      onSignUp={() => setShowSignUp(true)}
    />
  );
};