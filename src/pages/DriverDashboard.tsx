<<<<<<< HEAD
import React, { useEffect, useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { supabase } from '../lib/supabaseClient'
import { toast } from 'sonner'
import { Car, LogOut, Power, Wallet, Clock } from 'lucide-react'

export const DriverDashboard = () => {
  const { user, profile, signOut } = useAuth()
  const [online, setOnline] = useState(false)
  const [corridas, setCorridas] = useState<any[]>([])
  const [saldo, setSaldo] = useState(0)

  useEffect(() => {
    fetchDriverData()
  }, [])

  async function fetchDriverData() {
    const { data: motorista } = await supabase.from('motoristas').select('*').eq('id', user.id).single()
    if (motorista?.status !== 'aprovado') toast.error('Aguardando aprovação do admin')
    const { data: carteira } = await supabase.from('carteira_motorista').select('saldo_disponivel').eq('motorista_id', user.id).single()
    setSaldo(carteira?.saldo_disponivel || 0)
    const { data: rides } = await supabase.from('corridas').select('*').eq('motorista_id', user.id).order('created_at', { ascending: false })
    setCorridas(rides || [])
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      <header className="bg-[#1A1528]/80 backdrop-blur-lg border-b border-white/10 p-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <Car className="text-[#F4D03F] w-8 h-8" />
          <div>
            <h1 className="text-xl font-bold text-white">Motorista</h1>
            <p className="text-sm text-[#A0A0B0]">{profile?.nome_completo}</p>
          </div>
        </div>
        <button onClick={signOut} className="flex items-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-2xl hover:bg-red-500/30 transition">
          <LogOut size={18} /> Sair
        </button>
      </header>

      <div className="p-4 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-6 mt-4">
          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4">Status</h2>
            
            <button 
              onClick={() => setOnline(!online)} 
              className={`w-full py-4 rounded-2xl text-lg font-bold flex items-center justify-center gap-3 transition ${
                online 
                  ? 'bg-green-500/20 text-green-400 border border-green-500' 
                  : 'bg-gray-700/50 text-gray-400 border border-gray-600'
              }`}
            >
              <Power size={24} /> {online ? 'Online' : 'Offline'}
            </button>

            <div className="mt-4 bg-[#0F0B1A] rounded-2xl p-4 border border-white/10">
              <div className="flex items-center gap-2 text-[#A0A0B0] mb-2">
                <Wallet size={18} className="text-[#F4D03F]" />
                <span>Saldo disponível</span>
              </div>
              <p className="text-3xl font-bold text-white">R$ {saldo.toFixed(2)}</p>
            </div>
          </div>

          <div className="bg-[#1A1528]/80 backdrop-blur-lg rounded-3xl border border-white/10 p-6">
            <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
              <Clock className="text-[#F4D03F]" size={20} /> Histórico de Corridas
            </h2>
            
            {corridas.length === 0 ? (
              <p className="text-[#A0A0B0] text-center py-8">Nenhuma corrida ainda</p>
            ) : (
              <div className="space-y-2">
                {corridas.map(c => (
                  <div key={c.id} className="bg-[#0F0B1A] rounded-xl p-3 border border-white/10">
                    <div className="flex justify-between items-center">
                      <span className="text-white">{c.destino?.endereco}</span>
                      <span className="text-[#F4D03F] font-bold">R$ {c.valor_final || c.valor_estimado}</span>
                    </div>
                    <span className={`text-xs ${
                      c.status === 'solicitada' ? 'text-yellow-400' : 
                      c.status === 'em_andamento' ? 'text-blue-400' : 'text-green-400'
                    }`}>{c.status}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
=======
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
>>>>>>> f9fab54ce8b57aa4cace2f2e9bce17804474d780
}