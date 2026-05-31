import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user.id}/profile.jpg`);
      setImageUrl(data.publicUrl);
    }
  }, [user]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    
    // ALERTA 1
    alert('1. Arquivo selecionado: ' + (file ? file.name : 'nenhum'));
    
    if (!file) return;
    if (!user) {
      alert('ERRO: Usuário não autenticado');
      return;
    }

    alert('2. User ID: ' + user.id);
    alert('3. Tamanho do arquivo: ' + (file.size / 1024).toFixed(2) + ' KB');

    try {
      const filePath = `usuarios/${user.id}/profile.jpg`;
      alert('4. Caminho: ' + filePath);

      const { data, error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) {
        alert('5. ERRO DO SUPABASE: ' + error.message + ' - Código: ' + error.statusCode);
        return;
      }

      alert('6. SUCESSO! Arquivo enviado: ' + data?.path);
      
      const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setImageUrl(urlData.publicUrl);
      alert('7. URL da imagem: ' + urlData.publicUrl);
      
    } catch (err: any) {
      alert('8. ERRO GERAL: ' + err.message);
    }
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20 }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil - Teste</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          backgroundColor: '#333',
          margin: '0 auto 20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '3px solid #facc15'
        }}>
          {imageUrl ? (
            <img src={imageUrl} alt="Perfil" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 50 }}>👤</span>
          )}
        </div>

        <label style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#facc15',
          color: '#000',
          borderRadius: 30,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          📸 SELECIONAR FOTO
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleUpload}
            style={{ display: 'none' }}
          />
        </label>

        <div style={{ marginTop: 40, padding: 16, backgroundColor: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff' }}><strong>User ID:</strong></p>
          <p style={{ color: '#888', fontSize: 10, wordBreak: 'break-all' }}>{user?.id}</p>
          <p style={{ color: '#fff', marginTop: 8 }}><strong>Email:</strong> {user?.email}</p>
        </div>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            navigate('/login');
          }}
          style={{
            width: '100%',
            padding: 12,
            backgroundColor: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 'bold',
            marginTop: 30
          }}
        >
          SAIR
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;