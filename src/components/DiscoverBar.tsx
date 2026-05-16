import React, { useRef } from 'react';
import { ChevronRight, Gift, Shield, Star, Zap, Video, Megaphone, Coffee, Heart, ChevronLeft } from 'lucide-react';

interface CardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  color: string;
  type?: 'promo' | 'video' | 'info';
}

const cards: CardProps[] = [
  { icon: <Gift size={24} />, title: "1ª corrida grátis", description: "Até R$ 20 de desconto", color: "#F4D03F", type: "promo" },
  { icon: <Shield size={24} />, title: "Seguro ObaLeva", description: "Proteção total durante a viagem", color: "#6B2D8C", type: "info" },
  { icon: <Star size={24} />, title: "Avaliação 4.8★", description: "Motoristas nota 10", color: "#F4D03F", type: "info" },
  { icon: <Zap size={24} />, title: "Rápido", description: "Chegada em minutos", color: "#9B59B6", type: "info" },
  { icon: <Video size={24} />, title: "Como funciona?", description: "Assista ao vídeo tutorial", color: "#F4D03F", type: "video" },
  { icon: <Megaphone size={24} />, title: "Indique e ganhe", description: "R$ 10 de crédito por amigo", color: "#6B2D8C", type: "promo" },
  { icon: <Coffee size={24} />, title: "Parceiros", description: "Descontos em estabelecimentos", color: "#9B59B6", type: "promo" },
  { icon: <Heart size={24} />, title: "ObaLeva Solidário", description: "Doação de 1 real por corrida", color: "#F4D03F", type: "promo" },
];

export const DiscoverBar = () => {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-16 left-0 right-0 z-40 bg-gradient-to-t from-[#0F0B1A] via-[#0F0B1A]/80 to-transparent pt-4">
      <div className="max-w-md mx-auto px-4">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-white font-bold text-lg">Descubra o ObaLeva</h3>
          <button className="flex items-center gap-1 text-[#F4D03F] text-sm font-medium">
            Ver todos <ChevronRight size={16} />
          </button>
        </div>

        <div className="relative">
          <button
            onClick={() => scroll('left')}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm hover:bg-black/70 transition"
          >
            <ChevronLeft size={20} className="text-white" />
          </button>

          <div
            ref={scrollRef}
            className="flex overflow-x-auto scrollbar-hide gap-3 pb-4 snap-x snap-mandatory"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {cards.map((card, idx) => (
              <div
                key={idx}
                className="min-w-[calc(50%-6px)] max-w-[calc(50%-6px)] snap-start bg-[#1A1528] rounded-2xl p-4 border border-white/10 hover:border-[#F4D03F]/50 transition-all cursor-pointer"
              >
                <div className="flex items-start gap-3">
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0`} style={{ backgroundColor: `${card.color}20` }}>
                    <div style={{ color: card.color }}>{card.icon}</div>
                  </div>
                  <div className="flex-1">
                    <h4 className="text-white font-semibold text-sm">{card.title}</h4>
                    <p className="text-[#A0A0B0] text-xs mt-1">{card.description}</p>
                    {card.type === 'video' && (
                      <div className="mt-2 flex items-center gap-1 text-[#F4D03F] text-xs">
                        ▶️ Assistir agora
                      </div>
                    )}
                    {card.type === 'promo' && (
                      <div className="mt-2 inline-block bg-[#F4D03F]/20 text-[#F4D03F] text-xs px-2 py-0.5 rounded-full">
                        Promoção
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            onClick={() => scroll('right')}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/50 rounded-full p-1 backdrop-blur-sm hover:bg-black/70 transition"
          >
            <ChevronRight size={20} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
};