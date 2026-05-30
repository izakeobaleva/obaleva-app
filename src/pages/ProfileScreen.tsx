import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Camera, Upload, 
  Briefcase, History, CreditCard, Settings, LogOut,
  Calendar, MapPin, FileText, Shield, Smartphone,
  Edit2, Users, AlertCircle, Save, X
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
  
  // ==============================================
  // ESTADOS DO USUÁRIO (PERSISTIDOS NO LOCALSTORAGE)
  // ==============================================
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || null;
  });
  
  const [userData, setUserData] = useState(() => {
    const saved = localStorage.getItem('userData');
    if (saved) {
      return JSON.parse(saved);
    }
    return {
      nome: 'João Silva',
      email: 'joao@email.com',
      cpf: '123.456.789-00',
      telefone: '(11) 99999-9999',
      dataNascimento: '15/05/1990',
      endereco: 'Rua Santo Antônio, 1095 - Centro, São Paulo - SP'
    };
  });
  
  // ==============================================
  // ESTADOS DA INTERFACE
  // ==============================================
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [editingSection, setEditingSection] = useState(false);
  const [editFormData, setEditFormData] = useState(userData);
  const [isSaving, setIsSaving] = useState(false);
  
  // ==============================================
  // SALVAR DADOS NO LOCALSTORAGE
  // ==============================================
  useEffect(() => {
    localStorage.setItem('userData', JSON.stringify(userData));
  }, [userData]);
  
  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
  }, [profileImage]);
  
  // ==============================================
  // FUNÇÃO PARA COMPRIMIR IMAGEM (EVITA ERRO DE MEMÓRIA)
  // ==============================================
  const compressImage = (file: File): Promise<string> => {
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
          
          // Reduz a imagem para no máximo 300x300
          const maxSize = 300;
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
          
          // Qualidade 0.7 para reduzir ainda mais o tamanho
          const compressedDataUrl = canvas.toDataURL('image/jpeg', 0.7);
          resolve(compressedDataUrl);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };
  
  // ==============================================
  // FUNÇÃO PARA ABRIR CÂMARA (COM COMPRESSÃO)
  // ==============================================
  const handleOpenCamera = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsSaving(true);
        try {
          if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo muito grande! Máximo 5MB');
            setIsSaving(false);
            return;
          }
          const compressedImage = await compressImage(file);
          setProfileImage(compressedImage);
          setShowPhotoOptions(false);
          alert('✅ Foto salva com sucesso!');
        } catch (error) {
          alert('Erro ao processar a imagem. Tente outra foto.');
        } finally {
          setIsSaving(false);
        }
      }
    };
    input.click();
  };
  
  // ==============================================
  // FUNÇÃO PARA ANEXAR DA GALERIA (COM COMPRESSÃO)
  // ==============================================
  const handleOpenGallery = async () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        setIsSaving(true);
        try {
          if (file.size > 5 * 1024 * 1024) {
            alert('Arquivo muito grande! Máximo 5MB');
            setIsSaving(false);
            return;
          }
          const compressedImage = await compressImage(file);
          setProfileImage(compressedImage);
          setShowPhotoOptions(false);
          alert('✅ Foto anexada com sucesso!');
        } catch (error) {
          alert('Erro ao processar a imagem. Tente outra foto.');
        } finally {
          setIsSaving(false);
        }
      }
    };
    input.click();
  };
  
  // ==============================================
  // FUNÇÃO PARA SALVAR EDIÇÃO
  // ==============================================
  const handleSaveEdit = () => {
    setUserData(editFormData);
    setEditingSection(false);
    alert('✅ Informações salvas com sucesso!');
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
  
  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };
  
  // ==============================================
  // TELA DE EDIÇÃO DE INFORMAÇÕES
  // ==============================================
  if (editingSection) {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        backgroundColor: COLORS.fundo,
        display: 'flex',
        flexDirection: 'column',
        overflow: 'auto',
      }}>
        {/* TOP BAR */}
        <div style={{
          flexShrink: 0,
          backgroundColor: COLORS.card,
          padding: '12px 16px',
          borderBottom: `1px solid ${COLORS.roxo}40`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button onClick={() => setEditingSection(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={COLORS.verde} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>
            ✏️ EDITAR PERFIL
          </span>
        </div>
        
        {/* FORMULÁRIO */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{
            backgroundColor: COLORS.card,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${COLORS.roxo}40`,
          }}>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                <User size={12} style={{ display: 'inline', marginRight: '4px' }} /> Nome completo
              </label>
              <input
                type="text"
                value={editFormData.nome}
                onChange={(e) => setEditFormData({ ...editFormData, nome: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                }}
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
                style={{
                  width: '100%',
                  padding: '12px',
                  backgroundColor: COLORS.fundo,
                  border: `1px solid ${COLORS.roxo}40`,
                  borderRadius: '12px',
                  color: COLORS.texto,
                  fontSize: '14px',
                  resize: 'vertical',
                }}
              />
            </div>
            
            <button
              onClick={handleSaveEdit}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: COLORS.verde,
                color: COLORS.fundo,
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: 'bold',
                cursor: 'pointer',
                marginBottom: '12px',
              }}
            >
              <Save size={16} style={{ display: 'inline', marginRight: '8px' }} />
              SALVAR ALTERAÇÕES
            </button>
            
            <button
              onClick={() => setEditingSection(false)}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: 'transparent',
                color: COLORS.textoCinza,
                border: 'none',
                fontSize: '14px',
                cursor: 'pointer',
              }}
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
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: COLORS.fundo,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}>
      
      {/* TOP BAR */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        padding: '12px 16px',
        borderBottom: `1px solid ${COLORS.roxo}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button
          onClick={() => navigate('/home')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
          }}
        >
          <ArrowLeft size={20} color={COLORS.verde} />
          <span style={{ color: COLORS.verde, fontSize: '14px' }}>Voltar</span>
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>
          👤 PERFIL
        </span>
        <div style={{ width: '60px' }} />
      </div>

      {/* BEM-VINDO */}
      <div style={{
        flexShrink: 0,
        padding: '16px 20px 0 20px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '18px', color: COLORS.amarelo }}>
          Bem-vindo, {userData.nome.split(' ')[0]}! 👋
        </span>
      </div>

      {/* FOTO DO PERFIL COM BOTÃO INTERATIVO */}
      <div style={{
        flexShrink: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          {/* Círculo da foto */}
          <div
            style={{
              width: '100px',
              height: '100px',
              backgroundColor: COLORS.roxo + '30',
              borderRadius: '50px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              border: `3px solid ${COLORS.amarelo}`,
              margin: '0 auto 12px',
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color={COLORS.roxo} />
            )}
          </div>
          
          {/* Botão interativo para alterar foto */}
          <button
            onClick={() => setShowPhotoOptions(!showPhotoOptions)}
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              padding: '8px 16px',
              backgroundColor: COLORS.card,
              border: `1px solid ${COLORS.roxo}40`,
              borderRadius: '20px',
              cursor: 'pointer',
              margin: '0 auto',
            }}
          >
            <Camera size={14} color={COLORS.amarelo} />
            <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>
              {isSaving ? 'Salvando...' : 'ALTERAR FOTO'}
            </span>
          </button>
          
          {/* MODAL DE OPÇÕES DA FOTO */}
          {showPhotoOptions && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0,0,0,0.8)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 1000,
            }}>
              <div style={{
                backgroundColor: COLORS.card,
                borderRadius: '20px',
                padding: '20px',
                width: '280px',
                border: `1px solid ${COLORS.roxo}40`,
              }}>
                <h3 style={{ color: COLORS.texto, fontSize: '16px', marginBottom: '16px', textAlign: 'center' }}>
                  Escolha uma opção
                </h3>
                
                <button
                  onClick={handleOpenCamera}
                  disabled={isSaving}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: COLORS.verde,
                    border: 'none',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: COLORS.fundo,
                  }}
                >
                  <Camera size={16} /> TIRAR FOTO
                </button>
                
                <button
                  onClick={handleOpenGallery}
                  disabled={isSaving}
                  style={{
                    width: '100%',
                    padding: '12px',
                    backgroundColor: COLORS.amarelo,
                    border: 'none',
                    borderRadius: '12px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: COLORS.fundo,
                  }}
                >
                  <Upload size={16} /> ANEXAR DA GALERIA
                </button>
                
                <button
                  onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: `1px solid ${COLORS.roxo}40`,
                    borderRadius: '12px',
                    marginBottom: '10px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: COLORS.amarelo,
                  }}
                >
                  🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
                </button>
                
                <button
                  onClick={() => setShowPhotoOptions(false)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    backgroundColor: 'transparent',
                    border: 'none',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: COLORS.textoCinza,
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* INFORMAÇÕES PESSOAIS (MINIMIZADO) */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '12px 16px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.roxo}40`,
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '12px 16px',
          backgroundColor: COLORS.roxo + '15',
          borderBottom: `1px solid ${COLORS.roxo}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FileText size={16} color={COLORS.amarelo} />
            <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📝 INFORMAÇÕES PESSOAIS</span>
          </div>
          <button
            onClick={() => {
              setEditFormData(userData);
              setEditingSection(true);
            }}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              backgroundColor: 'transparent',
              border: 'none',
              cursor: 'pointer',
            }}
          >
            <Edit2 size={12} color={COLORS.amarelo} />
            <span style={{ color: COLORS.amarelo, fontSize: '11px' }}>Editar</span>
          </button>
        </div>
        
        {/* APENAS RESUMO DAS INFORMAÇÕES */}
        <div style={{ padding: '12px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <User size={14} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.nome}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
            <Mail size={14} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.email}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={14} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>{userData.telefone}</span>
          </div>
        </div>
      </div>

      {/* INFORMAÇÕES DO APLICATIVO */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '0 16px 12px 16px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.roxo}40`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: COLORS.roxo + '15',
          borderBottom: `1px solid ${COLORS.roxo}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Smartphone size={16} color={COLORS.amarelo} />
            <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>📌 INFORMAÇÕES DO APLICATIVO</span>
          </div>
        </div>
        
        <div style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>👤 Mudar passageiro</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Selecionar →
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase size={16} color={COLORS.verde} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>🚗 Seja Parceiro</span>
            </div>
            <button style={{ color: COLORS.verde, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cadastrar →
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>📜 Histórico de viagens</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver →
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CreditCard size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>💳 Formas de pagamento</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver →
            </button>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Settings size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>⚙️ Configurações</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Abrir →
            </button>
          </div>
        </div>
      </div>

      {/* SOBRE */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '0 16px 12px 16px',
        borderRadius: '16px',
        border: `1px solid ${COLORS.roxo}40`,
        overflow: 'hidden',
      }}>
        <div style={{
          padding: '12px 16px',
          backgroundColor: COLORS.roxo + '15',
          borderBottom: `1px solid ${COLORS.roxo}40`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Shield size={16} color={COLORS.amarelo} />
            <span style={{ color: COLORS.texto, fontSize: '14px', fontWeight: 'bold' }}>ℹ️ SOBRE</span>
          </div>
        </div>
        
        <div style={{ padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Versão 1.0.0</span>
          <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
            Termos de uso →
          </button>
        </div>
      </div>

      {/* BOTÃO SAIR */}
      <div style={{
        flexShrink: 0,
        margin: '0 16px 16px 16px',
      }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '14px',
            backgroundColor: COLORS.vermelho,
            color: COLORS.texto,
            border: 'none',
            borderRadius: '14px',
            fontSize: '15px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
          }}
        >
          <LogOut size={18} /> SAIR DA CONTA
        </button>
      </div>

      {/* RODAPÉ */}
      <div style={{
        flexShrink: 0,
        padding: '0 16px 20px 16px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '9px', color: COLORS.vinho }}>
          obaleva.com.br/profile
        </span>
      </div>

    </div>
  );
};

export default ProfileScreen;