import React from 'react';
import TopBar from '../components/TopBar';
import MapSection from '../components/MapSection';
import RideInputs from '../components/RideInputs';
import AdSpace from '../components/AdSpace';
import BottomBar from '../components/BottomBar';

const Home: React.FC = () => {
  return (
    <div className="flex flex-col h-screen bg-[#0F0B1A] text-white">
      {/* 1. TOP BAR FIXO (60dp) */}
      <TopBar />

      {/* 2. MAPA AO VIVO (OCUPA O RESTO) */}
      <div className="flex-1 relative min-h-0">
        <MapSection />
      </div>

      {/* 3. ORIGEM + DESTINO (WRAP CONTENT) */}
      <RideInputs />

      {/* 4. ESPAÇO PUBLICITÁRIO FIXO (50dp) */}
      <AdSpace />

      {/* 5. BOTTOM BAR FIXA (48dp) */}
      <BottomBar />
    </div>
  );
};

export default Home;