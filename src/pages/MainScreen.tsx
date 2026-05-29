import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toaster, toast } from 'sonner';
import { Car, MapPin, Navigation, DollarSign, TrendingUp, Users, Shield, Star, Info, ChevronRight, Sparkles, Target, Zap, Bell } from 'lucide-react';

// ============================================
// TELA PRINCIPAL - MAPA COMO VITRINE
// LAYOUT: topo -> MAPA (grande) -> cards flutuantes -> banner pub
// SEM BARRAS DE ROLAGEM
// ============================================

export const MainScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState('R. Santo Antônio, 1091 - Bela Vista');
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);
  const [showBannerInfo, setShowBannerInfo] = useState(false);
  const [bannerIndex, setBannerIndex] = useState(0);

  // Informações interativas do banner
  const bannerSlides = [
    { icon: Star, title: '4.8 ⭐', desc: 'Avaliação média dos motoristas', color: '#F59E0B' },
    { icon: Zap, title: 'Chegada Rápida', desc: 'Motorista em menos de 5 min', color: '#10B981' },
    { icon: Shield, title: 'Segurança', desc: 'Viagem monitorada 24h', color: '#3B82F6' },
    { icon: Target, title: 'Preço Justo', desc: 'Sem taxas surpresa', color: '#8B5CF6' },
    { icon: Users, title: '+10.000', desc: 'Passageiros satisfeitos', color: '#EC4899' },
    { icon: TrendingUp, title: 'Economia', desc: 'Até 30% mais barato', color: '#F59E0B' },
  ];

  // Rodar banner automático
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
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Motorista encontrado! 🚗');
      setIsRequesting(false);
    }, 2000);
  };

  const slide = bannerSlides[bannerIndex];
  const SlideIcon = slide.icon;

  return (
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* ========================================== */}
      {/* 🔝 TOP BAR - 60dp FIXO */}
      {/* ========================================== */}
      <div className="flex-shrink-0 h-14 bg-gray-900/95 backdrop-blur-md border-b border-gray-800 flex items-center justify-between px-4 z-30">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-xl flex items-center justify-center shadow-lg shadow-yellow-400/20">
            <Car className="w-5 h-5 text-gray-900" />
          </div>
          <span className="text-lg font-bold text-yellow-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeva</span>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={() => setShowBannerInfo(!showBannerInfo)}
            className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center hover:bg-gray-700 transition border border-gray-700"
          >
            <Info size={16} className="text-gray-400" />
          </button>
          <div className="w-8 h-8 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
            <span className="text-xs font-bold text-gray-900">{user?.email?.charAt(0).toUpperCase() || 'P'}</span>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 🗺️ MAPA AO VIVO (VITRINE PRINCIPAL) */}
      {/* ========================================== */}
      <div className="flex-1 relative">
        {/* Mapa - fundo gradiente simulando mapa */}
        <div className="absolute inset-0 bg-gradient-to-br from-gray-800 via-gray-900 to-gray-800">
          {/* Grid simulando ruas */}
          <div className="absolute inset-0 opacity-10" 
               style={{ 
                 backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
                 backgroundSize: '40px 40px' 
               }} 
          />
          {/* Círculos decorativos */}
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-1/3 right-1/4 w-40 h-40 bg-yellow-500/10 rounded-full blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-purple-500/10 rounded-full blur-3xl" />
          
          {/* Marcador central - pulso */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            <div className="relative">
              <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg shadow-blue-500/50"></div>
              <div className="absolute -top-2 -left-2 w-8 h-8 bg-blue-500/40 rounded-full animate-ping"></div>
              <div className="absolute -top-4 -left-4 w-12 h-12 border-2 border-blue-400/30 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          {/* Label de localização */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-8">
            <div className="bg-gray-900/80 backdrop-blur-sm px-3 py-1.5 rounded-full border border-gray-700">
              <p className="text-xs text-gray-400">📍 Av. Paulista, 1000</p>
            </div>
          </div>
        </div>

        {/* ========================================== */}
        {/* 📍 CARDS FLUTUANTES SOBRE O MAPA */}
        {/* ========================================== */}
        <div className="absolute top-4 left-4 right-4 z-20 space-y-2">
          {/* Card Origem */}
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3.5 border border-gray-700/50 shadow-xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-green-500/15 rounded-xl flex items-center justify-center border border-green-500/20">
                <MapPin size={18} className="text-green-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Onde você está?</p>
                <p className="text-sm text-white font-medium truncate">{origin}</p>
              </div>
              <button className="text-xs bg-green-500/10 text-green-400 px-3 py-1.5 rounded-xl border border-green-500/20 hover:bg-green-500/20 transition font-medium">
                Editar
              </button>
            </div>
          </div>

          {/* Card Destino */}
          <div className="bg-gray-900/90 backdrop-blur-xl rounded-2xl p-3.5 border border-gray-700/50 shadow-xl shadow-black/30">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-red-500/15 rounded-xl flex items-center justify-center border border-red-500/20">
                <Navigation size={18} className="text-red-400" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">Para onde você vai?</p>
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Digite seu destino..."
                  className="w-full bg-transparent text-sm text-white font-medium outline-none placeholder:text-gray-500"
                />
              </div>
              <button className="text-xs bg-red-500/10 text-red-400 px-3 py-1.5 rounded-xl border border-red-500/20 hover:bg-red-500/20 transition font-medium">
                OK
              </button>
            </div>
          </div>
        </div>

        {/* Botão Chamar - flutuante no mapa */}
        <div className="absolute bottom-4 left-4 right-4 z-20">
          <button
            onClick={handleRequestRide}
            disabled={isRequesting}
            className={`
              w-full py-4 rounded-2xl font-bold text-lg transition-all shadow-xl
              ${!isRequesting 
                ? 'bg-gradient-to-r from-yellow-400 to-amber-500 text-gray-900 hover:from-yellow-300 hover:to-amber-400 active:scale-[0.98] shadow-yellow-400/30' 
                : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
            `}
          >
            {isRequesting ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full animate-spin"></div>
                Procurando motorista...
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <Car size={22} className="text-gray-900" />
                Chamar ObaLeva
              </div>
            )}
          </button>
        </div>

        {/* Indicador de zoom no canto */}
        <div className="absolute bottom-4 right-4 z-20 hidden md:block">
          <div className="bg-gray-900/80 backdrop-blur-sm rounded-xl p-2 border border-gray-700">
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">+</button>
            <div className="w-8 h-px bg-gray-700 my-1"></div>
            <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition">−</button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* 📢 BANNER INFORMATIVO INTERATIVO - 50dp FIXO */}
      {/* ========================================== */}
      <div 
        className="flex-shrink-0 h-14 bg-gradient-to-r from-gray-800 to-gray-900 border-t border-gray-700/50 flex items-center px-4 cursor-pointer hover:from-gray-750 hover:to-gray-850 transition-all group relative overflow-hidden"
        onClick={() => setShowBannerInfo(!showBannerInfo)}
      >
        {/* Gradiente animado de fundo */}
        <div className="absolute inset-0 bg-gradient-to-r from-yellow-500/5 via-transparent to-purple-500/5 opacity-50 group-hover:opacity-100 transition-opacity" />
        
        <div className="flex items-center gap-3 relative z-10 flex-1">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ backgroundColor: `${slide.color}20` }}>
            <SlideIcon size={16} style={{ color: slide.color }} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-bold text-white truncate">{slide.title}</p>
            <p className="text-[10px] text-gray-400 truncate">{slide.desc}</p>
          </div>
          <ChevronRight size={16} className="text-gray-500 group-hover:text-gray-300 transition shrink-0" />
        </div>
        
        {/* Indicadores de slide */}
        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-1">
          {bannerSlides.map((_, i) => (
            <div 
              key={i} 
              className={`w-1 h-1 rounded-full transition-all duration-300 ${i === bannerIndex ? 'w-3 bg-yellow-400' : 'bg-gray-600'}`}
            />
          ))}
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTTOM NAV - 60dp */}
      {/* ========================================== */}
      <nav className="flex-shrink-0 h-14 bg-gray-900/95 backdrop-blur-md border-t border-gray-800 flex items-center justify-around px-4 z-30">
        <button className="flex flex-col items-center gap-0.5 text-yellow-400 relative">
          <Car size={20} />
          <span className="text-[10px] font-medium">Início</span>
          <div className="absolute -top-0.5 w-12 h-0.5 bg-yellow-400 rounded-full" />
        </button>
        <button onClick={() => navigate('/trips')} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-300 transition">
          <Navigation size={20} />
          <span className="text-[10px] font-medium">Viagens</span>
        </button>
        <button onClick={() => navigate('/driver')} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-300 transition">
          <Users size={20} />
          <span className="text-[10px] font-medium">Motorista</span>
        </button>
        <button onClick={() => navigate('/profile')} className="flex flex-col items-center gap-0.5 text-gray-500 hover:text-gray-300 transition">
          <Bell size={20} />
          <span className="text-[10px] font-medium">Perfil</span>
        </button>
      </nav>
    </div>
  );
};

export default MainScreen;