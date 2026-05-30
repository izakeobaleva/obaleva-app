"use client";

import React, { useState } from 'react';
import { TopBar } from '../components/TopBar';
import { MapSection } from '../components/MapSection';
import { RidePanel } from '../components/RidePanel';
import { AdBanner } from '../components/AdBanner';
import { BottomInfoBar } from '../components/BottomInfoBar';
import { useAuth } from '../contexts/AuthContext';

export default function Home() {
  const { user } = useAuth();
  const [priceEstimate, setPriceEstimate] = useState<number | null>(null);

  const handleRequestRide = (origin: string, destination: string) => {
    // Simula cálculo de preço
    const basePrice = 8.5;
    const kmPrice = 2.5;
    const estimatedKm = 3.5;
    const total = basePrice + (estimatedKm * kmPrice);
    setPriceEstimate(total);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#0F0B1A] overflow-hidden">
      {/* 1. TOP BAR FIXO */}
      <TopBar />

      {/* 2. MAPA (OCUPA TUDO QUE SOBRA) */}
      <div className="flex-1 relative min-h-0">
        <MapSection />
      </div>

      {/* 3. ORIGEM + DESTINO + PREÇO + BOTÃO */}
      <RidePanel onRequestRide={handleRequestRide} priceEstimate={priceEstimate} />

      {/* 4. BANNER INTERATIVO */}
      <AdBanner />

      {/* 5. BOTTOM INFO BAR */}
      <BottomInfoBar />
    </div>
  );
}