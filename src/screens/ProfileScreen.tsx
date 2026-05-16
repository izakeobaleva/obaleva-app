import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, Car, Truck, Star, Award, Settings, LogOut, Edit, CreditCard, History, Bell, Heart, ChevronRight, Camera, Save, X } from 'lucide-react';

interface ProfileScreenProps {
  user: any;
  profile: any;
  onSignOut: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profile, onSignOut, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome_completo: profile?.nome_completo || '',
    telefone: profile?.telefone || '',
    cpf: profile?.cpf || ''
  });
  const [estatisticas, setEstatisticas] = useState({
    total_corridas: 0,
    distancia_total: 0,
    total_gasto: 0,
    avaliacao_media: 0
  });

  useEffect(() => {
    if (user?.id && profile?.tipo === 'passageiro') {
      carregarEstatisticas();
    }
  }, [user]);

  const carregarEstatisticas = async () => {
    const { data: corridas } = await supabase
      .from('corridas')
      .select('valor_total, distancia_km')
      .eq('passageiro_id', user.id)
      .eq('status', 'finalizada');
    
    if (corridas && corridas.length > 0) {
      const total = corridas.reduce((acc, c) => acc + (c.valor_total || 0), 0);
      const distancia = corridas.reduce((acc, c) => acc + (c.distancia_km || 0), 0);
      setEstatisticas({
        total_corridas: corridas.length,
        distancia_total: distancia,
        total_gasto: total,
        avaliacao_media: 4.8
      });
    }
  };

  const handleUpdateProfile = async () => {
    const { error } = await supabase
      .from('usuarios')
      .update({
        nome_completo: editData.nome_completo,
        telefone: editData.telefone
      })
      .eq('id', user.id);
    
    if (error) {
      alert('Erro ao atualizar: ' + error.message);
    } else {
      alert('✅ Perfil atualizado com sucesso!');
      setIsEditing(false);
      onRefresh();
    }
  };

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-3 pb-28">
        <div className="bg-[#1A1528] rounded-xl p-8 text-center border-2 border-[#F4D03F]/30 mt-4">
          <User className="w-16 h-16 text-[#F4D03F] mx-auto mb-4" />
          <h2 className="text-white text-xl font-bold mb-2">Complete seu cadastro</h2>
          <p className="text-gray-400 mb-6">Escolha se você é passageiro ou motorista</p>
          <div className="space-y-3">
            <button className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">Sou Passageiro</button>
            <button className="w-full py-3 rounded-xl border-2 border-[#F4D03F]/30 text-white font-bold">Sou Motorista</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-3 pb-28">
      {/* Cabeçalho do Perfil */}
      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-xl p-6 border-2 border-[#F4D03F]/30 shadow-xl mt-4">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-4 border-[#F4D03F]/50">
            {profile.tipo === 'passageiro' ? (
              <User className="w-12 h-12 text-[#F4D03F]" />
            ) : (
              <Truck className="w-12 h-12 text-[#F4D03F]" />
            )}
          </div>
          <button className="absolute bottom-0 right-1/3 bg-[#F4D03F] rounded-full p-1.5 shadow-lg">
            <Camera className="w-4 h-4 text-[#1A1528]" />
          </button>
        </div>

        <div className="text-center mt-4">
          {isEditing ? (
            <div className="space-y-2">
              <input type="text" value={editData.nome_completo} onChange={(e) => setEditData({...editData, nome_completo: e.target.value})} className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center" />
              <input type="tel" value={editData.telefone} onChange={(e) => setEditData({...editData, telefone: e.target.value})} className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center" />
              <div className="flex gap-2 mt-2">
                <button onClick={handleUpdateProfile} className="flex-1 py-2 rounded-lg bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-1"><Save size={14} /> Salvar</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 font-bold text-sm flex items-center justify-center gap-1"><X size={14} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-white text-2xl font-bold">{profile.nome_completo}</h2>
              <p className="text-[#A0A0B0] text-sm mt-1 flex items-center justify-center gap-1"><Mail size={14} /> {user.email}</p>
              {profile.telefone && <p className="text-[#A0A0B0] text-sm flex items-center justify-center gap-1"><Phone size={14} /> {profile.telefone}</p>}
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20">
                {profile.tipo === 'passageiro' ? <Car size={14} className="text-[#F4D03F]" /> : <Truck size={14} className="text-[#F4D03F]" />}
                <span className="text-[#F4D03F] text-xs font-bold">{profile.tipo === 'passageiro' ? 'PASSAGEIRO' : 'MOTORISTA'}</span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      {profile.tipo === 'passageiro' && (
        <div className="mt-4">
          <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2"><Award size={20} className="text-[#F4D03F]" /> Minhas Estatísticas</h3>
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">{estatisticas.total_corridas}</div>
              <p className="text-[#A0A0B0] text-xs">Corridas</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">{estatisticas.distancia_total.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-xs">km rodados</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">{estatisticas.total_gasto.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-xs">Total gasto</p>
            </div>
          </div>
          <div className="mt-3 bg-[#1A1528] rounded-xl p-4 text-center border border-[#F4D03F]/15">
            <div className="flex items-center justify-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className={i < Math.floor(estatisticas.avaliacao_media) ? 'text-[#F4D03F] fill-[#F4D03F]' : 'text-gray-500'} />
                ))}
              </div>
              <span className="text-white font-bold">{estatisticas.avaliacao_media}</span>
            </div>
            <p className="text-[#A0A0B0] text-xs mt-1">Média de avaliações</p>
          </div>
        </div>
      )}

      {/* Configurações */}
      <div className="mt-4 mb-8">
        <h3 className="text-white font-bold text-lg mb-3 flex items-center gap-2"><Settings size={20} className="text-[#F4D03F]" /> Configurações</h3>
        <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
              <div className="flex items-center gap-3"><Edit size={18} className="text-[#F4D03F]" /><span className="text-white">Editar perfil</span></div>
              <ChevronRight size={16} className="text-gray-500" />
            </button>
          )}
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><CreditCard size={18} className="text-[#F4D03F]" /><span className="text-white">Formas de pagamento</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><History size={18} className="text-[#F4D03F]" /><span className="text-white">Histórico de corridas</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Bell size={18} className="text-[#F4D03F]" /><span className="text-white">Notificações</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Heart size={18} className="text-[#F4D03F]" /><span className="text-white">Endereços favoritos</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          <button onClick={onSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-500/10 transition">
            <div className="flex items-center gap-3"><LogOut size={18} className="text-red-400" /><span className="text-red-400">Sair da conta</span></div>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;