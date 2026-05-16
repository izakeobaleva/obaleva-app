import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { toast, Toaster } from 'sonner';
import { Car, LogOut, Truck, Shield } from 'lucide-react';
import { LoginScreen } from '../components/LoginScreen';
import { PassengerDashboard } from '../components/PassengerDashboard';
import { DiscoverBar } from '../components/DiscoverBar';
import { BottomNav } from '../components/BottomNav';
import CadastroRapido from '../components/CadastroRapido';

export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [showCadastroTipo, setShowCadastroTipo] = useState<'passageiro' | 'motorista' | null>(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');

  const handleRequestRide = () => {
    if (!pickupAddress || !dropoffAddress) {
      toast.error('📍 Por favor, preencha a origem e o destino!');
      return;
    }
    toast.success(`🚗 Corrida solicitada!\n\n📍 De: ${pickupAddress}\n📍 Para: ${dropoffAddress}`, {
      duration: 5000,
      icon: '🚗',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center animate-bounce">
            <Car className="text-[#F4D03F] w-8 h-8" />
          </div>
          <p className="text-white text-lg font-bold mt-4">Carregando ObaLeva...</p>
          <p className="text-[#A0A0B0] text-xs mt-1">Mobilidade premium</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-md mx-auto px-4 pb-32">
        {/* CABEÇALHO */}
        <div className="py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F4D03F]/20 to-[#8B5CF6]/20 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">
              OBALEVA
            </h1>
          </div>
          {user && (
            <button 
              onClick={signOut} 
              className="text-[#A0A0B0] text-xs flex items-center gap-1 hover:text-red-400 transition-all px-3 py-1 rounded-full bg-white/5"
            >
              <LogOut size={12} /> Sair
            </button>
          )}
        </div>

        {/* CONTEÚDO PRINCIPAL */}
        {!user ? (
          <LoginScreen />
        ) : !profile ? (
          <div className="space-y-3">
            <div className="flex gap-3">
              <button onClick={() => setShowCadastroTipo('passageiro')} className="flex-1 py-3 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm font-medium hover:bg-white/10 transition">Passageiro</button>
              <button onClick={() => setShowCadastroTipo('motorista')} className="flex-1 py-3 rounded-xl border border-[#F4D03F]/30 text-white bg-white/5 text-sm font-medium hover:bg-white/10 transition">Motorista</button>
            </div>
            {showCadastroTipo === 'passageiro' && <CadastroRapido tipo="passageiro" onSuccess={() => window.location.reload()} />}
            {showCadastroTipo === 'motorista' && <CadastroRapido tipo="motorista" onSuccess={() => window.location.reload()} />}
          </div>
        ) : profile.tipo === 'passageiro' ? (
          <PassengerDashboard
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            dropoffAddress={dropoffAddress}
            setDropoffAddress={setDropoffAddress}
            onRequestRide={handleRequestRide}
          />
        ) : profile.tipo === 'motorista' ? (
          <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
            <Truck className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg">Painel do Motorista</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Aguardando aprovação</p>
            <button className="mt-4 px-4 py-1.5 rounded-full bg-green-600 text-white text-xs flex items-center gap-1 mx-auto">
              <div className="w-1.5 h-1.5 rounded-full bg-green-300 animate-pulse" />
              Online
            </button>
          </div>
        ) : (
          <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20 text-center">
            <Shield className="text-[#F4D03F] w-12 h-12 mx-auto mb-3" />
            <h2 className="text-white font-bold text-lg">Painel Administrativo</h2>
          </div>
        )}

        <DiscoverBar />
      </div>

      <BottomNav role={profile?.tipo || 'passageiro'} />
    </div>
  );
};