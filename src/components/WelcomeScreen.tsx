import React, { useState, useEffect } from 'react';
import { Car, Shield, Star, Zap, MapPin, Navigation } from 'lucide-react';

interface WelcomeScreenProps {
  onSignUp: () => void;
  onLogin: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSignUp, onLogin }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      icon: <Car className="w-16 h-16 text-[#F4D03F]" />,
      title: "Mobilidade Premium",
      description: "Conectamos você a motoristas parceiros da sua região"
    },
    {
      icon: <Shield className="w-16 h-16 text-[#F4D03F]" />,
      title: "Seguro Total",
      description: "Todas as corridas são protegidas com seguro obrigatório"
    },
    {
      icon: <Star className="w-16 h-16 text-[#F4D03F]" />,
      title: "Motoristas Qualificados",
      description: "Todos os motoristas passam por verificação rigorosa"
    },
    {
      icon: <Zap className="w-16 h-16 text-[#F4D03F]" />,
      title: "Rápido e Prático",
      description: "Chegada em minutos, pagamento fácil e suporte 24h"
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="pt-12 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
          <Car className="w-10 h-10 text-[#F4D03F]" />
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">
          OBALEVA
        </h1>
        <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
      </div>

      <div className="relative mx-4 mt-6 rounded-2xl overflow-hidden h-[280px] bg-gradient-to-br from-[#1A1528] to-[#2D2342] border border-[#F4D03F]/20">
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="relative w-full h-full">
            <div className="absolute top-1/4 left-1/4 w-32 h-32 rounded-full border-2 border-[#F4D03F]/30 animate-ping" />
            <div className="absolute top-1/3 left-1/2 w-24 h-24 rounded-full border-2 border-[#F4D03F]/20 animate-pulse" />
            <div className="absolute bottom-1/4 right-1/4 w-40 h-40 rounded-full border-2 border-[#F4D03F]/10" />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center">
              <MapPin className="w-8 h-8 text-[#F4D03F] mx-auto animate-bounce" />
              <p className="text-white text-xs mt-2">Você está aqui</p>
            </div>
            <div className="absolute bottom-8 right-8">
              <div className="flex items-center gap-1 text-[10px] text-[#A0A0B0]">
                <Navigation size={12} className="text-[#F4D03F]" />
                Motoristas próximos
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 mt-6">
        <div className="text-center max-w-sm">
          <div className="mb-4 transform transition-all duration-500">
            {slides[currentSlide].icon}
          </div>
          <h2 className="text-white text-xl font-bold mb-2">
            {slides[currentSlide].title}
          </h2>
          <p className="text-[#A0A0B0] text-sm">
            {slides[currentSlide].description}
          </p>
          <div className="flex justify-center gap-2 mt-4">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  idx === currentSlide ? 'w-6 bg-[#F4D03F]' : 'w-2 bg-white/30'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-3">
        <button
          onClick={onSignUp}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base flex items-center justify-center gap-2"
        >
          ✨ CRIAR MINHA CONTA
        </button>
        <button
          onClick={onLogin}
          className="w-full py-3 rounded-xl border-2 border-[#F4D03F]/30 text-white font-medium text-base hover:bg-white/5 transition"
        >
          JÁ TENHO CONTA
        </button>
      </div>
    </div>
  );
};

export default WelcomeScreen;