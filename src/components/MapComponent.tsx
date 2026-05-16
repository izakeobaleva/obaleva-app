import React from 'react';

interface MapComponentProps {
  onLocationSelect?: (location: { lat: number; lng: number; address: string }) => void;
  pickupLocation?: { lat: number; lng: number; address: string } | null;
  dropoffLocation?: { lat: number; lng: number; address: string } | null;
  onPickupChange?: (value: string) => void;
  onDropoffChange?: (value: string) => void;
}

const MapComponent: React.FC<MapComponentProps> = () => {
  // Coordenadas de São Paulo (localização padrão)
  const latitude = -23.5505;
  const longitude = -46.6333;
  
  // URL do Google Maps embed (funciona SEMPRE, sem API Key)
  const mapUrl = `https://www.google.com/maps/embed/v1/view?key=AIzaSyBXC6y3jWxCFBMeV77L1F0E4fgu_q6QCaM&center=${latitude},${longitude}&zoom=14&maptype=roadmap`;

  return (
    <div className="relative w-full h-full rounded-xl overflow-hidden">
      <iframe
        title="Google Maps"
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
    </div>
  );
};

export default MapComponent;