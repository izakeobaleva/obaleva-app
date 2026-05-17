import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Search, Menu, LogOut, Car } from 'lucide-react';
import { BottomNav } from '../components/BottomNav';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginScreen } from '../components/LoginScreen';
import { SignUpScreen } from '../components/SignUpScreen';
import { HomeScreenContent } from '../components/HomeScreenContent';
import { PlaceholderScreen } from '../components/PlaceholderScreen';
import ProfileScreen from '../screens/ProfileScreen';
import WelcomeWizard from '../components/WelcomeWizard';

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [showWizard, setShowWizard] = useState(false);
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

  // Se o usuário está logado mas NÃO tem perfil (acabou de se cadastrar), mostra o Wizard
  useEffect(() => {
    if (user && !profile && !loading && !showWizard) {
      console.log('👋 Usuário sem perfil detectado, mostrando WelcomeWizard');
      setShowWizard(true);
    }
  }, [user, profile, loading]);

  if (loading) return <LoadingScreen />;

  // Welcome Wizard - Para usuários recém-cadastrados que ainda não escolheram tipo
  if (showWizard && user) {
    return (
      <WelcomeWizard 
        user={user} 
        onComplete={() => {
          setShowWizard(false);
          window.location.reload(); // Recarrega para buscar o perfil
        }} 
      />
    );
  }

  // Tela de cadastro
  if (!user && showSignUp) {
    return (
      <>
        <SignUpScreen 
          onBack={() => setShowSignUp(false)} 
          onSuccess={() => {
            setShowSignUp(false);
            // Após cadastro bem-sucedido, espera o AuthContext detectar o usuário
            // e o useEffect acima vai mostrar o WelcomeWizard
          }} 
        />
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

  // Botão Sair no cabeçalho (mais visível!)
  const SignOutButton = () => (
    <button
      onClick={signOut}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500/20 border border-red-500 text-red-400 hover:bg-red-500/30 transition-all font-medium"
    >
      <LogOut size={16} />
      <span className="text-sm font-medium">Sair</span>
    </button>
  );

  // Tela principal do app (logado)
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && (
        <>
          {/* Cabeçalho com botão Sair visível */}
          <div className="max-w-md mx-auto px-3 pt-3">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
                  <Car className="text-[#F4D03F]" size={18} />
                </div>
                <h1 className="text-lg font-bold text-white">OBALEVA</h1>
              </div>
              <SignOutButton />
            </div>
          </div>
          <HomeScreenContent user={user} onSignOut={signOut} key={refreshKey} />
        </>
      )}
      {activeTab === 'perfil' && (
        <>
          <div className="max-w-md mx-auto px-3 pt-3">
            <div className="flex justify-end">
              <SignOutButton />
            </div>
          </div>
          <ProfileScreen user={user} profile={profile} onSignOut={signOut} onRefresh={handleRefresh} />
        </>
      )}
      {activeTab === 'buscar' && (
        <>
          <div className="max-w-md mx-auto px-3 pt-3">
            <div className="flex justify-end">
              <SignOutButton />
            </div>
          </div>
          <PlaceholderScreen 
            icon={Search}
            title="🔍 Buscar" 
            description="Em breve você poderá:"
            features={['Ver histórico de corridas', 'Salvar lugares favoritos', 'Buscar endereços rapidamente']}
          />
        </>
      )}
      {activeTab === 'menu' && (
        <>
          <div className="max-w-md mx-auto px-3 pt-3">
            <div className="flex justify-end">
              <SignOutButton />
            </div>
          </div>
          <PlaceholderScreen 
            icon={Menu}
            title="☰ Menu" 
            description="Em breve você terá acesso a:"
            features={['Programa de indicação', 'Central de ajuda', 'Termos e segurança']}
          />
        </>
      )}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};