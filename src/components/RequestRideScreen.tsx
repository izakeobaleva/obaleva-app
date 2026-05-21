import { useState } from 'react';
import { MapPin, Navigation, DollarSign, Car } from 'lucide-react';
import MapComponent from './MapComponent';
import { solicitarCorrida, Location, Ride } from '../services/rideService';
import RideStatusModal from './RideStatusModal';

interface RequestRideScreenProps {
  user: any;
  onBack?: () => void;
}

export function RequestRideScreen({ user }: RequestRideScreenProps) {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<Location | null>(null);
  const [dropoffLocation, setDropoffLocation] = useState<Location | null>(null);
  const [solicitando, setSolicitando] = useState(false);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [precoEstimado, setPrecoEstimado] = useState<number | null>(null);

  const handleLocationSelect = (location: Location) => {
    if (!pickupLocation) {
      setPickupLocation(location);
      setPickupAddress(location.address);
    } else {
      setDropoffLocation(location);
      setDropoffAddress(location.address);
    }
  };

  const handleRequestRide = async () => {
    if (!user) { alert('Faça login para solicitar uma corrida!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('Selecione a origem e o destino no mapa!'); return; }

    setSolicitando(true);
    try {
      const corrida = await solicitarCorrida(user.id, pickupLocation, dropoffLocation);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        setPickupAddress('');
        setDropoffAddress('');
        setPickupLocation(null);
        setDropoffLocation(null);
        setPrecoEstimado(null);
      }
    } catch (error: any) {
      alert('Erro ao solicitar: ' + error.message);
    } finally {
      setSolicitando(false);
    }
  };

  const handleCancelRide = async () => {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) {
        alert('Corrida cancelada');
        setShowRideModal(false);
        setActiveRide(null);
      } else {
        alert('Erro ao cancelar corrida');
      }
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="relative h-[250px] rounded-xl overflow-hidden mb-3 shadow-lg border border-[#F4D03F]/20">
        <MapComponent
          pickupLocation={pickupLocation?.lat ? { lat: pickupLocation.lat, lng: pickupLocation.lng, address: pickupLocation.address } : null}
          dropoffLocation={dropoffLocation?.lat ? { lat: dropoffLocation.lat, lng: dropoffLocation.lng, address: dropoffLocation.address } : null}
          onPickupChange={setPickupAddress}
          onDropoffChange={setDropoffAddress}
          onLocationSelect={handleLocationSelect}
        />
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 mb-3">
        <div className="space-y-3">
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <MapPin size={16} className="text-green-400" />
              <input type="text" placeholder="Onde você está?" className="flex-1 bg-transparent text-white outline-none text-sm" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
            </div>
          </div>
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-3 py-2.5">
              <Navigation size={16} className="text-red-400" />
              <input type="text" placeholder="Para onde vai?" className="flex-1 bg-transparent text-white outline-none text-sm" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} />
            </div>
          </div>
        </div>
      </div>

      {precoEstimado && (
        <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <DollarSign size={18} className="text-[#F4D03F]" />
            <span className="text-white font-bold">R$ {precoEstimado.toFixed(2)}</span>
          </div>
          <span className="text-[#A0A0B0] text-xs">~{Math.round(precoEstimado * 5)} min</span>
        </div>
      )}

      <button
        onClick={handleRequestRide}
        disabled={solicitando || !pickupLocation || !dropoffLocation}
        className={`w-full py-3.5 rounded-xl font-bold text-base flex items-center justify-center gap-2 transition-all ${
          solicitando || !pickupLocation || !dropoffLocation
            ? 'bg-white/10 text-[#A0A0B0] cursor-not-allowed'
            : 'bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1E1E2F] hover:scale-[1.02] shadow-lg'
        }`}
      >
        {solicitando ? (
          <><div className="animate-spin h-5 w-5 border-2 border-[#1E1E2F] border-t-transparent rounded-full" /> Buscando motorista...</>
        ) : (
          <><Car size={20} /> SOLICITAR CORRIDA</>
        )}
      </button>

      {showRideModal && activeRide && (
        <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />
      )}
    </div>
  );
}

// Import needed
import { cancelarCorrida } from '../services/rideService';