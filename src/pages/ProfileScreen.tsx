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
  
  // ==============================================
  // ESTADOS
  // ==============================================
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadMessage, setUploadMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [editingSection, setEditingSection] = useState(false);
  const [loading, setLoading] = useState(true);
  const [savingData, setSavingData] = useState(false);
  
  const [userData, setUserData] = useState({
    nome: '',
    email: '',
    cpf: '',
    telefone: '',
    dataNascimento: '',
    endereco: ''
  });
  const [editFormData, setEditFormData] = useState(userData);

  // ==============================================
  // CARREGAR DADOS DO USUÁRIO
  // ==============================================
  useEffect(() => {
    if (user) {
      loadUserData();
      loadProfileImage();
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
      } else {
        setUserData({
          nome: user?.user_metadata?.name || 'Passageiro',
          email: user?.email || '',
          cpf: '',
          telefone: '',
          dataNascimento: '',
          endereco: ''
        });
      }
    } catch (error) {
      console.log('Erro ao carregar dados');
    } finally {
      setLoading(false);
    }
  };

  const loadProfileImage = async () => {
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

  // ==============================================
  // FUNÇÃO PARA COMPRIMIR IMAGEM
  // ==============================================
  const compressImage = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const maxSize = 150;
          
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            if (blob) {
              console.log(`✅ Tamanho da imagem comprimida: ${(blob.size / 1024).toFixed(2)} KB`);
              resolve(blob);
            } else {
              reject(new Error('Erro ao comprimir imagem'));
            }
          }, 'image/jpeg', 0.6);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // ==============================================
  // FUNÇÃO PARA SALVAR FOTO NO SUPABASE
  // ==============================================
  const savePhotoToSupabase = async (file: File) => {
    console.log('1️⃣ Iniciando upload...');
    console.log('   Arquivo:', file.name, file.size, file.type);
    
    if (!user) {
      console.log('❌ Erro: Usuário não autenticado');
      setUploadMessage({ type: 'error', text: 'Usuário não autenticado' });
      return;
    }
    
    console.log('   Usuário ID:', user.id);
    
    setIsUploading(true);
    setUploadProgress(0);
    setUploadMessage(null);
    
    try {
      // PASSO 1: Verificar tamanho
      console.log('2️⃣ Verificando tamanho...');
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande! Máximo 5MB');
      }
      
      // PASSO 2: Comprimir imagem
      console.log('3️⃣ Comprimindo imagem...');
      console.log('   Tamanho original:', file.size);
      setUploadProgress(20);
      const compressedBlob = await compressImage(file);
      console.log('4️⃣ Imagem comprimida!');
      console.log('   Tamanho comprimido:', compressedBlob.size);
      setUploadProgress(50);
      
      // PASSO 3: Tentar fazer upload para Supabase
      console.log('5️⃣ Enviando para Supabase...');
      console.log('   Bucket: avatars');
      console.log('   Path:', `usuarios/${user.id}/profile.jpg`);
      
      const filePath = `usuarios/${user.id}/profile.jpg`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, compressedBlob, { 
          upsert: true,
          contentType: 'image/jpeg'
        });
      
      if (uploadError) {
        console.log('❌ Erro no upload:', uploadError);
        throw uploadError;
      }
      
      console.log('6️⃣ Upload concluído!');
      console.log('   Dados:', uploadData);
      setUploadProgress(80);
      
      // PASSO 4: Pegar URL pública
      console.log('7️⃣ Obtendo URL pública...');
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      console.log('8️⃣ URL pública:', urlData.publicUrl);
      setUploadProgress(100);
      setProfileImageUrl(urlData.publicUrl);
      setShowPhotoOptions(false);
      setUploadMessage({ type: 'success', text: '✅ Foto salva com sucesso!' });
      
      console.log('🎉 Upload finalizado com sucesso!');
      setTimeout(() => setUploadMessage(null), 3000);
      
    } catch (error: any) {
      console.error('❌ Erro detalhado:', error);
      console.error('   Mensagem:', error.message);
      console.error('   Código:', error.code);
      setUploadMessage({ type: 'error', text: error.message || 'Erro ao processar a imagem' });
      setTimeout(() => setUploadMessage(null), 3000);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  // ==============================================
  // FUNÇÃO PARA SALVAR DADOS DO USUÁRIO
  // ==============================================
  const saveUserDataToSupabase = async () => {
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

      // Atualiza os dados locais
      setUserData(editFormData);
      setEditingSection(false);
      setUploadMessage({ type: 'success', text: '✅ Dados salvos com sucesso!' });
      setTimeout(() => setUploadMessage(null), 3000);
    } catch (error: any) {
      console.error('Erro ao salvar dados:', error);
      setUploadMessage({ type: 'error', text: error.message || 'Erro ao salvar dados' });
      setTimeout(() => setUploadMessage(null), 3000);
    }
    setSavingData(false);
  };

  // ==============================================
  // FUNÇÕES DE CÂMERA E GALERIA
  // ==============================================
  const handleOpenCamera = () => {
    console.log('📸 Abrindo câmera...');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('📸 Arquivo selecionado pela câmera:', file.name, file.size);
        savePhotoToSupabase(file);
      }
    };
    input.click();
  };

  const handleOpenGallery = () => {
    console.log('🖼️ Abrindo galeria...');
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        console.log('🖼️ Arquivo selecionado da galeria:', file.name, file.size);
        savePhotoToSupabase(file);
      }
    };
    input.click();
  };

  // ==============================================
  // FUNÇÕES DE FORMATAÇÃO
  // ==============================================
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

  // ==============================================
  // LOADING
  // ==============================================
  if (loading) {
    return (
      <div style={{ height: '100vh', width: '100%', backgroundColor: COLORS.fundo, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // ==============================================
  // TELA DE EDIÇÃO
  // ==============================================
  if (editingSection) {
    return (
      <div style={{ height: '100vh', width: '100%', backgroundColor: COLORS.fundo, display: 'flex', flexDirection: 'column', overflow: 'auto' }}>
        <div style={{ flexShrink: 0, backgroundColor: COLORS.card, padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}40`, display: 'flex', alignItems: 'center', gap: '16px' }}>
          <button onClick={() => setEditingSection(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={COLORS.verde} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>✏️ EDITAR PERFIL</span>
        </div>
        
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{ backgroundColor: COLORS.card, borderRadius: '20px', padding: '20px', border: `1px solid ${COLORS.roxo}40` }}>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <User size={12} style={{ display: 'inline', marginRight: '4px' }} /> Nome completo
              </label>
              <input
                type="text"
                value={editFormData.nome}
                onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <Mail size={12} style={{ display: 'inline', marginRight: '4px' }} /> E-mail
              </label>
              <input
                type="email"
                value={editFormData.email}
                onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <FileText size={12} style={{ display: 'inline', marginRight: '4px' }} /> CPF
              </label>
              <input
                type="text"
                value={editFormData.cpf}
                onChange={(e) => setEditFormData({ ...editFormData, cpf: formatCPF(e.target.value) })}
                maxLength={14}
                placeholder="000.000.000-00"
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <Phone size={12} style={{ display: 'inline', marginRight: '4px' }} /> Telefone
              </label>
              <input
                type="tel"
                value={editFormData.telefone}
                onChange={(e) => setEditFormData({ ...editFormData, telefone: formatPhone(e.target.value) })}
                maxLength={15}
                placeholder="(11) 99999-9999"
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <Calendar size={12} style={{ display: 'inline', marginRight: '4px' }} /> Data de nascimento
              </label>
              <input
                type="text"
                value={editFormData.dataNascimento}
                onChange={(e) => setEditFormData({ ...editFormData, dataNascimento: formatDate(e.target.value) })}
                maxLength={10}
                placeholder="DD/MM/AAAA"
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px' }}
              />
            </div>
            
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <MapPin size={12} style={{ display: 'inline', marginRight: '4px' }} /> Endereço
              </label>
              <textarea
                value={editFormData.endereco}
                onChange={(e) => setEditFormData({ ...editFormData, endereco: e.target.value })}
                rows={2}
                style={{ width: '100%', padding: '12px', backgroundColor: COLORS.fundo, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', color: COLORS.texto, fontSize: '14px', resize: 'vertical' }}
              />
            </div>
            
            <button
              onClick={saveUserDataToSupabase}
              disabled={savingData}
              style={{ 
                width: '100%', padding: '14px', 
                backgroundColor: savingData ? COLORS.textoCinza : COLORS.verde, 
                color: COLORS.fundo, border: 'none', borderRadius: '12px', 
                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '12px',
                opacity: savingData ? 0.6 : 1 
              }}
            >
              <Save size={16} style={{ display: 'inline', marginRight: '8px' }} />
              {savingData ? 'SALVANDO...' : 'SALVAR ALTERAÇÕES'}
            </button>
            
            <button
              onClick={() => setEditingSection(false)}
              style={{ width: '100%', padding: '12px', backgroundColor: 'transparent', color: COLORS.textoCinza, border: 'none', fontSize: '14px', cursor: 'pointer' }}
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ==============================================
  // TELA PRINCIPAL DO PERFIL
  // ==============================================
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
              <>
                <Loader2 size={14} className="animate-spin" color={COLORS.amarelo} />
                <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ENVIANDO... {uploadProgress}%</span>
              </>
            ) : (
              <>
                <Camera size={14} color={COLORS.amarelo} />
                <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>ALTERAR FOTO</span>
              </>
            )}
          </button>
          
          {showPhotoOptions && !isUploading && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: COLORS.card, borderRadius: '20px', padding: '24px', width: '280px', border: `1px solid ${COLORS.roxo}40` }}>
                <h3 style={{ color: COLORS.texto, fontSize: '16px', marginBottom: '20px', textAlign: 'center' }}>Escolha uma opção</h3>
                <button onClick={handleOpenCamera} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.verde, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: COLORS.fundo }}>
                  <Camera size={16} /> TIRAR FOTO
                </button>
                <button onClick={handleOpenGallery} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.amarelo, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontSize: '14px', fontWeight: 'bold', color: COLORS.fundo }}>
                  <Upload size={16} /> ANEXAR FOTO
                </button>
                <button onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontSize: '12px', color: COLORS.amarelo }}>
                  🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
                </button>
                <button onClick={() => setShowPhotoOptions(false)} style={{ width: '100%', padding: '10px', backgroundColor: 'transparent', border: 'none', borderRadius: '12px', cursor: 'pointer', fontSize: '12px', color: COLORS.textoCinza }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><FileText size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📝 INFORMAÇÕES PESSOAIS</span></div>
          <button onClick={() => { setEditFormData(userData); setEditingSection(true); }} style={{ display: 'flex', alignItems: 'center', gap: '4px', backgroundColor: 'transparent', border: 'none', cursor: 'pointer' }}>
            <Edit2 size={12} color={COLORS.amarelo} /><span style={{ color: COLORS.amarelo, fontSize: '11px' }}>Editar</span>
          </button>
        </div>
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><User size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.nome || 'Não informado'}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}><Mail size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.email || 'Não informado'}</span></div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}><Phone size={14} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.telefone || 'Não informado'}</span></div>
        </div>
      </div>

      {/* INFORMAÇÕES DO APLICATIVO */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, margin: '0 16px 12px 16px', borderRadius: '16px', border: `1px solid ${COLORS.roxo}40`, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: COLORS.roxo + '15', borderBottom: `1px solid ${COLORS.roxo}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Smartphone size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📌 INFORMAÇÕES DO APLICATIVO</span></div>
        </div>
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Users size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>👤 Mudar passageiro</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Selecionar →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Briefcase size={16} color={COLORS.verde} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>🚗 Seja Parceiro</span></div>
            <button style={{ color: COLORS.verde, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Cadastrar →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><History size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>📜 Histórico de viagens</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Ver →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><CreditCard size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>💳 Formas de pagamento</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Ver →</button>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><Settings size={16} color={COLORS.roxo} /><span style={{ color: COLORS.texto, fontSize: '13px' }}>⚙️ Configurações</span></div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Abrir →</button>
          </div>
        </div>
      </div>

      {/* SOBRE */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, margin: '0 16px 12px 16px', borderRadius: '16px', border: `1px solid ${COLORS.roxo}40`, overflow: 'hidden' }}>
        <div style={{ padding: '12px 16px', backgroundColor: COLORS.roxo + '15', borderBottom: `1px solid ${COLORS.roxo}40` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Shield size={16} color={COLORS.amarelo} /><span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>ℹ️ SOBRE</span></div>
        </div>
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Versão 1.0.0</span>
          <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>Termos de uso →</button>
        </div>
      </div>

      {/* BOTÃO SAIR */}
      <div style={{ flexShrink: 0, margin: '0 16px 16px 16px' }}>
        <button onClick={handleLogout} style={{ width: '100%', padding: '14px', backgroundColor: COLORS.vermelho, color: COLORS.texto, border: 'none', borderRadius: '14px', fontSize: '15px', fontWeight: 'bold', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px' }}>
          <LogOut size={18} /> SAIR DA CONTA
        </button>
      </div>

      {/* RODAPÉ */}
      <div style={{ flexShrink: 0, padding: '0 16px 20px 16px', textAlign: 'center' }}>
        <span style={{ fontSize: '9px', color: COLORS.vinho }}>obaleva.com.br/profile</span>
      </div>

    </div>
  );
};

export default ProfileScreen;