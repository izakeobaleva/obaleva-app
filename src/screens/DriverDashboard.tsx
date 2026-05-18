import { useState } from 'react';
import { Truck, Bell, Clock, DollarSign, TrendingUp } from 'lucide-react';

interface DriverDashboardProps {
  user: any;
  onSignOut: () => void;
}

export function DriverDashboard({ user, onSignOut }: DriverDashboardProps) {
  const [online, setOnline] = useState(true);
  const [stats] = useState({
    corridasHoje: 3,
    ganhosHoje: 45.0,
    corridasSemana: 15,
    ganhosSemana: 225.0,
    solicitacoesPendentes: 2,
  });

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="flex justify-between items-center py-3">
        <div className="flex items-center gap-2">
          <Truck size={24} className="text-[#F4D03F]" />
          <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        </div>
        <button
          onClick={onSignOut}
          className="px-4 py-2 rounded-lg bg-red-500 text-white text-sm font-bold hover:bg-red-600 transition"
        >
          SAIR
        </button>
      </div>

      {/* Status Online/Offline */}
      <div className="bg-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20 mb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-[#A0A0B0] text-sm">Status</p>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-3 h-3 rounded-full ${online ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}
              />
              <span className="text-white font-bold">{online ? 'Online' : 'Offline'}</span>
            </div>
          </div>
          <button
            onClick={() => setOnline(!online)}
            className={`px-5 py-2 rounded-xl font-bold text-sm transition ${
              online
                ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                : 'bg-green-500/20 text-green-400 border border-green-500/30'
            }`}
          >
            {online ? '🔴 Ficar Offline' : '🟢 Ficar Online'}
          </button>
        </div>
      </div>

      {/* Estatísticas do dia */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15">
          <div className="flex items-center gap-2 mb-2">
            <Clock size={16} className="text-[#F4D03F]" />
            <span className="text-[#A0A0B0] text-xs">Hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">{stats.corridasHoje}</p>
          <p className="text-[#A0A0B0] text-xs">corridas</p>
        </div>
        <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15">
          <div className="flex items-center gap-2 mb-2">
            <DollarSign size={16} className="text-[#F4D03F]" />
            <span className="text-[#A0A0B0] text-xs">Ganhos hoje</span>
          </div>
          <p className="text-2xl font-bold text-white">R$ {stats.ganhosHoje.toFixed(2)}</p>
          <p className="text-[#A0A0B0] text-xs">receita</p>
        </div>
      </div>

      {/* Estatísticas da semana */}
      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15 mb-4">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp size={18} className="text-[#F4D03F]" />
          <span className="text-white font-bold text-sm">Resumo da Semana</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-[#A0A0B0] text-sm">Corridas</span>
          <span className="text-white font-bold">{stats.corridasSemana}</span>
        </div>
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-[#A0A0B0] text-sm">Ganhos</span>
          <span className="text-white font-bold">R$ {stats.ganhosSemana.toFixed(2)}</span>
        </div>
        <div className="flex justify-between items-center py-2">
          <span className="text-[#A0A0B0] text-sm">Média por corrida</span>
          <span className="text-white font-bold">
            R$ {(stats.ganhosSemana / stats.corridasSemana).toFixed(2)}
          </span>
        </div>
      </div>

      {/* Solicitações pendentes */}
      <div className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15">
        <div className="flex items-center gap-2 mb-3">
          <Bell size={18} className="text-[#F4D03F]" />
          <span className="text-white font-bold text-sm">Solicitações Pendentes</span>
          {stats.solicitacoesPendentes > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full ml-auto">
              {stats.solicitacoesPendentes}
            </span>
          )}
        </div>
        {stats.solicitacoesPendentes > 0 ? (
          <div className="space-y-2">
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">Passageiro: João</p>
                  <p className="text-[#A0A0B0] text-xs">📍 Av. Paulista → Shopping</p>
                  <p className="text-[#F4D03F] text-xs font-bold mt-1">R$ 18,50</p>
                </div>
                <button className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                  Aceitar
                </button>
              </div>
            </div>
            <div className="bg-white/5 rounded-xl p-3 border border-white/10">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-white font-medium text-sm">Passageiro: Maria</p>
                  <p className="text-[#A0A0B0] text-xs">📍 Centro → Aeroporto</p>
                  <p className="text-[#F4D03F] text-xs font-bold mt-1">R$ 35,00</p>
                </div>
                <button className="bg-green-500 text-white px-3 py-1.5 rounded-lg text-xs font-bold">
                  Aceitar
                </button>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-[#A0A0B0] text-sm">Nenhuma solicitação no momento</p>
            <p className="text-[#A0A0B0] text-xs mt-1">Aguardando novas corridas...</p>
          </div>
        )}
      </div>
    </div>
  );
}