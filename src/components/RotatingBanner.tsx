import React, { useState, useEffect } from 'react';

interface Banner {
  id: number;
  image: string;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor: string;
}

const banners: Banner[] = [
  {
    id: 1,
    image: "🏪",
    title: "Farmácia Popular",
    description: "10% de desconto em compras acima de R$ 50",
    buttonText: "Aproveitar",
    buttonLink: "#",
    bgColor: "from-green-500/20 to-green-600/10"
  },
  {
    id: 2,
    image: "⛽",
    title: "Posto Ipiranga",
    description: "R$ 0,50 de desconto por litro",
    buttonText: "Ver posto mais próximo",
    buttonLink: "#",
    bgColor: "from-blue-500/20 to-blue-600/10"
  },
  {
    id: 3,
    image: "🍔",
    title: "McDonald's",
    description: "Combo Big Mac por R$ 29,90",
    buttonText: "Pedir agora",
    buttonLink: "#",
    bgColor: "from-red-500/20 to-red-600/10"
  },
  {
    id: 4,
    image: "☕",
    title: "Café Starbucks",
    description: "Compre 1, leve 2 aos finais de semana",
    buttonText: "Resgatar oferta",
    buttonLink: "#",
    bgColor: "from-amber-500/20 to-amber-600/10"
  },
  {
    id: 5,
    image: "🛒",
    title: "Supermercado Extra",
    description: "R$ 15 de cashback na primeira compra",
    buttonText: "Saber mais",
    buttonLink: "#",
    bgColor: "from-yellow-500/20 to-yellow-600/10"
  }
];

const RotatingBanner: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (!isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [isHovered]);

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % banners.length);
  };

  const currentBanner = banners[currentIndex];

  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden shadow-lg mt-3"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`bg-gradient-to-r ${currentBanner.bgColor} p-4 border border-[#F4D03F]/20`}>
        <div className="flex items-center gap-4">
          <div className="text-5xl bg-white/10 rounded-full w-16 h-16 flex items-center justify-center">
            {currentBanner.image}
          </div>
          
          <div className="flex-1">
            <h3 className="text-white font-bold text-base">{currentBanner.title}</h3>
            <p className="text-[#A0A0B0] text-xs mt-0.5">{currentBanner.description}</p>
            <button 
              onClick={() => window.open(currentBanner.buttonLink, '_blank')}
              className="mt-2 px-3 py-1 rounded-lg bg-[#F4D03F] text-[#1A1528] text-xs font-bold hover:scale-105 transition"
            >
              {currentBanner.buttonText} →
            </button>
          </div>
        </div>
      </div>

      <button 
        onClick={goToPrevious}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition"
      >
        ◀
      </button>
      <button 
        onClick={goToNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/50 rounded-full p-1.5 hover:bg-black/70 transition"
      >
        ▶
      </button>

      <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5">
        {banners.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 ${
              idx === currentIndex 
                ? 'w-4 bg-[#F4D03F]' 
                : 'w-1.5 bg-white/50'
            }`}
          />
        ))}
      </div>
    </div>
  );
};

export default RotatingBanner;