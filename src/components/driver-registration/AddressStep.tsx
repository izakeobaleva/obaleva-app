import { MapPin, Home } from 'lucide-react';

interface AddressStepProps {
  cep: string; logradouro: string; numero: string; complemento: string;
  bairro: string; cidade: string; estado: string;
  onCepChange: (v: string) => void; onLogradouroChange: (v: string) => void;
  onNumeroChange: (v: string) => void; onComplementoChange: (v: string) => void;
  onBairroChange: (v: string) => void; onCidadeChange: (v: string) => void;
  onEstadoChange: (v: string) => void;
  buscarCep: (cep: string) => void; formatarCep: (v: string) => string;
  errors?: Record<string, string>;
}

export function AddressStep({
  cep, logradouro, numero, complemento, bairro, cidade, estado,
  onCepChange, onLogradouroChange, onNumeroChange, onComplementoChange,
  onBairroChange, onCidadeChange, onEstadoChange,
  buscarCep, formatarCep, errors = {}
}: AddressStepProps) {
  return (
    <div className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <MapPin size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Endereço</h2>
      </div>

      <InputField icon={MapPin} placeholder="CEP" value={cep} onChange={(v) => { const f = formatarCep(v); onCepChange(f); if (v.replace(/\D/g, '').length === 8) buscarCep(v); }} maxLength={9} error={errors.cep} />

      <div className="flex gap-2">
        <div className="flex-1"><InputField icon={Home} placeholder="Logradouro" autoComplete="street-address" value={logradouro} onChange={onLogradouroChange} error={errors.logradouro} /></div>
        <div className="w-20"><InputField icon={Home} placeholder="Nº" value={numero} onChange={onNumeroChange} error={errors.numero} /></div>
      </div>

      <InputField icon={Home} placeholder="Complemento (opcional)" value={complemento} onChange={onComplementoChange} />
      <InputField icon={MapPin} placeholder="Bairro" value={bairro} onChange={onBairroChange} error={errors.bairro} />

      <div className="flex gap-2">
        <div className="flex-[2]"><InputField icon={MapPin} placeholder="Cidade" autoComplete="address-level2" value={cidade} onChange={onCidadeChange} error={errors.cidade} /></div>
        <div className="w-16"><InputField icon={MapPin} placeholder="UF" autoComplete="address-level1" value={estado} onChange={(v) => onEstadoChange(v.toUpperCase().slice(0, 2))} maxLength={2} error={errors.estado} /></div>
      </div>
    </div>
  );
}

function InputField({ icon: Icon, placeholder, autoComplete, type = 'text', value, onChange, maxLength, error }: any) {
  return (
    <div>
      <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${error ? 'border-red-500/50' : 'border-white/10'} rounded-2xl px-3 py-2.5 focus-within:ring-2 focus-within:ring-[#F4D03F]`}>
        <Icon size={14} className="text-[#F4D03F] shrink-0" />
        <input type={type} placeholder={placeholder} autoComplete={autoComplete}
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} />
        {value && !error && <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#22C55E" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>}
      </div>
      {error && <p className="text-red-400 text-[10px] mt-0.5 ml-2">{error}</p>}
    </div>
  );
}