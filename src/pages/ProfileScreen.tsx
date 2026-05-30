import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Edit3, CheckCircle, 
  Camera, Upload, Briefcase, History, CreditCard, Settings,
  LogOut, Star, Shield, ChevronRight
} from 'lucide-react';

// ==============================================
// CORES DO TEMA OBALEVÁ
// ==============================================
const COLORS = {
  amarelo: '#facc15',
  amareloEscuro: '#eab308',
  roxo: '#8b5cf6',
  roxoEscuro: '#7c3aed',
  vinho: '#800020',
  vinhoClaro: '#b91c1c',
  vermelho: '#ef4444',
  vermelhoEscuro: '#dc2626',
  verde: '#22c55e',
  verdeEscuro: '#16a34a',
  fundo: '#0f0f0f',
  card: '#1a1a2e',
  texto: '#ffffff',
  textoCinza: '#9ca3af',
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [userName, setUserName] = useState('João Silva');
  const [userEmail, setUserEmail] = useState('joao@email.com');
  const [userPhone, setUserPhone] = useState('(11) 99999-9999');
  const [isEditingName, setIsEditingName] = useState(false);
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  // Função para abrir a câmera (alterna entre frontal e traseira)
  const handleOpenCamera = () => {
    // Cria um input com capture para a câmera
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (event) => {
          setProfileImage(event.target?.result as string);
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Função para abrir a galeria (upload de arquivos)
  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*, application/pdf';
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
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  const handleEditName = () => {
    const newName = prompt('Digite seu nome:', userName);
    if (newName) setUserName(newName);
    setIsEditingName(false);
  };

  const handleEditEmail = () => {
    const newEmail = prompt('Digite seu e-mail:', userEmail);
    if (newEmail) setUserEmail(newEmail);
    setIsEditingEmail(false);
  };

  const handleEditPhone = () => {
    const newPhone = prompt('Digite seu telefone:', userPhone);
    if (newPhone) setUserPhone(newPhone);
    setIsEditingPhone(false);
  };

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
      {/* TOP BAR COM VOLTAR */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        padding: '12px 16px',
        borderBottom: `1px solid ${COLORS.roxo}40`,
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
      }}>
        <button
          onClick={() => navigate('/')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            backgroundColor: 'transparent',
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
      </div>

      {/* ========================================== */}
      {/* ÁREA DA FOTO COM BOTÕES */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{
          width: '200px',
          textAlign: 'center',
        }}>
          {/* Círculo da foto */}
          <div style={{
            width: '120px',
            height: '120px',
            backgroundColor: COLORS.roxo + '30',
            borderRadius: '60px',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: `2px solid ${COLORS.amarelo}`,
          }}>
            {profileImage ? (
              <img src={profileImage} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <User size={48} color={COLORS.roxo} />
            )}
          </div>
          
          {/* Botão de alternar câmera (frontal/traseira) */}
          <div style={{ marginBottom: '12px' }}>
            <button
              onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
              style={{
                fontSize: '11px',
                color: COLORS.amarelo,
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              🔄 Alternar câmera ({cameraMode === 'user' ? 'FRONTAL' : 'TRASEIRA'})
            </button>
          </div>
          
          {/* Botões de ação */}
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button
              onClick={handleOpenCamera}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: COLORS.verde,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
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
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                padding: '8px 16px',
                backgroundColor: COLORS.amarelo,
                border: 'none',
                borderRadius: '10px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: 'bold',
                color: COLORS.fundo,
              }}
            >
              <Upload size={14} /> ANEXAR
            </button>
          </div>
          
          <p style={{ fontSize: '9px', color: COLORS.textoCinza, marginTop: '12px' }}>
            Toque em "TIRAR FOTO" para usar a câmera<br />
            (alterna entre FRONTAL e TRASEIRA)
          </p>
        </div>
      </div>

      {/* ========================================== */}
      {/* INFORMAÇÕES DO USUÁRIO */}
      {/* ========================================== */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '0 16px 16px 16px',
        borderRadius: '16px',
        padding: '12px',
        border: `1px solid ${COLORS.roxo}40`,
      }}>
        
        {/* Nome */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Nome:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userName}</span>
          </div>
          <button onClick={handleEditName} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Editar]
          </button>
        </div>

        {/* E-mail */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>E-mail:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userEmail}</span>
          </div>
          <button onClick={handleEditEmail} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Editar]
          </button>
        </div>

        {/* Telefone */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Telefone:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userPhone}</span>
          </div>
          <button onClick={handleEditPhone} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Editar]
          </button>
        </div>

        {/* Mudar passageiro */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Mudar passageiro</span>
          </div>
          <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Selecionar]
          </button>
        </div>

        {/* Seja Parceiro (Motorista) - VERDE */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={16} color={COLORS.verde} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>🚗 Seja Parceiro (Motorista)</span>
          </div>
          <button style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Cadastrar]
          </button>
        </div>

        {/* Histórico */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <History size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Histórico de viagens</span>
          </div>
          <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Ver]
          </button>
        </div>

        {/* Formas de pagamento */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
          borderBottom: `1px solid ${COLORS.roxo}20`,
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <CreditCard size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Formas de pagamento</span>
          </div>
          <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Ver]
          </button>
        </div>

        {/* Configurações */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '10px 0',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Settings size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Configurações</span>
          </div>
          <button style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>
            [Abrir]
          </button>
        </div>
      </div>

      {/* ========================================== */}
      {/* BOTÃO SAIR (VERMELHO) */}
      {/* ========================================== */}
      <div style={{ padding: '0 16px 20px 16px' }}>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: COLORS.vermelho,
            color: COLORS.texto,
            border: 'none',
            borderRadius: '12px',
            fontSize: '14px',
            fontWeight: 'bold',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
          }}
        >
          <LogOut size={16} /> SAIR DA CONTA
        </button>
      </div>

    </div>
  );
};

export default ProfileScreen;