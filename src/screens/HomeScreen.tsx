import React, { useState, useRef, useEffect } from 'react';
import { Car, LogOut, Map, ArrowRight } from 'lucide-react';
import MapComponent from '../components/MapComponent';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from '../components/RideStatusModal';
import RotatingBanner from '../components/RotatingBanner';

interface HomeScreenProps {
  user: any;
  onSignOut: () => void;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ user, onSignOut }) => {
  const [pickupAddress, setPickupAddress] = useState('');
  const [dropoffAddress, setDropoffAddress] = useState('');
  const [pickupLocation, setPickupLocation] = useState<any>(null);
  const [dropoffLocation, setDropoffLocation] = useState<any>(null);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [showRideModal, setShowRideModal] = useState(false);
  const [solicitando, setSolicitando] = useState(false);
  const subscriptionRef = useRef<any>(null);

  async function carregarCorridaAtiva() {
    if (user?.id) {
      const corrida = await buscarCorridaAtiva(user.id);
      if (corrida) {
        setActiveRide(corrida);
        setShowRideModal(true);
        subscriptionRef.current = subscribeToRide(corrida.id, (updatedRide) => {
          setActiveRide(updatedRide);
          if (updatedRide.status === 'finalizada' || updatedRide.status === 'cancelada') {
            setTimeout(() => { setShowRideModal(false); setActiveRide(null); }, 3000);
          }
        });
      }
    }
  }

  useEffect(() => {
    if (user?.id) carregarCorridaAtiva();
    return () => { if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); };
  }, [user]);

  const handleRequestRide = async () => {
    if (!user) { alert('🔐 Faça login para solicitar uma corrida!'); return; }
    if (!pickupLocation || !dropoffLocation) { alert('📍 Selecione a origem e destino no mapa!'); return; }
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
        alert('🚗 Corrida solicitada! Buscando motorista...');
      }
    } catch (error: any) { alert('❌ Erro: ' + error.message); } 
    finally { setSolicitando(false); }
  };

  async function handleCancelRide() {
    if (activeRide) {
      const success = await cancelarCorrida(activeRide.id);
      if (success) { alert('✅ Corrida cancelada'); setShowRideModal(false); setActiveRide(null); if (subscriptionRef.current) subscriptionRef.current.unsubscribe(); } 
      else { alert('❌ Erro ao cancelar corrida'); }
    }
  }

  const LocationInputs = ({ pickupAddress, setPickupAddress, dropoffAddress, setDropoffAddress, disabled }: any) => (
    <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 shadow-lg">
      <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
        <Map size={16} className="text-[#F4D03F]" />
        <span className="text-white font-bold text-sm">Definir sua rota</span>
      </div>
      <div className="bg-white/10 rounded-xl border border-white/15 mb-2">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
          <input type="text" placeholder="Digite onde você está..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} disabled={disabled} />
        </div>
      </div>
      <div className="bg-white/10 rounded-xl border border-white/15">
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="w-3 h-3 rounded-full bg-red-500" />
          <input type="text" placeholder="Digite seu destino..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} disabled={disabled} />
        </div>
      </div>
      <button onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} className="mt-3 w-full text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition py-1.5 font-medium">🔄 Inverter origem e destino</button>
    </div>
  );

  const ActionButton = ({ onRequestRide, disabled, loading }: any) => (
    <button onClick={onRequestRide} disabled={disabled || loading} className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-extrabold flex items-center justify-center gap-3 text-lg transition-all duration-200 ${(disabled || loading) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-xl'}`}>
      {loading ? (<><div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" /> Buscando motorista...</>) : (<><Car size={22} /> SOLICITAR CORRIDA <ArrowRight size={18} /></>)}
    </button>
  );

  return (
    <div className="max-w-md mx-auto px-3 pb-28">
      <div className="py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
            <Car className="text-[#F4D03F] w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
        </div>
        {user && <button onClick={onSignOut} className="text-[#A0A0B0] text-sm flex items-center gap-1 hover:text-red-400 transition px-3 py-1 rounded-full bg-white/5"><LogOut size={14} /> Sair</button>}
      </div>

      <div className="relative h-[220px] rounded-xl overflow-hidden shadow-lg mb-3">
        <MapComponent pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} onPickupChange={setPickupAddress} onDropoffChange={setDropoffAddress} onLocationSelect={(location: any) => { if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } else { setDropoffLocation(location); setDropoffAddress(location.address); } }} />
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/60 backdrop-blur-md rounded-2xl px-5 py-2 border-2 border-[#F4D03F]/50 shadow-xl">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-full bg-[#F4D03F]/30 flex items-center justify-center"><Car className="text-[#F4D03F] w-6 h-6" /></div>
              <div><h1 className="text-xl font-extrabold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1><p className="text-[#F4D03F] text-[10px] text-center font-bold tracking-wider">SUA CORRIDA DE CONFIANÇA</p></div>
            </div>
          </div>
        </div>
      </div>

      <LocationInputs pickupAddress={pickupAddress} setPickupAddress={setPickupAddress} dropoffAddress={dropoffAddress} setDropoffAddress={setDropoffAddress} disabled={false} />
      <div className="mt-3"><ActionButton onRequestRide={handleRequestRide} disabled={!pickupLocation || !dropoffLocation} loading={solicitando} /></div>
      <RotatingBanner />
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
};

export default HomeScreen;