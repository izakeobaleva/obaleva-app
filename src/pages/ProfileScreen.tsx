import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Camera, Upload, 
  Briefcase, History, CreditCard, Settings, LogOut,
  Calendar, MapPin, FileText, Shield, Smartphone,
  Edit2, Users, ChevronRight, AlertCircle, CheckCircle,
  XCircle, File, Home, CreditCard as CardIcon
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
  // FUNÇÃO PARA ABRIR CÂMERA
  // ==============================================
  const handleOpenCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Arquivo muito grande! Máximo 2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target?.result as string);
          setShowPhotoOptions(false);
          alert('✅ Foto salva com sucesso!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  
  // ==============================================
  // FUNÇÃO PARA ANEXAR ARQUIVO
  // ==============================================
  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 2 * 1024 * 1024) {
          alert('Arquivo muito grande! Máximo 2MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target?.result as string);
          setShowPhotoOptions(false);
          alert('✅ Foto anexada com sucesso!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };
  
  // ==============================================
  // FUNÇÃO PARA SALVAR EDIÇÃO DE INFORMAÇÕES
  // ==============================================
  const handleSaveEdit = () => {
    setUserData(editFormData);
    setEditingSection(false);
    alert('✅ Informações salvas com sucesso!');
  };
  
  // ==============================================
  // FUNÇÃO PARA FORMATAR CPF
  // ==============================================
  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 3) return numbers;
    if (numbers.length <= 6) return numbers.replace(/(\d{3})(\d{1,})/, '$1.$2');
    if (numbers.length <= 9) return numbers.replace(/(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3');
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{1,})/, '$1.$2.$3-$4');
  };
  
  // ==============================================
  // FUNÇÃO PARA FORMATAR TELEFONE
  // ==============================================
  const formatPhone = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 2) return `(${numbers}`;
    if (numbers.length <= 7) return `(${numbers.slice(0,2)}) ${numbers.slice(2)}`;
    return `(${numbers.slice(0,2)}) ${numbers.slice(2,7)}-${numbers.slice(7,11)}`;
  };
  
  // ==============================================
  // FUNÇÃO PARA FORMATAR DATA
  // ==============================================
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
        
        {/* FORMULÁRIO DE EDIÇÃO */}
        <div style={{ flex: 1, padding: '20px' }}>
          <div style={{
            backgroundColor: COLORS.card,
            borderRadius: '20px',
            padding: '20px',
            border: `1px solid ${COLORS.roxo}40`,
          }}>
            
            {/* Nome */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                Nome completo
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
            
            {/* E-mail */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                E-mail
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
            
            {/* CPF */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                CPF
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
            
            {/* Telefone */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                Telefone
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
            
            {/* Data de Nascimento */}
            <div style={{ marginBottom: '16px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                Data de nascimento
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
            
            {/* Endereço */}
            <div style={{ marginBottom: '24px' }}>
              <label style={{ color: COLORS.textoCinza, fontSize: '12px', marginBottom: '4px', display: 'block' }}>
                Endereço
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
            
            {/* Botões */}
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
              💾 SALVAR ALTERAÇÕES
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
      
      {/* ========================================== */}
      {/* TOP BAR */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* FOTO DO PERFIL COM BOTÃO DE EDITAR */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        padding: '24px 20px 12px 20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ position: 'relative' }}>
          {/* Círculo da foto */}
          <div
            onClick={() => setShowPhotoOptions(!showPhotoOptions)}
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
              cursor: 'pointer',
              position: 'relative',
            }}
          >
            {profileImage ? (
              <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color={COLORS.roxo} />
            )}
            
            {/* Botão de editar (ícone pequeno) */}
            <div style={{
              position: 'absolute',
              bottom: '0',
              right: '0',
              backgroundColor: COLORS.amarelo,
              borderRadius: '50%',
              width: '28px',
              height: '28px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: `2px solid ${COLORS.fundo}`,
            }}>
              <Edit2 size={14} color={COLORS.fundo} />
            </div>
          </div>
          
          {/* Modal de opções da câmera */}
          {showPhotoOptions && (
            <div style={{
              position: 'absolute',
              top: '110px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: COLORS.card,
              borderRadius: '16px',
              padding: '12px',
              border: `1px solid ${COLORS.roxo}40`,
              zIndex: 100,
              width: '200px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.3)',
            }}>
              <button
                onClick={handleOpenCamera}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: COLORS.verde,
                  border: 'none',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: COLORS.fundo,
                }}
              >
                <Camera size={14} /> TIRAR FOTO
              </button>
              
              <button
                onClick={handleOpenGallery}
                style={{
                  width: '100%',
                  padding: '10px',
                  backgroundColor: COLORS.amarelo,
                  border: 'none',
                  borderRadius: '10px',
                  marginBottom: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: COLORS.fundo,
                }}
              >
                <Upload size={14} /> ANEXAR FOTO
              </button>
              
              <button
                onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: COLORS.amarelo,
                }}
              >
                🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
              </button>
              
              <button
                onClick={() => setShowPhotoOptions(false)}
                style={{
                  width: '100%',
                  padding: '8px',
                  backgroundColor: 'transparent',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '11px',
                  color: COLORS.textoCinza,
                  marginTop: '4px',
                }}
              >
                Cancelar
              </button>
            </div>
          )}
        </div>
      </div>

      {/* ========================================== */}
      {/* INFORMAÇÕES PESSOAIS */}
      {/* ========================================== */}
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
        
        <div style={{ padding: '12px 16px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>Nome completo</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.nome}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>E-mail</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.email}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>CPF</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.cpf}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>Telefone</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.telefone}</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>Data de nascimento</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.dataNascimento}</p>
          </div>
          <div>
            <span style={{ color: COLORS.textoCinza, fontSize: '11px' }}>Endereço</span>
            <p style={{ color: COLORS.texto, fontSize: '14px', marginTop: '2px' }}>{userData.endereco}</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* INFORMAÇÕES DO APLICATIVO */}
      {/* ========================================== */}
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
          {/* Mudar passageiro */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${COLORS.roxo}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Users size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>👤 Mudar passageiro</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Selecionar →
            </button>
          </div>
          
          {/* Seja Parceiro */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${COLORS.roxo}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Briefcase size={16} color={COLORS.verde} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>🚗 Seja Parceiro (Motorista)</span>
            </div>
            <button style={{ color: COLORS.verde, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Cadastrar →
            </button>
          </div>
          
          {/* Histórico */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${COLORS.roxo}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <History size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>📜 Histórico de viagens</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver →
            </button>
          </div>
          
          {/* Pagamento */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
            borderBottom: `1px solid ${COLORS.roxo}20`,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <CardIcon size={16} color={COLORS.roxo} />
              <span style={{ color: COLORS.texto, fontSize: '13px' }}>💳 Formas de pagamento</span>
            </div>
            <button style={{ color: COLORS.amarelo, fontSize: '12px', background: 'none', border: 'none', cursor: 'pointer' }}>
              Ver →
            </button>
          </div>
          
          {/* Configurações */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}>
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

      {/* ========================================== */}
      {/* SOBRE */}
      {/* ========================================== */}
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
        
        <div style={{ padding: '12px 16px' }}>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Versão do aplicativo</span>
            <p style={{ color: COLORS.texto, fontSize: '13px', marginTop: '2px' }}>ObaLeva v1.0.0</p>
          </div>
          <div style={{ marginBottom: '10px' }}>
            <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Termos de uso</span>
            <p style={{ color: COLORS.amarelo, fontSize: '12px', marginTop: '2px', cursor: 'pointer' }}>Consultar termos →</p>
          </div>
          <div>
            <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>Política de privacidade</span>
            <p style={{ color: COLORS.amarelo, fontSize: '12px', marginTop: '2px', cursor: 'pointer' }}>Consultar política →</p>
          </div>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTÃO SAIR (FIXO COMO FAIXA INFERIOR) */}
      {/* ========================================== */}
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

      {/* ========================================== */}
      {/* RODAPÉ */}
      {/* ========================================== */}
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