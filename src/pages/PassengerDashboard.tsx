import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { BottomNav } from '../components/BottomNav';
import { Skeleton } from '../components/Skeleton';
import { calcularPrecoCorrida } from '../lib/priceCalculator';
import { supabase } from '../lib/supabaseClient';
import { MapPin, Navigation, DollarSign, History, LogOut, Car, Crosshair, X } from 'lucide-react';
import { toast } from 'sonner';

export function PassengerDashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [solicitando, setSolicitando] = useState(false);
  const [loading, setLoading] = useState(true);
  const [recentTrips, setRecentTrips] = useState<any[]>([]);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);

  const precoEstimado = useMemo(
    () => (origem || destino) ? calcularPrecoCorrida({ distanciaKm: 5.2, tempoMin: 15 }) : null,
    [origem, destino]
  );

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
        () => setUserLocation({ lat: -23.5505, lng: -46.6333 }),
        { enableHighAccuracy: true, timeout: 15000 }
      );
    } else {
      setUserLocation({ lat: -23.5505, lng: -46.6333 });
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
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
      .limit(5);
    if (data) setRecentTrips(data);
  }

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const solicitarCorrida = async () => {
    if (!destino) { toast.error('Digite o destino'); return; }
    setSolicitando(true);
    try {
      const { error } = await supabase.from('corridas').insert({
        passageiro_id: user?.id,
        origem: origem || 'Local atual',
        destino,
        status: 'pendente',
        valor: precoEstimado || 20,
      });
      if (error) throw error;
      toast.success('✅ Corrida solicitada!');
      fetchRecentTrips();
    } catch (err: any) {
      toast.error('Erro: ' + err.message);
    }
    setSolicitando(false);
  };

  if (loading) {
    return (
      <div className="w-full min-h-screen bg-[#0F0B1A] p-4 space-y-4">
        <Skeleton className="h-12 w-full rounded-2xl" />
        <Skeleton className="h-56 w-full rounded-2xl" />
        <Skeleton className="h-40 w-full rounded-2xl" />
        <Skeleton className="h-24 w-full rounded-2xl" />
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] pb-28">
      {/* Header */}
      <header className="sticky top-0 z-20 glass px-5 py-4">
        <div className="w-full max-w-lg mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-xl flex items-center justify-center shadow-lg shadow-[#F4D03F]/20">
              <span className="text-xl">🚕</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">ObaLeva</h1>
              <p className="text-[10px] text-[#A0A0B0] -mt-0.5">Mobilidade premium</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 bg-green-500/10 border border-green-500/20 rounded-full px-3 py-1">
              <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
              <span className="text-[10px] text-green-400 font-medium">Online</span>
            </div>
            <button 
              onClick={handleSignOut}
              className="w-10 h-10 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center hover:bg-red-500/20 transition-all"
            >
              <LogOut size={16} className="text-red-400" />
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo */}
      <div className="w-full px-4 mt-4 max-w-lg mx-auto space-y-4">
        {/* Card do Mapa */}
        <div className="card overflow-hidden h-52 relative">
          <div className="w-full h-full bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center">
            <div className="text-center">
              <MapPin size={40} className="mx-auto mb-2 text-[#F4D03F]/40" />
              <p className="text-xs text-[#A0A0B0]">Mapa será exibido aqui</p>
              {userLocation && (
                <p className="text-[10px] text-[#A0A0B0]/60 mt-1">📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
              )}
            </div>
          </div>
          {userLocation && (
            <button 
              onClick={() => {
                if (navigator.geolocation) {
                  navigator.geolocation.getCurrentPosition(
                    (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                    () => {},
                    { enableHighAccuracy: true, timeout: 10000 }
                  );
                  toast.success('📍 Localização atualizada!');
                }
              }}
              className="absolute bottom-3 right-3 w-10 h-10 rounded-full bg-[#1A1528] border border-white/10 flex items-center justify-center hover:bg-[#2D2342] transition-all shadow-lg"
            >
              <Crosshair size={16} className="text-[#F4D03F]" />
            </button>
          )}
        </div>

        {/* Card de Endereços */}
        <div className="card p-4 space-y-3">
          <div>
            <label className="text-[10px] text-[#A0A0B0] mb-1.5 flex items-center gap-1.5">
              <MapPin size={11} className="text-green-400" />
              ORIGEM
            </label>
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F] focus-within:border-transparent transition-all">
              <MapPin size={16} className="text-green-400 shrink-0" />
              <input
                type="text"
                placeholder="Onde você está?"
                value={origem}
                onChange={e => setOrigem(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-[16px]"
              />
              {origem && (
                <button onClick={() => setOrigem('')} className="text-gray-500 hover:text-red-400 transition p-0.5">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          <div className="border-l-2 border-dashed border-white/10 ml-3 h-3" />

          <div>
            <label className="text-[10px] text-[#A0A0B0] mb-1.5 flex items-center gap-1.5">
              <Navigation size={11} className="text-red-400" />
              DESTINO
            </label>
            <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F] focus-within:border-transparent transition-all">
              <Navigation size={16} className="text-red-400 shrink-0" />
              <input
                type="text"
                placeholder="Para onde vai?"
                value={destino}
                onChange={e => setDestino(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-[16px]"
              />
              {destino && (
                <button onClick={() => setDestino('')} className="text-gray-500 hover:text-red-400 transition p-0.5">
                  <X size={14} />
                </button>
              )}
            </div>
          </div>

          {precoEstimado && (
            <div className="bg-gradient-to-r from-purple-900/30 to-amber-900/30 rounded-xl p-3 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <DollarSign size={16} className="text-[#F4D03F]" />
                  <span className="font-bold text-white">R$ {precoEstimado.toFixed(2)}</span>
                  <span className="text-[10px] text-[#A0A0B0]">estimativa</span>
                </div>
                <span className="text-xs text-[#A0A0B0]">~15 min</span>
              </div>
            </div>
          )}
        </div>

        {/* Botão Solicitar */}
        <button
          onClick={solicitarCorrida}
          disabled={solicitando || !destino}
          className="btn-primary w-full flex items-center justify-center gap-3 text-base"
        >
          {solicitando ? (
            <><svg className="animate-spin h-5 w-5" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg> Buscando motorista...</>
          ) : (
            <><Car size={20} /> Solicitar ObaLeva</>
          )}
        </button>

        {/* Últimas corridas */}
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <h2 className="text-sm font-semibold text-white/80 flex items-center gap-2">
              <History size={14} className="text-[#F4D03F]" />
              Últimas corridas
            </h2>
            <button onClick={() => navigate('/trips')} className="text-xs text-[#F4D03F] hover:underline font-medium">
              Ver todas
            </button>
          </div>

          {recentTrips.length === 0 ? (
            <div className="card py-8 text-center">
              <Car size={32} className="mx-auto mb-3 text-[#F4D03F]/40" />
              <p className="text-sm text-[#A0A0B0]">Nenhuma corrida ainda</p>
              <p className="text-xs text-[#A0A0B0]/60 mt-1">Digite o destino e solicite sua primeira corrida!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {recentTrips.map((trip, i) => (
                <button
                  key={trip.id}
                  onClick={() => navigate(`/trips/${trip.id}`)}
                  className="w-full text-left card p-3 hover:border-[#F4D03F]/20 transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0F0B1A] rounded-xl flex items-center justify-center">
                      <Navigation size={16} className="text-[#F4D03F]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-white truncate max-w-[170px]">{trip.destino}</p>
                      <p className="text-[10px] text-[#A0A0B0]">{new Date(trip.created_at).toLocaleDateString('pt-BR')}</p>
                    </div>
                  </div>
                  <span className="font-bold text-sm text-[#F4D03F]">R$ {trip.valor?.toFixed(2) || '0.00'}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <BottomNav role="passageiro" />
    </div>
  );
}