import { useState, useEffect, useRef } from 'react';
import { Car, ChevronRight } from 'lucide-react';
import MapComponent from '../MapComponent';

interface HomeScreenProps {
  user?: any;
  onLogout?: () => void;
  showFullUI?: boolean;
}

export function HomeScreen({ user, onLogout, showFullUI }: HomeScreenProps) {
  const [destino, setDestino] = useState('');
  const [origem, setOrigem] = useState(localStorage.getItem('user_address') || 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP');
  const [modoEdicaoOrigem, setModoEdicaoOrigem] = useState(false);
  const [modoEdicaoDestino, setModoEdicaoDestino] = useState(false);
  const [enderecoEditadoOrigem, setEnderecoEditadoOrigem] = useState(origem);
  const [enderecoEditadoDestino, setEnderecoEditadoDestino] = useState(destino);

  const origemInputRef = useRef<HTMLInputElement>(null);
  const destinoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const checkGoogleMaps = setInterval(() => {
      if (window.google && window.google.maps && window.google.maps.places) {
        clearInterval(checkGoogleMaps);
        if (origemInputRef.current) {
          new window.google.maps.places.Autocomplete(origemInputRef.current, { fields: ['formatted_address'] });
        }
        if (destinoInputRef.current) {
          new window.google.maps.places.Autocomplete(destinoInputRef.current, { fields: ['formatted_address'] });
        }
      }
    }, 100);
    return () => clearInterval(checkGoogleMaps);
  }, []);

  const handleChamarObaLeva = () => {
    if (!destino) {
      alert('Digite um destino primeiro!');
      return;
    }
    alert(`🚗 Corrida solicitada de: ${origem}\nPara: ${destino}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24">
        <div className="flex justify-between items-center py-3">
          <h1 className="text-xl font-bold text-white">ObaLeva</h1>
          {showFullUI && (
            <div className="flex items-center gap-3">
              <button className="text-[#A0A0B0] text-xs">Mudar passageiro</button>
              {onLogout && (
                <button onClick={onLogout} className="text-red-400 text-xs font-bold">SAIR</button>
              )}
            </div>
          )}
        </div>

        <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
          <MapComponent />
        </div>

        <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500" />
              <span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span>
            </div>
            <button onClick={() => setModoEdicaoOrigem(!modoEdicaoOrigem)} className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1">
              {modoEdicaoOrigem ? '❌ Cancelar' : '✏️ Editar'}
            </button>
          </div>
          {modoEdicaoOrigem ? (
            <div className="flex gap-2">
              <input ref={origemInputRef} type="text" className="flex-1 bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={enderecoEditadoOrigem} onChange={(e) => setEnderecoEditadoOrigem(e.target.value)} />
              <button onClick={() => { setOrigem(enderecoEditadoOrigem); setModoEdicaoOrigem(false); localStorage.setItem('user_address', enderecoEditadoOrigem); }} className="px-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold">✅</button>
            </div>
          ) : (
            <div className="flex items-center gap-2"><span className="text-white text-sm flex-1">{origem}</span></div>
          )}
        </div>

        {showFullUI && (
          <>
            <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500" /><span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span></div>
                <button onClick={() => setModoEdicaoDestino(!modoEdicaoDestino)} className="text-[#F4D03F] text-xs hover:underline flex items-center gap-1">{modoEdicaoDestino ? '❌ Cancelar' : '✏️ Editar'}</button>
              </div>
              {modoEdicaoDestino ? (
                <div className="flex gap-2"><input ref={destinoInputRef} type="text" placeholder="Digite o endereço ou cidade..." className="flex-1 bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={enderecoEditadoDestino} onChange={(e) => setEnderecoEditadoDestino(e.target.value)} /><button onClick={() => { setDestino(enderecoEditadoDestino); setModoEdicaoDestino(false); }} className="px-3 bg-green-500/20 text-green-400 rounded-lg text-sm font-bold">✅</button></div>
              ) : (
                <input ref={destinoInputRef} type="text" placeholder="Digite o endereço ou cidade..." className="w-full bg-white/10 text-white p-2 rounded-lg outline-none text-sm" value={destino} onChange={(e) => setDestino(e.target.value)} />
              )}
            </div>
            <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"><Car size={18} /> Chamar ObaLeva</button>
            <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center">
              <div><div className="flex items-center gap-1"><span className="text-2xl">🍔</span><span className="text-white font-bold text-sm">Almoço com até 50% OFF</span></div><p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p></div>
              <ChevronRight size={20} className="text-[#F4D03F]" />
            </div>
          </>
        )}
      </div>
    </div>
  );
}