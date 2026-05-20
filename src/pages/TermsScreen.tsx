import React from 'react';
import { ArrowLeft, Shield, FileText, CheckCircle } from 'lucide-react';

interface TermsScreenProps {
  onBack: () => void;
}

const TermsScreen: React.FC<TermsScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center gap-3 py-4">
          <button onClick={onBack} className="text-[#A0A0B0] hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Termos de Uso</h1>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Shield size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">1. Aceitação dos Termos</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">Ao usar o aplicativo ObaLeva, você concorda com estes Termos de Uso. Se não concordar, não utilize o aplicativo.</p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <FileText size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">2. Serviços Oferecidos</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">O ObaLeva conecta passageiros a motoristas parceiros para transporte particular. Não somos uma empresa de transporte, mas uma plataforma de intermediação.</p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <CheckCircle size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">3. Cadastro e Conta</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">Você é responsável por manter a confidencialidade de sua senha e por todas as atividades que ocorrerem em sua conta.</p>

          <div className="text-center pt-3 border-t border-white/10">
            <p className="text-[#A0A0B0] text-xs">Última atualização: Maio de 2026</p>
            <p className="text-[#F4D03F] text-xs mt-1">ObaLeva - Sua corrida de confiança</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsScreen;