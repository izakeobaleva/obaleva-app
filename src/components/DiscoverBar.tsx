import { ChevronLeft } from 'lucide-react';

const ChevronRight = ({ size, className }: { size: number; className?: string }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <path d="m9 18 6-6-6-6"/>
  </svg>
);

const cards = [
  { emoji: "🎁", title: "1ª grátis", desc: "R$20 off", color: "#F4D03F" },
  { emoji: "🛡️", title: "Seguro", desc: "Proteção", color: "#8B5CF6" },
  { emoji: "⭐", title: "4.8★", desc: "Top", color: "#F4D03F" },
  { emoji: "⚡", title: "Rápido", desc: "Minutos", color: "#A855F7" },
  { emoji: "📹", title: "Como funciona?", desc: "Watch", color: "#F4D03F" },
  { emoji: "📢", title: "Indique", desc: "R$10", color: "#8B5CF6" },
  { emoji: "☕", title: "Parceiros", desc: "Off", color: "#A855F7" },
  { emoji: "❤️", title: "Solidário", desc: "Doação", color: "#F4D03F" },
];

export function DiscoverBar() {
  const scrollRef = React.useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = scrollRef.current.clientWidth * 0.8;
      scrollRef.current.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="relative mt-2 mb-20">
      <button onClick={() => scroll('left')} className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronLeft size={14} className="text-[#F4D03F]" />
      </button>
      <div ref={scrollRef} className="flex overflow-x-auto scrollbar-hide gap-1.5 pb-1 px-1">
        {cards.map((card, idx) => (
          <div key={idx} className="min-w-[105px] max-w-[105px] bg-[#1A1528] rounded-lg p-1.5 border border-[#F4D03F]/10">
            <div className="flex items-center gap-1.5">
              <div className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 text-base" style={{ backgroundColor: `${card.color}20` }}>
                {card.emoji}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-bold text-[10px] truncate">{card.title}</h4>
                <p className="text-[#A0A0B0] text-[8px] truncate">{card.desc}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button onClick={() => scroll('right')} className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-[#1A1528]/90 rounded-full p-1 backdrop-blur-sm border border-[#F4D03F]/30">
        <ChevronRight size={14} className="text-[#F4D03F]" />
      </button>
    </div>
  );
}