import React, { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const Perfil = () => {
  const [userEmail, setUserEmail] = useState('carregando...');
  const [userName, setUserName] = useState('Usuário');
  const [isMotorista, setIsMotorista] = useState(false);

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.user) {
      setUserEmail(session.user.email || 'sem email');
      setUserName(session.user.email?.split('@')[0] || 'Usuário');
      
      const { data } = await supabase
        .from('usuarios')
        .select('tipo')
        .eq('id', session.user.id)
        .maybeSingle();
      
      if (data?.tipo === 'motorista') {
        setIsMotorista(true);
      }
    }
  }

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
      <div style={{ maxWidth: '500px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0', marginBottom: '20px' }}>
          <button onClick={() => window.location.href = '/'} style={{ background: 'none', border: 'none', color: '#A0A0B0', fontSize: '20px', cursor: 'pointer' }}>←</button>
          <h1 style={{ color: 'white', fontSize: '20px', margin: 0, fontWeight: 'bold' }}>Meu Perfil</h1>
        </div>

        <div style={{
          background: '#1A1528', borderRadius: '16px', padding: '24px', border: '1px solid rgba(255,255,255,0.1)',
          textAlign: 'center', marginBottom: '16px'
        }}>
          <div style={{
            width: '80px', height: '80px', background: 'linear-gradient(135deg, #F4D03F, #F59E0B)',
            borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px'
          }}>
            <span style={{ fontSize: '36px' }}>👤</span>
          </div>
          <h2 style={{ color: 'white', fontSize: '20px', margin: '0 0 8px' }}>{userName}</h2>
          <span style={{
            display: 'inline-block', padding: '6px 16px', borderRadius: '9999px', fontSize: '12px', fontWeight: '600',
            background: isMotorista ? 'rgba(34,197,94,0.3)' : 'rgba(59,130,246,0.3)',
            color: isMotorista ? '#22C55E' : '#3B82F6'
          }}>
            {isMotorista ? '🚗 Motorista' : '🚶 Passageiro'}
          </span>
        </div>

        <div style={{
          background: '#1A1528', borderRadius: '16px', padding: '20px', border: '1px solid rgba(255,255,255,0.1)', marginBottom: '16px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
            <span style={{ fontSize: '18px' }}>📧</span>
            <div>
              <p style={{ color: '#A0A0B0', fontSize: '12px', margin: '0 0 2px' }}>E-mail</p>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>{userEmail}</p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <span style={{ fontSize: '18px' }}>🛡️</span>
            <div>
              <p style={{ color: '#A0A0B0', fontSize: '12px', margin: '0 0 2px' }}>Conta</p>
              <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>Verificada</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleSignOut}
          style={{
            width: '100%', background: '#1A1528', borderRadius: '16px', padding: '16px',
            border: '1px solid rgba(255,255,255,0.1)', color: '#EF4444', fontSize: '16px',
            fontWeight: '500', cursor: 'pointer', display: 'flex', alignItems: 'center',
            justifyContent: 'center', gap: '8px', marginTop: '32px'
          }}
        >
          <span style={{ fontSize: '18px' }}>🚪</span>
          Sair da conta
        </button>
      </div>
    </div>
  );
};

export default Perfil;