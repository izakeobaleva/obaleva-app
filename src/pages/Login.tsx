import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      navigate('/home');
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '32px',
        width: '90%',
        maxWidth: '350px',
      }}>
        <h1 style={{ textAlign: 'center', marginBottom: '24px' }}>🚛 ObaLeva</h1>
        <form onSubmit={handleLogin}>
          <input type="email" placeholder="E-mail" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
          <input type="password" placeholder="Senha" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '12px', border: '1px solid #ddd', borderRadius: '8px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', background: '#667eea', color: 'white', fontWeight: 'bold', padding: '12px', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '16px' }}>Entrar</button>
        </form>
      </div>
    </div>
  );
};

export default Login;