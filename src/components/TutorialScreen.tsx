import React, { useState } from 'react';
import { Car, MapPin, Navigation, ArrowRight, Check, SkipForward, Map, Smartphone, CreditCard } from 'lucide-react';

interface TutorialScreenProps {
  onComplete: () => void;
  onSkip: () => void;
}

const TutorialScreen: React.FC<TutorialScreenProps> = ({ onComplete, onSkip }) => {
  const [step, setStep] = useState(1);
  const totalSteps = 3;

  const steps = [
    {
      title: "📍 Como solicitar sua corrida",
      icon: <MapPin className="w-12 h-12 text-[#F4D03F]" />,
      description: "Digite onde você está e para onde quer ir. O mapa mostra sua localização em tempo real!",
      tips: [
        "Use o autocomplete para endereços",
        "Salve endereços favoritos",
        "Veja o valor antes de confirmar"
      ],
      image: "📍"
    },
    {
      title: "🚗 Acompanhamento em tempo real",
      icon: <Navigation className="w-12 h-12 text-[#F4D03F]" />,
      description: "Veja onde está seu motorista, tempo de chegada e rota completa até seu destino.",
      tips: [
        "Compartilhe sua viagem com familiares",
        "Chat direto com o motorista",
        "Botão de emergência 24h"
      ],
      image: "🗺️"
    },
    {
      title: "💳 Pagamento fácil e seguro",
      icon: <CreditCard className="w-12 h-12 text-[#F4D03F]" />,
      description: "Pague como preferir: dinheiro, cartão, Pix ou saldo ObaLeva.",
      tips: [
        "Cartões cadastrados com segurança",
        "Pix na hora da viagem",
        "Acumule pontos e ganhe descontos"
      ],
      image: "💳"
    }
  ];

  const currentStep = steps[step - 1];

  const handleNext = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex flex-col">
      <div className="pt-6 px-4">
        <div className="flex justify-between items-center mb-2">
          <span className="text-[#A0A0B0] text-xs">Passo {step} de {totalSteps}</span>
          <button onClick={onSkip} className="text-[#A0A0B0] text-xs flex items-center gap-1">
            <SkipForward size={12} /> Pular tutorial
          </button>
        </div>
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-[#F4D03F] to-[#FFD966] rounded-full transition-all duration-300"
            style={{ width: `${(step / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          <div className="w-24 h-24 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-6 animate-pulse">
            {currentStep.icon}
          </div>
          
          <div className="text-6xl mb-4">{currentStep.image}</div>
          
          <h2 className="text-white text-2xl font-bold mb-3">
            {currentStep.title}
          </h2>
          <p className="text-[#A0A0B0] text-base mb-6">
            {currentStep.description}
          </p>
          
          <div className="bg-[#1A1528] rounded-xl p-4 text-left border border-[#F4D03F]/15">
            <p className="text-[#F4D03F] text-xs font-bold mb-2">💡 DICAS ÚTEIS</p>
            {currentStep.tips.map((tip, idx) => (
              <div key={idx} className="flex items-center gap-2 text-white text-sm mb-2">
                <Check size={14} className="text-[#F4D03F]" />
                {tip}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="p-4 pb-8 space-y-3">
        <button
          onClick={handleNext}
          className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base flex items-center justify-center gap-2"
        >
          {step === totalSteps ? '✨ COMEÇAR A USAR' : 'PRÓXIMO →'}
        </button>
        {step > 1 && (
          <button
            onClick={handlePrev}
            className="w-full py-2 rounded-xl text-[#A0A0B0] font-medium text-sm hover:text-white transition"
          >
            ← VOLTAR
          </button>
        )}
      </div>
    </div>
  );
};

export default TutorialScreen;