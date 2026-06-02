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

  // 🔧 Compressão de imagem (resolve erro de memória)
  const comprimirImagem = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_WIDTH) {
            height = (height * MAX_WIDTH) / width;
            width = MAX_WIDTH;
          } else if (height > MAX_HEIGHT) {
            width = (width * MAX_HEIGHT) / height;
            height = MAX_HEIGHT;
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(
            (blob) => {
              if (blob) resolve(blob);
              else reject(new Error('Falha ao comprimir'));
            },
            'image/jpeg',
            0.8
          );
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Upload com compressão para fotos da câmera
  const fazerUpload = async (file: File, fromCamera = false) => {
    if (!user) return;

    setUploading(true);
    setMessage(fromCamera ? '📸 Processando selfie...' : '📤 Enviando...');

    try {
      let arquivoParaUpload: File | Blob = file;

      // Se for da câmera, comprime antes
      if (fromCamera) {
        arquivoParaUpload = await comprimirImagem(file);
      }

      const caminho = getCaminhoFoto();

      const { error } = await supabase.storage
        .from('avatars')
        .upload(caminho, arquivoParaUpload, {
          upsert: true,
          contentType: 'image/jpeg'
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

  // 🤳 Selfie (câmera frontal + compressão)
  const tirarSelfie = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'user');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file, true);
    };
    input.click();
  };

  // 🖼️ Anexar da galeria (sem compressão extra, já funciona)
  const anexarFoto = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.removeAttribute('capture');
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) fazerUpload(file, false);
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

        {/* Botões */}
        <div style={{ marginTop: 30, display: 'flex', gap: 15, justifyContent: 'center', flexWrap: 'wrap' }}>
          <button
            onClick={tirarSelfie}
            disabled={uploading}
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              color: '#000',
              border: 'none',
              borderRadius: 30,
              fontWeight: 'bold',
              fontSize: 16,
              cursor: uploading ? 'not-allowed' : 'pointer',
              opacity: uploading ? 0.6 : 1
            }}
          >
            🤳 SELFIE
          </button>

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
            🖼️ ANEXAR
          </button>
        </div>

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