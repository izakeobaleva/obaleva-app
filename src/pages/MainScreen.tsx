import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Search, Menu } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginScreen } from '../components/LoginScreen';
import { SignUpScreen } from '../components/SignUpScreen';
import { HomeScreenContent } from '../components/HomeScreenContent';
import { PlaceholderScreen } from '../components/PlaceholderScreen';
import ProfileScreen from '../screens/ProfileScreen';

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleRefresh = () => setRefreshKey(prev => prev + 1);

  // Salvar a aba atual no localStorage
  useEffect(() => {
    localStorage.setItem('obaleva_last_tab', activeTab);
  }, [activeTab]);

  // Recuperar a última aba ao iniciar
  useEffect(() => {
    const lastTab = localStorage.getItem('obaleva_last_tab');
    if (lastTab && ['home', 'buscar', 'perfil', 'menu'].includes(lastTab)) {
      setActiveTab(lastTab);
    }
  }, []);

  if (loading) return <LoadingScreen />;

  // Tela de cadastro
  if (!user && showSignUp) {
    return (
      <>
        <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => setShowSignUp(false)} />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  // Tela de login
  if (!user) {
    return (
      <>
        <LoginScreen
          onGoogleLogin={async () => { 
            await supabase.auth.signInWithOAuth({ 
              provider: 'google', 
              options: { redirectTo: window.location.origin } 
            }); 
          }}
          onEmailLogin={async (e) => { 
            e.preventDefault(); 
            setLoginLoading(true); 
            const { error } = await supabase.auth.signInWithPassword({ 
              email: loginEmail, 
              password: loginPassword 
            }); 
            if (error) alert('❌ E-mail ou senha inválidos'); 
            setLoginLoading(false); 
          }}
          loginEmail={loginEmail}
          setLoginEmail={setLoginEmail}
          loginPassword={loginPassword}
          setLoginPassword={setLoginPassword}
          loginLoading={loginLoading}
          onSignUpClick={() => setShowSignUp(true)}
        />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  // Tela principal do app (logado)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && <HomeScreenContent user={user} onSignOut={signOut} key={refreshKey} />}
      {activeTab === 'perfil' && <ProfileScreen user={user} profile={profile} onSignOut={signOut} onRefresh={handleRefresh} />}
      {activeTab === 'buscar' && (
        <PlaceholderScreen 
          icon={Search}
          title="🔍 Buscar" 
          description="Em breve você poderá:"
          features={['Ver histórico de corridas', 'Salvar lugares favoritos', 'Buscar endereços rapidamente']}
        />
      )}
      {activeTab === 'menu' && (
        <PlaceholderScreen 
          icon={Menu}
          title="☰ Menu" 
          description="Em breve você terá acesso a:"
          features={['Programa de indicação', 'Central de ajuda', 'Termos e segurança']}
        />
      )}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};