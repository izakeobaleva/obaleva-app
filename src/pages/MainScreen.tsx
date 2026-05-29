import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Toaster, toast } from 'sonner';
import { MapPin, Navigation, Car } from 'lucide-react';

// ============================================
// TELA PRINCIPAL - IGUAL ÀS IMAGENS
// SEM BARRAS DE ROLAGEM
// ============================================

export const MainScreen = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [origin, setOrigin] = useState('R. Santo Antônio, 1091 - Bela Vís');
  const [destination, setDestination] = useState('');
  const [isRequesting, setIsRequesting] = useState(false);

  const handleRequestRide = () => {
    if (!destination) {
      toast.error('Digite um destino');
      return;
    }
    setIsRequesting(true);
    setTimeout(() => {
      toast.success('Procurando motorista...');
      setIsRequesting(false);
    }, 2000);
  };

  return (
    // CONTAINER PRINCIPAL - SEM ROLAGEM
    <div className="fixed inset-0 bg-gray-900 flex flex-col overflow-hidden">
      <Toaster position="top-center" richColors />
      
      {/* ========================================== */}
      {/* TOPO - Logo e nome do app */}
      {/* ========================================== */}
      <div className="flex-shrink-0 pt-8 pb-4 px-4">
        <div className="flex items-center justify-center gap-2">
          <div className="w-10 h-10 bg-yellow-400 rounded-xl flex items-center justify-center">
            <Car className="w-6 h-6 text-gray-900" />
          </div>
          <h1 className="text-2xl font-bold text-yellow-400">ObaLeva</h1>
        </div>
      </div>

      {/* ========================================== */}
      {/* ÁREA DO MAPA (simulada por enquanto) */}
      {/* ========================================== */}
      <div className="flex-1 mx-4 mb-4 rounded-2xl overflow-hidden relative bg-gray-800">
        {/* Mapa mockado (igual à imagem) */}
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🗺️</span>
            </div>
            <p className="text-gray-400 text-sm">Mapa indisponível</p>
            <p className="text-gray-500 text-xs mt-1">📞 -23.5543, -46.6475</p>
          </div>
        </div>
        
        {/* Marcador de localização simulado */}
        <div className="absolute bottom-4 right-4 bg-gray-900/80 rounded-full p-2">
          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
        </div>
      </div>

      {/* ========================================== */}
      {/* ORIGEM + DESTINO */}
      {/* ========================================== */}
      <div className="flex-shrink-0 bg-gray-800 mx-4 rounded-2xl p-4 space-y-4">
        
        {/* ONDE VOCÊ ESTÁ? */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <MapPin className="w-4 h-4 text-green-400" />
            <span className="text-xs text-gray-400 font-medium">ONDE VOCÊ ESTÁ?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-700 rounded-xl px-3 py-2">
            <span className="text-sm text-white truncate flex-1">{origin}</span>
            <button className="text-xs text-yellow-400 font-medium ml-2">[Editar]</button>
          </div>
        </div>

        {/* PARA ONDE VOCÊ VAI? */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Navigation className="w-4 h-4 text-red-400" />
            <span className="text-xs text-gray-400 font-medium">PARA ONDE VOCÊ VAI?</span>
          </div>
          <div className="flex items-center justify-between bg-gray-700 rounded-xl px-3 py-2">
            <input
              type="text"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder="Para onde vai?"
              className="flex-1 bg-transparent text-sm text-white outline-none"
            />
            <button className="text-xs text-yellow-400 font-medium ml-2">[Editar]</button>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTÃO CHAMAR OBALEVÁ */}
      {/* ========================================== */}
      <div className="flex-shrink-0 p-4">
        <button
          onClick={handleRequestRide}
          disabled={isRequesting}
          className={`
            w-full py-4 rounded-2xl font-bold text-lg transition-all
            ${!isRequesting 
              ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300 active:scale-95' 
              : 'bg-gray-700 text-gray-400 cursor-not-allowed'}
          `}
        >
          {isRequesting ? 'Procurando...' : 'Chamar ObaLeva'}
        </button>
      </div>

      {/* ESPAÇO PARA A BARRA INFERIOR (simulando navegação) */}
      <div className="flex-shrink-0 h-16" />
    </div>
  );
};

export default MainScreen;