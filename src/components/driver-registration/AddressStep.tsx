import { MapPin, Home } from 'lucide-react';

interface AddressStepProps {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
  estado: string;
  onCepChange: (value: string) => void;
  onLogradouroChange: (value: string) => void;
  onNumeroChange: (value: string) => void;
  onComplementoChange: (value: string) => void;
  onBairroChange: (value: string) => void;
  onCidadeChange: (value: string) => void;
  onEstadoChange: (value: string) => void;
  buscarCep: (cep: string) => void;
  formatarCep: (value: string) => string;
}

export function AddressStep({
  cep,
  logradouro,
  numero,
  complemento,
  bairro,
  cidade,
  estado,
  onCepChange,
  onLogradouroChange,
  onNumeroChange,
  onComplementoChange,
  onBairroChange,
  onCidadeChange,
  onEstadoChange,
  buscarCep,
  formatarCep,
}: AddressStepProps) {
  return (
    <div className="space-y-2.5">
      <div className="text-center mb-3">
        <div className="w-10 h-10 bg-[#F4D03F]/20 rounded-2xl flex items-center justify-center mx-auto mb-1">
          <MapPin size={20} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-sm text-white font-bold">Endereço</h2>
      </div>

      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <MapPin size={14} className="text-[#F4D03F] shrink-0" />
        <input
          type="text"
          placeholder="CEP"
          autoComplete="postal-code"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={cep}
          onChange={(e) => {
            const formatted = formatarCep(e.target.value);
            onCepChange(formatted);
            if (e.target.value.replace(/\D/g, '').length === 8) buscarCep(e.target.value);
          }}
          required
          maxLength={9}
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <Home size={14} className="text-[#F4D03F] shrink-0" />
          <input
            type="text"
            placeholder="Logradouro"
            autoComplete="street-address"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
            value={logradouro}
            onChange={(e) => onLogradouroChange(e.target.value)}
            required
          />
        </div>
        <div className="w-16 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <input
            type="text"
            placeholder="Nº"
            autoComplete="address-line2"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
            value={numero}
            onChange={(e) => onNumeroChange(e.target.value)}
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <Home size={14} className="text-[#F4D03F] shrink-0" />
        <input
          type="text"
          placeholder="Complemento (opcional)"
          autoComplete="address-line3"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={complemento}
          onChange={(e) => onComplementoChange(e.target.value)}
        />
      </div>

      <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
        <MapPin size={14} className="text-[#F4D03F] shrink-0" />
        <input
          type="text"
          placeholder="Bairro"
          autoComplete="address-level4"
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
          value={bairro}
          onChange={(e) => onBairroChange(e.target.value)}
          required
        />
      </div>

      <div className="flex gap-2">
        <div className="flex-1 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <MapPin size={14} className="text-[#F4D03F] shrink-0" />
          <input
            type="text"
            placeholder="Cidade"
            autoComplete="address-level2"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs"
            value={cidade}
            onChange={(e) => onCidadeChange(e.target.value)}
            required
          />
        </div>
        <div className="w-14 flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-3 py-2.5">
          <input
            type="text"
            placeholder="UF"
            autoComplete="address-level1"
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-xs uppercase"
            value={estado}
            onChange={(e) => onEstadoChange(e.target.value.toUpperCase().slice(0, 2))}
            required
            maxLength={2}
          />
        </div>
      </div>
    </div>
  );
}