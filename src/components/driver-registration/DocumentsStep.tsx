import { FileText, Car, AlertTriangle } from 'lucide-react';
import { DocumentUpload } from '../DocumentUpload';

interface DocumentsStepProps {
  frenteCnh: string | null; versoCnh: string | null; selfieCnh: string | null;
  crlv: string | null; certidaoAntecedentes: string | null;
  modeloVeiculo: string; placaVeiculo: string; anoVeiculo: string; corVeiculo: string;
  onFrenteCnhChange: (v: string | null) => void; onVersoCnhChange: (v: string | null) => void;
  onSelfieCnhChange: (v: string | null) => void; onCrlvChange: (v: string | null) => void;
  onCertidaoChange: (v: string | null) => void; onModeloChange: (v: string) => void;
  onPlacaChange: (v: string) => void; onAnoChange: (v: string) => void; onCorChange: (v: string) => void;
  errors?: Record<string, string>;
}

export function DocumentsStep({
  frenteCnh, versoCnh, selfieCnh, crlv, certidaoAntecedentes,
  modeloVeiculo, placaVeiculo, anoVeiculo, corVeiculo,
  onFrenteCnhChange, onVersoCnhChange, onSelfieCnhChange, onCrlvChange, onCertidaoChange,
  onModeloChange, onPlacaChange, onAnoChange, onCorChange, errors = {}
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

      <DocumentUpload label="CNH - Frente" description="Foto nítida da frente da sua CNH" acceptedFiles="image/png,image/jpeg" value={frenteCnh} onChange={onFrenteCnhChange} error={errors.frenteCnh} />
      <DocumentUpload label="CNH - Verso" description="Foto nítida do verso da sua CNH" acceptedFiles="image/png,image/jpeg" value={versoCnh} onChange={onVersoCnhChange} error={errors.versoCnh} />
      <DocumentUpload label="Selfie com a CNH" description="Selfie segurando a CNH ao lado do rosto" acceptedFiles="image/png,image/jpeg" value={selfieCnh} onChange={onSelfieCnhChange} error={errors.selfieCnh} />
      <DocumentUpload label="CRLV" description="Certificado de Registro e Licenciamento do Veículo" acceptedFiles="image/png,image/jpeg,.pdf" value={crlv} onChange={onCrlvChange} error={errors.crlv} />
      <DocumentUpload label="Antecedentes Criminais (opcional)" description="Acelera a aprovação" acceptedFiles="image/png,image/jpeg,.pdf" value={certidaoAntecedentes} onChange={onCertidaoChange} />

      <div className="border-t border-white/10 pt-3 mt-3">
        <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-1.5">
          <Car size={14} className="text-[#F4D03F]" /> Dados do Veículo
        </h3>
        <div className="space-y-2.5">
          <VehicleField placeholder="Modelo (ex: Toyota Corolla)" value={modeloVeiculo} onChange={onModeloChange} error={errors.modeloVeiculo} />
          <div className="flex gap-2">
            <div className="flex-1"><VehicleField placeholder="Placa" value={placaVeiculo} onChange={(v: any) => onPlacaChange(v.toUpperCase())} error={errors.placaVeiculo} /></div>
            <div className="w-20"><VehicleField placeholder="Ano" value={anoVeiculo} onChange={(v: any) => onAnoChange(v.replace(/\D/g, '').slice(0, 4))} maxLength={4} error={errors.anoVeiculo} /></div>
          </div>
          <VehicleField placeholder="Cor do veículo" value={corVeiculo} onChange={onCorChange} error={errors.corVeiculo} />
        </div>
      </div>
    </div>
  );
}

function VehicleField({ placeholder, value, onChange, maxLength, error }: any) {
  return (
    <div>
      <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
        <Car size={14} className="text-[#F4D03F] shrink-0" />
        <input type="text" placeholder={placeholder}
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} />
        {value && !error && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      {error && <p className="text-red-400 text-[10px] mt-0.5 ml-2">{error}</p>}
    </div>
  );
}