import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Camera, Upload, LogOut } from 'lucide-react';

const COLORS = {
  amarelo: '#facc15',
  roxo: '#8b5cf6',
  vermelho: '#ef4444',
  verde: '#22c55e',
  fundo: '#0f0f0f',
  card: '#1a1a2e',
  texto: '#ffffff',
};

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);

  // Carregar foto existente
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user.id}/profile.jpg`);
      setProfileImageUrl(data.publicUrl);
    }
  }, [user]);

  // Upload da foto
  const handleFileSelect = async (file: File) => {
    if (!user) return;
    
    setIsUploading(true);
    
    try {
      console.log('1️⃣ Iniciando upload...');
      console.log('   Arquivo:', file.name, file.size, file.type);
      console.log('   User ID:', user.id);
      
      // Upload direto para o Supabase (SEM compressão)
      const filePath = `usuarios/${user.id}/profile.jpg`;
      console.log('2️⃣ Enviando para:', filePath);
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { 
          upsert: true,
          contentType: file.type 
        });
      
      if (uploadError) {
        console.log('❌ Erro no upload:', uploadError);
        console.log('   Mensagem:', uploadError.message);
        console.log('   Código:', uploadError.code);
        alert('Erro: ' + uploadError.message);
      } else {
        console.log('✅ Upload concluído!');
        console.log('   Dados:', uploadData);
        
        // Atualizar URL
        const { data } = supabase.storage
          .from('avatars')
          .getPublicUrl(filePath);
        console.log('   URL pública:', data.publicUrl);
        
        setProfileImageUrl(data.publicUrl);
        alert('✅ Foto salva com sucesso!');
      }
      
      setIsUploading(false);
      setShowPhotoOptions(false);
      
    } catch (error: any) {
      console.error('❌ Erro inesperado:', error);
      alert('Erro: ' + (error.message || 'Erro desconhecido'));
      setIsUploading(false);
    }
  };

  // Abrir câmera
  const handleOpenCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  // Abrir galeria
  const handleOpenGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) handleFileSelect(file);
    };
    input.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ height: '100vh', width: '100%', backgroundColor: COLORS.fundo, display: 'flex', flexDirection: 'column' }}>
      
      {/* TOP BAR */}
      <div style={{ flexShrink: 0, backgroundColor: COLORS.card, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={() => navigate('/home')} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={20} color={COLORS.verde} />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: COLORS.amarelo }}>PERFIL</span>
        <div style={{ width: '40px' }} />
      </div>

      {/* CONTEÚDO CENTRAL */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '20px' }}>
        
        {/* FOTO */}
        <div style={{ width: '120px', height: '120px', backgroundColor: COLORS.roxo + '30', borderRadius: '60px', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden', border: `3px solid ${COLORS.amarelo}`, marginBottom: '20px' }}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={48} color={COLORS.roxo} />
          )}
        </div>

        {/* BOTÃO ALTERAR FOTO */}
        <button
          onClick={() => setShowPhotoOptions(!showPhotoOptions)}
          disabled={isUploading}
          style={{ padding: '10px 20px', backgroundColor: COLORS.card, border: `1px solid ${COLORS.roxo}40`, borderRadius: '20px', cursor: 'pointer', marginBottom: '20px' }}
        >
          {isUploading ? 'ENVIANDO...' : 'ALTERAR FOTO'}
        </button>

        {/* OPÇÕES DA FOTO */}
        {showPhotoOptions && !isUploading && (
          <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
            <div style={{ backgroundColor: COLORS.card, borderRadius: '20px', padding: '24px', width: '280px' }}>
              <button onClick={handleOpenCamera} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.verde, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold' }}>
                📸 TIRAR FOTO
              </button>
              <button onClick={handleOpenGallery} style={{ width: '100%', padding: '12px', backgroundColor: COLORS.amarelo, border: 'none', borderRadius: '12px', marginBottom: '10px', cursor: 'pointer', fontWeight: 'bold', color: COLORS.fundo }}>
                📁 ANEXAR FOTO
              </button>
              <button onClick={() => setShowPhotoOptions(false)} style={{ width: '100%', padding: '10px', background: 'transparent', border: 'none', cursor: 'pointer', color: '#888' }}>
                Cancelar
              </button>
            </div>
          </div>
        )}

        {/* INFORMAÇÕES DO USUÁRIO */}
        <div style={{ backgroundColor: COLORS.card, borderRadius: '16px', padding: '16px', width: '100%', maxWidth: '300px', marginTop: '20px' }}>
          <p style={{ color: COLORS.texto }}><strong>Nome:</strong> {user?.user_metadata?.name || user?.email?.split('@')[0] || 'Passageiro'}</p>
          <p style={{ color: COLORS.texto, marginTop: '8px' }}><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* BOTÃO SAIR */}
        <button onClick={handleLogout} style={{ marginTop: '30px', padding: '12px 30px', backgroundColor: COLORS.vermelho, border: 'none', borderRadius: '12px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;