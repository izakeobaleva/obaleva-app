import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toaster, toast } from 'sonner';
import { Car, MapPin, Navigation, DollarSign, Award, Shield, Sparkles, ChevronRight, User } from 'lucide-react';

// ============================================
// LAYOUT - CONTAINERS FIXOS
// ┌─────────────────────────────────┐
// │ TOP BAR (60px)                  │ FIXO
// ├─────────────────────────────────┤
// │ MAPA (flex-1)                   │ OCUPA TUDO
// ├─────────────────────────────────┤
// │ ORIGEM + DESTINO + BOTÃO        │ wrap
// ├─────────────────────────────────┤
// │ BANNER (50px)                   │ FIXO
// └─────────────────────────────────┘
// ============================================

export const MainScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [origin] = useState('R. Santo Antônio, 1091 - Bela Vista');
  const [destination, setDestination] = useState('');
  const [showPrice, setShowPrice] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  const bannerSlides = [
    { icon: Sparkles, title: '🔥 10% OFF na 1ª corrida!', color: '#F59E0B' },
    { icon: Shield, title: '🛡️ Segurança 24h monitorada', color: '#3B82F6' },
    { icon: Award, title: '⭐ Motoristas nota 4.8', color: '#10B981' },
    { icon: DollarSign, title: '💰 Preço justo sem taxas surpresa', color: '#8B5CF6' },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setBannerIndex(prev => (prev + 1) % bannerSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const handleRequestRide = () => {
    if (!destination) {
      toast.error('Digite um destino');
      return;
    }
    setShowPrice(true);
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Motorista encontrado!');
      setIsRequesting(false);
    }, 2000);
  };

  const slide = bannerSlides[bannerIndex];
  const SlideIcon = slide.icon;

  return (
    // overflow-hidden APENAS nesta div, não no global
    <div className="h-screen w-full bg-[#0F0B1A] flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />

      {/* ========================================== */}
      {/* 1. TOP BAR - 60px FIXO */}
      {/* ========================================== */}
      <div className="h-[60px] flex-shrink-0 bg-[#1A1528] border-b border-white/10 flex items-center justify-between px-5 z-40">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-xl flex items-center justify-center">
            <Car className="w-5 h-5 text-[#1E1E2F]" />
          </div>
          <span className="text-xl font-bold text-[#F4D03F]">ObaLeva</span>
        </div>
        <button className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4 py-2 hover:bg-white/10 transition">
          <User size={16} className="text-[#F4D03F]" />
          <span className="text-sm font-medium text-white">{user?.email?.split('@')[0] || 'Entrar'}</span>
        </button>
      </div>

      {/* ========================================== */}
      {/* 2. MAPA - OCUPA TODO ESPAÇO (flex-1) */}
      {/* ========================================== */}
      <div className="flex-1 relative min-h-0 bg-gradient-to-br from-[#1A1528] to-[#0F0B1A]">
        {/* Grid de fundo */}
        <div className="absolute inset-0 opacity-5" 
             style={{ 
               backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
               backgroundSize: '50px 50px' 
             }} 
        />
        
        {/* Círculos decorativos */}
        <div className="absolute top-1/4 left-1/3 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/3 right-1/4 w-48 h-48 bg-yellow-500/10 rounded-full blur-3xl" />
        
        {/* Marcador central */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
          <div className="relative">
            <div className="w-5 h-5 bg-blue-500 rounded-full border-[3px] border-white shadow-xl shadow-blue-500/50" />
            <div className="absolute -top-2 -left-2 w-9 h-9 bg-blue-500/30 rounded-full animate-ping" />
          </div>
        </div>

        {/* Label do mapa */}
        <div className="absolute top-6 left-6 bg-[#1A1528]/90 backdrop-blur-md rounded-2xl px-5 py-3 border border-white/10 shadow-xl">
          <p className="text-sm text-white font-medium">📍 Av. Paulista, 1000</p>
          <p className="text-xs text-[#A0A0B0] mt-0.5">São Paulo - SP</p>
        </div>
      </div>

      {/* ========================================== */}
      {/* 3. ORIGEM + DESTINO + BOTÃO - wrap_content */}
      {/* ========================================== */}
      <div className="flex-shrink-0 bg-[#1A1528] px-5 py-4 border-t border-white/10">
        {/* Origem */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <MapPin size={16} className="text-green-400" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Onde você está?</span>
          </div>
          <div className="flex items-center bg-[#0F0B1A] rounded-2xl px-4 py-3 border border-white/10">
            <span className="text-sm text-white font-medium flex-1 truncate">{origin}</span>
            <button className="text-xs text-green-400 font-medium ml-2 shrink-0">Editar</button>
          </div>
        </div>

        {/* Destino */}
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-1.5">
            <Navigation size={16} className="text-red-400" />
            <span className="text-xs font-semibold text-white/60 uppercase tracking-wider">Para onde você vai?</span>
          </div>
          <div className="flex items-center bg-[#0F0B1A] rounded-2xl px-4 py-3 border border-white/10">
            <input
              type="text"
              value={destination}
              onChange={e => setDestination(e.target.value)}
              placeholder="Digite seu destino..."
              className="flex-1 bg-transparent text-sm text-white placeholder-white/30 outline-none"
            />
            <button className="text-xs text-[#F4D03F] font-medium ml-2 shrink-0">OK</button>
          </div>
        </div>

        {/* Preço estimado */}
        {showPrice && (
          <div className="mb-3 flex items-center justify-between bg-green-900/20 rounded-2xl px-4 py-3 border border-green-500/30">
            <div className="flex items-center gap-2">
              <DollarSign size={18} className="text-green-400" />
              <span className="text-sm text-white/80">Valor estimado</span>
            </div>
            <span className="text-lg font-bold text-green-400">R$ 24,50</span>
          </div>
        )}

        {/* Botão Chamar */}
        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          className="w-full py-4 rounded-2xl font-bold text-base bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg hover:shadow-yellow-500/20 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          {isRequesting ? (
            <>
              <div className="w-5 h-5 border-2 border-[#1E1E2F] border-t-transparent rounded-full animate-spin" />
              Procurando motorista...
            </>
          ) : (
            <>
              <Car size={20} />
              Chamar ObaLeva
            </>
          )}
        </button>
      </div>

      {/* ========================================== */}
      {/* 4. BANNER INTERATIVO - 50px FIXO */}
      {/* ========================================== */}
      <div 
        className="h-[50px] flex-shrink-0 bg-[#1A1528] border-t border-white/5 flex items-center px-5 cursor-pointer hover:bg-white/5 transition-all group relative overflow-hidden"
        onClick={() => toast.success('Promoção válida por tempo limitado!')}
      >
        <div className="flex items-center gap-3 w-full relative z-10">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${slide.color}20` }}>
            <SlideIcon size={16} style={{ color: slide.color }} />
          </div>
          <span className="text-sm font-medium text-white flex-1 truncate">{slide.title}</span>
          <ChevronRight size={16} className="text-gray-500 group-hover:text-white transition shrink-0" />
        </div>
        
        {/* Indicadores de slide */}
        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 flex gap-1.5">
          {bannerSlides.map((_, i) => (
            <div 
              key={i} 
              className={`rounded-full transition-all duration-500 ${i === bannerIndex ? 'w-4 h-1 bg-[#F4D03F]' : 'w-1 h-1 bg-white/20'}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default MainScreen;