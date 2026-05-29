import React from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Bell, User, LogOut } from 'lucide-react';

const TopBar: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    navigate('/login');
  };

  return (
    <header className="h-[60px] min-h-[60px] bg-[#1A1528] border-b border-white/10 flex items-center justify-between px-4 shadow-lg z-50">
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-to-br from-[#F4D03F] to-amber-500 rounded-lg flex items-center justify-center shadow">
          <span className="text-lg">🚕</span>
        </div>
        <span className="text-xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent">
          ObaLeva
        </span>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-[#A0A0B0] hover:text-white transition p-1.5 rounded-xl hover:bg-white/5" title="Notificações">
          <Bell size={20} />
        </button>
        <button className="text-[#A0A0B0] hover:text-white transition p-1.5 rounded-xl hover:bg-white/5" title="Perfil">
          <User size={20} />
        </button>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-300 transition p-1.5 rounded-xl hover:bg-red-500/10 flex items-center gap-1.5"
          title="Sair"
        >
          <LogOut size={20} />
          <span className="text-sm font-medium">Sair</span>
        </button>
      </div>
    </header>
  );
};

export default TopBar;