import { useEffect, useState } from 'react';
import { Car, MapPin, DollarSign, Clock, Navigation, X, CheckCircle } from 'lucide-react';
import { Ride, subscribeToRide } from '../services/rideService';

interface RideStatusModalProps {
  ride: Ride;
  onClose: () => void;
  onCancel: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: any; message: string }> = {
  buscando_motorista: { label: 'Buscando motorista...', color: '#F4D03F', icon: Clock, message: 'Aguardando um motorista aceitar sua corrida' },
  motorista_em_rota: { label: 'Motorista a caminho', color: '#22C55E', icon: Car, message: 'O motorista está indo até você' },
  motorista_chegou: { label: 'Motorista chegou', color: '#3B82F6', icon: MapPin, message: 'O motorista chegou ao local' },
  em_andamento: { label: 'Em andamento', color: '#A855F7', icon: Navigation, message: 'Você está a caminho do destino' },
  finalizada: { label: 'Corrida finalizada', color: '#22C55E', icon: CheckCircle, message: 'Você chegou ao seu destino!' },
  cancelada: { label: 'Corrida cancelada', color: '#EF4444', icon: X, message: 'Esta corrida foi cancelada' },
};

export default function RideStatusModal({ ride, onClose, onCancel }: RideStatusModalProps) {
  const [currentRide, setCurrentRide] = useState<Ride>(ride);

  useEffect(() => {
    const subscription = subscribeToRide(ride.id, (updatedRide) => {
      setCurrentRide(updatedRide);
    });
    return () => subscription.unsubscribe();
  }, [ride.id]);

  const config = statusConfig[currentRide.status] || statusConfig.buscando_motorista;
  const IconComponent = config.icon;
  const isFinalizada = currentRide.status === 'finalizada';
  const isCancelada = currentRide.status === 'cancelada';
  const podeCancelar = ['buscando_motorista'].includes(currentRide.status);

  return (
    <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1528] rounded-2xl max-w-md w-full border border-[#F4D03F]/20 shadow-2xl overflow-hidden">
        <div className="p-6 text-center">
          <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center mb-4" style={{ backgroundColor: `${config.color}20` }}>
            <IconComponent size={40} style={{ color: config.color }} className={currentRide.status === 'buscando_motorista' ? 'animate-pulse' : ''} />
          </div>

          <h2 className="text-white text-xl font-bold mb-1">{config.label}</h2>
          <p className="text-[#A0A0B0] text-sm">{config.message}</p>

          <div className="bg-[#0F0B1A] rounded-xl p-4 mt-5 space-y-3 border border-white/10">
            <div className="flex items-center gap-3">
              <MapPin size={16} className="text-green-400 shrink-0" />
              <div className="text-left">
                <p className="text-[#A0A0B0] text-xs">Origem</p>
                <p className="text-white text-sm">{currentRide.origem}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Navigation size={16} className="text-red-400 shrink-0" />
              <div className="text-left">
                <p className="text-[#A0A0B0] text-xs">Destino</p>
                <p className="text-white text-sm">{currentRide.destino}</p>
              </div>
            </div>
            <div className="border-t border-white/10 pt-3 flex justify-between">
              <div className="flex items-center gap-2">
                <DollarSign size={16} className="text-[#F4D03F]" />
                <span className="text-white font-bold">R$ {currentRide.valor_total?.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock size={16} className="text-[#A0A0B0]" />
                <span className="text-[#A0A0B0] text-sm">{currentRide.distancia_km?.toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {podeCancelar && (
            <button onClick={onCancel} className="mt-5 w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-bold hover:bg-red-500/10 transition">
              Cancelar corrida
            </button>
          )}

          {isFinalizada && (
            <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] font-bold">
              Fechar
            </button>
          )}

          {isCancelada && (
            <button onClick={onClose} className="mt-5 w-full py-3 rounded-xl bg-white/10 text-white font-bold">
              Fechar
            </button>
          )}
        </div>
      </div>
    </div>
  );
}