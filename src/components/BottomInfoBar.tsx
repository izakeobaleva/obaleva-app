"use client";

import { Shield, Clock, Headphones } from 'lucide-react';

export function BottomInfoBar() {
  return (
    <footer className="h-[48px] bg-[#0F0B1A] border-t border-white/10 flex items-center justify-between px-4 flex-shrink-0">
      <div className="flex items-center gap-1 text-[10px] text-gray-500">
        <Shield size={12} className="text-yellow-500" />
        <span>Segurança 24h</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-500">
        <Clock size={12} className="text-yellow-500" />
        <span>Suporte rápido</span>
      </div>
      <div className="flex items-center gap-1 text-[10px] text-gray-500">
        <Headphones size={12} className="text-yellow-500" />
        <span>(11) 99999-9999</span>
      </div>
    </footer>
  );
}