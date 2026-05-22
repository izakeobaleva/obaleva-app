import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';

const Perfil = () => {
  const navigate = useNavigate();
  const [userEmail, setUserEmail] = useState('carregando...');

  useEffect(() => {
    const load = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) setUserEmail(session.user.email || '');
    };
    load();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0F0B1A, #1A1528)',
      padding: '16px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ maxWidth: '500px', margin: '0 auto', textAlign: 'center', paddingTop: '80px' }}>
        <div style={{
          width: '80px', height: '80px', background: 'linear-gradient(135deg, #F4D03F, #F59E0B)',
          borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
        }}>
          <span style={{ fontSize: '36px' }}>👤</span>
        </div>
        <h2 style={{ color: 'white', fontSize: '20px', margin: '0 0 8px' }}>{userEmail}</h2>

        <button
          onClick={() => navigate('/register-driver')}
          style={{
            width: '100%',
            background: '#1A1528',
            borderRadius: '16px',
            padding: '16px',
            border: '1px solid rgba(255,255,255,0.1)',
            color: '#4CAF50',
            fontSize: '16px',
            fontWeight: '500',
            cursor: 'pointer',
            marginTop: '32px'
          }}
        >
          🚀 Seja Motorista Parceiro
        </button>

        <button onClick={handleSignOut} style={{
          width: '100%', background: '#1A1528', borderRadius: '16px', padding: '16px',
          border: '1px solid rgba(255,255,255,0.1)', color: '#EF4444', fontSize: '16px',
          fontWeight: '500', cursor: 'pointer', marginTop: '16px'
        }}>
          🚪 Sair da conta
        </button>
      </div>
    </div>
  );
};

export default Perfil;