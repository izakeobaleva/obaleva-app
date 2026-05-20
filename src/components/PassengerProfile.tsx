import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { 
  User, Edit, CreditCard, History, Star, Heart, Bell, Shield, 
  HelpCircle, Truck, LogOut, ChevronRight, Award, MapPin, 
  Save, X, Camera, Phone, Mail, FileText, Lock, CheckCircle, 
  AlertCircle, DollarSign, Calendar, Clock, TrendingUp, 
  MessageCircle, Share2, Smartphone, Home, Briefcase, 
  Navigation, Moon, Sun, Globe, Info, ChevronLeft
} from 'lucide-react';
import TermsScreen from '../pages/TermsScreen';
import PrivacyScreen from '../pages/PrivacyScreen';

interface PassengerProfileProps {
  user: any;
  onLogout: () => void;
  onSejaMotorista: () => void;
  onRefresh: () => void;
}

const PassengerProfile: React.FC<PassengerProfileProps> = ({ user, onLogout, onSejaMotorista, onRefresh }) => {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({ nome_completo: '', telefone: '' });
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showTermsAcceptModal, setShowTermsAcceptModal] = useState(false);
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [fotoPerfil, setFotoPerfil] = useState<string | null>(null);
  const [estatisticas, setEstatisticas] = useState({
    total_corridas: 0,
    distancia_total: 0,
    total_gasto: 0,
    avaliacao_media: 4.8,
    tempo_medio: 0,
    economizado: 0,
  });
  const [favoritos] = useState([
    { id: 1, nome: 'Casa', endereco: 'Rua Santo Antônio, 1095', icone: '🏠' },
    { id: 2, nome: 'Trabalho', endereco: 'Av. Paulista, 1000', icone: '🏢' },
    { id: 3, nome: 'Academia', endereco: 'Rua Augusta, 500', icone: '💪' },
  ]);
  const [recentes] = useState([
    { id: 1, origem: 'Casa', destino: 'Trabalho', data: 'Hoje, 08:30', valor: 15.50 },
    { id: 2, origem: 'Trabalho', destino: 'Casa', data: 'Ontem, 18:45', valor: 18.00 },
    { id: 3, origem: 'Casa', destino: 'Shopping', data: '15/05, 14:20', valor: 22.50 },
  ]);

  useEffect(() => {
    carregarPerfil();
    carregarEstatisticas();
    carregarFoto();
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
        tempo_medio: 12,
        economizado: 45,
      });
    }
  };

  const carregarFoto = async () => {
    const { data } = await supabase.storage.from('avatars').list(`${user.id}/`);
    if (data && data.length > 0) {
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${data[0].name}`);
      setFotoPerfil(url.publicUrl);
    }
  };

  const handleUploadFoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const fileName = `${Date.now()}.jpg`;
    const { error } = await supabase.storage.from('avatars').upload(`${user.id}/${fileName}`, file);
    if (error) {
      alert('Erro ao enviar foto: ' + error.message);
    } else {
      const { data: url } = supabase.storage.from('avatars').getPublicUrl(`${user.id}/${fileName}`);
      setFotoPerfil(url.publicUrl);
      alert('✅ Foto atualizada!');
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
      onRefresh();
    }
    setLoading(false);
  };

  const handleAcceptTerms = async () => {
    await supabase.from('usuarios').update({ termos_aceitos: true }).eq('id', user.id);
    setShowTermsAcceptModal(false);
    carregarPerfil();
    onRefresh();
  };

  if (showTermsAcceptModal) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
        <div className="bg-[#1A1528] rounded-2xl max-w-md w-full p-6 border border-[#F4D03F]/20 shadow-2xl">
          <div className="text-center mb-5">
            <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-3">
              <Shield size={32} className="text-[#F4D03F]" />
            </div>
            <h2 className="text-white text-2xl font-bold">Bem-vindo ao ObaLeva!</h2>
            <p className="text-[#A0A0B0] text-sm mt-2">
              Para começar a usar o aplicativo, você precisa aceitar nossos Termos de Uso e Política de Privacidade.
            </p>
          </div>
          
          <div className="space-y-3">
            <button onClick={() => setShowTermsModal(true)} className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition">
              <FileText size={18} /> 📖 Ler Termos de Uso
            </button>
            <button onClick={() => setShowPrivacyModal(true)} className="w-full py-3.5 rounded-xl bg-white/10 border border-white/20 text-white font-medium flex items-center justify-center gap-2 hover:bg-white/20 transition">
              <Lock size={18} /> 🔒 Ler Política de Privacidade
            </button>
            <button onClick={handleAcceptTerms} className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold flex items-center justify-center gap-2 mt-4">
              <CheckCircle size={18} /> ✅ ACEITAR E CONTINUAR
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (showTermsModal) return <TermsScreen onBack={() => setShowTermsModal(false)} user={user} />;
  if (showPrivacyModal) return <PrivacyScreen onBack={() => setShowPrivacyModal(false)} user={user} />;

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0F0B1A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin w-10 h-10 border-2 border-[#F4D03F] border-t-transparent rounded-full mx-auto mb-3" />
          <p className="text-white">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  if (activeMenu === 'historico') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-24 pt-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setActiveMenu(null)} className="text-[#A0A0B0] hover:text-white">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-xl font-bold">📜 Histórico de Corridas</h1>
          </div>
          <div className="space-y-3">
            {recentes.map((corrida) => (
              <div key={corrida.id} className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-white font-bold">{corrida.origem} → {corrida.destino}</p>
                    <p className="text-[#A0A0B0] text-xs mt-1">{corrida.data}</p>
                  </div>
                  <p className="text-[#F4D03F] font-bold">R$ {corrida.valor.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (activeMenu === 'favoritos') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
        <div className="max-w-md mx-auto px-4 pb-24 pt-4">
          <div className="flex items-center gap-3 mb-5">
            <button onClick={() => setActiveMenu(null)} className="text-[#A0A0B0] hover:text-white">
              <ChevronLeft size={24} />
            </button>
            <h1 className="text-white text-xl font-bold">❤️ Endereços Favoritos</h1>
          </div>
          <div className="space-y-3">
            {favoritos.map((fav) => (
              <div key={fav.id} className="bg-[#1A1528] rounded-xl p-4 border border-[#F4D03F]/15 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#F4D03F]/20 flex items-center justify-center text-xl">
                  {fav.icone}
                </div>
                <div className="flex-1">
                  <p className="text-white font-bold">{fav.nome}</p>
                  <p className="text-[#A0A0B0] text-xs">{fav.endereco}</p>
                </div>
                <button className="text-[#F4D03F] text-xs">Editar</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528]">
      <div className="max-w-md mx-auto px-4 pb-24 pt-4">
        
        <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-5 border-2 border-[#F4D03F]/30 shadow-xl">
          <div className="relative">
            <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-lg overflow-hidden">
              {fotoPerfil ? (
                <img src={fotoPerfil} alt="Perfil" className="w-full h-full object-cover" />
              ) : (
                <User size={44} className="text-[#F4D03F]" />
              )}
            </div>
            <label className="absolute bottom-0 right-1/3 bg-[#F4D03F] rounded-full p-2 shadow-lg hover:scale-105 transition cursor-pointer">
              <Camera size={14} className="text-black" />
              <input type="file" className="hidden" accept="image/*" onChange={handleUploadFoto} />
            </label>
          </div>

          <div className="text-center mt-4">
            {isEditing ? (
              <div className="space-y-3">
                <input
                  type="text"
                  value={editData.nome_completo}
                  onChange={(e) => setEditData({ ...editData, nome_completo: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-center text-base focus:border-[#F4D03F] outline-none"
                  placeholder="Nome completo"
                />
                <input
                  type="tel"
                  value={editData.telefone}
                  onChange={(e) => setEditData({ ...editData, telefone: e.target.value })}
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white text-center text-base focus:border-[#F4D03F] outline-none"
                  placeholder="Telefone"
                />
                <div className="flex gap-3 mt-3">
                  <button onClick={handleUpdateProfile} className="flex-1 py-2.5 rounded-xl bg-green-500 text-white text-sm font-bold flex items-center justify-center gap-2">
                    <Save size={16} /> Salvar
                  </button>
                  <button onClick={() => setIsEditing(false)} className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm font-bold flex items-center justify-center gap-2">
                    <X size={16} /> Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-white text-xl font-bold">{profile?.nome_completo || user.email.split('@')[0]}</h2>
                <p className="text-[#A0A0B0] text-xs mt-1 flex items-center justify-center gap-1">
                  <Mail size={12} /> {user.email}
                </p>
                {profile?.telefone && (
                  <p className="text-[#A0A0B0] text-xs flex items-center justify-center gap-1 mt-0.5">
                    <Phone size={12} /> {profile.telefone}
                  </p>
                )}
                <div className="inline-flex items-center gap-2 mt-3 px-4 py-1.5 rounded-full bg-[#F4D03F]/20">
                  <span className="text-[#F4D03F] text-xs font-bold">🚶 PASSAGEIRO</span>
                </div>
                <button 
                  onClick={() => setIsEditing(true)} 
                  className="mt-3 text-[#F4D03F] text-xs flex items-center justify-center gap-1 w-full hover:underline transition"
                >
                  <Edit size={12} /> Editar perfil
                </button>
              </>
            )}
          </div>
        </div>

        <div className="mt-5">
          <h3 className="text-white font-bold text-sm mb-2 flex items-center gap-2">
            <Award size={16} className="text-[#F4D03F]" /> Minhas Estatísticas
          </h3>
          <div className="grid grid-cols-3 gap-2">
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">{estatisticas.total_corridas}</div>
              <p className="text-[#A0A0B0] text-[10px]">Corridas</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">{estatisticas.distancia_total.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-[10px]">km rodados</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
              <div className="text-2xl font-bold text-white">R$ {estatisticas.total_gasto.toFixed(0)}</div>
              <p className="text-[#A0A0B0] text-[10px]">Total gasto</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 mt-2">
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="flex items-center justify-center gap-1">
                <Clock size={12} className="text-[#F4D03F]" />
                <span className="text-white text-sm font-bold">{estatisticas.tempo_medio} min</span>
              </div>
              <p className="text-[#A0A0B0] text-[9px]">Tempo médio</p>
            </div>
            <div className="bg-[#1A1528] rounded-xl p-2 text-center border border-[#F4D03F]/15">
              <div className="flex items-center justify-center gap-1">
                <TrendingUp size={12} className="text-[#F4D03F]" />
                <span className="text-white text-sm font-bold">R$ {estatisticas.economizado}</span>
              </div>
              <p className="text-[#A0A0B0] text-[9px]">Economizado</p>
            </div>
          </div>

          <div className="mt-2 bg-[#1A1528] rounded-xl p-3 text-center border border-[#F4D03F]/15">
            <div className="flex items-center justify-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={16} className={i < Math.floor(estatisticas.avaliacao_media) ? 'text-[#F4D03F] fill-[#F4D03F]' : 'text-gray-500'} />
              ))}
              <span className="text-white text-base font-bold ml-2">{estatisticas.avaliacao_media}</span>
            </div>
            <p className="text-[#A0A0B0] text-[10px]">Média de avaliações</p>
          </div>
        </div>

        <div className="mt-5 bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">⚙️ CONFIGURAÇÕES</p>
          </div>
          
          <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Edit size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Editar perfil</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><CreditCard size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Formas de pagamento</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button onClick={() => setActiveMenu('historico')} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><History size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Histórico de corridas</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button onClick={() => setActiveMenu('favoritos')} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Heart size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Endereços favoritos</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">📜 LEGAL</p>
          </div>

          <button onClick={() => setShowTermsModal(true)} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><FileText size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Termos de Uso</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button onClick={() => setShowPrivacyModal(true)} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Lock size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Política de Privacidade</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">🔔 PREFERÊNCIAS</p>
          </div>

          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Bell size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Notificações</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Globe size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Idioma</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Moon size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Tema escuro</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">🛡️ SEGURANÇA E AJUDA</p>
          </div>

          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Shield size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Central de segurança</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><HelpCircle size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Central de ajuda</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><MessageCircle size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Fale conosco</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <div className="p-3 border-b border-white/10 bg-[#F4D03F]/5">
            <p className="text-[#F4D03F] text-xs font-bold">🌟 RECURSOS EXTRAS</p>
          </div>

          <button onClick={onSejaMotorista} className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Truck size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Seja Motorista</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>
          
          <button className="w-full flex items-center justify-between p-3.5 hover:bg-white/5 transition border-b border-white/10">
            <div className="flex items-center gap-3"><Share2 size={18} className="text-[#F4D03F]" /><span className="text-white text-sm">Convidar amigos</span></div>
            <ChevronRight size={16} className="text-gray-500" />
          </button>

          <button onClick={onLogout} className="w-full flex items-center justify-between p-3.5 hover:bg-red-500/10 transition">
            <div className="flex items-center gap-3"><LogOut size={18} className="text-red-400" /><span className="text-red-400 text-sm font-medium">Sair da conta</span></div>
            <ChevronRight size={16} className="text-red-400" />
          </button>
        </div>

        <div className="mt-6 text-center">
          <p className="text-[#A0A0B0] text-[10px]">Versão 1.0.0</p>
          <p className="text-[#A0A0B0] text-[10px] mt-1">© 2026 ObaLeva - Sua corrida de confiança</p>
        </div>
      </div>
    </div>
  );
};

export default PassengerProfile;