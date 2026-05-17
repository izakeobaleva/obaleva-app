import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { User, Mail, Phone, Car, Truck, Star, LogOut, Edit, Save, X } from 'lucide-react';

interface ProfileScreenProps {
  user: any;
  profile: any;
  onSignOut: () => void;
  onRefresh: () => void;
}

const ProfileScreen: React.FC<ProfileScreenProps> = ({ user, profile, onSignOut, onRefresh }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    nome_completo: profile?.nome_completo || '',
    telefone: profile?.telefone || '',
    cpf: profile?.cpf || ''
  });

  if (!profile || !profile.nome_completo) {
    return <CompleteProfile user={user} onComplete={onRefresh} />;
  }

  const handleUpdate = async () => {
    setLoading(true);
    const { error } = await supabase
      .from('usuarios')
      .update({ nome_completo: formData.nome_completo, telefone: formData.telefone })
      .eq('id', user.id);
    
    if (error) {
      alert('Erro: ' + error.message);
    } else {
      alert('✅ Perfil atualizado!');
      setIsEditing(false);
      onRefresh();
    }
    setLoading(false);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-6 border-2 border-[#F4D03F]/30 mt-4">
        <div className="text-center">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-3">
            {profile.tipo === 'passageiro' ? <Car size={32} className="text-[#F4D03F]" /> : <Truck size={32} className="text-[#F4D03F]" />}
          </div>
          
          {isEditing ? (
            <div className="space-y-2">
              <input type="text" value={formData.nome_completo} onChange={(e) => setFormData({...formData, nome_completo: e.target.value})} className="w-full p-2 rounded-lg bg-white/10 text-white text-center" />
              <input type="tel" value={formData.telefone} onChange={(e) => setFormData({...formData, telefone: e.target.value})} className="w-full p-2 rounded-lg bg-white/10 text-white text-center" />
              <div className="flex gap-2">
                <button onClick={handleUpdate} disabled={loading} className="flex-1 py-2 rounded-lg bg-green-500 text-white flex items-center justify-center gap-1"><Save size={16} /> Salvar</button>
                <button onClick={() => setIsEditing(false)} className="flex-1 py-2 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center gap-1"><X size={16} /> Cancelar</button>
              </div>
            </div>
          ) : (
            <>
              <h2 className="text-white text-xl font-bold">{profile.nome_completo}</h2>
              <p className="text-[#A0A0B0] text-sm mt-1">{user?.email}</p>
              {profile.telefone && <p className="text-[#A0A0B0] text-sm">{profile.telefone}</p>}
              <div className="inline-block mt-2 px-3 py-1 rounded-full bg-[#F4D03F]/20">
                <span className="text-[#F4D03F] text-xs font-bold">{profile.tipo?.toUpperCase()}</span>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="mt-4 bg-[#1A1528] rounded-xl border border-[#F4D03F]/15 overflow-hidden">
        {!isEditing && (
          <button onClick={() => setIsEditing(true)} className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3"><Edit size={18} className="text-[#F4D03F]" /><span className="text-white">Editar perfil</span></div>
            <span className="text-gray-500">→</span>
          </button>
        )}
        <button className="w-full flex items-center justify-between p-4 hover:bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-3"><Star size={18} className="text-[#F4D03F]" /><span className="text-white">Avaliações</span></div>
          <span className="text-gray-500">→</span>
        </button>
        <button onClick={onSignOut} className="w-full flex items-center justify-between p-4 hover:bg-red-500/10">
          <div className="flex items-center gap-3"><LogOut size={18} className="text-red-400" /><span className="text-red-400">Sair da conta</span></div>
          <span className="text-red-400">→</span>
        </button>
      </div>
    </div>
  );
};

const CompleteProfile = ({ user, onComplete }: any) => {
  const [nome, setNome] = useState('');
  const [telefone, setTelefone] = useState('');
  const [tipo, setTipo] = useState('passageiro');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!nome) {
      alert('Por favor, digite seu nome completo');
      return;
    }
    
    setLoading(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .insert({
          id: user.id,
          nome_completo: nome,
          telefone: telefone,
          email: user.email,
          tipo: tipo
        });
      
      if (error) throw error;
      
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: user.id });
      } else {
        await supabase.from('motoristas').insert({ id: user.id, status: 'pendente' });
      }
      
      alert('✅ Perfil criado com sucesso!');
      onComplete();
    } catch (error: any) {
      alert('Erro: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-28">
      <div className="bg-gradient-to-br from-[#1A1528] to-[#2D2342] rounded-2xl p-6 border-2 border-[#F4D03F]/30 mt-4">
        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto rounded-full bg-[#F4D03F]/30 flex items-center justify-center mb-3">
            <User size={32} className="text-[#F4D03F]" />
          </div>
          <h2 className="text-white text-xl font-bold">Complete seu cadastro</h2>
          <p className="text-[#A0A0B0] text-sm">Você está logado com {user?.email}</p>
        </div>

        <div className="space-y-4">
          <div className="bg-white/10 rounded-xl border border-white/15">
            <div className="flex items-center gap-3 px-4 py-3">
              <User size={18} className="text-[#A0A0B0]" />
              <input type="text" placeholder="Nome completo" className="flex-1 bg-transparent text-white outline-none" value={nome} onChange={(e) => setNome(e.target.value)} />
            </div>
          </div>

          <div className="bg-white/10 rounded-xl border border-white/15">
            <div className="flex items-center gap-3 px-4 py-3">
              <Phone size={18} className="text-[#A0A0B0]" />
              <input type="tel" placeholder="Telefone (opcional)" className="flex-1 bg-transparent text-white outline-none" value={telefone} onChange={(e) => setTelefone(e.target.value)} />
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={() => setTipo('passageiro')} className={`flex-1 py-3 rounded-xl border-2 transition ${tipo === 'passageiro' ? 'border-[#F4D03F] bg-[#F4D03F]/20 text-[#F4D03F]' : 'border-white/20 text-white'}`}>
              🚗 Passageiro
            </button>
            <button onClick={() => setTipo('motorista')} className={`flex-1 py-3 rounded-xl border-2 transition ${tipo === 'motorista' ? 'border-[#F4D03F] bg-[#F4D03F]/20 text-[#F4D03F]' : 'border-white/20 text-white'}`}>
              🚛 Motorista
            </button>
          </div>

          <button onClick={handleComplete} disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold">
            {loading ? 'Salvando...' : '✅ COMPLETAR CADASTRO'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProfileScreen;