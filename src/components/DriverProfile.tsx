import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Edit, CreditCard, History, Star, Bell, Shield, HelpCircle, LogOut, ChevronRight, Award, Truck, Car, DollarSign, Phone, Mail, Camera, Save, X } from 'lucide-react';

interface DriverProfileProps {
  user: any;
  onLogout: () => void;
}

const DriverProfile: React.FC<DriverProfileProps> = ({ user, onLogout }) => {
  const [profile, setProfile] = useState<any>(null);
  const [veiculo, setVeiculo] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [online, setOnline] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome_completo: '', telefone: '' });
  const [estatisticas, setEstatisticas] = useState({
    total_corridas: 0,
    distancia_total: 0,
    faturamento_total: 0,
    avaliacao_media: 4.9,
    corridas_hoje: 0,
    faturamento_hoje: 0,
  });

  useEffect(() => {
    carregarPerfil();
    carregarEstatisticas();
  }, [user]);

  const carregarPerfil = async () => {
    const { data: userData } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    const { data: motoristaData } = await supabase.from('motoristas').select('*').eq('id', user.id).single();
    setProfile(userData);
    setEditData({ nome_completo: userData?.nome_completo || '', telefone: userData?.telefone || '' });
    setVeiculo(motoristaData?.dados_veiculo);
    setLoading(false);
  };

  const carregarEstatisticas = async () => {
    const { data: corridas } = await supabase
      .from('corridas')
      .select('valor_total, distancia_km')
      .eq('motorista_id', user.id)
      .eq('status', 'finalizada');
    
    if (corridas && corridas.length > 0) {
      const total = corridas.reduce((acc, c) => acc + (c.valor_total || 0), 0);
      const distancia = corridas.reduce((acc, c) => acc + (c.distancia_km || 0), 0);
      setEstatisticas({
        total_corridas: corridas.length,
        distancia_total: distancia,
        faturamento_total: total,
        avaliacao_media: 4.9,
        corridas_hoje: 3,
        faturamento_hoje: 45,
      });
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('usuarios')
      .update({ nome_completo: editData.nome_completo, telefone: editData.telefone })
      .eq('id', user.id);
    
    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      alert('✅ Perfil atualizado!');
      setIsEditing(false);
      carregarPerfil();
    }
    setLoading(false);
  };

  if (loading) {
    return <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center"><div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full" /></div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24 pt-4">
        <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border-2 border-[#F4D03F]/30 shadow-xl">
          <div className="relative">
            <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
              <User size={40} className="text-[#F4D03F]" />
            </div>
            <button className="absolute bottom-0 right-1/3 bg-[#F4D03F] rounded-full p-1.5 shadow-lg">
              <Camera size={12} className="text-black" />
            </button>
          </div>

          <div className="text-center mt-3">
            {isEditing ? (
              <div className="space-y-2">
                <input type="text" value={editData.nome_completo} onChange={(e) => setEditData({ ...editData, nome_completo: e.target.value })} className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center text-base" placeholder="Nome completo" />
                <input type="tel" value={editData.telefone} onChange={(e) => setEditData({ ...editData, telefone: e.target.value })} className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center text-base" placeholder="Telefone" />
                <div className="flex gap-2 mt-2">
                  <button onClick={handleUpdateProfile} className="flex-1 py-2 rounded-lg bg-green-500 text-white text-sm font-bold flex items-center justify-center gap-1"><Save size={14} /> Salvar</button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 text-sm font-bold flex items-center justify-center gap-1"><X size={14} /> Cancelar</button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-white text-lg font-bold">{profile?.nome_completo || user.email}</h2>
                <p className="text-[#A0A0B0] text-xs mt-1 flex items-center justify-center gap-1"><Mail size={12} /> {user.email}</p>
                {profile?.telefone && <p className="text-[#A0A0B0] text-xs flex items-center justify-center gap-1"><Phone size={12} /> {profile.telefone}</p>}
                <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20">
                  <Truck size={14} className="text-[#F4D03F]" />
                  <span className="text-[#F4D03F] text-xs font-bold">MOTORISTA</span>
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-2 text-[#F4D03F] text-xs flex items-center justify-center gap-1 w-full"><Edit size={12} /> Editar perfil</button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4 bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className={`w-2 h-2 rounded-full animate-pulse ${online ? 'bg-green-500' : 'bg-red-500'}`} />
            <span className={`text-sm font-bold ${online ? 'text-green-400' : 'text-red-400'}`}>{online ? 'ONLINE' : 'OFFLINE'}</span>
          </div>
          <button onClick={() => setOnline(!online)} className={`px-4 py-1.5 rounded-lg text-xs font-bold ${online ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
            {online ? '🔴 Ficar Offline' : '🟢 Ficar Online'}
          </button>
        </div>

        <div className="mt-4">
          <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Award size={16} className="text-[#F4D03F]" /> Meus Ganhos</h3>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-lg font-bold text-white">{estatisticas.corridas_hoje}</div>
              <p className="text-[#A0A0B0] text-[10px]">Corridas hoje</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-lg font-bold text-white">R$ {estatisticas.faturamento_hoje.toFixed(2)}</div>
              <p className="text-[#A0A0B0] text-[10px]">Faturamento hoje</p>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-md font-bold text-white">{estatisticas.total_corridas}</div>
              <p className="text-[#A0A0B0] text-[9px]">Total corridas</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-md font-bold text-white">{estatisticas.distancia_total.toFixed(0)}km</div>
              <p className="text-[#A0A0B0] text-[9px]">Distância</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-md font-bold text-white">R$ {estatisticas.faturamento_total.toFixed(2)}</div>
              <p className="text-[#A0A0B0] text-[9px]">Total</p>
            </div>
          </div>
          <div className="mt-2 bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={14} className={i < Math.floor(estatisticas.avaliacao_media) ? 'text-[#F4D03F] fill-[#F4D03F]' : 'text-gray-500'} />
              ))}
              <span className="text-white text-sm font-bold ml-1">{estatisticas.avaliacao_media}</span>
            </div>
            <p className="text-[#A0A0B0] text-[10px]">Média de avaliações</p>
          </div>
        </div>

        <div className="mt-4 bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15">
          <div className="flex items-center gap-2 mb-2"><Car size={16} className="text-[#F4D03F]" /><h3 className="text-white font-bold text-sm">Meu Veículo</h3></div>
          <p className="text-white text-sm">🚗 {veiculo?.modelo || 'Não informado'}</p>
          <p className="text-[#A0A0B0] text-xs">Placa: {veiculo?.placa || 'Não informada'}</p>
          <p className="text-[#A0A0B0] text-xs">Cor: {veiculo?.cor || 'Não informada'}</p>
          <button className="mt-2 text-[#F4D03F] text-xs flex items-center gap-1"><Edit size={12} /> Editar veículo</button>
        </div>

        <div className="mt-4 bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
          <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Edit size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Editar perfil</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><CreditCard size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Formas de pagamento</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><History size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Histórico de corridas</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><DollarSign size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Meus ganhos</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Bell size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Notificações</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Shield size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Segurança</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><HelpCircle size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Ajuda</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button onClick={onLogout} className="w-full flex items-center justify-between p-3 hover:bg-red-500/10 transition">
            <div className="flex items-center gap-2"><LogOut size={16} className="text-red-400" /><span className="text-red-400 text-sm">Sair da conta</span></div>
            <ChevronRight size={14} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default DriverProfile;