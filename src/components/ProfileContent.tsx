import React from 'react';
import { User, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';

interface ProfileContentProps {
  user: any;
  profile: any;
  onSignOut: () => void;
}

export const ProfileContent: React.FC<ProfileContentProps> = ({ user, profile, onSignOut }) => {
  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.reload();
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 mt-4 text-center">
        <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3 border border-[#F4D03F]/30">
          <User size={40} className="text-[#F4D03F]" />
        </div>
        <h2 className="text-white text-xl font-bold">{profile?.nome_completo || user?.email}</h2>
        <p className="text-gray-400 text-sm mt-1">{user?.email}</p>
        <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20 border border-[#F4D03F]/30">
          <span className="text-[#F4D03F] text-xs font-bold">
            {profile?.tipo?.toUpperCase() || 'PASSAGEIRO'}
          </span>
        </div>
        
        <div className="mt-6 space-y-2">
          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
            📋 Editar perfil
          </button>
          <button className="w-full py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm hover:bg-white/10 transition flex items-center justify-center gap-2">
            ⭐ Avaliações
          </button>
          
          {/* Botão Sair - VERMELHO E VISÍVEL */}
          <button 
            onClick={handleSignOut}
            className="w-full py-3 rounded-xl bg-red-500/20 border border-red-500 text-red-400 font-bold hover:bg-red-500/30 transition flex items-center justify-center gap-2"
          >
            <LogOut size={16} /> Sair da conta
          </button>
        </div>
      </div>
    </div>
  );
};