import { Shield, Check } from 'lucide-react';
import { DriverContract } from '../DriverContract';

interface ReviewStepProps {
  nome: string;
  cpf: string;
  modeloVeiculo: string;
  placaVeiculo: string;
  temDocumentos: boolean;
  contratoAceito: boolean;
  onContratoChange: (aceito: boolean) => void;
}

export function ReviewStep({
  nome,
  cpf,
  modeloVeiculo,
  placaVeiculo,
  temDocumentos,
  contratoAceito,
  onContratoChange,
}: ReviewStepProps) {
  return (
    <div className="space-y-3">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <Shield size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Revisão e Contrato</h2>
      </div>

      <div className="bg-[#0F0B1A] rounded-2xl border border-white/10 p-3 space-y-1.5 text-xs">
        <h3 className="text-white font-semibold mb-1">📌 Resumo</h3>
        <div className="grid grid-cols-2 gap-1">
          <div>
            <span className="text-[#A0A0B0]">Nome:</span>{' '}
            <span className="text-white">{nome}</span>
          </div>
          <div>
            <span className="text-[#A0A0B0]">CPF:</span>{' '}
            <span className="text-white">{cpf}</span>
          </div>
          <div>
            <span className="text-[#A0A0B0]">Veículo:</span>{' '}
            <span className="text-white">{modeloVeiculo}</span>
          </div>
          <div>
            <span className="text-[#A0A0B0]">Placa:</span>{' '}
            <span className="text-white">{placaVeiculo}</span>
          </div>
        </div>
        <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10">
          <Check size={12} className="text-green-400" />
          <span className="text-green-400 text-[10px]">
            {temDocumentos ? 'Documentos OK' : 'Documentos pendentes'}
          </span>
        </div>
      </div>

      <DriverContract aceito={contratoAceito} onAcceptChange={onContratoChange} />
    </div>
  );
}