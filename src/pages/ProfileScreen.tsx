import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { ArrowLeft, User, Camera, LogOut } from 'lucide-react';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [profileImageUrl, setProfileImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  // Carregar foto
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user.id}/profile.jpg`);
      setProfileImageUrl(data.publicUrl);
    }
  }, [user]);

  // Upload da foto - VERSÃO MAIS SIMPLES POSSÍVEL
  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      alert('Usuário não logado');
      return;
    }

    setUploading(true);
    
    try {
      console.log('1. Iniciando upload do arquivo:', file.name, file.size);
      
      const filePath = `usuarios/${user.id}/profile.jpg`;
      
      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) {
        console.error('Erro no upload:', error);
        alert('Erro: ' + error.message);
        return;
      }

      console.log('2. Upload concluído:', data);
      
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
      
      setProfileImageUrl(urlData.publicUrl);
      alert('✅ Foto salva com sucesso!');
      
    } catch (error: any) {
      console.error('Erro:', error);
      alert('Erro: ' + error.message);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '20px', backgroundColor: '#0f0f0f', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: '20px' }}>
        <ArrowLeft size={20} /> Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center', marginBottom: '30px' }}>PERFIL</h1>
      
      {/* Foto */}
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <div style={{
          width: '120px',
          height: '120px',
          borderRadius: '60px',
          backgroundColor: '#8b5cf630',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '3px solid #facc15'
        }}>
          {profileImageUrl ? (
            <img src={profileImageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <User size={48} color="#8b5cf6" />
          )}
        </div>
      </div>
      
      {/* Botão de upload */}
      <div style={{ textAlign: 'center' }}>
        <label style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#facc15',
          color: '#000',
          borderRadius: '30px',
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {uploading ? 'ENVIANDO...' : '📸 ESCOLHER FOTO'}
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>
      </div>
      
      {/* Info do usuário */}
      <div style={{
        backgroundColor: '#1a1a2e',
        padding: '20px',
        borderRadius: '16px',
        marginTop: '30px'
      }}>
        <p style={{ color: '#fff' }}><strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
        <p style={{ color: '#fff', marginTop: '10px' }}><strong>Email:</strong> {user?.email}</p>
      </div>
      
      {/* Botão sair */}
      <button
        onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }}
        style={{
          width: '100%',
          padding: '14px',
          backgroundColor: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: '12px',
          fontWeight: 'bold',
          marginTop: '30px'
        }}
      >
        SAIR
      </button>
    </div>
  );
};

export default ProfileScreen;