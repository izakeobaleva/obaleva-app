<<<<<<< HEAD
import React from 'react'
import { MapPin } from 'lucide-react'

export const MapWithPersonCar = () => (
  <div className="w-full h-96 bg-[#0F0B1A] rounded-3xl border border-white/10 flex items-center justify-center">
    <div className="text-center text-[#A0A0B0]">
      <MapPin size={48} className="mx-auto mb-2 opacity-50" />
      <p>Mapa será carregado aqui</p>
      <p className="text-sm mt-1">(Google Maps em breve)</p>
    </div>
  </div>
)
=======
export function MapWithPersonCar() {
  return (
    <div className="w-full h-64 bg-gray-200 flex items-center justify-center rounded-lg">
      <p className="text-gray-500 text-lg">🗺️ Mapa com localização</p>
    </div>
  )
}
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
