import { useState } from 'react';
import { Car, MapPin } from 'lucide-react';
import MapComponent from '../components/MapComponent';

interface HomeScreenProps {
  user: any;
  onSignOut: () => void;
}

export function HomeScreen({ user, onSignOut }: HomeScreenProps) {
  const [destino, setDestino] = useState('');
  const [mensagem, setMensagem] = useState('');

  const handleConfirmar = () => {
    if (!destino.trim()) {
      setMensagem('❌ Digite um destino');
      setTimeout(() => setMensagem(''), 2000);
      return;
    }
    setMensagem(`✅ Corrida para: ${destino}`);
    setTimeout(() => setMensagem(''), 2000);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">ObaLeva</h1>
        </div>
        <button
          onClick={onSignOut}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
        >
          SAIR
        </button>
      </div>

      <div className="h-[200px] rounded-xl overflow-hidden mb-3">
        <MapComponent />
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20">
        <h2 className="text-white font-bold text-lg mb-3 flex items-center gap-2">
          <MapPin size={20} className="text-[#F4D03F]" /> Para onde você vai agora?
        </h2>
        <input
          type="text"
          placeholder="Digite seu destino..."
          className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white outline-none"
          value={destino}
          onChange={(e) => setDestino(e.target.value)}
        />
        <button
          onClick={handleConfirmar}
          className="w-full mt-4 py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
        >
          Chamar ObaLeva
        </button>
        {mensagem && (
          <div className="mt-3 p-2 text-center text-sm text-white bg-green-500/30 rounded">
            {mensagem}
          </div>
        )}
      </div>
    </div>
  );
}