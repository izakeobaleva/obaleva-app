import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Camera, Upload, LogOut, Loader2 } from 'lucide-react';

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
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Carregar foto existente
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user.id}/profile.jpg`);
      
      fetch(data.publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) setProfileImageUrl(data.publicUrl);
        })
        .catch(() => console.log('Sem foto'));
    }
  }, [user]);

  // Função principal de upload
  const uploadPhoto = async (file: File) => {
    if (!user) {
      setMessage({ type: 'error', text: 'Usuário não autenticado' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    try {
      if (file.size > 5 * 1024 * 1024) {
        throw new Error('Arquivo muito grande! Máximo 5MB');
      }

      const filePath = `usuarios/${user.id}/profile.jpg`;

      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setProfileImageUrl(data.publicUrl);
      setMessage({ type: 'success', text: '✅ Foto salva com sucesso!' });
      setTimeout(() => setMessage(null), 3000);
      
    } catch (error: any) {
      setMessage({ type: 'error', text: error.message || 'Erro ao salvar' });
      setTimeout(() => setMessage(null), 3000);
    } finally {
      setIsUploading(false);
    }
  };

  // Abrir câmera
  const handleCamera = () => {
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

  // Abrir galeria
  const handleGallery = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadPhoto(file);
    };
    input.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ 
      height: '100vh', 
      width: '100%', 
      backgroundColor: COLORS.fundo, 
      display: 'flex', 
      flexDirection: 'column',
      overflow: 'auto' 
    }}>
      
      {/* Topo */}
      <div style={{ 
        padding: '16px', 
        backgroundColor: COLORS.card, 
        borderBottom: `1px solid ${COLORS.roxo}40`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} color={COLORS.verde} />
        </button>
        <span style={{ fontSize: '20px', fontWeight: 'bold', color: COLORS.amarelo }}>Perfil</span>
        <div style={{ width: 24 }} />
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* Foto */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          backgroundColor: COLORS.roxo + '30',
          border: `3px solid ${COLORS.amarelo}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={50} color={COLORS.roxo} />
          )}
        </div>

        {/* Botões */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <button
            onClick={handleCamera}
            disabled={isUploading}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.verde,
              border: 'none',
              borderRadius: '30px',
              color: '#000',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            <Camera size={18} /> TIRAR FOTO
          </button>

          <button
            onClick={handleGallery}
            disabled={isUploading}
            style={{
              padding: '10px 20px',
              backgroundColor: COLORS.amarelo,
              border: 'none',
              borderRadius: '30px',
              color: '#000',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              opacity: isUploading ? 0.6 : 1
            }}
          >
            <Upload size={18} /> ANEXAR
          </button>
        </div>

        {/* Alternar câmera */}
        <button
          onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
          style={{
            background: 'none',
            border: 'none',
            color: COLORS.amarelo,
            fontSize: '12px',
            cursor: 'pointer',
            marginBottom: '15px'
          }}
        >
          🔄 Usar câmera {cameraMode === 'user' ? 'TRASEIRA' : 'FRONTAL (SELFIE)'}
        </button>

        {/* Mensagem */}
        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: message.type === 'success' ? COLORS.verde + '20' : COLORS.vermelho + '20',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <span style={{ color: message.type === 'success' ? COLORS.verde : COLORS.vermelho, fontSize: '14px' }}>
              {message.text}
            </span>
          </div>
        )}

        {/* Loading */}
        {isUploading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
            <Loader2 size={20} color={COLORS.amarelo} className="animate-spin" />
            <span style={{ color: COLORS.texto }}>Enviando foto...</span>
          </div>
        )}

        {/* Informações do usuário */}
        <div style={{
          width: '100%',
          backgroundColor: COLORS.card,
          borderRadius: '16px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <p style={{ color: COLORS.texto, marginBottom: '8px' }}>
            <strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}
          </p>
          <p style={{ color: COLORS.texto }}>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        {/* Botão Sair */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: COLORS.vermelho,
            border: 'none',
            borderRadius: '12px',
            color: '#fff',
            fontWeight: 'bold',
            fontSize: '16px',
            cursor: 'pointer',
            marginTop: '30px'
          }}
        >
          SAIR DA CONTA
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;