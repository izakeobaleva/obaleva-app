import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, User, Mail, Phone, Camera, Upload, 
  Briefcase, History, CreditCard, Settings, LogOut,
  FileText, Shield, Smartphone, Edit2, Users
} from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  vinho: '#800020',
  vermelho: '#ef4444',
  verde: '#22c55e',
  fundo: '#0f0f0f',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editingSection, setEditingSection] = useState(false);
  
  const [userData, setUserData] = useState({
    nome: user?.user_metadata?.name || 'Passageiro',
    email: user?.email || '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: ''
  });
  const [editFormData, setEditFormData] = useState(userData);

  useEffect(() => {
    if (user) {
      loadUserData();
      checkProfileImage();
    }
  }, [user]);

  const loadUserData = async () => {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('id', user?.id)
        .single();
      
      if (data && !error) {
        setUserData({
          nome: data.nome_completo || user?.user_metadata?.name || 'Passageiro',
          email: data.email || user?.email || '',
          cpf: data.cpf || '',
          telefone: data.telefone || '',
          dataNascimento: data.data_nascimento || '',
          endereco: data.endereco || ''
        });
      }
    } catch (error) {
      console.log('Erro ao carregar dados');
    }
  };

  const checkProfileImage = async () => {
    try {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user?.id}/profile.jpg`);
      
      if (data?.publicUrl) {
        const response = await fetch(data.publicUrl, { method: 'HEAD' });
        if (response.ok) {
          setProfileImageUrl(data.publicUrl);
        }
      }
    } catch (error) {
      console.log('Nenhuma foto encontrada');
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      alert('Usuário não logado');
      return;
    }

    setUploading(true);
    
    try {
      const filePath = `usuarios/${user.id}/profile.jpg`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      setProfileImageUrl(urlData.publicUrl);
      alert('✅ Foto salva com sucesso!');
      
    } catch (error: any) {
      alert('Erro: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  const saveUserData = async () => {
    if (!user) return;
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: editFormData.nome,
          telefone: editFormData.telefone,
          cpf: editFormData.cpf,
          data_nascimento: editFormData.dataNascimento,
          endereco: editFormData.endereco,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setUserData(editFormData);
      setEditingSection(false);
      alert('✅ Informações salvas!');
    } catch (error: any) {
      alert('Erro: ' + error.message);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  // Tela de edição
  if (editingSection) {
    return (
      <div style={{ height: '100vh', width: '100%', backgroundColor: COLORS.fundo, display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexShrink: 0, backgroundColor: COLORS.card, padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}40`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setEditingSection(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={COLORS.verde} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>✏️ EDITAR PERFIL</span>
        </div>
        <div style={{ flex: 1, padding: '20px', overflow: 'auto' }}>
          <div style={{ backgroundColor: COLORS.card, borderRadius: '20px', padding: '20px', border: `1px solid ${COLORS.roxo}40` }}>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}><User size={12} color={COLORS.roxo} style={{ display: 'inline', marginRight: '4px' }} /> Nome completo</label>
              <input type="text" value={editFormData.nome} onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}><Mail size={12} color={COLORS.roxo} style={{ display: 'inline', marginRight: '4px' }} /> E-mail</label>
              <input type="email" value={editFormData.email} onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}><FileText size={12} color={COLORS.roxo} style={{ display: 'inline', marginRight: '4px' }} /> CPF</label>
              <input type="text" value={editFormData.cpf} onChange={(e) => setEditFormData({ ...editFormData, cpf: e.target.value })} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}><Phone size={12} color={COLORS.roxo} style={{ display: 'inline', marginRight: '4px' }} /> Telefone</label>
              <input type="tel" value={editFormData.telefone} onChange={(e) => setEditFormData({ ...editFormData, telefone: e.target.value })} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>Data de nascimento</label>
              <input type="text" value={editFormData.dataNascimento} onChange={(e) => setEditFormData({ ...editFormData, dataNascimento: e.target.value })} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>Endereço</label>
              <textarea value={editFormData.endereco} onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })} rows={2} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto }} />
            </div>
            <button onClick={saveUserData} style={{ width: '100%', padding: '14px', backgroundColor: COLORS.verde, color: COLORS.fundo, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px' }}>
              💾 SALVAR ALTERAÇÕES
            </button>
            <button onClick={() => setEditingSection(false)} style={{ width: '100%', padding: '12px', background: 'transparent', color: COLORS.textoCinza, border: 'none', cursor: 'pointer' }}>
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal
  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: COLORS.fundo, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
      {/* TOP BAR */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}40`, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/home')} style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} color={COLORS.verde} />
          <span style={{ color: COLORS.verde, fontSize: '14px' }}>Voltar</span>
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>👤 PERFIL</span>
        <div style={{ width: '60px' }} />
      </div>

      {/* BEM-VINDO */}
      <div style={{ flexShrink: 0, padding: '16px 20px 0 20px', textAlign: 'center' }}>
        <span style={{ fontSize: '18px', color: COLORS.amarelo }}>Bem-vindo, {userData.nome.split(' ')[0]}! 👋</span>
      </div>

      {/* FOTO DO PERFIL */}
      <div style={{ flexShrink: 0, padding: '20px', display: 'flex', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: '100px', height: '100px', backgroundColor: COLORS.roxo + '30', borderRadius: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `3px solid ${COLORS.amarelo}`, margin: '0 auto 12px' }}>
            {profileImageUrl ? (
              <img src={profileImageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color={COLORS.roxo} />
            )}
          </div>
          
          <label style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '8px 16px', backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '20px', cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.6 : 1 }}>
            {uploading ? (
              <><Upload size={14} color={COLORS.amarelo} /><span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ENVIANDO...</span></>
            ) : (
              <><Camera size={14} color={COLORS.amarelo} /><span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ALTERAR FOTO</span></>
            )}
            <input type="file" accept="image/*" onChange={handleFileSelect} style={{ display: 'none' }} disabled={uploading} />
          </label>
        </div>
      </div>

      {/* INFORMAÇÕES PESSOAIS */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, margin: '12px 16px', borderRadius: '16px', border: `1px solid ${COLORS.roxo}40`, overflow: 'hidden' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', backgroundColor: COLORS.roxo + '15', borderBottom: `1px solid ${COLORS.roxo}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontWeight: 'bold' }}>📝 INFORMAÇÕES PESSOAIS</span></div>
          <button onClick={() => { setEditFormData(userData); setEditingSection(true); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Edit2 size={12} color={COLORS.amarelo} /><span style={{ color: COLORS.amarelo, fontSize: '11px' }}>Editar</span>
          </button>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><User size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>{userData.nome}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Mail size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>{userData.email}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>{userData.telefone || 'Não informado'}</span></div>
        </div>
      </div>

      {/* INFORMAÇÕES DO APLICATIVO */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, margin: '0 16px 12px 16px', borderRadius: '16px', border: `1px solid ${COLORS.roxo}40`, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: COLORS.roxo + '15' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontWeight: 'bold' }}>📌 INFORMAÇÕES DO APLICATIVO</span></div>
        </div>
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>👤 Mudar passageiro</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Selecionar →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Briefcase size={16} color={COLORS.verde} /><span style={{ color: COLORS.texto }}>🚗 Seja Parceiro</span></div>
            <button style={{ color: COLORS.verde, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Cadastrar →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><History size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>📜 Histórico de viagens</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Ver →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CreditCard size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>💳 Formas de pagamento</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Ver →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Settings size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto }}>⚙️ Configurações</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Abrir →</button>
          </div>
        </div>
      </div>

      {/* SOBRE */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, margin: '0 16px 12px 16px', borderRadius: '16px', border: `1px solid ${COLORS.roxo}40`, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: COLORS.roxo + '15' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontWeight: 'bold' }}>ℹ️ SOBRE</span></div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Versão 1.0.0</span>
          <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Termos de uso →</button>
        </div>
      </div>

      {/* BOTÃO SAIR */}
      <div style={{ flexShrink: 0, margin: '0 16px 16px 16px' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', backgroundColor: COLORS.vermelho, color: COLORS.texto, border: 'none', borderRadius: '14px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <LogOut size={18} /> SAIR DA CONTA
        </button>
      </div>

      <div style={{ flexShrink: 0, padding: '0 16px 20px 16px', textAlign: 'center' }}>
        <span style={{ fontSize: '9px', color: COLORS.vinho }}>obaleva.com.br/profile</span>
      </div>
    </div>
  );
};

export default ProfileScreen;