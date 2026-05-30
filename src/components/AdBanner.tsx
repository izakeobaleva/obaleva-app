"use client";

import { useEffect, useState } from 'react';
import { Gift, ChevronRight, Sparkles, Zap, Star } from 'lucide-react';

const slides = [
  { icon: Gift, text: 'Ganhe R$ 10 na primeira corrida!', color: '#F4D03F' },
  { icon: Sparkles, text: 'Corridas com até 20% OFF no horário de pico', color: '#A855F7' },
  { icon: Star, text: 'Motoristas verificados • Segurança 24h', color: '#22C55E' },
  { icon: Zap, text: 'Reserve com antecedência sem taxa extra', color: '#3B82F6' },
];

export function AdBanner() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent(prev => (prev + 1) % slides.length), 4000);
    return () => clearInterval(timer);
  }, []);

  const slide = slides[current];
  const Icon = slide.icon;

  return (
    <div 
      className="h-[50px] bg-[#1A1528] border-t border-white/10 flex items-center justify-between px-4 flex-shrink-0 cursor-pointer hover:bg-[#2D2342] transition-all"
      onClick={() => {/* ação ao clicar */}}
    >
      <div className="flex items-center gap-2">
        <Icon size={18} style={{ color: slide.color }} />
        <p className="text-xs text-white/90 font-medium truncate max-w-[250px]">{slide.text}</p>
      </div>
      <ChevronRight size={16} className="text-gray-500 shrink-0" />
    </div>
  );
}