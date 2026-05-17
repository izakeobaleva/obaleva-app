import { useState, useEffect, useRef } from 'react';
import { Car, ArrowRight, LogOut } from 'lucide-react';
import MapComponent from './MapComponent';
import RotatingBanner from './RotatingBanner';
import { solicitarCorrida, buscarCorridaAtiva, subscribeToRide, cancelarCorrida, Ride } from '../services/rideService';
import RideStatusModal from './RideStatusModal';

interface HomeScreenContentProps {
  user: any;
  onSignOut: () => void;
}

export function HomeScreenContent({ user, onSignOut }: HomeScreenContentProps) {
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

  return (
    <div className="max-w-md mx-auto px-3 pb-28">
      <div className="py-3 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-[#F4D03F]/30 flex items-center justify-center">
            <Car className="text-[#F4D03F] w-5 h-5" />
          </div>
          <h1 className="text-xl font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
        </div>
        <button onClick={onSignOut} className="text-[#A0A0B0] text-sm flex items-center gap-1 hover:text-red-400 transition px-3 py-1 rounded-full bg-white/5">
          <LogOut size={14} /> Sair
        </button>
      </div>

      <div className="relative h-[200px] rounded-xl overflow-hidden shadow-lg mb-3">
        <MapComponent pickupLocation={pickupLocation} dropoffLocation={dropoffLocation} onPickupChange={setPickupAddress} onDropoffChange={setDropoffAddress} onLocationSelect={(location: any) => { if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } else { setDropoffLocation(location); setDropoffAddress(location.address); } }} />
      </div>

      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 shadow-lg">
        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/15">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#F4D03F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          <span className="text-white font-bold text-sm">Definir sua rota</span>
        </div>
        <div className="bg-white/10 rounded-xl border border-white/15 mb-2">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
            <input type="text" placeholder="Digite onde você está..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={pickupAddress} onChange={(e) => setPickupAddress(e.target.value)} />
          </div>
        </div>
        <div className="bg-white/10 rounded-xl border border-white/15">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-3 h-3 rounded-full bg-red-500" />
            <input type="text" placeholder="Digite seu destino..." className="flex-1 bg-transparent text-white outline-none text-base font-medium" value={dropoffAddress} onChange={(e) => setDropoffAddress(e.target.value)} />
          </div>
        </div>
        <button onClick={() => { const temp = pickupAddress; setPickupAddress(dropoffAddress); setDropoffAddress(temp); }} className="mt-3 w-full text-center text-sm text-[#A0A0B0] hover:text-[#F4D03F] transition py-1.5 font-medium">🔄 Inverter origem e destino</button>
      </div>

      <div className="mt-3">
        <button onClick={handleRequestRide} disabled={!pickupLocation || !dropoffLocation || solicitando} className={`w-full py-4 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-extrabold flex items-center justify-center gap-3 text-lg transition-all duration-200 ${(!pickupLocation || !dropoffLocation || solicitando) ? 'opacity-50 cursor-not-allowed' : 'hover:scale-[1.02] active:scale-[0.98] shadow-xl'}`}>
          {solicitando ? (
            <><div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" /> Buscando motorista...</>
          ) : (
            <><Car size={22} /> SOLICITAR CORRIDA <ArrowRight size={18} /></>
          )}
        </button>
      </div>

      <RotatingBanner />
      
      {showRideModal && activeRide && <RideStatusModal ride={activeRide} onClose={() => setShowRideModal(false)} onCancel={handleCancelRide} />}
    </div>
  );
}