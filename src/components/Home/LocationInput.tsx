import { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Edit2, Check } from 'lucide-react';

interface LocationInputProps {
  type: 'origem' | 'destino';
  value: string;
  editing: boolean;
  placeholder: string;
  loading?: boolean;
  onEditToggle: () => void;
  onConfirm: () => void;
  onChange: (value: string) => void;
  onFocus: () => void;
  onBlur: () => void;
  sugestoes: any[];
  showSugestoes: boolean;
  onSelectSugestao: (sugestao: any) => void;
}

export function LocationInput({
  type,
  value,
  editing,
  placeholder,
  loading = false,
  onEditToggle,
  onConfirm,
  onChange,
  onFocus,
  onBlur,
  sugestoes,
  showSugestoes,
  onSelectSugestao,
}: LocationInputProps) {
  const isOrigem = type === 'origem';
  const autocompleteRef = useRef<HTMLInputElement>(null);
  const [autocompleteInstance, setAutocompleteInstance] = useState<any>(null);
  const autocompleteInitRef = useRef(false);

  // Inicializar Google Places Autocomplete no campo Destino
  useEffect(() => {
    if (type !== 'destino') return;
    if (!window.google?.maps?.places || !autocompleteRef.current) return;
    if (autocompleteInitRef.current) return;

    try {
      autocompleteInitRef.current = true;

      const autocomplete = new window.google.maps.places.Autocomplete(autocompleteRef.current, {
        types: ['geocode', 'establishment'],
        componentRestrictions: { country: 'br' },
        fields: ['formatted_address', 'geometry', 'name'],
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place?.formatted_address) {
          onChange(place.formatted_address);
          onConfirm();
        }
      });

      setAutocompleteInstance(autocomplete);
    } catch (err) {
      console.warn('Erro ao criar Autocomplete Places:', err);
    }
  }, [type, onChange, onConfirm]);

  return (
    <div className="mb-2 relative z-20">
      <label className="text-[10px] text-[#A0A0B0] mb-1 flex items-center gap-1">
        {isOrigem ? (
          <MapPin size={10} className="text-green-400" />
        ) : (
          <Navigation size={10} className="text-red-400" />
        )}
        {isOrigem ? 'ONDE VOCÊ ESTÁ?' : 'PARA ONDE VOCÊ VAI?'}
      </label>
      <div className="relative">
        {/* Fundo escuro SÓLIDO para evitar vazamento do mapa */}
        <div className={`flex items-center gap-2 bg-[#0F0B1A] border ${editing ? 'border-[#F4D03F] ring-2 ring-[#F4D03F]/20' : 'border-white/10'} rounded-2xl px-4 py-2.5 transition-all`}>
          {isOrigem ? (
            <MapPin size={16} className="text-green-400 shrink-0" />
          ) : (
            <Navigation size={16} className="text-red-400 shrink-0" />
          )}
          <input
            ref={type === 'destino' ? autocompleteRef : undefined}
            type="text"
            placeholder={loading ? 'Buscando endereço...' : placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={onFocus}
            onBlur={onBlur}
            className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
            autoComplete="off"
            readOnly={!editing}
          />
          {editing ? (
            <button
              onClick={onConfirm}
              className="bg-[#22C55E] text-white p-1 rounded-xl hover:bg-[#16A34A] transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Check size={12} /> OK
            </button>
          ) : (
            <button
              onClick={onEditToggle}
              className="bg-white/10 text-white p-1 rounded-xl hover:bg-white/20 transition flex items-center gap-1 text-[10px] font-medium px-2.5 shrink-0"
            >
              <Edit2 size={12} /> Editar
            </button>
          )}
        </div>

        {/* Sugestões dropdown */}
        {showSugestoes && sugestoes.length > 0 && (
          <div className="absolute z-50 mt-1 w-full bg-[#1A1528] border border-white/10 rounded-2xl shadow-xl max-h-48 overflow-y-auto">
            {sugestoes.map((s: any) => (
              <button
                key={s.place_id}
                onMouseDown={() => onSelectSugestao(s)}
                className="w-full text-left px-4 py-2.5 text-white text-sm hover:bg-white/5 transition border-b border-white/5 last:border-0 flex items-center gap-3"
              >
                <MapPin size={14} className="text-[#A0A0B0] shrink-0" />
                <span className="truncate">{s.description}</span>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}