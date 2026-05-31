import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');
  const [cameraMode, setCameraMode] = useState<'user' | 'environment'>('environment');
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`user_${user.id}.jpg`);
      setImageUrl(data.publicUrl);
    }
  }, [user]);

  const upload = async (file: File) => {
    if (!file || !user) return;

    setUploading(true);
    setStatus('📤 Enviando... (pode levar alguns segundos)');

    // Timeout de 30 segundos
    const timeoutId = setTimeout(() => {
      setStatus('⏰ O upload está demorando. Tente uma foto menor.');
      setUploading(false);
    }, 30000);

    try {
      console.log('1. Arquivo:', file.name, file.size, file.type);
      console.log('2. User ID:', user.id);
      
      const filePath = `user_${user.id}.jpg`;
      console.log('3. Caminho:', filePath);

      const { error, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file, { upsert: true });

      clearTimeout(timeoutId);

      if (error) {
        console.error('4. Erro:', error);
        setStatus('❌ Erro: ' + error.message);
      } else {
        console.log('5. Sucesso:', data);
        setStatus('✅ Foto salva!');
        const { data: urlData } = supabase.storage.from('avatars').getPublicUrl(filePath);
        setImageUrl(urlData.publicUrl);
        setTimeout(() => setStatus(''), 2000);
      }
    } catch (err: any) {
      clearTimeout(timeoutId);
      console.error('Erro geral:', err);
      setStatus('❌ Erro: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const abrirCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.capture = cameraMode === 'user' ? 'user' : 'environment';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) upload(file);
    };
    input.click();
  };

  const abrirGaleria = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.removeAttribute('capture');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) upload(file);
    };
    input.click();
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20 }}>← Voltar</button>
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        {/* Foto */}
        <div style={{
          width: 100,
          height: 100,
          borderRadius: 50,
          background: '#333',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          border: '2px solid #facc15'
        }}>
          {imageUrl ? (
            <img src={imageUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span style={{ fontSize: 40 }}>👤</span>
          )}
        </div>

        {/* Botões */}
        <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
          <button
            onClick={abrirCamera}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 25,
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            📸 TIRAR FOTO
          </button>

          <button
            onClick={abrirGaleria}
            disabled={uploading}
            style={{
              padding: '10px 20px',
              background: '#facc15',
              color: '#000',
              border: 'none',
              borderRadius: 25,
              fontWeight: 'bold',
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            🖼️ ANEXAR
          </button>
        </div>

        {/* Alternar câmera */}
        <button
          onClick={() => setCameraMode(cameraMode === 'user' ? 'environment' : 'user')}
          style={{
            marginTop: 10,
            background: 'none',
            border: 'none',
            color: '#facc15',
            fontSize: 12,
            cursor: 'pointer'
          }}
        >
          🔄 {cameraMode === 'user' ? 'Usar câmera TRASEIRA' : 'Usar câmera FRONTAL (SELFIE)'}
        </button>

        {/* Status */}
        {status && (
          <div style={{ 
            marginTop: 15, 
            padding: 10,
            borderRadius: 10,
            background: status.includes('✅') ? '#22c55e20' : status.includes('❌') ? '#ef444420' : '#facc1520',
            color: status.includes('✅') ? '#22c55e' : status.includes('❌') ? '#ef4444' : '#facc15'
          }}>
            {status}
          </div>
        )}

        {/* Info */}
        <div style={{ marginTop: 30, padding: 16, background: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff', fontSize: 10, wordBreak: 'break-all' }}>
            <strong>User ID:</strong> {user?.id}
          </p>
          <p style={{ color: '#fff', fontSize: 10, marginTop: 8 }}>
            <strong>Status:</strong> {uploading ? 'Enviando...' : 'Pronto'}
          </p>
        </div>

        {/* Sair */}
        <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} style={{
          width: '100%',
          padding: 12,
          background: '#ef4444',
          color: '#fff',
          border: 'none',
          borderRadius: 12,
          fontWeight: 'bold',
          marginTop: 20,
          cursor: 'pointer'
        }}>
          SAIR
        </button>
      </div>
    </div>
  );
};

export default ProfileScreen;