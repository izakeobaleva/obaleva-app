import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Camera, Upload, LogOut } from 'lucide-react';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
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

  // Função de upload (QUE FUNCIONOU)
  const uploadPhoto = async (file: File) => {
    if (!user) return;

    setIsUploading(true);
    setMessage(null);

    try {
      const filePath = `usuarios/${user.id}/profile.jpg`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
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

  // ==============================================
  // APENAS DOIS BOTÕES SIMPLES (SEM COMPLICAÇÃO)
  // ==============================================
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) uploadPhoto(file);
  };

  const handleCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) uploadPhoto(file);
    };
    input.click();
  };

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
      backgroundColor: '#0f0f0f', 
      display: 'flex', 
      flexDirection: 'column' 
    }}>
      
      {/* TOP BAR */}
      <div style={{ 
        padding: '12px 16px', 
        backgroundColor: '#1a1a2e', 
        borderBottom: '1px solid #8b5cf640',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/home')} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
          <ArrowLeft size={24} color="#22c55e" />
        </button>
        <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#facc15' }}>PERFIL</span>
        <div style={{ width: 24 }} />
      </div>

      {/* CONTEÚDO */}
      <div style={{ flex: 1, padding: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        
        {/* FOTO */}
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          backgroundColor: '#8b5cf630',
          border: `3px solid #facc15`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          marginBottom: '20px'
        }}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={50} color="#8b5cf6" />
          )}
        </div>

        {/* BOTÕES */}
        <div style={{ display: 'flex', gap: '15px', marginBottom: '15px' }}>
          <button
            onClick={handleCamera}
            disabled={isUploading}
            style={{
              padding: '10px 20px',
              backgroundColor: '#22c55e',
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
              backgroundColor: '#facc15',
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

        {/* MENSAGEM */}
        {message && (
          <div style={{
            padding: '10px',
            backgroundColor: message.type === 'success' ? '#22c55e20' : '#ef444420',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <span style={{ color: message.type === 'success' ? '#22c55e' : '#ef4444', fontSize: '14px' }}>
              {message.text}
            </span>
          </div>
        )}

        {/* INFO USUÁRIO */}
        <div style={{
          width: '100%',
          backgroundColor: '#1a1a2e',
          borderRadius: '16px',
          padding: '16px',
          marginTop: '20px'
        }}>
          <p style={{ color: '#fff', marginBottom: '8px' }}>
            <strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}
          </p>
          <p style={{ color: '#fff' }}>
            <strong>Email:</strong> {user?.email}
          </p>
        </div>

        {/* BOTÃO SAIR */}
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            backgroundColor: '#ef4444',
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