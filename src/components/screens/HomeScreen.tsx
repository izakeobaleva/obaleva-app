import { useState } from 'react';
import { Car, MapPin, ChevronRight } from 'lucide-react';
import MapComponent from '../MapComponent';

interface HomeScreenProps {
  user: any;
  showFullUI: boolean;
  onLogout?: () => void;
}

export function HomeScreen({ user, onLogout, showFullUI }: HomeScreenProps) {
  const [destino, setDestino] = useState('');
  const [origem, setOrigem] = useState(localStorage.getItem('user_address') || 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP');
  const [modoEdicao, setModoEdicao] = useState(false);
  const [enderecoEditado, setEnderecoEditado] = useState(origem);

  const handleChamarObaLeva = () => {
    if (!destino) {
      alert('Digite um destino primeiro!');
      return;
    }
    alert(`🚗 Corrida solicitada de: ${origem}\nPara: ${destino}`);
  };

  return (
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
        <button className="absolute bottom-3 right-3 bg-[#1A1528] rounded-full p-2 shadow-lg border border-[#F4D03F]/30">
          <MapPin size={20} className="text-[#F4D03F]" />
        </button>
      </div>

      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="text-white text-xs font-bold">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex gap-2">
            <button onClick={() => setModoEdicao(!modoEdicao)} className="text-[#F4D03F] text-xs hover:underline">
              {modoEdicao ? 'Cancelar' : '✏️ Editar'}
            </button>
            {modoEdicao && (
              <button onClick={() => { setOrigem(enderecoEditado); setModoEdicao(false); }} className="text-green-400 text-xs hover:underline">
                ✅ Confirmar
              </button>
            )}
          </div>
        </div>
        {modoEdicao ? (
          <input type="text" className="w-full bg-white/10 text-white p-2 rounded-lg outline-none" value={enderecoEditado} onChange={(e) => setEnderecoEditado(e.target.value)} />
        ) : (
          <div className="flex items-center gap-2"><span className="text-white text-sm flex-1">{origem}</span></div>
        )}
      </div>

      {showFullUI && (
        <>
          <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
            <div className="flex items-center gap-2 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-white text-xs font-bold">PARA ONDE VOCÊ VAI?</span>
            </div>
            <input
              type="text"
              placeholder="Digite o endereço ou cidade..."
              className="w-full bg-white/10 text-white p-2 rounded-lg outline-none"
              value={destino}
              onChange={(e) => setDestino(e.target.value)}
            />
          </div>

          <button onClick={handleChamarObaLeva} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3">
            <Car size={18} /> Chamar ObaLeva
          </button>

          <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 flex justify-between items-center">
            <div>
              <div className="flex items-center gap-1">
                <span className="text-2xl">🍔</span>
                <span className="text-white font-bold text-sm">Almoço com até 50% OFF</span>
              </div>
              <p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p>
            </div>
            <ChevronRight size={20} className="text-[#F4D03F]" />
          </div>
        </>
      )}
    </div>
  );
}