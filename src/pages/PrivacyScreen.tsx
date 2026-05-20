import React from 'react';
import { ArrowLeft, Shield, Lock, Eye, Database, Share2 } from 'lucide-react';

interface PrivacyScreenProps {
  onBack: () => void;
}

const PrivacyScreen: React.FC<PrivacyScreenProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex items-center gap-3 py-4">
          <button onClick={onBack} className="text-[#A0A0B0] hover:text-white">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-white text-xl font-bold">Política de Privacidade</h1>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20 space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-white/10">
            <Shield size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">1. Informações Coletadas</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            Coletamos informações como: nome, e-mail, telefone, CPF, localização, dados de corrida e informações de pagamento.
          </p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <Lock size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">2. Uso das Informações</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            Utilizamos seus dados para: processar corridas, calcular valores, melhorar o serviço, enviar notificações e cumprir obrigações legais.
          </p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <Eye size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">3. Compartilhamento de Dados</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            Compartilhamos seus dados com motoristas para execução da corrida, parceiros de pagamento e quando exigido por lei.
          </p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <Database size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">4. Armazenamento e Segurança</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            Seus dados são armazenados com segurança em servidores criptografados. Implementamos medidas para proteger suas informações.
          </p>

          <div className="flex items-center gap-2 pb-2 border-b border-white/10 pt-2">
            <Share2 size={20} className="text-[#F4D03F]" />
            <h2 className="text-white font-bold text-base">5. Seus Direitos</h2>
          </div>
          <p className="text-[#A0A0B0] text-sm">
            Você pode solicitar acesso, correção ou exclusão de seus dados a qualquer momento através do aplicativo ou pelo e-mail suporte@obaleva.com.br.
          </p>

          <div className="text-center pt-3 border-t border-white/10">
            <p className="text-[#A0A0B0] text-xs">Última atualização: Maio de 2026</p>
            <p className="text-[#F4D03F] text-xs mt-1">ObaLeva - Sua corrida de confiança</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrivacyScreen;