import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Truck, LogOut, Users, Navigation, DollarSign,  
  MapPin, Star, Clock, TrendingUp, Car
} from 'lucide-react';
import { 
  buscarSolicitacoesPendentes, subscribeToNewRides, aceitarCorrida, 
  atualizarLocalizacaoMotorista, iniciarCorrida, finalizarCorrida, Ride,
  subscribeToRide, cancelarCorrida
} from '../services/rideService';

interface DriverProfileProps {
  user: any;
  onLogout: () => void;
}

export default function DriverProfile({ user, onLogout }: DriverProfileProps) {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(false);
  const [solicitacoes, setSolicitacoes] = useState<Ride[]>([]);
  const [activeRide, setActiveRide] = useState<Ride | null>(null);
  const [ganhosHoje, setGanhosHoje] = useState(0);
  const [corridasHoje, setCorridasHoje] = useState(0);
  const [locationInterval, setLocationInterval] = useState<any>(null);

  useEffect(() => {
    carregarTudo();
    const sub = subscribeToNewRides((novaRide) => {
      setSolicitacoes(prev => [novaRide, ...prev]);
    });
    return () => {
      sub.unsubscribe();
      if (locationInterval) clearInterval(locationInterval);
    };
  }, []);

  async function carregarTudo() {
    const { data: userData } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    const { data: motoristaData } = await supabase.from('motoristas').select('*').eq('id', user.id).single();
    setProfile({ ...userData, ...motoristaData });
    setOnline(motoristaData?.online || false);

    const pendentes = await buscarSolicitacoesPendentes();
    setSolicitacoes(pendentes);

    // Buscar corrida ativa
    const { data: corridaAtiva } = await supabase
      .from('corridas')
      .select('*')
      .eq('motorista_id', user.id)
      .in('status', ['motorista_em_rota', 'em_andamento'])
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (corridaAtiva) {
      setActiveRide(corridaAtiva);
      startLocationTracking();
    }

    // Estatísticas do dia
    const hoje = new Date().toISOString().split('T')[0];
    const { data: corridasHojeData } = await supabase
      .from('corridas')
      .select('valor_total')
      .eq('motorista_id', user.id)
      .eq('status', 'finalizada')
      .gte('created_at', hoje);

    if (corridasHojeData) {
      setGanhosHoje(corridasHojeData.reduce((acc, c) => acc + (c.valor_total || 0), 0));
      setCorridasHoje(corridasHojeData.length);
    }

    setLoading(false);
  }

  function startLocationTracking() {
    if (!navigator.geolocation || locationInterval) return;
    const interval = setInterval(() => {
      navigator.geolocation.getCurrentPosition(
        (pos) => atualizarLocalizacaoMotorista(user.id, pos.coords.latitude, pos.coords.longitude),
        () => {},
        { enableHighAccuracy: true, timeout: 10000 }
      );
    }, 5000);
    setLocationInterval(interval);
  }

  async function toggleOnline() {
    const novo = !online;
    const { error } = await supabase.from('motoristas').update({ online: novo }).eq('id', user.id);
    if (!error) setOnline(novo);
  }

  async function handleAccept(ride: Ride) {
    const ok = await aceitarCorrida(ride.id, user.id);
    if (ok) {
      setSolicitacoes(prev => prev.filter(r => r.id !== ride.id));
      setActiveRide({ ...ride, motorista_id: user.id, status: 'motorista_em_rota' });
      startLocationTracking();
    }
  }

  async function handleIniciar() {
    if (activeRide) {
      await iniciarCorrida(activeRide.id);
      setActiveRide({ ...activeRide, status: 'em_andamento' });
    }
  }

  async function handleFinalizar() {
    if (activeRide) {
      await finalizarCorrida(activeRide.id);
      setActiveRide(null);
      if (locationInterval) clearInterval(locationInterval);
      setLocationInterval(null);
      carregarTudo();
    }
  }

  async function handleCancelar() {
    if (activeRide) {
      await cancelarCorrida(activeRide.id);
      setActiveRide(null);
      if (locationInterval) clearInterval(locationInterval);
      setLocationInterval(null);
    }
  }

  if (loading) return (
    <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
      <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] pb-32">
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Card de perfil */}
        <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border-2 border-[#F4D03F]/30 mb-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-[#F4D03F]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
              <User size={32} className="text-[#F4D03F]" />
            </div>
            <div className="flex-1">
              <h2 className="text-white font-bold">{profile?.nome_completo || user.email}</h2>
              <p className="text-[#A0A0B0] text-xs flex items-center gap-1"><Truck size={12} /> Motorista</p>
              <div className="flex items-center gap-1 mt-1">
                <Star size={12} className="text-[#F4D03F] fill-[#F4D03F]" />
                <span className="text-white text-xs font-bold">4.8</span>
              </div>
            </div>
            <div className="text-right">
              <div className={`text-lg font-bold ${online ? 'text-green-400' : 'text-red-400'}`}>
                {online ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
        </div>

        {/* Status e botão online */}
        <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${online ? 'bg-green-500 animate-pulse' : 'bg-red-500'}`} />
              <span className="text-white font-bold">{online ? 'Recebendo solicitações' : 'Não está recebendo solicitações'}</span>
            </div>
            <button
              onClick={toggleOnline}
              className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
                online ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-green-500/20 text-green-400 border border-green-500/30'
              }`}
            >
              {online ? 'Ficar Offline' : 'Ficar Online'}
            </button>
          </div>
        </div>

        {/* Corrida ativa */}
        {activeRide && (
          <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#22C55E]/20 rounded-xl p-4 border border-[#F4D03F]/30 mb-4">
            <h3 className="text-white font-bold text-lg mb-2 flex items-center gap-2">
              <Navigation size={20} className="text-[#F4D03F]" />
              Corrida em andamento
            </h3>
            <div className="space-y-2 bg-[#0F0B1A]/50 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <MapPin size={14} className="text-green-400" />
                <span className="text-white text-sm">{activeRide.origem}</span>
              </div>
              <div className="flex items-center gap-2">
                <Navigation size={14} className="text-red-400" />
                <span className="text-white text-sm">{activeRide.destino}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-white/10">
                <div className="flex items-center gap-1">
                  <DollarSign size={16} className="text-[#F4D03F]" />
                  <span className="text-white font-bold text-lg">R$ {activeRide.valor_total.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={14} className="text-[#A0A0B0]" />
                  <span className="text-[#A0A0B0] text-sm">{activeRide.distancia_km.toFixed(1)} km</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2 mt-3">
              {activeRide.status === 'motorista_em_rota' && (
                <button onClick={handleIniciar} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-sm">
                  🚗 INICIAR CORRIDA
                </button>
              )}
              {activeRide.status === 'em_andamento' && (
                <button onClick={handleFinalizar} className="flex-1 py-3 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-sm">
                  ✅ FINALIZAR CORRIDA
                </button>
              )}
              {(activeRide.status === 'motorista_em_rota') && (
                <button onClick={handleCancelar} className="py-3 px-4 rounded-xl border border-red-500/30 text-red-400 text-sm">
                  Cancelar
                </button>
              )}
            </div>
          </div>
        )}

        {/* Solicitações pendentes */}
        {online && !activeRide && (
          <div className="mb-4">
            <h3 className="text-white font-bold mb-3 flex items-center gap-2">
              <Users size={18} className="text-[#F4D03F]" />
              Solicitações Pendentes ({solicitacoes.length})
            </h3>
            {solicitacoes.length === 0 ? (
              <div className="bg-[#1A1528] rounded-xl p-6 text-center border border-[#F4D03F]/15">
                <Navigation size={32} className="mx-auto mb-2 text-gray-600" />
                <p className="text-white font-medium">Aguardando solicitações...</p>
                <p className="text-[#A0A0B0] text-xs mt-1">As corridas aparecerão aqui</p>
              </div>
            ) : (
              <div className="space-y-2">
                {solicitacoes.map(ride => (
                  <div key={ride.id} className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/20 hover:border-[#F4D03F]/40 transition">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-1">
                        <MapPin size={14} className="text-green-500" />
                        <span className="text-white text-sm font-medium truncate max-w-[200px]">{ride.origem}</span>
                      </div>
                      <span className="text-[#F4D03F] font-bold">R$ {ride.valor_total.toFixed(2)}</span>
                    </div>
                    <div className="flex items-center gap-1 mb-3">
                      <Navigation size={14} className="text-red-400" />
                      <span className="text-[#A0A0B0] text-sm truncate max-w-[250px]">{ride.destino}</span>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-[#A0A0B0] mb-3">
                      <span>🕐 {new Date(ride.created_at).toLocaleTimeString('pt-BR')}</span>
                      <span>📏 {ride.distancia_km.toFixed(1)} km</span>
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => handleAccept(ride)}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white font-bold text-sm"
                      >
                        ✅ ACEITAR
                      </button>
                      <button 
                        onClick={() => setSolicitacoes(prev => prev.filter(r => r.id !== ride.id))}
                        className="flex-1 py-2.5 rounded-xl border border-red-500/30 text-red-400 font-bold text-sm"
                      >
                        ❌ RECUSAR
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Estatísticas do dia */}
        <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15 mb-4">
          <h3 className="text-white font-bold mb-3 flex items-center gap-2">
            <TrendingUp size={16} className="text-[#F4D03F]" />
            Resumo de Hoje
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-[#0F0B1A] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-white">{corridasHoje}</p>
              <p className="text-[#A0A0B0] text-xs">Corridas</p>
            </div>
            <div className="bg-[#0F0B1A] rounded-lg p-3 text-center">
              <p className="text-2xl font-bold text-[#F4D03F]">R$ {ganhosHoje.toFixed(2)}</p>
              <p className="text-[#A0A0B0] text-xs">Ganhos</p>
            </div>
          </div>
        </div>

        {/* Menu do perfil */}
        <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden mb-4">
          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">⚙️ CONFIGURAÇÕES</p>
          </div>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Car size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Meu Veículo ({profile?.dados_veiculo?.modelo || 'Não informado'})</span></div>
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><DollarSign size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Meus Ganhos</span></div>
          </button>
          <button onClick={onLogout} className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 transition">
            <div className="flex items-center gap-2"><LogOut size={16} className="text-red-400" /><span className="text-red-400 text-sm font-medium">Sair da conta</span></div>
          </button>
        </div>
      </div>
    </div>
  );
}