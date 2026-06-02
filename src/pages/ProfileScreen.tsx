import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState('');

  const getCaminhoFoto = () => `user_${user?.id}.jpg`;

  // Carregar foto existente
  useEffect(() => {
    if (user) {
      const caminho = getCaminhoFoto();
      const { data } = supabase.storage.from('avatars').getPublicUrl(caminho);

      fetch(data.publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) setImageUrl(data.publicUrl);
        })
        .catch(() => console.log('sem foto'));
    }
  }, [user]);

  // Upload (padrão que já funciona)
  const fazerUpload = async (file: File) => {
    if (!user) return;

    setUploading(true);
    setMessage('📤 Enviando...');

    try {
      const caminho = getCaminhoFoto();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(caminho, file, {
          upsert: true,
          contentType: file.type
        });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(caminho);
      setImageUrl(data.publicUrl);
      setMessage('✅ Foto salva!');
      setTimeout(() => setMessage(''), 2000);
    } catch (err: any) {
      setMessage(`❌ ${err.message}`);
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // 🖼️ Anexar (galeria) – esse já funciona
  const anexarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.removeAttribute('capture');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file);
    };
    input.click();
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>
        ← Voltar
      </button>

      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Meu Perfil</h1>

      <div style={{ textAlign: 'center', marginTop: 30 }}>
        {/* Círculo da foto */}
        <div style={{
          width: 120,
          height: 120,
          borderRadius: 60,
          background: '#333',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '3px solid #facc15'
        }}>
          {imageUrl ? (
            <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} alt="Perfil" />
          ) : (
            <span style={{ fontSize: 50 }}>👤</span>
          )}
        </div>

        {/* Botão ÚNICO: Anexar foto */}
        <div style={{ marginTop: 30 }}>
          <button
            onClick={anexarFoto}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            🖼️ ANEXAR FOTO
          </button>
        </div>

        {/* Mensagem de orientação */}
        <p style={{ color: '#888', fontSize: 12, marginTop: 16 }}>
          💡 Dica: tire a selfie com o app Câmera do celular e depois clique em "ANEXAR FOTO".
        </p>

        {message && (
          <div style={{
            marginTop: 20,
            padding: 12,
            borderRadius: 10,
            background: message.includes('✅') ? '#22c55e20' : '#ef444420',
            color: message.includes('✅') ? '#22c55e' : '#ef4444',
            fontSize: 14
          }}>
            {message}
          </div>
        )}

        {uploading && (
          <div style={{ marginTop: 20 }}>
            <div style={{
              width: 40,
              height: 40,
              border: '3px solid #facc15',
              borderTop: '3px solid transparent',
              borderRadius: '50%',
              margin: '0 auto',
              animation: 'spin 1s linear infinite'
            }} />
          </div>
        )}

        <div style={{ marginTop: 40, padding: 16, background: '#1a1a2e', borderRadius: 16, textAlign: 'left' }}>
          <p style={{ color: '#fff', margin: 0 }}><strong>👤 Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
          <p style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}><strong>📧 Email:</strong> {user?.email}</p>
        </div>

        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: 12,
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 12,
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer',
            marginTop: 30
          }}
        >
          SAIR DA CONTA
        </button>
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ProfileScreen;