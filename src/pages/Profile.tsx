import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, LogOut, ChevronLeft, CreditCard, History, Heart, Edit, Car } from 'lucide-react';
import { motion } from 'framer-motion';

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
      setStats({ corridas: data.length, km, gasto: total });
    }
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] pb-24">
      <header className="sticky top-0 z-20 bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 px-4 py-3">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate('/')} className="text-[#A0A0B0] hover:text-white">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-lg font-bold text-white">Meu Perfil</h1>
        </div>
      </header>

      <main className="p-4 max-w-md mx-auto space-y-4">
        {/* Avatar e nome */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1A1528] rounded-2xl p-6 border border-white/10 text-center"
        >
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#F4D03F] to-amber-500 flex items-center justify-center mx-auto mb-3">
            <span className="text-3xl font-bold text-[#1E1E2F]">
              {profile?.nome_completo?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <h2 className="text-lg font-bold text-white">{profile?.nome_completo || 'Usuário'}</h2>
          <div className="flex items-center justify-center gap-2 mt-1">
            <Mail size={14} className="text-[#A0A0B0]" />
            <p className="text-sm text-[#A0A0B0]">{user?.email}</p>
          </div>
          {profile?.telefone && (
            <div className="flex items-center justify-center gap-2 mt-1">
              <Phone size={14} className="text-[#A0A0B0]" />
              <p className="text-sm text-[#A0A0B0]">{profile.telefone}</p>
            </div>
          )}
        </motion.div>

        {/* Estatísticas */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{stats.corridas}</p>
            <p className="text-xs text-[#A0A0B0]">Corridas</p>
          </div>
          <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-white">{stats.km.toFixed(0)}</p>
            <p className="text-xs text-[#A0A0B0]">Km</p>
          </div>
          <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-white/10">
            <p className="text-2xl font-bold text-[#F4D03F]">R$ {stats.gasto.toFixed(0)}</p>
            <p className="text-xs text-[#A0A0B0]">Gasto</p>
          </div>
        </div>

        {/* Menu */}
        <div className="bg-[#1A1528] rounded-2xl border border-white/10 overflow-hidden">
          <button 
            onClick={() => navigate('/trips')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <History size={18} className="text-[#F4D03F]" />
              <span className="text-white text-sm">Histórico de corridas</span>
            </div>
            <ChevronLeft size={16} className="text-[#A0A0B0] rotate-180" />
          </button>
          
          {/* Botão Torne-se um Parceiro */}
          <button 
            onClick={() => navigate('/cadastro-motorista')}
            className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10"
          >
            <div className="flex items-center gap-3">
              <Car size={18} className="text-[#F4D03F]" />
              <span className="text-white text-sm font-medium">Torne-se um Parceiro</span>
            </div>
            <ChevronLeft size={16} className="text-[#A0A0B0] rotate-180" />
          </button>

          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3">
              <CreditCard size={18} className="text-[#F4D03F]" />
              <span className="text-white text-sm">Formas de pagamento</span>
            </div>
            <ChevronLeft size={16} className="text-[#A0A0B0] rotate-180" />
          </button>
          
          <button 
            onClick={handleSignOut}
            className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition"
          >
            <div className="flex items-center gap-3">
              <LogOut size={18} className="text-red-400" />
              <span className="text-red-400 text-sm font-medium">Sair da conta</span>
            </div>
          </button>
        </div>

        <p className="text-center text-xs text-[#A0A0B0]">ObaLeva v1.0</p>
      </main>

      <BottomNav role="passageiro" />
    </div>
  )
}