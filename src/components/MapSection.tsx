import MapComponent from './MapComponent';
import { Car } from 'lucide-react';

export function MapSection() {
  return (
    <div className="relative h-[180px] rounded-xl overflow-hidden shadow-md mb-2">
      <MapComponent />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="bg-black/50 backdrop-blur-md rounded-xl px-3 py-1 border border-[#F4D03F]/40">
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full bg-[#F4D03F]/20 flex items-center justify-center">
              <Car className="text-[#F4D03F] w-3.5 h-3.5" />
            </div>
            <div>
              <h1 className="text-sm font-bold bg-gradient-to-r from-white to-[#F4D03F] bg-clip-text text-transparent">OBALEVA</h1>
              <p className="text-[#F4D03F] text-[7px] text-center">MOBILIDADE PREMIUM</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}