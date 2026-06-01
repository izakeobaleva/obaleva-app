import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const testarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !user) return;

    setLoading(true);
    alert(`1. Arquivo: ${file.name} (${(file.size / 1024).toFixed(2)} KB)`);

    try {
      const caminho = `teste_${Date.now()}.jpg`;
      alert(`2. Caminho: ${caminho}`);

      const { error, data } = await supabase.storage
        .from('avatars')
        .upload(caminho, file);

      if (error) {
        alert(`3. ERRO: ${error.message}`);
        return;
      }

      alert(`4. SUCESSO! Arquivo: ${data?.path}`);
      
    } catch (err: any) {
      alert(`ERRO GERAL: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20, background: 'none', border: 'none', fontSize: 16, cursor: 'pointer' }}>
        ← Voltar
      </button>
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Teste Upload</h1>
      
      <div style={{ textAlign: 'center', marginTop: 50 }}>
        <input
          type="file"
          accept="image/*"
          onChange={testarUpload}
          disabled={loading}
          style={{
            padding: '12px 24px',
            background: '#facc15',
            color: '#000',
            borderRadius: 30,
            border: 'none',
            fontWeight: 'bold',
            fontSize: 16,
            cursor: 'pointer'
          }}
        />
        
        {loading && <p style={{ color: '#facc15', marginTop: 20 }}>Enviando...</p>}
        
        <p style={{ color: '#fff', marginTop: 30, fontSize: 12 }}>
          User ID: {user?.id}
        </p>
      </div>
    </div>
  );
};

export default ProfileScreen;