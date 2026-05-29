import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, LogOut, ChevronLeft, History, CreditCard, Heart, Car, Camera, Edit } from 'lucide-react';

export default function Profile() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [stats, setStats] = useState({ corridas: 0, km: 0, gasto: 0 });

  useEffect(() => {
    loadProfile();
    loadStats();
  }, []);

  async function loadProfile() {
    if (!user) return;
    const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    setProfile(data);
  }

  async function loadStats() {
    if (!user) return;
    const { data } = await supabase
      .from('corridas')
      .select('valor, distancia_km')
      .eq('passageiro_id', user.id)
      .eq('status', 'finalizada');
    if (data) {
      const total = data.reduce((acc, c) => acc + (c.valor || 0), 0);
      const km = data.reduce((acc, c) => acc + (c.distancia_km || 0), 0);
      setStats({ corridas: data.length, km: Math.round(km), gasto: Math.round(total) });
    }
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-20 glass px-5 py-4">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/')} className="w-9 h-9 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition">
              <ChevronLeft size={18} className="text-white" />
            </button>
            <h1 className="text-lg font-bold text-white">Meu Perfil</h1>
          </div>
        </div>
      </header>

      <div className="max-w-lg mx-auto px-4 mt-4 space-y-4">
        {/* Card Principal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="card text-center py-8"
        >
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#FFD966] to-[#F4D03F]/30 border-2 border-[#F4D03F]/40 flex items-center justify-center shadow-xl overflow-hidden">
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="w-full h-full object-cover" />
            ) : (
              <User size={40} className="text-[#F4D03F]" />
            )}
          </div>
          <h2 className="text-xl font-bold text-white">{profile?.nome_completo || 'Usuário'}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Mail size={12} className="text-[#A0A0B0]" />
            <p className="text-sm text-[#A0A0B0]">{user?.email}</p>
          </div>
          {profile?.telefone && (
            <div className="flex items-center justify-center gap-2 mt-0.5">
              <Phone size={12} className="text-[#A0A0B0]" />
              <p className="text-sm text-[#A0A0B0]">{profile.telefone}</p>
            </div>
          )}
          <div className="inline-flex items-center gap-1.5 mt-3 bg-[#0F0B1A] rounded-full px-4 py-1.5 border border-white/10">
            <span className="text-xs text-[#A0A0B0]">🚶</span>
            <span className="text-xs font-medium text-white">Passageiro</span>
          </div>
        </motion.div>

        {/* Estatísticas */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-3 gap-3"
        >
          {[
            { label: 'Corridas', value: stats.corridas, icon: Car },
            { label: 'Km', value: stats.km, icon: History },
            { label: 'Gasto', value: `R$ ${stats.gasto}`, icon: CreditCard },
          ].map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 + i * 0.05 }}
              className="card text-center py-4"
            >
              <item.icon size={18} className="mx-auto mb-2 text-[#F4D03F]" />
              <p className="text-lg font-bold text-white">{item.value}</p>
              <p className="text-[10px] text-[#A0A0B0]">{item.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Menu */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="card overflow-hidden divide-y divide-white/5"
        >
          <MenuItem icon={History} label="Histórico de corridas" onClick={() => navigate('/trips')} />
          <MenuItem icon={Car} label="Torne-se Motorista" onClick={() => navigate('/cadastro-motorista')} />
          <MenuItem icon={Heart} label="Endereços favoritos" />
          <MenuItem icon={Edit} label="Editar perfil" />
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between px-4 py-4 hover:bg-red-500/5 transition-all group"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-red-400" />
              <span className="text-sm font-medium text-red-400 group-hover:text-red-300">Sair da conta</span>
            </div>
          </button>
        </motion.div>

        <p className="text-center text-[10px] text-[#A0A0B0]/50 mt-2">ObaLeva v1.0 • Mobilidade premium</p>
      </div>

      <BottomNav role="passageiro" />
    </div>
  );
}

function MenuItem({ icon: Icon, label, onClick }: { icon: any; label: string; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center justify-between px-4 py-4 hover:bg-white/5 transition-all group"
    >
      <div className="flex items-center gap-3">
        <Icon size={18} className="text-[#F4D03F]" />
        <span className="text-sm text-white/80 group-hover:text-white">{label}</span>
      </div>
      <ChevronLeft size={14} className="text-[#A0A0B0] rotate-180" />
    </button>
  );
}