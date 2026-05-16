import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Toaster } from 'sonner';
import { toast } from 'sonner';
import { Header } from '../components/Header';
import { MapSection } from '../components/MapSection';
import { LocationInputs } from '../components/LocationInputs';
import { ActionButton } from '../components/ActionButton';
import { LoginForm } from '../components/LoginForm';
import { CadastroRapido } from '../components/CadastroRapido';
import { DriverPanel } from '../components/DriverPanel';
import { DiscoverBar } from '../components/DiscoverBar';
import { BottomNav } from '../components/BottomNav';
import RideStatusModal from '../components/RideStatusModal';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride, Location } from '../services/rideService';

// ============================================
// ICONE CHEVRON RIGHT (usado pelo DiscoverBar)
// ============================================
const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  
  // Estado do fluxo de corrida
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  // Verificar se há corrida ativa ao carregar
  useEffect(() => {
    if (user?.id) {
      carregarCorridaAtiva();
    }
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
    };
  }, [user]);

  async function carregarCorridaAtiva() {
    const corrida = await buscarCorridaAtiva(user!.id);
    if (corrida) {
      setActiveRide(corrida);
      setShowRideModal(true);
      subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
        setActiveRide(updatedRide);
        if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
          setTimeout(() => {
            setShowRideModal(false);
            setActiveRide(null);
          }, 3000);
        }
      });
    }
  }

  async function handleRequestRide() {
    if (!user) {
      toast.error('🔐 Faça login para solicitar uma corrida!');
      return;
    }
    
    if (!pickupAddress || !dropoffAddress) {
      toast.error('📍 Preencha a origem e o destino!');
      return;
    }
    
    // Converter endereços em coordenadas mock (em produção seria geocoding)
    const mockLocation = (address: string): Location => ({
      lat: -23.5505 + Math.random() * 0.02,
      lng: -46.6333 + Math.random() * 0.02,
      address: address,
    });
    
    const origemLoc = mockLocation(pickupAddress);
    const destinoLoc = mockLocation(dropoffAddress);
    
    setSolicitando(true);
    
    try {
      const corrida = await solicitarCorrida(user.id, origemLoc, destinoLoc);
      
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        
        // Limpar campos
        setPickupAddress('');
        setDropoffAddress('');
        
        toast.success('🚗 Corrida solicitada! Buscando motorista...');
        
        // Inscrever para atualizações em tempo real
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setActiveRide(updatedRide);
          
          if (updatedRide.status === 'motorista_em_rota') {
            toast.success('👨‍✈️ Motorista encontrado! A caminho...');
          } else if (updatedRide.status === 'motorista_chegou') {
            toast.success('✅ Motorista chegou!');
          } else if (updatedRide.status === 'em_andamento') {
            toast.info('🚗 Corrida em andamento');
          } else if (updatedRide.status === 'finalizada') {
            toast.success('🎉 Corrida finalizada! Obrigado!');
            setTimeout(() => {
              setShowRideModal(false);
              setActiveRide(null);
            }, 3000);
          } else if (updatedRide.status === 'cancelada') {
            toast.error('❌ Corrida cancelada');
            setShowRideModal(false);
            setActiveRide(null);
          }
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Erro ao solicitar corrida');
    } finally {
      setSolicitando(false);
    }
  }

  async function handleCancelRide() {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) {
        toast.info('Corrida cancelada');
        setShowRideModal(false);
        setActiveRide(null);
        if (subscriptionRef.current) {
          subscriptionRef.current.unsubscribe();
        }
      } else {
        toast.error('Erro ao cancelar corrida');
      }
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-10 h-10 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
            <Car />
          </div>
          <p className="text-white text-xs mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <Toaster position="top-center" richColors />
      <div className="max-w-md mx-auto px-3 pb-24">
        
        <Header user={user} onSignOut={signOut} />
        <MapSection />
        
        <LocationInputs 
          pickupAddress={pickupAddress}
          setPickupAddress={setPickupAddress}
          dropoffAddress={dropoffAddress}
          setDropoffAddress={setDropoffAddress}
        />

        <div className="mt-2">
          <ActionButton 
            onClick={handleRequestRide} 
            disabled={solicitando || !pickupAddress || !dropoffAddress}
            loading={solicitando}
          />
        </div>

        {!user && (
          <LoginForm
            onGoogleLogin={async () => { await supabase.auth.signInWithOAuth({ provider: 'google', options: { redirectTo: window.location.origin } }); }}
            onEmailLogin={async (e) => { e.preventDefault(); setLoginLoading(true); const { error } = await supabase.auth.signInWithPassword({ email: loginEmail, password: loginPassword }); if (error) toast.error('E-mail ou senha inválidos'); setLoginLoading(false); }}
            loginEmail={loginEmail} setLoginEmail={setLoginEmail}
            loginPassword={loginPassword} setLoginPassword={setLoginPassword}
            loginLoading={loginLoading}
          />
        )}

        {user && !profile && (
          <div className="space-y-1.5 mt-2">
            <div className="flex gap-1.5">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-1.5 rounded-lg border border-[#F4D03F]/30 text-white bg-white/5 text-xs">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-1.5 rounded-lg border border-[#F4D03F]/30 text-white bg-white/5 text-xs">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        )}

        {user && profile?.tipo === 'motorista' && <DriverPanel />}

        <DiscoverBar />
      </div>

      {/* BOTTOM NAV */}
      <BottomNav active={activeTab} onNavigate={setActiveTab} />

      {/* MODAL DE CORRIDA EM TEMPO REAL */}
      {showRideModal && activeRide && (
        <RideStatusModal
          ride={activeRide}
          onClose={() => setShowRideModal(false)}
          onCancel={handleCancelRide}
        />
      )}
    </div>
  );
};