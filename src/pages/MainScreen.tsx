import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import { LoadingScreen } from '../components/LoadingScreen';
import { LoginScreen } from '../components/LoginScreen';
import { SignUpScreen } from '../components/SignUpScreen';
import { HomeContent } from '../components/HomeContent';
import { ProfileContent } from '../components/ProfileContent';
import { PlaceholderScreen } from '../components/PlaceholderScreen';
import { BottomNav } from '../components/BottomNav';
import { Search, Menu } from 'lucide-react';

interface RideState {
  activeRide: Ride | null;
  showRideModal: boolean;
}

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showSignUp, setShowSignUp] = useState(false);
  const [rideState, setRideState] = useState<RideState>({ activeRide: null, showRideModal: false });
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Carregar corrida ativa ao logar
  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const carregarCorridaAtiva = async () => {
    if (user?.id) {
      const corrida = await buscarCorridaAtiva(user.id);
      if (corrida) {
        setRideState({ activeRide: corrida, showRideModal: true });
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setRideState({ activeRide: updatedRide, showRideModal: true });
          if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
            setTimeout(() => setRideState({ activeRide: null, showRideModal: false }), 3000);
          }
        });
      }
    }
  };

  const handleSignOut = async () => {
    await signOut();
    if (subscriptionRef.current) subscriptionRef.current.unsubscribe();
    window.location.reload();
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword });
    if (error) alert('❌ E-mail ou senha inválidos');
    setLoginLoading(false);
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } });
  };

  const handleRequestRide = async () => {
    if (!user || !pickupLocation || !dropoffLocation) return;
    setSolicitando(true);
    try {
      const corrida = await solicitarCorrida(user.id, pickupLocation, dropoffLocation);
      if (corrida) {
        setRideState({ activeRide: corrida, showRideModal: true });
        setPickupAddress('');
        setDropoffAddress('');
        setPickupLocation(null);
        setDropoffLocation(null);
      }
    } catch (error: any) { alert('Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  const handleCancelRide = async () => {
    if (rideState.activeRide) {
      const success = await cancelarCorrida(rideState.activeRide.id);
      if (success) { setRideState({ activeRide: null, showRideModal: false }); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); }
    }
  };

  if (loading) return <LoadingScreen />;

  // Tela de cadastro
  if (!user && showSignUp) {
    return (
      <>
        <SignUpScreen onBack={() => setShowSignUp(false)} onSuccess={() => { setShowSignUp(false); alert('✅ Conta criada! Agora faça login.'); }} />
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </>
    );
  }

  // Tela de login
  if (!user) {
    return (
      <>
        <LoginScreen
          onGoogleLogin={handleGoogleLogin}
          onEmailLogin={handleEmailLogin}
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

  // App logado
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      {activeTab === 'home' && (
        <HomeContent
          user={user}
          onSignOut={handleSignOut}
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
          dropoffAddress={dropoffAddress}
          setDropoffAddress={setDropoffAddress}
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          setPickupLocation={setPickupLocation}
          setDropoffLocation={setDropoffLocation}
          onRequestRide={handleRequestRide}
          solicitando={solicitando}
          activeRide={rideState.activeRide}
          showRideModal={rideState.showRideModal}
          onCloseRideModal={() => setRideState({ ...rideState, showRideModal: false })}
          onCancelRide={handleCancelRide}
        />
      )}
      {activeTab === 'perfil' && <ProfileContent user={user} profile={profile} onSignOut={handleSignOut} />}
      {activeTab === 'buscar' && <PlaceholderScreen icon={Search} title="🔍 Buscar" description="Busque por destinos ou motoristas" features={["Busca inteligente", "Histórico de destinos", "Favoritos"]} />}
      {activeTab === 'menu' && <PlaceholderScreen icon={Menu} title="☰ Menu" description="Configurações e opções" features={["Ajuda e suporte", "Configurações", "Sobre o ObaLeva"]} />}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};