import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { MapWithPersonCar } from '../components/MapWithPersonCar';
import { PaymentMethodSelector } from '../components/PaymentMethodSelector';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Navigation, DollarSign, History } from 'lucide-react';
import { toast } from 'sonner';

export function PassengerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [metodoPagamento, setMetodoPagamento] = useState<'dinheiro' | 'cartao' | 'pix'>('dinheiro');
  const [solicitando, setSolicitando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 800);
    fetchRecentTrips();
    return () => clearTimeout(timer);
  }, []);

  async function fetchRecentTrips() {
    if (!user) return;
    const { data } = await supabase
      .from('corridas')
      .select('*')
      .eq('passageiro_id', user.id)
      .order('created_at', { ascending: false })
      .limit(3);
    if (data) setRecentTrips(data);
  }

  const precoEstimado = origem || destino ? calcularPrecoCorrida({
    distanciaKm: 5.2,
    tempoMin: 15,
  }) : null;

  const solicitarCorrida = async () => {
    if (!destino) {
      toast.error('Digite o destino');
      return;
    }
    setSolicitando(true);
    
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id,
        origem: origem || 'Local atual',
        destino: destino,
        status: 'pendente',
        valor: precoEstimado || 20,
        metodo_pagamento: metodoPagamento,
      });
      
      if (error) throw error;
      toast.success('🚗 Corrida solicitada! Aguardando motorista...');
      setOrigem('');
      setDestino('');
    } catch (err: any) {
      toast.error('Erro ao solicitar: ' + err.message);
    } finally {
      setSolicitando(false);
    }
  };

  const quickDestinations = [
    { label: 'Casa', icon: '🏠' },
    { label: 'Trabalho', icon: '💼' },
    { label: 'Mercado', icon: '🛒' },
    { label: 'Farmácia', icon: '💊' },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] p-4 space-y-4">
        <Skeleton className="h-12 w-full" />
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0F0B1A] pb-24">
      <header className="glass-header sticky top-0 z-20 flex justify-between items-center px-6 py-4">
        <motion.h1
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-2xl font-bold bg-gradient-to-r from-[#F4D03F] to-amber-400 bg-clip-text text-transparent"
          style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}
        >
          OvaLeva
        </motion.h1>
        <div className="flex items-center gap-3">
          <span className="text-sm text-[#A0A0B0] hidden sm:block">{user?.email}</span>
          <button onClick={signOut} className="btn-outline-dark px-4 py-2 text-sm">Sair</button>
        </div>
      </header>

      <div className="relative -mt-1">
        <MapWithPersonCar />
        <div className="absolute bottom-4 left-4 right-4 flex justify-center">
          <div className="bg-[#1A1528]/90 backdrop-blur-md px-6 py-2 rounded-full shadow-lg text-sm text-[#A0A0B0] border border-white/10">
            📍 Rua Augusta, 1500 - Consolação
          </div>
        </div>
      </div>

      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 100, delay: 0.1 }}
        className="mx-4 -mt-8 relative z-10"
      >
        <div className="bg-[#1A1528] rounded-2xl shadow-xl p-5 space-y-4 border border-white/10">
          <div className="space-y-3">
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2">
              <div className="bg-green-900/40 p-2 rounded-full shrink-0">
                <MapPin size={18} className="text-green-400" />
              </div>
              <input
                type="text"
                placeholder="Onde você está?"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-3 bg-[#1A1528] border border-white/10 rounded-2xl px-4 py-2">
              <div className="bg-red-900/40 p-2 rounded-full shrink-0">
                <Navigation size={18} className="text-red-400" />
              </div>
              <input
                type="text"
                placeholder="Para onde vai?"
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
                value={destino}
                onChange={e => setDestino(e.target.value)}
              />
            </div>
          </div>

          <AnimatePresence>
            {precoEstimado && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 p-3 rounded-xl border border-white/10"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DollarSign size={20} className="text-[#F4D03F]" />
                    <span className="font-bold text-lg text-white">R$ {precoEstimado.toFixed(2)}</span>
                    <span className="text-xs text-[#A0A0B0]">(estimativa)</span>
                  </div>
                  <span className="text-xs text-[#A0A0B0]">~15 min</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div>
            <label className="block text-sm font-medium mb-2 text-[#A0A0B0]">Forma de pagamento</label>
            <PaymentMethodSelector value={metodoPagamento} onChange={setMetodoPagamento} />
          </div>

          <motion.button
            whileTap={{ scale: 0.98 }}
            whileHover={{ scale: 1.01 }}
            onClick={solicitarCorrida}
            disabled={solicitando}
            className="btn-premium w-full py-4 rounded-xl text-lg font-bold shadow-lg"
          >
            {solicitando ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Buscando motorista...
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">🚗 Solicitar OvaLeva</span>
            )}
          </motion.button>
        </div>
      </motion.div>

      <div className="mx-4 mt-6">
        <h2 className="font-semibold text-white mb-3">Destinos rápidos</h2>
        <div className="flex gap-3 overflow-x-auto pb-2">
          {quickDestinations.map((place, index) => (
            <motion.button
              key={place.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDestino(place.label)}
              className="bg-[#1A1528] backdrop-blur-sm px-5 py-3 rounded-xl shadow-sm text-sm font-medium text-white hover:shadow-md transition-all whitespace-nowrap border border-white/10"
            >
              {place.icon} {place.label}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="mx-4 mt-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="font-semibold text-white">Últimas corridas</h2>
          <button onClick={() => navigate('/trips')} className="text-xs text-[#F4D03F] hover:underline">Ver todas</button>
        </div>
        
        <div className="space-y-2">
          {recentTrips.length === 0 ? (
            <div className="bg-[#1A1528]/80 backdrop-blur-sm rounded-xl p-6 text-center border border-white/10">
              <History size={32} className="mx-auto mb-2 text-gray-600" />
              <p className="text-sm text-[#A0A0B0]">Nenhuma corrida ainda</p>
              <p className="text-xs text-gray-500">Suas viagens aparecerão aqui</p>
            </div>
          ) : (
            recentTrips.map((trip, index) => (
              <motion.button
                key={trip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                onClick={() => navigate(`/trips/${trip.id}`)}
                className="w-full text-left bg-[#1A1528] rounded-xl p-3 border border-white/10 hover:border-[#F4D03F]/30 transition-all"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-900/40 p-2 rounded-full">
                      <Navigation size={16} className="text-[#F4D03F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white">{trip.destino}</p>
                      <p className="text-xs text-[#A0A0B0]">{new Date(trip.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-white">R$ {trip.valor?.toFixed(2) || '0.00'}</span>
                </div>
              </motion.button>
            ))
          )}
        </div>
      </div>

      <BottomNav role="passageiro" />
    </div>
  );
}