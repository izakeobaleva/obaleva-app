"use client";

import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Bell, User, LogOut, Menu, Car } from 'lucide-react';

export function TopBar() {
  const navigate = useNavigate();
  const { signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <header className="h-[60px] bg-[#0F0B1A] border-b border-white/10 flex items-center justify-between px-4 flex-shrink-0 z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-lg flex items-center justify-center shadow-lg">
          <Car size={18} className="text-[#1E1E2F]" />
        </div>
        <span className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>
          ObaLeva
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button className="text-gray-400 hover:text-white transition p-1.5" title="Notificações">
          <Bell size={20} />
        </button>
        <button onClick={() => navigate('/profile')} className="text-gray-400 hover:text-white transition p-1.5" title="Perfil">
          <User size={20} />
        </button>
        <button 
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition p-1.5" 
          title="Sair"
        >
          <LogOut size={20} />
        </button>
      </div>
    </header>
  );
}