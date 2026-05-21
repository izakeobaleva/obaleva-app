import { useEffect, useState } from 'react';
import { Car, MapPin, DollarSign, Clock, Navigation, X, CheckCircle, User } from 'lucide-react';
import { Ride, subscribeToRide, subscribeToMotoristaLocation, cancelarCorrida } from '../services/rideService';

interface RideStatusModalProps {
  ride: Ride;
  onClose: () => void;
  onCancel: () => void;
}

const statusConfig: Record<string, { label: string; color: string; icon: any; message: string }> = {
  buscando_motorista: { label: 'Buscando motorista...', color: '#F4D03F', icon: Clock, message: 'Aguardando um motorista aceitar sua corrida' },
  motorista_em_rota: { label: 'Motorista a caminho', color: '#22C55E', icon: Navigation, message: 'Seu motorista está vindo até você!' },
  motorista_chegou: { label: 'Motorista chegou', color: '#3B82F6', icon: MapPin, message: 'O motorista está no local de partida' },
  em_andamento: { label: 'Em andamento', color: '#A855F7', icon: Car, message: 'Você está a caminho do seu destino' },
  finalizada: { label: 'Corrida finalizada', color: '#22C55E', icon: CheckCircle, message: 'Você chegou ao seu destino!' },
  cancelada: { label: 'Corrida cancelada', color: '#EF4444', icon: X, message: 'Esta corrida foi cancelada' },
};

export default function RideStatusModal({ ride, onClose, onCancel }: RideStatusModalProps) {
  const [currentRide, setCurrentRide] = useState<Ride>(ride);
  const [driverLocation, setDriverLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);

  useEffect(() => {
    const sub = subscribeToRide(ride.id, (updatedRide) => {
      setCurrentRide(updatedRide);
      if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
        setTimeout(() => { onClose(); }, 3000);
      }
    });

    // Se já tem motorista, assinar localização
    if (ride.motorista_id) {
      const locSub = subscribeToMotoristaLocation(ride.motorista_id, (lat, lng) => {
        setDriverLocation({ lat, lng });
      });
      return () => { sub.unsubscribe(); locSub.unsubscribe(); };
    }

    return () => sub.unsubscribe();
  }, [ride.id]);

  // Timer para contar tempo decorrido
  useEffect(() => {
    const interval = setInterval(() => setTempoDecorrido(prev => prev + 1), 1000);
    return () => clearInterval(interval);
  }, []);

  const config = statusConfig[currentRide.status] || statusConfig.buscando_motorista;
  const IconComponent = config.icon;
  const podeCancelar = ['buscando_motorista', 'motorista_em_rota'].includes(currentRide.status);
  
  const formatTime = (seconds: number) => {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
      <div className="bg-[#1A1528] rounded-2xl max-w-md w-full border border-[#F4D03F]/20 shadow-2xl overflow-hidden">
        <div className="relative h-[200px] bg-gradient-to-br from-[#1A1528] to-[#2D2342] flex items-center justify-center">
          <IconComponent size={48} style={{ color: config.color }} className={currentRide.status === 'buscando_motorista' ? 'animate-pulse' : ''} />
          <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md rounded-lg px-3 py-1">
            <span className="text-white text-xs font-bold">{config.label}</span>
          </div>
          <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md rounded-lg px-3 py-1">
            <span className="text-[#F4D03F] text-xs font-bold">{formatTime(tempoDecorrido)}</span>
          </div>
        </div>

        <div className="p-5 space-y-4">
          <p className="text-[#A0A0B0] text-sm text-center">{config.message}</p>

          {/* Informações da corrida */}
          <div className="bg-[#0F0B1A] rounded-xl p-4 space-y-2 border border-white/10">
            <div className="flex items-center gap-2">
              <MapPin size={14} className="text-green-400" />
              <span className="text-white text-sm">{currentRide.origem}</span>
            </div>
            <div className="flex items-center gap-2">
              <Navigation size={14} className="text-red-400" />
              <span className="text-white text-sm">{currentRide.destino}</span>
            </div>
            <div className="flex justify-between pt-2 border-t border-white/10">
              <div className="flex items-center gap-1">
                <DollarSign size={16} className="text-[#F4D03F]" />
                <span className="text-white font-bold">R$ {currentRide.valor_total?.toFixed(2)}</span>
              </div>
              <div className="flex items-center gap-1">
                <Clock size={14} className="text-[#A0A0B0]" />
                <span className="text-[#A0A0B0] text-sm">{currentRide.distancia_km?.toFixed(1)} km</span>
              </div>
            </div>
          </div>

          {/* Localização do motorista (se disponível) */}
          {currentRide.motorista_id && driverLocation && (
            <div className="bg-[#0F0B1A] rounded-xl p-3 border border-green-500/30">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-400 text-sm font-medium">
                  Motorista a {driverLocation ? `${Math.round(Math.random() * 5 + 1)} km` : '...'}
                </span>
              </div>
            </div>
          )}

          {/* Botões de ação */}
          {currentRide.status === 'finalizada' && (
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-black font-bold">
              ✅ Fechar
            </button>
          )}

          {currentRide.status === 'cancelada' && (
            <button onClick={onClose} className="w-full py-3 rounded-xl bg-white/10 text-white font-bold">
              Fechar
            </button>
          )}

          {podeCancelar && (
            <button onClick={onCancel} className="w-full py-3 rounded-xl border border-red-500/30 text-red-400 font-bold">
              Cancelar corrida
            </button>
          )}
        </div>
      </div>
    </div>
  );
}