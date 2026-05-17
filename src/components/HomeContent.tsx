import React from 'react';
import { Car, LogOut } from 'lucide-react';
import MapComponent from './MapComponent';
import RotatingBanner from './RotatingBanner';
import RideStatusModal from './RideStatusModal';
import { Ride } from '../services/rideService';

interface HomeContentProps {
  user: any;
  onSignOut: () => void;
  pickupAddress: string;
  setPickupAddress: (value: string) => void;
  dropoffAddress: string;
  setDropoffAddress: (value: string) => void;
  pickupLocation: any;
  dropoffLocation: any;
  setPickupLocation: (loc: any) => void;
  setDropoffLocation: (loc: any) => void;
  onRequestRide: () => void;
  solicitando: boolean;
  activeRide: Ride | null;
  showRideModal: boolean;
  onCloseRideModal: () => void;
  onCancelRide: () => void;
}

export const HomeContent: React.FC<HomeContentProps> = ({
  user,
  onSignOut,
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
  pickupLocation,
  dropoffLocation,
  setPickupLocation,
  setDropoffLocation,
  onRequestRide,
  solicitando,
  activeRide,
  showRideModal,
  onCloseRideModal,
  onCancelRide,
}) => {
  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Car size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button 
          onClick={onSignOut} 
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500 text-red-400 text-sm hover:bg-red-500/30 transition"
        >
          <LogOut size={14} /> Sair
        </button>
      </div>

      {/* Mapa */}
      <div className="relative h-[220px] rounded-xl overflow-hidden mb-3 border border-white/10">
        <MapComponent
          pickupLocation={pickupLocation}
          dropoffLocation={dropoffLocation}
          onPickupChange={setPickupAddress}
          onDropoffChange={setDropoffAddress}
          onLocationSelect={(location: any) => {
            if (!dropoffAddress) { setPickupLocation(location); setPickupAddress(location.address); } 
            else { setDropoffLocation(location); setDropoffAddress(location.address); }
          }}
        />
        <div className="absolute top-3 left-3 bg-black/50 backdrop-blur-sm px-3 py-1 rounded-lg">
          <div className="flex items-center gap-1.5">
            <Car className="text-[#F4D03F] w-4 h-4" />
            <span className="text-white text-xs font-bold">OBALEVA</span>
          </div>
        </div>
      </div>

      {/* Campos */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-3">
        <div className="bg-white/10 rounded-lg mb-2">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <input 
              type="text" 
              placeholder="Onde você está?" 
              className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500" 
              value={pickupAddress} 
              onChange={e => setPickupAddress(e.target.value)} 
            />
          </div>
        </div>
        <div className="bg-white/10 rounded-lg">
          <div className="flex items-center gap-2 p-3">
            <div className="w-2 h-2 rounded-full bg-red-500" />
            <input 
              type="text" 
              placeholder="Para onde vai?" 
              className="flex-1 bg-transparent text-white outline-none placeholder:text-gray-500" 
              value={dropoffAddress} 
              onChange={e => setDropoffAddress(e.target.value)} 
            />
          </div>
        </div>
      </div>

      {/* Botão Solicitar */}
      <button 
        onClick={onRequestRide} 
        disabled={solicitando || !pickupLocation || !dropoffLocation} 
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base disabled:opacity-50 hover:shadow-lg transition-all"
      >
        {solicitando ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            Buscando motorista...
          </span>
        ) : (
          '🚗 SOLICITAR CORRIDA'
        )}
      </button>

      <RotatingBanner />

      {showRideModal && activeRide && (
        <RideStatusModal 
          ride={activeRide} 
          onClose={onCloseRideModal} 
          onCancel={onCancelRide} 
        />
      )}
    </div>
  );
};