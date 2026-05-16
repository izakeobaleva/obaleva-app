import React from 'react';
import { Car, MapPin, Navigation, Clock, X, Phone, MessageCircle } from 'lucide-react';
import { Ride } from '../services/rideService';

interface RideStatusModalProps {
  ride: Ride | null;
  onClose: () => void;
  onCancel: () => void;
}

const RideStatusModal: React.FC<RideStatusModalProps> = ({ ride, onClose, onCancel }) => {
  if (!ride) return null;

  const getStatusText = () => {
    switch (ride.status) {
      case 'buscando_motorista': return 'Buscando motorista...';
      case 'motorista_em_rota': return 'Motorista a caminho';
      case 'motorista_chegou': return 'Motorista chegou!';
      case 'em_andamento': return 'Corrida em andamento';
      case 'finalizada': return 'Corrida finalizada';
      default: return 'Aguardando';
    }
  };

  const getStatusColor = () => {
    switch (ride.status) {
      case 'buscando_motorista': return 'text-yellow-400';
      case 'motorista_em_rota': return 'text-blue-400';
      case 'motorista_chegou': return 'text-green-400';
      case 'em_andamento': return 'text-purple-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1528] rounded-2xl max-w-md w-full border border-[#F4D03F]/20 shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Car className="text-[#F4D03F]" size={20} />
            Sua Corrida
          </h2>
          <button onClick={onClose} className="text-[#A0A0B0] hover:text-white transition">
            <X size={20} />
          </button>
        </div>

        {/* Status */}
        <div className="p-4">
          <div className="text-center mb-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5">
              <div className={`w-2 h-2 rounded-full animate-pulse ${ride.status === 'buscando_motorista' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <span className={`text-sm font-medium ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
          </div>

          {/* Valor */}
          <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 text-center mb-4">
            <p className="text-[#A0A0B0] text-xs">Valor estimado</p>
            <p className="text-white text-2xl font-bold">R$ {ride.valor_total}</p>
          </div>

          {/* Rotas */}
          <div className="space-y-3 mb-4">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <div className="w-0.5 h-10 bg-gradient-to-b from-green-500 to-red-500 mt-1" />
                <div className="w-3 h-3 rounded-full bg-red-500 mt-1" />
              </div>
              <div className="flex-1">
                <p className="text-white text-xs font-medium">Origem</p>
                <p className="text-[#A0A0B0] text-xs">{ride.origem}</p>
                <p className="text-white text-xs font-medium mt-2">Destino</p>
                <p className="text-[#A0A0B0] text-xs">{ride.destino}</p>
              </div>
              <div className="text-right">
                <p className="text-[#A0A0B0] text-[10px]">Distância</p>
                <p className="text-white text-xs font-bold">{ride.distancia_km?.toFixed(1)} km</p>
              </div>
            </div>
          </div>

          {/* Botões de ação */}
          <div className="flex gap-2">
            {ride.status === 'buscando_motorista' && (
              <button
                onClick={onCancel}
                className="flex-1 py-2 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-medium text-sm hover:bg-red-500/30 transition"
              >
                Cancelar
              </button>
            )}
            {(ride.status === 'motorista_em_rota' || ride.status === 'motorista_chegou') && (
              <>
                <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2">
                  <Phone size={14} /> Ligar
                </button>
                <button className="flex-1 py-2 rounded-xl bg-white/5 border border-white/10 text-white font-medium text-sm flex items-center justify-center gap-2">
                  <MessageCircle size={14} /> Mensagem
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RideStatusModal;