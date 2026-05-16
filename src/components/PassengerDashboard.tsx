import React from 'react';
import MapComponent from './MapComponent';
import { LocationInputs } from './LocationInputs';
import { ActionButton } from './ActionButton';

interface PassengerDashboardProps {
  pickupAddress: string;
  setPickupAddress: (value: string) => void;
  dropoffAddress: string;
  setDropoffAddress: (value: string) => void;
  onRequestRide: () => void;
}

export const PassengerDashboard = React.memo(({
  pickupAddress,
  setPickupAddress,
  dropoffAddress,
  setDropoffAddress,
  onRequestRide,
}: PassengerDashboardProps) => (
  <div className="space-y-4">
    <div className="h-[220px] rounded-2xl overflow-hidden shadow-2xl">
      <MapComponent />
    </div>

    <LocationInputs
      pickupAddress={pickupAddress}
      setPickupAddress={setPickupAddress}
      dropoffAddress={dropoffAddress}
      setDropoffAddress={setDropoffAddress}
    />

    <ActionButton
      onRequestRide={onRequestRide}
      disabled={!pickupAddress || !dropoffAddress}
    />
  </div>
));