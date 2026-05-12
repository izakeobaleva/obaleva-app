import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { MapWithPersonCar } from '../components/MapWithPersonCar';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { RatingStars } from '../components/RatingStars';
import { supabase } from '../lib/supabaseClient';
import { DollarSign, Star, Clock, TrendingUp, Navigation, Bell } from 'lucide-react';
import { toast } from 'sonner';

export default function DriverDashboard() {
  const { user, signOut } = useAuth();
  const [disponivel, setDisponivel] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    corridasHoje: 0,
    ganhosHoje: 0,
    avaliacao: 4.5,
    totalCorridas: 0,
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    fetchDriverStats();
    return () => {
      clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    const channel = supabase
      .channel('novas-corridas')
      .on('postgres_changes', 
        { event: 'INSERT', schema: 'public', table: 'corridas', filter: `status=eq.pendente` }, 
        (payload) => {
          if (disponivel) {
            toast.custom((t) => (
              <motion.div
                initial={{ opacity: 0, y: -50 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#1A1528] text-white p-4 rounded-2xl border border-white/10 shadow-xl"
              >
                <div className="flex items-center gap-3">
                  <Bell size={20} className="text-[#F4D03F]" />
                  <div>
                    <p className="font-bold">Nova solicitação!</p>
                    <p className="text-sm text-[#A0A0B0]">Valor estimado: R$ {payload.new.valor?.toFixed(2) || '0.00'}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3">
                  <button 
                    onClick={() => acceptRide(payload.new.id)}
                    className="bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] px-4 py-2 rounded-2xl text-sm font-bold flex-1"
                  >
                    Aceitar
                  </button>
                  <button 
                    onClick={() => toast.dismiss(t)}
                    className="bg-white/10 text-white px-4 py-2 rounded-2xl text-sm flex-1"
                  >
                    Recusar
                  </button>
                </div>
              </motion.div>
            ), { duration: 15000 });
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [disponivel]);

  async function fetchDriverStats() {
    if (!user) return;
    
    const { data: corridas } = await supabase
      .from('corridas')
      .select('valor, status, created_at')
      .eq('motorista_id', user.id);

    if (corridas) {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);
      
      const hojeCorridas = corridas.filter(c => new Date(c.created_at) >= hoje && c.status === 'finalizada');
      const ganhosHoje = hojeCorridas.reduce((acc, c) => acc + (c.valor || 0), 0);
      
      setStats({
        corridasHoje: hojeCorridas.length,
        ganhosHoje: ganhosHoje,
        avaliacao: 4.5,
        totalCorridas: corridas.filter(c => c.status === 'finalizada').length,
      });
    }
    setLoading(false);
  }

  async function acceptRide(rideId: string) {
    const { error } = await supabase
      .from('corridas')
      .update({ motorista_id: user?.id, status: 'aceita' })
      .eq('id', rideId);
    
    if (error) {
      toast.error('Erro ao aceitar corrida');
    } else {
      toast.success('✅ Corrida aceita! Vá até o passageiro.');
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4 space-y-4">
        <Skeleton className="h-12 w-full bg-white/5" />
        <Skeleton className="h-28 w-full rounded-2xl bg-white/5" />
        <Skeleton className="h-64 w-full rounded-2xl bg-white/5" />
        <Skeleton className="h-32 w-full rounded-2xl bg-white/5" />
      </div>
    );
  }

  const statCards = [
    { label: 'Corridas Hoje', value: stats.corridasHoje, icon: Clock, color: '#3B82F6' },
    { label: 'Ganhos Hoje', value: `R$ ${stats.ganhosHoje.toFixed(2)}`, icon: DollarSign, color: '#22C55E' },
    { label: 'Avaliação', value: <RatingStars value={stats.avaliacao} readonly size={14} />, icon: Star, color: '#F4D03F' },
    { label: 'Total', value: stats.totalCorridas, icon: TrendingUp, color: '#A855F7' },
  ];

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      <header className="glass-header sticky top-0 z-20 flex justify-between items-center px-6 py-4">
        <div>
          <h1 className="text-xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeve</h1>
          <p className="text-xs text-[#A0A0B0]">Motorista</p>
        </div>
        <button
          onClick={signOut}
          className="btn-outline-dark px-4 py-2 text-sm"
        >
          Sair
        </button>
      </header>

      <main className="p-4 max-w-lg mx-auto space-y-4">
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-[#1A1528] rounded-2xl border border-white/10 p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="text-sm text-[#A0A0B0]">Olá, {user?.email?.split('@')[0] || 'Motorista'}</p>
              <p className="text-2xl font-bold text-white mt-1">
                R$ {stats.ganhosHoje.toFixed(2)}
              </p>
              <p className="text-xs text-[#A0A0B0]">ganhos de hoje</p>
            </div>
            <div className="flex flex-col items-end gap-2">
              <div className={`px-4 py-2 rounded-full text-sm font-semibold ${
                disponivel ? 'bg-green-900/40 text-green-400' : 'bg-white/10 text-[#A0A0B0]'
              }`}>
                {disponivel ? '🟢 Online' : '⚫ Offline'}
              </div>
              <motion.button
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setDisponivel(!disponivel);
                  if (!disponivel) {
                    toast.success('Você está online! Recebendo solicitações.');
                  } else {
                    toast('Você ficou offline');
                  }
                }}
                className={`px-6 py-2.5 rounded-2xl font-bold text-sm transition-all ${
                  disponivel 
                    ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                    : 'bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F]'
                }`}
              >
                {disponivel ? 'Ficar Offline' : 'Ficar Online'}
              </motion.button>
            </div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl overflow-hidden border border-white/10"
        >
          <MapWithPersonCar />
        </motion.div>

        <div className="grid grid-cols-2 gap-3">
          {statCards.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              whileHover={{ scale: 1.02 }}
              className="bg-[#1A1528] p-4 rounded-2xl border border-white/10"
            >
              <div className="flex items-center gap-2 mb-2">
                <div className="p-2 rounded-xl" style={{ backgroundColor: `${stat.color}20` }}>
                  <stat.icon size={16} color={stat.color} />
                </div>
              </div>
              <p className="text-xs text-[#A0A0B0] mb-1">{stat.label}</p>
              <div className="text-lg font-bold text-white">{stat.value}</div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-[#1A1528] rounded-2xl border border-white/10 p-5"
        >
          <h2 className="font-bold text-white mb-3 flex items-center gap-2">
            <Navigation size={18} className="text-[#F4D03F]" />
            Solicitações Próximas
          </h2>
          <AnimatePresence mode="wait">
            {disponivel ? (
              <motion.div
                key="waiting"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <div className="animate-pulse">
                  <Clock size={40} className="mx-auto mb-3 text-gray-600" />
                </div>
                <p className="text-white font-medium">Aguardando solicitações...</p>
                <p className="text-xs text-[#A0A0B0] mt-1">Fique atento às notificações</p>
              </motion.div>
            ) : (
              <motion.div
                key="offline"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-6"
              >
                <Bell size={40} className="mx-auto mb-3 text-gray-600" />
                <p className="text-white font-medium">Fique online para receber corridas</p>
                <p className="text-xs text-[#A0A0B0] mt-1">Ative o status online acima</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </main>

      <BottomNav role="motorista" />
    </div>
  );
}