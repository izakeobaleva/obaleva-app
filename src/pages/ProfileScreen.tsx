import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, User, Mail, Phone, Camera, Upload, 
  Briefcase, History, CreditCard, Settings, LogOut,
  Edit3
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
  
  // Estados para informações do usuário (persistidas no localStorage)
  const [userName, setUserName] = useState(() => {
    return localStorage.getItem('userName') || 'João Silva';
  });
  const [userEmail, setUserEmail] = useState(() => {
    return localStorage.getItem('userEmail') || 'joao@email.com';
  });
  const [userPhone, setUserPhone] = useState(() => {
    return localStorage.getItem('userPhone') || '(11) 99999-9999';
  });
  const [profileImage, setProfileImage] = useState(() => {
    return localStorage.getItem('profileImage') || null;
  });
  
  // Estados para controle de edição
  const [editingField, setEditingField] = useState<'nome' | 'email' | 'telefone' | null>(null);
  const [editValue, setEditValue] = useState('');
  
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');

  // Salvar informações no localStorage sempre que mudarem
  useEffect(() => {
    localStorage.setItem('userName', userName);
  }, [userName]);
  
  useEffect(() => {
    localStorage.setItem('userEmail', userEmail);
  }, [userEmail]);
  
  useEffect(() => {
    localStorage.setItem('userPhone', userPhone);
  }, [userPhone]);
  
  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('profileImage', profileImage);
    }
  }, [profileImage]);

  // Função para abrir a câmera
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
          const imageData = event.target?.result as string;
          setProfileImage(imageData);
          alert('✅ Foto salva com sucesso!');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Função para abrir a galeria (anexar arquivo)
  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*, application/pdf';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 5 * 1024 * 1024) {
          alert('Arquivo muito grande! Máximo 5MB');
          return;
        }
        const reader = new FileReader();
        reader.onload = (event) => {
          if (file.type.startsWith('image/')) {
            const imageData = event.target?.result as string;
            setProfileImage(imageData);
            alert('✅ Foto anexada com sucesso!');
          } else {
            alert('✅ Documento anexado com sucesso!');
          }
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  };

  // Função para abrir edição
  const handleEdit = (field: 'nome' | 'email' | 'telefone') => {
    if (field === 'nome') {
      setEditValue(userName);
    } else if (field === 'email') {
      setEditValue(userEmail);
    } else {
      setEditValue(userPhone);
    }
    setEditingField(field);
  };

  // Função para salvar edição
  const handleSaveEdit = () => {
    if (editingField === 'nome') {
      setUserName(editValue);
    } else if (editingField === 'email') {
      setUserEmail(editValue);
    } else if (editingField === 'telefone') {
      setUserPhone(editValue);
    }
    setEditingField(null);
    alert('✅ Informação salva com sucesso!');
  };

  // Função para cancelar edição
  const handleCancelEdit = () => {
    setEditingField(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    navigate('/login');
  };

  // Tela de edição (se estiver editando)
  if (editingField) {
    return (
      <div style={{
        height: '100vh',
        width: '100%',
        backgroundColor: COLORS.fundo,
        display: 'flex',
        flexDirection: 'column',
      }}>
        <div style={{
          flexShrink: 0,
          backgroundColor: COLORS.card,
          padding: '12px 16px',
          borderBottom: `1px solid ${COLORS.roxo}40`,
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
        }}>
          <button onClick={handleCancelEdit} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
            <ArrowLeft size={20} color={COLORS.verde} />
          </button>
          <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>
            EDITAR {editingField === 'nome' ? 'NOME' : editingField === 'email' ? 'E-MAIL' : 'TELEFONE'}
          </span>
        </div>
        
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
          <div className="bg-[#1a1a2e] rounded-3xl p-6 w-full max-w-[320px] border border-purple-500/30">
            <div className="text-center mb-4">
              <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-2">
                {editingField === 'nome' && <User size={32} color={COLORS.roxo} />}
                {editingField === 'email' && <Mail size={32} color={COLORS.roxo} />}
                {editingField === 'telefone' && <Phone size={32} color={COLORS.roxo} />}
              </div>
              <h3 className="text-white font-medium">
                {editingField === 'nome' && 'Nome Completo'}
                {editingField === 'email' && 'E-mail'}
                {editingField === 'telefone' && 'Telefone'}
              </h3>
            </div>
            
            <input
              type={editingField === 'email' ? 'email' : 'text'}
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a3e] border border-purple-500/30 rounded-xl text-white mb-4 focus:outline-none focus:border-yellow-500"
            />
            
            <button
              onClick={handleSaveEdit}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl mb-3 hover:bg-green-700 transition"
            >
              💾 SALVAR ALTERAÇÕES
            </button>
            
            <button
              onClick={handleCancelEdit}
              className="w-full py-3 text-gray-500 font-medium text-sm hover:text-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Tela principal do perfil
  return (
    <div style={{
      height: '100vh',
      width: '100%',
      backgroundColor: COLORS.fundo,
      display: 'flex',
      flexDirection: 'column',
      overflow: 'auto',
    }}>
      
      {/* TOP BAR COM VOLTAR */}
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
      </div>

      {/* ÁREA DA FOTO COM BEM-VINDO */}
      <div style={{
        flexShrink: 0,
        padding: '20px',
        display: 'flex',
        justifyContent: 'center',
      }}>
        <div style={{ width: '200px', textAlign: 'center' }}>
          
          {/* Bem-vindo */}
          <p style={{ color: COLORS.amarelo, fontSize: '14px', marginBottom: '8px' }}>
            Bem-vindo, {userName.split(' ')[0]}! 👋
          </p>
          
          {/* Foto */}
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
          
          {/* Botões de câmera */}
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
        </div>
      </div>

      {/* INFORMAÇÕES DO USUÁRIO */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '0 16px 16px 16px',
        borderRadius: '16px',
        padding: '12px',
        border: `1px solid ${COLORS.roxo}40`,
      }}>
        
        <div style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: `1px solid ${COLORS.roxo}20` }}>
          <span style={{ color: COLORS.amarelo, fontSize: '12px', fontWeight: 'bold' }}>📝 INFORMAÇÕES PESSOAIS</span>
        </div>

        {/* Nome */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.roxo}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <User size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Nome:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userName}</span>
          </div>
          <button onClick={() => handleEdit('nome')} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit3 size={12} /> Editar
          </button>
        </div>

        {/* E-mail */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.roxo}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Mail size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>E-mail:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userEmail}</span>
          </div>
          <button onClick={() => handleEdit('email')} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit3 size={12} /> Editar
          </button>
        </div>

        {/* Telefone */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: `1px solid ${COLORS.roxo}20` }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Phone size={16} color={COLORS.roxo} />
            <span style={{ color: COLORS.texto, fontSize: '13px' }}>Telefone:</span>
            <span style={{ color: COLORS.textoCinza, fontSize: '13px' }}>{userPhone}</span>
          </div>
          <button onClick={() => handleEdit('telefone')} style={{ color: COLORS.amarelo, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Edit3 size={12} /> Editar
          </button>
        </div>
      </div>

      {/* SEJA PARCEIRO */}
      <div style={{
        flexShrink: 0,
        backgroundColor: COLORS.card,
        margin: '0 16px 16px 16px',
        borderRadius: '16px',
        padding: '12px',
        border: `1px solid ${COLORS.roxo}40`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Briefcase size={16} color={COLORS.verde} />
            <span style={{ color: COLORS.texto, fontSize: '13px', fontWeight: 'bold' }}>🚗 SEJA PARCEIRO</span>
          </div>
          <button style={{ color: COLORS.verde, fontSize: '11px', background: 'none', border: 'none', cursor: 'pointer' }}>[Cadastrar]</button>
        </div>
        <div style={{ backgroundColor: COLORS.roxo + '15', borderRadius: '12px', padding: '8px 12px' }}>
          <span style={{ color: COLORS.textoCinza, fontSize: '12px' }}>
            Cadastre-se como motorista e ganhe dinheiro com o ObaLeva!
          </span>
        </div>
      </div>

      {/* BOTÕES RÁPIDOS */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        gap: '12px',
        margin: '0 16px 16px 16px',
      }}>
        <button style={{ flex: 1, backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
          <History size={20} color={COLORS.roxo} style={{ margin: '0 auto 4px' }} />
          <span style={{ fontSize: '10px', color: COLORS.textoCinza }}>Histórico</span>
        </button>
        <button style={{ flex: 1, backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
          <CreditCard size={20} color={COLORS.roxo} style={{ margin: '0 auto 4px' }} />
          <span style={{ fontSize: '10px', color: COLORS.textoCinza }}>Pagamento</span>
        </button>
        <button style={{ flex: 1, backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '12px', padding: '12px', textAlign: 'center', cursor: 'pointer' }}>
          <Settings size={20} color={COLORS.roxo} style={{ margin: '0 auto 4px' }} />
          <span style={{ fontSize: '10px', color: COLORS.textoCinza }}>Config.</span>
        </button>
      </div>

      {/* BOTÃO SAIR */}
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