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
    <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="bg-[#1A1528] rounded-2xl max-w-md w-full border-2 border-[#F4D03F]/30 shadow-2xl">
        <div className="flex justify-between items-center p-5 border-b border-white/15">
          <h2 className="text-white font-bold text-xl flex items-center gap-2">
            <Car className="text-[#F4D03F]" size={24} />
            Minha Corrida
          </h2>
          <button onClick={onClose} className="text-[#A0A0B0] hover:text-white transition p-1">
            <X size={24} />
          </button>
        </div>

        <div className="p-5">
          <div className="text-center mb-5">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10">
              <div className={`w-2.5 h-2.5 rounded-full animate-pulse ${ride.status === 'buscando_motorista' ? 'bg-yellow-400' : 'bg-green-400'}`} />
              <span className={`text-base font-bold ${getStatusColor()}`}>{getStatusText()}</span>
            </div>
          </div>

          <div className="bg-gradient-to-r from-[#F4D03F]/30 to-[#8B5CF6]/20 rounded-xl p-4 text-center mb-5">
            <p className="text-[#A0A0B0] text-sm mb-1">Valor estimado</p>
            <p className="text-white text-3xl font-extrabold">R$ {ride.valor_total}</p>
          </div>

          <div className="space-y-4 mb-5">
            <div className="flex gap-3">
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 rounded-full bg-green-500" />
                <div className="w-0.5 h-14 bg-gradient-to-b from-green-500 to-red-500 my-1" />
                <div className="w-4 h-4 rounded-full bg-red-500" />
              </div>
              <div className="flex-1">
                <p className="text-white font-bold text-sm">Origem</p>
                <p className="text-[#A0A0B0] text-sm mt-0.5">{ride.origem}</p>
                <p className="text-white font-bold text-sm mt-3">Destino</p>
                <p className="text-[#A0A0B0] text-sm mt-0.5">{ride.destino}</p>
              </div>
              <div className="text-right">
                <p className="text-[#A0A0B0] text-xs">Distância</p>
                <p className="text-white text-base font-bold">{ride.distancia_km?.toFixed(1)} km</p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            {ride.status === 'buscando_motorista' && (
              <button onClick={onCancel} className="flex-1 py-3 rounded-xl bg-red-500/20 border-2 border-red-500 text-red-400 font-bold text-base hover:bg-red-500/30 transition">
                Cancelar Corrida
              </button>
            )}
            {(ride.status === 'motorista_em_rota' || ride.status === 'motorista_chegou') && (
              <>
                <button className="flex-1 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-base flex items-center justify-center gap-2">
                  <Phone size={18} /> Ligar
                </button>
                <button className="flex-1 py-3 rounded-xl bg-white/10 border border-white/15 text-white font-bold text-base flex items-center justify-center gap-2">
                  <MessageCircle size={18} /> Mensagem
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