import { FileText, Car, AlertTriangle } from 'lucide-react';
import { DocumentUpload } from '../DocumentUpload';

interface DocumentsStepProps {
  frenteCnh: string | null;
  versoCnh: string | null;
  selfieCnh: string | null;
  crlv: string | null;
  certidaoAntecedentes: string | null;
  modeloVeiculo: string;
  placaVeiculo: string;
  anoVeiculo: string;
  corVeiculo: string;
  onFrenteCnhChange: (value: string | null) => void;
  onVersoCnhChange: (value: string | null) => void;
  onSelfieCnhChange: (value: string | null) => void;
  onCrlvChange: (value: string | null) => void;
  onCertidaoChange: (value: string | null) => void;
  onModeloChange: (value: string) => void;
  onPlacaChange: (value: string) => void;
  onAnoChange: (value: string) => void;
  onCorChange: (value: string) => void;
}

export function DocumentsStep({
  frenteCnh,
  versoCnh,
  selfieCnh,
  crlv,
  certidaoAntecedentes,
  modeloVeiculo,
  placaVeiculo,
  anoVeiculo,
  corVeiculo,
  onFrenteCnhChange,
  onVersoCnhChange,
  onSelfieCnhChange,
  onCrlvChange,
  onCertidaoChange,
  onModeloChange,
  onPlacaChange,
  onAnoChange,
  onCorChange,
}: DocumentsStepProps) {
  return (
    <div className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <FileText size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Documentos</h2>
      </div>

      <div className="bg-yellow-900/20 border border-yellow-500/30 rounded-2xl p-2.5 flex items-start gap-2">
        <AlertTriangle size={14} className="text-yellow-400 shrink-0 mt-0.5" />
        <p className="text-yellow-300/70 text-[10px]">Tire fotos nítidas dos documentos. Isso acelera a aprovação.</p>
      </div>

      <DocumentUpload label="CNH - Frente" description="Foto nítida da frente da sua CNH" acceptedFiles="image/png,image/jpeg,image/jpg" value={frenteCnh} onChange={onFrenteCnhChange} />
      <DocumentUpload label="CNH - Verso" description="Foto nítida do verso da sua CNH" acceptedFiles="image/png,image/jpeg,image/jpg" value={versoCnh} onChange={onVersoCnhChange} />
      <DocumentUpload label="Selfie com a CNH" description="Selfie segurando a CNH ao lado do rosto" acceptedFiles="image/png,image/jpeg,image/jpg" value={selfieCnh} onChange={onSelfieCnhChange} />
      <DocumentUpload label="CRLV" description="Certificado de Registro e Licenciamento do Veículo" acceptedFiles="image/png,image/jpeg,image/jpg,.pdf" value={crlv} onChange={onCrlvChange} />
      <DocumentUpload label="Antecedentes Criminais (opcional)" description="Acelera a aprovação" acceptedFiles="image/png,image/jpeg,image/jpg,.pdf" value={certidaoAntecedentes} onChange={onCertidaoChange} />

      <div className="border-t border-white/10 pt-3 mt-3">
        <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Car size={14} className="text-[#F4D03F]" /> Dados do Veículo
        </h3>
        <div className="space-y-2.5">
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Car size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type="text"
              placeholder="Modelo (ex: Toyota Corolla)"
              autoComplete="off"
              className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
              value={modeloVeiculo}
              onChange={(e) => onModeloChange(e.target.value)}
              required
            />
          </div>
          <div className="flex gap-2">
            <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <Car size={14} className="text-[#F4D03F] shrink-0" />
              <input
                type="text"
                placeholder="Placa"
                autoComplete="off"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs uppercase"
                value={placaVeiculo}
                onChange={(e) => onPlacaChange(e.target.value.toUpperCase())}
                required
              />
            </div>
            <div className="w-16 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
              <input
                type="text"
                placeholder="Ano"
                autoComplete="off"
                className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
                value={anoVeiculo}
                onChange={(e) => onAnoChange(e.target.value.replace(/\D/g, '').slice(0, 4))}
                required
                maxLength={4}
              />
            </div>
          </div>
          <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
            <Car size={14} className="text-[#F4D03F] shrink-0" />
            <input
              type="text"
              placeholder="Cor do veículo"
              autoComplete="off"
              className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
              value={corVeiculo}
              onChange={(e) => onCorChange(e.target.value)}
              required
            />
          </div>
        </div>
      </div>
    </div>
  );
}