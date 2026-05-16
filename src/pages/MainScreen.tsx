import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Truck, Shield, Star, Zap, Gift, Chrome, 
  Home, Search, Menu as MenuIcon, Video, Megaphone, 
  Coffee, Heart, MapPin, Navigation, Car, Wallet 
} from 'lucide-react';
import { toast } from 'sonner';
import MapComponent from '../components/MapComponent';

// Bottom Navigation
const BottomNav = ({ active, onNavigate }: { active: string; onNavigate: (tab: string) => void }) => {
  const tabs = [
    { id: 'home', label: 'Início', icon: Home },
    { id: 'buscar', label: 'Buscar', icon: Search },
    { id: 'perfil', label: 'Perfil', icon: User },
    { id: 'menu', label: 'Menu', icon: MenuIcon },
  ];
  return (
    <div className="flex justify-center">
      <div className="bg-[#1A1528] border border-white/10 rounded-xl max-w-md w-full mx-4">
        <div className="flex justify-between items-center px-4 py-2">
          {tabs.map((tab) => {
            const isActive = active === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onNavigate(tab.id)}
                className={`flex flex-col items-center gap-1 transition-colors ${
                  isActive ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'
                }`}
                style={{ minHeight: '56px', minWidth: '64px' }}
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

// Discover Bar com Cards
const DiscoverBar = () => {
  const cards = [
    { icon: <Gift size={24} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F", type: "promo" },
    { icon: <Shield size={24} />, title: "Seguro ObaLeva", description: "Proteção total", color: "#6B2D8C", type: "info" },
    { icon: <Star size={24} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F", type: "info" },
    { icon: <Zap size={24} />, title: "Rápido", description: "Chegada em minutos", color: "#9B59B6", type: "info" },
    { icon: <Video size={24} />, title: "Como funciona?", description: "Assista ao vídeo", color: "#F4D03F", type: "video" },
    { icon: <Megaphone size={24} />, title: "Indique e ganhe", description: "R$ 10 de crédito", color: "#6B2D8C", type: "promo" },
    { icon: <Coffee size={24} />, title: "Parceiros", description: "Descontos exclusivos", color: "#9B59B6", type: "promo" },
    { icon: <Heart size={24} />, title: "ObaLeva Solidário", description: "Doação por corrida", color: "#F4D03F", type: "promo" },
  ];

  return (
    <div className="mt-4">
      <div className="flex overflow-x-auto scrollbar-hide gap-2.5 pb-1">
        {cards.map((card, idx) => (
          <div key={idx} className="min-w-[calc(50%-3px)] max-w-[calc(50%-3px)] bg-[#1A1528] rounded-xl p-3 border border-white/10">
            <div className="flex items-start gap-2.5">
              <div className={`w-10 h-10 rounded-full flex items-center justify-center`} 
                   style={{ backgroundColor: `${card.color}20` }}>
                <div style={{ color: card.color }}>{card.icon}</div>
              </div>
              <div className="flex-1">
                <h4 className="text-white font-semibold text-xs">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[10px] mt-0.5">{card.description}</p>
                {card.type === 'promo' && (
                  <div className="mt-1 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-[8px] px-1.5 py-0.5 rounded-full">
                    Promoção
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

// Passenger Dashboard com Mapa + Botão + Saldo
const PassengerDashboard = ({ 
  pickupLocation, dropoffLocation, setPickupLocation, setDropoffLocation, 
  pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, 
  onRequestRide, userBalance 
}: any) => (
  <div>
    {/* Mapa com Logo sobreposto */}
    <div className="relative h-[400px] rounded-xl overflow-hidden">
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
      
      {/* Logo sobrepondo o mapa */}
      <div className="absolute top-4 left-0 right-0 z-20 flex justify-center pointer-events-none">
        <div className="bg-[#1A1528]/80 backdrop-blur-md rounded-2xl px-6 py-2 border border-[#F4D03F]/30 shadow-lg">
          <h1 className="text-2xl font-bold text-white">
            OBALEVA <span className="text-[#F4D03F]">🚗</span>
          </h1>
          <p className="text-[#F4D03F] text-[10px] text-center -mt-1">Sua corrida de confiança</p>
        </div>
      </div>
    </div>

    {/* Botão com Saldo integrado - FORA DO MAPA */}
    <div className="mt-3 px-2">
      <button 
        onClick={onRequestRide}
        className="w-full bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1A1528] font-bold py-3 rounded-xl shadow-lg transition-transform hover:scale-[1.02] active:scale-[0.98] flex items-center justify-between px-4"
      >
        <span className="flex items-center gap-2">
          🟡 Solicitar ObaLeva
        </span>
        <span className="flex items-center gap-1 bg-[#1A1528]/20 px-3 py-1 rounded-full text-sm">
          <Wallet size={16} /> R$ {userBalance}
        </span>
      </button>
    </div>
  </div>
);

// Tela de Login Simplificada
const LoginCard = () => (
  <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-6 border border-white/10 text-center">
    <div className="bg-[#F4D03F]/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
      <Car className="text-[#F4D03F] w-10 h-10" />
    </div>
    <h2 className="text-white font-bold text-xl mb-2">Bem-vindo ao ObaLeva!</h2>
    <p className="text-[#A0A0B0] text-sm mb-6">Faça login para solicitar corridas</p>
    <button 
      onClick={async () => {
        const { error } = await supabase.auth.signInWithOAuth({ 
          provider: 'google', 
          options: { redirectTo: window.location.origin } 
        });
        if (error) toast.error('Erro ao fazer login');
      }}
      className="w-full py-3 rounded-lg bg-white/5 border border-white/20 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition"
    >
      <Chrome size={18} /> Entrar com Google
    </button>
  </div>
);

// Tela principal
export const MainScreen = () => {
  const { user, profile, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('home');
  const [pickupLocation, setPickupLocation] = useState(null);
  const [dropoffLocation, setDropoffLocation] = useState(null);
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [userBalance, setUserBalance] = useState('0,00');

  const handleRequestRide = () => {
    if (!pickupLocation || !dropoffLocation) {
      toast.error('Por favor, preencha a origem e o destino!');
      return;
    }
    toast.success(`Corrida solicitada! 🚗\nDe: ${pickupAddress}\nPara: ${dropoffAddress}`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-white">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-4">
      <div className="max-w-md mx-auto px-4">
        {/* Dashboard do Passageiro ou Login */}
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
          />
        )}

        {/* Discover Bar */}
        <DiscoverBar />
      </div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 pb-2">
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
      </div>
    </div>
  );
};