import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    navigate('/');
  };

  return (
    <div style={{
      backgroundColor: '#111827',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
      fontFamily: 'system-ui, sans-serif'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <div style={{
          width: '72px',
          height: '72px',
          backgroundColor: '#facc15',
          borderRadius: '20px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px',
          fontSize: '36px'
        }}>
          🚗
        </div>
        <h1 style={{ color: '#facc15', fontSize: '32px', marginBottom: '4px' }}>ObaLeva</h1>
        <p style={{ color: '#6b7280', fontSize: '14px' }}>Sua corrida, do seu jeito</p>
      </div>

      <form onSubmit={handleLogin} style={{ width: '100%', maxWidth: '320px' }}>
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            marginBottom: '12px',
            outline: 'none'
          }}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{
            width: '100%',
            padding: '14px 16px',
            backgroundColor: '#1f2937',
            border: '1px solid #374151',
            borderRadius: '12px',
            color: '#fff',
            fontSize: '14px',
            marginBottom: '20px',
            outline: 'none'
          }}
        />
        <button
          type="submit"
          style={{
            width: '100%',
            backgroundColor: '#facc15',
            color: '#111827',
            padding: '14px',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: 'bold',
            cursor: 'pointer'
          }}
        >
          Entrar
        </button>
      </form>

      <div style={{ width: '100%', maxWidth: '320px', marginTop: '20px', textAlign: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
          <span style={{ padding: '0 12px', color: '#6b7280', fontSize: '12px' }}>ou</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#374151' }}></div>
        </div>

        <button
          style={{
            width: '100%',
            backgroundColor: '#1f2937',
            color: '#fff',
            padding: '12px',
            border: '1px solid #374151',
            borderRadius: '12px',
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer'
          }}
        >
          <span style={{ fontSize: '18px' }}>🔗</span> Entrar com Google
        </button>

        <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '20px' }}>
          Não tem conta? <span style={{ color: '#facc15', cursor: 'pointer' }}>Cadastre-se</span>
        </p>
        <p style={{ color: '#4b5563', fontSize: '12px', marginTop: '8px', cursor: 'pointer' }}>
          Esqueci minha senha
        </p>
      </div>

      <p style={{ color: '#374151', fontSize: '10px', marginTop: '40px' }}>obaleva.com.br/login</p>
    </div>
  );
};

export default Login;