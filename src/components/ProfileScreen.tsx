import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Mail, Phone, Car, Truck, Star, Calendar, Settings, 
  LogOut, Edit, CreditCard, History, Bell, Heart, ChevronRight,
  Camera, Save, X, MapPin, Award, Shield, HelpCircle, MessageCircle
} from 'lucide-react';

interface ProfileScreenProps {
  user: any;
  onLogout: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, onLogout, onRefresh }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    nome_completo: '',
    telefone: '',
  });
  const [estatisticas, setEstatisticas] = useState({
    total_corridas: 0,
    distancia_total: 0,
    total_gasto: 0,
    avaliacao_media: 4.8,
    tempo_medio: 0,
  });

  useEffect(() => {
    carregarPerfil();
  }, [user]);

  const carregarPerfil = async () => {
    setLoading(true);
    try {
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user.id)
        .single();

      if (userError) throw userError;

      setProfile(userData);
      setEditData({
        nome_completo: userData?.nome_completo || '',
        telefone: userData?.telefone || '',
      });

      const { data: corridas, error: corridasError } = await supabase
        .from('corridas')
        .select('valor_total, distancia_km, status')
        .eq('passageiro_id', user.id)
        .eq('status', 'finalizada');

      if (!corridasError && corridas) {
        const total = corridas.reduce((acc, c) => acc + (c.valor_total || 0), 0);
        const distancia = corridas.reduce((acc, c) => acc + (c.distancia_km || 0), 0);
        setEstatisticas({
          total_corridas: corridas.length,
          distancia_total: distancia,
          total_gasto: total,
          avaliacao_media: 4.8,
          tempo_medio: 0,
        });
      }
    } catch (error) {
      console.error('Erro ao carregar perfil:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: editData.nome_completo,
          telefone: editData.telefone,
        })
        .eq('id', user.id);

      if (error) throw error;

      alert('✅ Perfil atualizado com sucesso!');
      setIsEditing(false);
      carregarPerfil();
      onRefresh();
    } catch (error: any) {
      alert('❌ Erro ao atualizar: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-md mx-auto px-4 pb-28 mt-8">
        <div className="bg-[#1A1528] rounded-2xl p-8 text-center border border-[#F4D03F]/20">
          <div className="animate-spin w-8 h-8 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto px-4 pb-28 mt-8">
        <div className="bg-[#1A1528] rounded-2xl p-6 text-center border border-[#F4D03F]/20">
          <User size={48} className="text-[#F4D03F] mx-auto mb-3" />
          <h2 className="text-white text-xl font-bold">Complete seu cadastro</h2>
          <p className="text-gray-400 text-sm mt-2">Adicione suas informações para continuar</p>
          <button className="mt-4 px-6 py-2 rounded-xl bg-[#F4D03F] text-black font-bold">
            Completar cadastro
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border-2 border-[#F4D03F]/30 shadow-xl mt-4">
        <div className="relative">
          <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50">
            {profile.tipo === 'passageiro' ? (
              <User size={48} className="text-[#F4D03F]" />
            ) : (
              <Truck size={48} className="text-[#F4D03F]" />
            )}
          </div>
          <button className="absolute bottom-0 right-1/3 bg-[#F4D03F] rounded-full p-1.5 shadow-lg">
            <Camera size={14} className="text-black" />
          </button>
        </div>

        <div className="text-center mt-3">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                value={editData.nome_completo}
                onChange={(e) => setEditData({ ...editData, nome_completo: e.target.value })}
                className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center"
                placeholder="Nome completo"
              />
              <input
                type="tel"
                value={editData.telefone}
                onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                className="w-full p-2 rounded-lg bg-white/10 border border-white/15 text-white text-center"
                placeholder="Telefone"
              />
              <div className="flex gap-2 mt-2">
                <button onClick={handleUpdateProfile} className="flex-1 py-1.5 rounded-lg bg-green-500 text-white text-sm font-bold flex items-center justify-center gap-1">
                  <Save size={14} /> Salvar
                </button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-1.5 rounded-lg bg-red-500/20 text-red-400 text-sm font-bold flex items-center justify-center gap-1">
                  <X size={14} /> Cancelar
                </button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-white text-xl font-bold">{profile.nome_completo}</h2>
              <p className="text-[#A0A0B0] text-sm mt-1 flex items-center justify-center gap-1">
                <Mail size={14} /> {user.email}
              </p>
              {profile.telefone && (
                <p className="text-[#A0A0B0] text-sm flex items-center justify-center gap-1">
                  <Phone size={14} /> {profile.telefone}
                </p>
              )}
              <div className="inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20">
                {profile.tipo === 'passageiro' ? (
                  <Car size={14} className="text-[#F4D03F]" />
                ) : (
                  <Truck size={14} className="text-[#F4D03F]" />
                )}
                <span className="text-[#F4D03F] text-xs font-bold">
                  {profile.tipo === 'passageiro' ? 'PASSAGEIRO' : 'MOTORISTA'}
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {profile.tipo === 'passageiro' && (
        <div className="mt-4">
          <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
            <Award size={16} className="text-[#F4D03F]" /> Minhas Estatísticas
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-lg font-bold text-white">{estatisticas.total_corridas}</div>
              <p className="text-[#A0A0B0] text-[10px]">Corridas</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-lg font-bold text-white">{estatisticas.distancia_total.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-[10px]">km rodados</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="text-lg font-bold text-white">R$ {estatisticas.total_gasto.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-[10px]">Total gasto</p>
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
      )}

      <div className="mt-4 mb-8">
        <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
          <Settings size={16} className="text-[#F4D03F]" /> Configurações
        </h3>
        <div className="bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
          {!isEditing && (
            <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
              <div className="flex items-center gap-2"><Edit size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Editar perfil</span></div>
              <ChevronRight size={14} className="text-gray-500" />
            </button>
          )}
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><CreditCard size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Formas de pagamento</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><History size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Histórico de corridas</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Star size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Minhas avaliações</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Bell size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Notificações</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Heart size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Endereços favoritos</span></div>
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
          <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><MessageCircle size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Fale conosco</span></div>
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

export default ProfileScreen;