import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [imageUrl, setImageUrl] = useState('');
  const [status, setStatus] = useState('');

  useEffect(() => {
    if (user) {
      const { data } = supabase.storage
        .from('avatars')
        .getPublicUrl(`user_${user.id}.jpg`);
      setImageUrl(data.publicUrl);
    }
  }, [user]);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !user) return;

    setStatus('Enviando...');

    const { error } = await supabase.storage
      .from('avatars')
      .upload(`user_${user.id}.jpg`, file, { upsert: true });

    if (error) {
      setStatus('❌ ' + error.message);
    } else {
      setStatus('✅ Foto salva!');
      const { data } = supabase.storage.from('avatars').getPublicUrl(`user_${user.id}.jpg`);
      setImageUrl(data.publicUrl);
      setTimeout(() => setStatus(''), 2000);
    }
  };

  return (
    <div style={{ padding: 20, background: '#000', minHeight: '100vh' }}>
      <button onClick={() => navigate('/home')} style={{ color: '#22c55e', marginBottom: 20 }}>← Voltar</button>
      <h1 style={{ color: '#facc15', textAlign: 'center' }}>Perfil</h1>
      
      <div style={{ textAlign: 'center', marginTop: 30 }}>
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

        <div style={{ marginTop: 20 }}>
          <label style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#facc15',
            color: '#000',
            borderRadius: 25,
            fontWeight: 'bold',
            cursor: 'pointer'
          }}>
            📸 SELECIONAR FOTO
            <input type="file" accept="image/*" onChange={upload} style={{ display: 'none' }} />
          </label>
        </div>

        {status && (
          <div style={{ marginTop: 15, color: status.includes('✅') ? '#22c55e' : '#ef4444' }}>
            {status}
          </div>
        )}

        <div style={{ marginTop: 30, padding: 16, background: '#1a1a2e', borderRadius: 16 }}>
          <p style={{ color: '#fff', fontSize: 10 }}>User: {user?.id}</p>
        </div>

        <button onClick={async () => { await supabase.auth.signOut(); navigate('/login'); }} style={{
          width: '100%', padding: 12, background: '#ef4444', color: '#fff',
          border: 'none', borderRadius: 12, fontWeight: 'bold', marginTop: 20
        }}>SAIR</button>
      </div>
    </div>
  );
};

export default ProfileScreen;