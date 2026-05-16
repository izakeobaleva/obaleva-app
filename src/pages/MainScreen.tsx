import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Truck, Shield, Star, Zap, Gift, Chrome, 
  Home, Search, Menu as MenuIcon, Video, Megaphone, 
  Coffee, Heart, Wallet, Car, MapPin, Navigation, LogOut 
} from 'lucide-react';
import { toast, Toaster } from 'sonner';
import MapComponent from '../components/MapComponent';

// ============================================
// BOTTOM NAVIGATION
// ============================================
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="fixed bottom-0 left-0 right-0 flex justify-center pb-3 bg-gradient-to-t from-[#0F0B1A] via-[#0F0B1A] to-transparent pt-4 z-50">
      <div className="bg-[#1A1528] border border-white/10 rounded-2xl max-w-md w-full mx-4 shadow-xl">
        <div className="flex justify-between items-center px-4 py-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-1 transition-all duration-200 ${
                  isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
                }`}
              >
                <tab.icon size={24} strokeWidth={isActive ? 2 : 1.5} />
                <span className="text-xs font-medium">{tab.label}</span>
                {isActive && <div className="w-1.5 h-1 rounded-full bg-[#F4D03F] mt-0.5" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

// ============================================
// DISCOVER BAR - CARDS ROLÁVEIS
// ============================================
const DiscoverBar = () => {
  const cards = [
    { icon: <Gift size={22} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F", type: "promo" },
    { icon: <Shield size={22} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#6B2D8C", type: "info" },
    { icon: <Star size={22} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F", type: "info" },
    { icon: <Zap size={22} />, title: "Rápido", description: "Chegada em minutos", color: "#9B59B6", type: "info" },
    { icon: <Video size={22} />, title: "Como funciona?", description: "Assista ao vídeo", color: "#F4D03F", type: "video" },
    { icon: <Megaphone size={22} />, title: "Indique e ganhe", description: "R$ 10 de crédito", color: "#6B2D8C", type: "promo" },
    { icon: <Coffee size={22} />, title: "Parceiros", description: "Descontos exclusivos", color: "#9B59B6", type: "promo" },
    { icon: <Heart size={22} />, title: "ObaLeva Solidário", description: "Doação por corrida", color: "#F4D03F", type: "promo" },
  ];

  return (
    <div className="mt-4 mb-28">
      <div className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-1">
        {cards.map((card, idx) => (
          <div 
            key={idx} 
            className="min-w-[160px] max-w-[160px] bg-[#1A1528] rounded-xl p-3 border border-white/10 hover:border-[#F4D03F]/30 transition-all duration-200"
          >
            <div className="flex items-start gap-2">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0`} 
                   style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-xs truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[10px] mt-0.5 truncate">{card.description}</p>
                {card.type === 'promo' && (
                  <div className="mt-1 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-[8px] px-1.5 py-0.5 rounded-full font-bold">
                    🔥 PROMO
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ============================================
// DASHBOARD DO PASSAGEIRO
// ============================================
const PassengerDashboard = ({ 
  pickupLocation, dropoffLocation, setPickupLocation, setDropoffLocation, 
  pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, 
  onRequestRide, userBalance, signOut 
}: any) => (
  <div className="mt-2">
    {/* CABEÇALHO COM SAIR */}
    <div className="flex justify-between items-center mb-3 px-1">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 rounded-full bg-[#F4D03F] animate-pulse" />
        <span className="text-[#F4D03F] text-[10px] font-medium">AO VIVO</span>
      </div>
      <button 
        onClick={signOut}
        className="text-[#A0A0B0] text-[10px] flex items-center gap-1 hover:text-red-400 transition"
      >
        <LogOut size={12} /> Sair
      </button>
    </div>

    {/* MAPA COM LOGO SOBREPOSTA */}
    <div className="relative rounded-2xl overflow-hidden shadow-2xl">
      <div className="h-[420px] w-full">
        <MapComponent
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onPickupChange={setPickupAddress}
          onDropoffChange={setDropoffAddress}
          onLocationSelect={(location: any) => {
            if (!dropoffAddress) {
              setPickupLocation(location);
              setPickupAddress(location.address);
            } else {
              setDropoffLocation(location);
              setDropoffAddress(location.address);
            }
          }}
        />
      </div>
      
      {/* LOGO SOBREPOSTA AO MAPA */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="bg-[#1A1528]/90 backdrop-blur-md rounded-2xl px-6 py-2 border border-[#F4D03F]/40 shadow-xl">
          <div className="flex items-center gap-2">
            <Car className="text-[#F4D03F] w-5 h-5" />
            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">
              OBALEVA
            </h1>
          </div>
          <p className="text-[#F4D03F] text-[9px] text-center font-medium tracking-wider">
            SUA CORRIDA DE CONFIANÇA
          </p>
        </div>
      </div>
    </div>

    {/* BOTÃO COM SALDO INTEGRADO */}
    <div className="mt-4 px-1">
      <button 
        onClick={onRequestRide}
        className="w-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1A1528] font-bold py-4 rounded-xl shadow-lg transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between px-5"
      >
        <div className="flex items-center gap-3">
          <div className="bg-[#1A1528]/20 w-8 h-8 rounded-full flex items-center justify-center text-lg">
            🚗
          </div>
          <span className="text-base font-black tracking-wide">SOLICITAR OBALEVALe</span>
        </div>
        <div className="flex items-center gap-2 bg-[#1A1528]/30 px-4 py-2 rounded-full">
          <Wallet size={18} className="text-[#1A1528]" />
          <span className="font-black text-lg">R$ {userBalance}</span>
        </div>
      </button>
    </div>
  </div>
);

// ============================================
// TELA DE LOGIN
// ============================================
const LoginCard = () => (
  <div className="bg-gradient-to-br from-[#1A1528] to-[#0F0B1A] rounded-2xl p-8 border border-white/10 text-center mt-8">
    <div className="bg-gradient-to-br from-[#F4D03F]/20 to-[#F4D03F]/5 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-5">
      <Car className="text-[#F4D03F] w-12 h-12" />
    </div>
    <h2 className="text-white font-bold text-2xl mb-2">Bem-vindo ao ObaLeva!</h2>
    <p className="text-[#A0A0B0] text-sm mb-8">Faça login para solicitar corridas</p>
    <button 
      onClick={async () => {
        const { error } = await supabase.auth.signInWithOAuth({ 
          provider: 'google', 
          options: { redirectTo: window.location.origin } 
        });
        if (error) toast.error('Erro ao fazer login');
      }}
      className="w-full py-3 rounded-xl bg-white/5 border border-white/20 text-white flex items-center justify-center gap-3 hover:bg-white/10 transition-all duration-200 font-medium"
    >
      <Chrome size={20} /> Entrar com Google
    </button>
  </div>
);

// ============================================
// TELA PRINCIPAL
// ============================================
export const MainScreen = () => {
  const { user, profile, loading, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [userBalance, setUserBalance] = useState('0,00');

  const handleRequestRide = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('📍 Por favor, preencha a origem e o destino!');
      return;
    }
    toast.success(`🚗 Corrida solicitada!\n\nDe: ${pickupAddress}\nPara: ${dropoffAddress}`, {
      duration: 5000,
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Car className="text-[#F4D03F] w-12 h-12 mb-3 animate-bounce" />
          <p className="text-white text-lg font-bold">Carregando ObaLeva...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A]">
      <Toaster position="top-center" richColors />
      
      <div className="max-w-md mx-auto px-4 pb-32">
        {!user ? (
          <LoginCard />
        ) : (
          <PassengerDashboard
            pickupLocation={pickupLocation}
            dropoffLocation={dropoffLocation}
            setPickupLocation={setPickupLocation}
            setDropoffLocation={setDropoffLocation}
            pickupAddress={pickupAddress}
            setPickupAddress={setPickupAddress}
            dropoffAddress={dropoffAddress}
            setDropoffAddress={setDropoffAddress}
            onRequestRide={handleRequestRide}
            userBalance={userBalance}
            signOut={signOut}
          />
        )}

        <DiscoverBar />
      </div>

      <BottomNav active={activeTab} onNavigate={setActiveTab} />
    </div>
  );
};