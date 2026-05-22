import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showDriverForm, setShowDriverForm] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && password) {
      navigate('/home');
    }
  };

  // TELA DE LOGIN
  if (!showDriverForm) {
    return (
      <div style={{
        position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center', marginBottom: 50 }}>
          <div style={{ fontSize: 60 }}>🚗</div>
          <h1 style={{ color: 'white', fontSize: 32, margin: 10 }}>OBALEVA</h1>
          <p style={{ color: 'rgba(255,255,255,0.8)' }}>Sua corrida de confiança</p>
        </div>

        <form onSubmit={handleLogin} style={{ width: '90%', maxWidth: 320 }}>
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ width: '100%', padding: 14, marginBottom: 12, borderRadius: 10, border: 'none', fontSize: 16, boxSizing: 'border-box' }}
          />
          <input
            type="password"
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{ width: '100%', padding: 14, marginBottom: 20, borderRadius: 10, border: 'none', fontSize: 16, boxSizing: 'border-box' }}
          />
          <button type="submit" style={{ width: '100%', padding: 14, background: 'white', color: '#667eea', fontWeight: 'bold', border: 'none', borderRadius: 10, fontSize: 16, cursor: 'pointer' }}>
            Entrar
          </button>
        </form>

        <div style={{ marginTop: 20, color: 'rgba(255,255,255,0.6)' }}>ou</div>

        <button style={{ marginTop: 10, width: '90%', maxWidth: 320, padding: 12, background: 'rgba(255,255,255,0.2)', color: 'white', border: 'none', borderRadius: 10, cursor: 'pointer' }}>
          Entrar com Google
        </button>

        <button onClick={() => setShowDriverForm(true)} style={{ marginTop: 30, background: 'none', border: 'none', color: '#ff9800', cursor: 'pointer', textDecoration: 'underline' }}>
          🚛 É motorista? Cadastre-se como motorista
        </button>
      </div>
    );
  }

  // TELA DE CADASTRO DE MOTORISTA
  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: '#f5f5f5', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ padding: 16, background: 'white', display: 'flex', alignItems: 'center', borderBottom: '1px solid #ddd' }}>
        <button onClick={() => setShowDriverForm(false)} style={{ background: 'none', border: 'none', fontSize: 20, cursor: 'pointer' }}>←</button>
        <h1 style={{ flex: 1, textAlign: 'center', fontSize: 18, margin: 0 }}>Cadastro Motorista</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ background: 'white', borderRadius: 16, padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>Nome completo</label>
            <input type="text" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>E-mail</label>
            <input type="email" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>Senha</label>
            <input type="password" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>WhatsApp</label>
            <input type="tel" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>CPF</label>
            <input type="text" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>Data de Nascimento</label>
            <input type="text" placeholder="DD/MM/AAAA" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ fontWeight: 'bold' }}>CNH</label>
            <input type="text" style={{ width: '100%', padding: 10, marginTop: 5, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 16 }}>
        <button onClick={() => alert('Cadastro enviado!')} style={{ width: '100%', padding: 14, background: '#4CAF50', color: 'white', fontWeight: 'bold', border: 'none', borderRadius: 30, fontSize: 16, cursor: 'pointer' }}>
          Cadastrar
        </button>
      </div>
    </div>
  );
};

export default Login;