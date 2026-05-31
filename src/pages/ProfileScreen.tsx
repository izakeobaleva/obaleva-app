import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Carregar foto existente
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`usuarios/${user.id}/profile.jpg`);
      setImageUrl(data.publicUrl);
    }
  }, [user]);

  // Função de upload (VERSÃO MAIS SIMPLES POSSÍVEL)
  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    if (!user) {
      setMessage('Usuário não logado');
      return;
    }

    setUploading(true);
    setMessage('Enviando...');

    try {
      const filePath = `usuarios/${user.id}/profile.jpg`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      if (error) {
        setMessage('Erro: ' + error.message);
        return;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      setMessage('✅ Foto salva com sucesso!');
      
    } catch (err: any) {
      setMessage('Erro: ' + err.message);
    } finally {
      setUploading(false);
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ padding: 20, backgroundColor: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20 }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        {/* Foto */}
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

        {/* Botão de upload */}
        <label style={{
          display: 'inline-block',
          padding: '12px 24px',
          backgroundColor: '#facc15',
          color: '#000',
          borderRadius: 30,
          fontWeight: 'bold',
          cursor: 'pointer'
        }}>
          {uploading ? 'ENVIANDO...' : '📸 SELECIONAR FOTO'}
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: 'none' }}
            disabled={uploading}
          />
        </label>

        {/* Mensagem */}
        {message && (
          <p style={{ color: message.includes('✅') ? '#22c55e' : '#ef4444', marginTop: 20 }}>
            {message}
          </p>
        )}

        {/* Info do usuário */}
        <div style={{ marginTop: 40, padding: 16, backgroundColor: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff' }}><strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
          <p style={{ color: '#fff', marginTop: 8 }}><strong>Email:</strong> {user?.email}</p>
        </div>

        {/* Botão sair */}
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