import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Edit, CreditCard, History, Star, Heart, Bell, Shield, HelpCircle, Truck, LogOut, ChevronRight, Award, Save, X, Camera, Phone, Mail } from 'lucide-react';
import TermsScreen from '../pages/TermsScreen';
import PrivacyScreen from '../pages/PrivacyScreen';

interface PassengerProfileProps {
  user: any;
  onLogout: () => void;
  onSejaMotorista: () => void;
}

const PassengerProfile: React.FC<PassengerProfileProps> = ({ user, onLogout, onSejaMotorista }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome_completo: '', telefone: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsAcceptModal, setShowTermsAcceptModal] = useState(false);
  const [estatisticas, setEstatisticas] = useState({
    total_corridas: 0,
    distancia_total: 0,
    total_gasto: 0,
    avaliacao_media: 4.8,
  });

  useEffect(() => {
    carregarPerfil();
    carregarEstatisticas();
  }, [user]);

  const carregarPerfil = async () => {
    const { data } = await supabase.from('usuarios').select('*').eq('id', user.id).single();
    setProfile(data);
    setEditData({ nome_completo: data?.nome_completo || '', telefone: data?.telefone || '' });
    
    if (data && data.termos_aceitos === false) {
      setShowTermsAcceptModal(true);
    }
    setLoading(false);
  };

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
        avaliacao_media: 4.8,
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

  const handleAcceptTerms = async () => {
    await supabase.from('usuarios').update({ termos_aceitos: true }).eq('id', user.id);
    setShowTermsAcceptModal(false);
    carregarPerfil();
  };

  if (showTermsAcceptModal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="bg-[#1A1528] rounded-2xl max-w-md w-full p-6 border border-[#F4D03F]/20">
          <div className="text-center mb-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
              <Shield size={28} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-xl font-bold">Aceite os Termos</h2>
            <p className="text-[#A0A0B0] text-sm mt-2">
              Para continuar usando o ObaLeva, você precisa aceitar nossos Termos de Uso e Política de Privacidade.
            </p>
          </div>
          <div className="space-y-3">
            <button onClick={() => setShowTermsModal(true)} className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium">📖 Ler Termos de Uso</button>
            <button onClick={() => setShowPrivacyModal(true)} className="w-full py-3 rounded-xl bg-white/10 border border-white/20 text-white font-medium">🔒 Ler Política de Privacidade</button>
            <button onClick={handleAcceptTerms} className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold">✅ ACEITAR E CONTINUAR</button>
          </div>
        </div>
      </div>
    );
  }

  if (showTermsModal) {
    return <TermsScreen onBack={() => setShowTermsModal(false)} />;
  }
  if (showPrivacyModal) {
    return <PrivacyScreen onBack={() => setShowPrivacyModal(false)} />;
  }

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
                  <span className="text-[#F4D03F] text-xs font-bold">PASSAGEIRO</span>
                </div>
                <button onClick={() => setIsEditing(true)} className="mt-2 text-[#F4D03F] text-xs flex items-center justify-center gap-1 w-full"><Edit size={12} /> Editar perfil</button>
              </>
            )}
          </div>
        </div>

        <div className="mt-4">
          <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2"><Award size={16} className="text-[#F4D03F]" /> Minhas Estatísticas</h3>
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
            <div className="flex items-center gap-2"><Heart size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Endereços favoritos</span></div>
            <ChevronRight size={14} className="text-gray-500" />
          </button>
          <button onClick={onSejaMotorista} className="w-full flex items-center justify-between p-3 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-2"><Truck size={16} className="text-[#F4D03F]" /><span className="text-white text-sm">Seja Motorista</span></div>
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

export default PassengerProfile;