import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { 
  ArrowLeft, User, Mail, Phone, Camera, Upload, 
  Briefcase, History, CreditCard, Settings, LogOut,
  Calendar, MapPin, FileText, Shield, Smartphone,
  Edit2, Users, Save, Loader2, CheckCircle, XCircle
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
  
  // Estados
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [editingSection, setEditingSection] = useState(false);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [savingData, setSavingData] = useState(false);
  
  const [userData, setUserData] = useState({
    nome: user?.user_metadata?.name || 'Passageiro',
    email: user?.email || '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: ''
  });
  const [editFormData, setEditFormData] = useState(userData);

  // Carregar dados do usuário
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

  // Upload da foto (simplificado)
  const uploadPhoto = async (file: File) => {
    if (!user) {
      setUploadMessage({ type: 'error', text: 'Usuário não autenticado' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadMessage({ type: 'error', text: 'Arquivo muito grande! Máximo 5MB' });
      return;
    }

    setIsUploading(true);
    setUploadMessage(null);

    try {
      const filePath = `usuarios/${user.id}/profile.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileImageUrl(data.publicUrl);
      setShowPhotoOptions(false);
      setUploadMessage({ type: 'success', text: '✅ Foto salva com sucesso!' });
      setTimeout(() => setUploadMessage(null), 3000);
      
    } catch (error: any) {
      setUploadMessage({ type: 'error', text: error.message || 'Erro ao salvar foto' });
      setTimeout(() => setUploadMessage(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  const handleOpenCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadPhoto(file);
    };
    input.click();
  };

  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadPhoto(file);
    };
    input.click();
  };

  const saveUserData = async () => {
    if (!user) return;
    setSavingData(true);
    try {
      const { error } = await supabase
        .from('usuarios')
        .update({
          nome_completo: editFormData.nome,
          email: editFormData.email,
          cpf: editFormData.cpf,
          telefone: editFormData.telefone,
          data_nascimento: editFormData.dataNascimento,
          endereco: editFormData.endereco,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id);

      if (error) throw error;
      
      setUserData(editFormData);
      setEditingSection(false);
      setUploadMessage({ type: 'success', text: '✅ Informações salvas!' });
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error: any) {
      setUploadMessage({ type: 'error', text: error.message || 'Erro ao salvar' });
      setTimeout(() => setUploadMessage(null), 3000);
    }
    setSavingData(false);
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{1,})/, '$1.$2');
    if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4');
  };

  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
  };

  const formatDate = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    if (numbers.length <= 4) return `${numbers.slice(0,2)}/${numbers.slice(2)}`;
    return `${numbers.slice(0,2)}/${numbers.slice(2,4)}/${numbers.slice(4,8)}`;
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
            <InputField label="Nome completo" value={editFormData.nome} onChange={(v) => setEditFormData({ ...editFormData, nome: v })} icon={<User size={14} color={COLORS.roxo} />} />
            <InputField label="E-mail" value={editFormData.email} onChange={(v) => setEditFormData({ ...editFormData, email: v })} type="email" icon={<Mail size={14} color={COLORS.roxo} />} />
            <InputField label="CPF" value={editFormData.cpf} onChange={(v) => setEditFormData({ ...editFormData, cpf: formatCPF(v) })} maxLength={14} placeholder="000.000.000-00" icon={<FileText size={14} color={COLORS.roxo} />} />
            <InputField label="Telefone" value={editFormData.telefone} onChange={(v) => setEditFormData({ ...editFormData, telefone: formatPhone(v) })} maxLength={15} placeholder="(11) 99999-9999" icon={<Phone size={14} color={COLORS.roxo} />} />
            <InputField label="Data de nascimento" value={editFormData.dataNascimento} onChange={(v) => setEditFormData({ ...editFormData, dataNascimento: formatDate(v) })} maxLength={10} placeholder="DD/MM/AAAA" icon={<Calendar size={14} color={COLORS.roxo} />} />
            <InputField label="Endereço" value={editFormData.endereco} onChange={(v) => setEditFormData({ ...editFormData, endereco: v })} textarea icon={<MapPin size={14} color={COLORS.roxo} />} />
            
            <button onClick={saveUserData} disabled={savingData} style={{ width: '100%', padding: '14px', backgroundColor: savingData ? COLORS.textoCinza : COLORS.verde, color: COLORS.fundo, border: 'none', borderRadius: '12px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px', opacity: savingData ? 0.6 : 1 }}>
              <Save size={16} style={{ display: 'inline', marginRight: '8px' }} /> {savingData ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
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
          
          <button
            onClick={() => setShowPhotoOptions(!showPhotoOptions)}
            disabled={isUploading}
            style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px 16px', backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '20px', cursor: isUploading ? 'not-allowed' : 'pointer', margin: '0 auto', opacity: isUploading ? 0.6 : 1 }}
          >
            {isUploading ? (
              <><Loader2 size={14} className="animate-spin" color={COLORS.amarelo} /><span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ENVIANDO...</span></>
            ) : (
              <><Camera size={14} color={COLORS.amarelo} /><span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ALTERAR FOTO</span></>
            )}
          </button>
          
          {showPhotoOptions && !isUploading && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: COLORS.card, borderRadius: '20px', padding: '24px', width: '280px', border: `1px solid ${COLORS.roxo}40` }}>
                <h3 style={{ color: COLORS.texto, marginBottom: '20px', textAlign: 'center' }}>Escolha uma opção</h3>
                <button onClick={handleOpenCamera} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.verde, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold', color: COLORS.fundo }}>
                  <Camera size={16} style={{ display: 'inline', marginRight: '8px' }} /> TIRAR FOTO
                </button>
                <button onClick={handleOpenGallery} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.amarelo, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold', color: COLORS.fundo }}>
                  <Upload size={16} style={{ display: 'inline', marginRight: '8px' }} /> ANEXAR FOTO
                </button>
                <button onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')} style={{ width: '100%', padding: '10px', background: 'transparent', border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontSize: '12px', color: COLORS.amarelo }}>
                  🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
                </button>
                <button onClick={() => setShowPhotoOptions(false)} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', color: COLORS.textoCinza }}>
                  Cancelar
                </button>
              </div>
            </div>
          )}
          
          {uploadMessage && (
            <div style={{ marginTop: '12px', padding: '8px 12px', backgroundColor: uploadMessage.type === 'success' ? COLORS.verde + '20' : COLORS.vermelho + '20', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
              {uploadMessage.type === 'success' ? <CheckCircle size={14} color={COLORS.verde} /> : <XCircle size={14} color={COLORS.vermelho} />}
              <span style={{ color: uploadMessage.type === 'success' ? COLORS.verde : COLORS.vermelho, fontSize: '11px' }}>{uploadMessage.text}</span>
            </div>
          )}
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
          <MenuItem icon={<Users size={16} color={COLORS.roxo} />} label="👤 Mudar passageiro" action="Selecionar →" />
          <MenuItem icon={<Briefcase size={16} color={COLORS.verde} />} label="🚗 Seja Parceiro" action="Cadastrar →" actionColor={COLORS.verde} />
          <MenuItem icon={<History size={16} color={COLORS.roxo} />} label="📜 Histórico de viagens" action="Ver →" />
          <MenuItem icon={<CreditCard size={16} color={COLORS.roxo} />} label="💳 Formas de pagamento" action="Ver →" />
          <MenuItem icon={<Settings size={16} color={COLORS.roxo} />} label="⚙️ Configurações" action="Abrir →" />
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

function InputField({ label, value, onChange, type = 'text', maxLength, placeholder, textarea, icon }: any) {
  return (
    <div style={{ marginBottom: '16px' }}>
      <label style={{ color: '#9ca3af', fontSize: '12px', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '4px' }}>{icon} {label}</label>
      {textarea ? (
        <textarea value={value} onChange={(e) => onChange(e.target.value)} rows={2} style={{ width: '100%', padding: '12px', backgroundColor: '#0f0f0f', border: '1px solid #8b5cf640', borderRadius: '12px', color: '#ffffff', resize: 'vertical' }} />
      ) : (
        <input type={type} value={value} onChange={(e) => onChange(e.target.value)} maxLength={maxLength} placeholder={placeholder} style={{ width: '100%', padding: '12px', backgroundColor: '#0f0f0f', border: '1px solid #8b5cf640', borderRadius: '12px', color: '#ffffff' }} />
      )}
    </div>
  );
}

function MenuItem({ icon, label, action, actionColor = '#facc15' }: any) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: '1px solid #8b5cf620' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        {icon}
        <span style={{ color: '#ffffff' }}>{label}</span>
      </div>
      <button style={{ color: actionColor, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>{action}</button>
    </div>
  );
}

export default ProfileScreen;