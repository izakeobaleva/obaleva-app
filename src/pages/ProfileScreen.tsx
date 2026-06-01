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

  // Carregar foto existente
  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`user_${user.id}.jpg`);
      
      // Verificar se a imagem existe
      fetch(data.publicUrl, { method: 'HEAD' })
        .then(res => {
          if (res.ok) setImageUrl(data.publicUrl);
        })
        .catch(() => console.log('Sem foto'));
    }
  }, [user]);

  // Função para processar imagem da câmera
  const processarImagemCamera = (file: File): Promise<Blob> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (e) => {
        const img = new Image();
        img.src = e.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Reduz para 800px (tamanho bom para perfil)
          const maxSize = 800;
          if (width > height && width > maxSize) {
            height = (height * maxSize) / width;
            width = maxSize;
          } else if (height > maxSize) {
            width = (width * maxSize) / height;
            height = maxSize;
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);
          
          // Converter para JPEG com qualidade 0.8
          canvas.toBlob((blob) => {
            if (blob) resolve(blob);
            else reject(new Error('Erro ao processar imagem'));
          }, 'image/jpeg', 0.8);
        };
        img.onerror = reject;
      };
      reader.onerror = reject;
    });
  };

  // Upload da foto
  const fazerUpload = async (file: File, origem: 'camera' | 'galeria') => {
    if (!user) return;

    setUploading(true);
    setMessage(origem === 'camera' ? '📸 Processando selfie...' : '📤 Enviando foto...');

    try {
      let blobParaUpload: Blob;
      
      if (origem === 'camera') {
        // Processa imagem da câmera
        blobParaUpload = await processarImagemCamera(file);
      } else {
        // Usa arquivo da galeria diretamente (já está ok)
        blobParaUpload = file;
      }

      setMessage('📤 Salvando no servidor...');

      const filePath = `user_${user.id}.jpg`;
      
      const { error } = await supabase.storage
        .from('avatars')
        .upload(filePath, blobParaUpload, { 
          upsert: true,
          contentType: 'image/jpeg'
        });

      if (error) throw error;

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      setImageUrl(data.publicUrl);
      setMessage('✅ Foto salva com sucesso!');
      
      setTimeout(() => setMessage(''), 3000);
      
    } catch (err: any) {
      console.error('Erro:', err);
      setMessage('❌ ' + (err.message || 'Erro ao salvar foto'));
      setTimeout(() => setMessage(''), 4000);
    } finally {
      setUploading(false);
    }
  };

  // Abrir câmera
  const abrirCamera = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.setAttribute('capture', 'environment');
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 15 * 1024 * 1024) {
          setMessage('❌ Foto muito grande! Máximo 15MB');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        await fazerUpload(file, 'camera');
      }
    };
    input.click();
  };

  // Abrir galeria
  const abrirGaleria = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        if (file.size > 10 * 1024 * 1024) {
          setMessage('❌ Foto muito grande! Máximo 10MB');
          setTimeout(() => setMessage(''), 3000);
          return;
        }
        await fazerUpload(file, 'galeria');
      }
    };
    input.click();
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>
        ← Voltar
      </button>
      
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
        {/* Foto */}
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
            onClick={abrirCamera}
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
            📸 TIRAR FOTO
          </button>

          <button
            onClick={abrirGaleria}
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
            🖼️ ESCOLHER FOTO
          </button>
        </div>

        {/* Mensagem de status */}
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

        {/* Indicador de upload */}
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

        {/* Informações do usuário */}
        <div style={{ marginTop: 40, padding: 16, background: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff', margin: 0 }}><strong>Nome:</strong> {user?.user_metadata?.name || 'Passageiro'}</p>
          <p style={{ color: '#fff', marginTop: 8, marginBottom: 0 }}><strong>Email:</strong> {user?.email}</p>
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