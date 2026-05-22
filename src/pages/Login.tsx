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
    <div style={styles.container}>
      <div style={styles.logoArea}>
        <div style={styles.logoIcon}>🚗</div>
        <h1 style={styles.logoTitle}>OBALEVA</h1>
        <p style={styles.logoSubtitle}>Sua corrida de confiança</p>
      </div>

      <form onSubmit={handleLogin} style={styles.form}>
        <div style={styles.inputGroup}>
          <span style={styles.inputIcon}>📧</span>
          <input
            type="email"
            placeholder="E-mail"
            style={styles.input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div style={styles.inputGroup}>
          <span style={styles.inputIcon}>🔒</span>
          <input
            type="password"
            placeholder="Senha"
            style={styles.input}
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
          />
        </div>

        <button type="submit" style={styles.loginButton}>
          Entrar
        </button>
      </form>

      <div style={styles.divider}>
        <span style={styles.dividerLine}></span>
        <span style={styles.dividerText}>ou</span>
        <span style={styles.dividerLine}></span>
      </div>

      <button style={styles.googleButton}>
        Entrar com Google
      </button>

      <div style={styles.footer}>
        <button
          onClick={() => navigate('/motorista-cadastro')}
          style={styles.driverLink}
        >
          🚛 É motorista? Cadastre-se como motorista
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    boxSizing: 'border-box',
  },
  logoArea: { textAlign: 'center', marginBottom: '48px' },
  logoIcon: { fontSize: '64px', marginBottom: '12px' },
  logoTitle: { color: 'white', fontSize: '32px', fontWeight: 'bold', margin: 0 },
  logoSubtitle: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '8px' },
  form: { width: '100%', maxWidth: '320px' },
  inputGroup: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', marginBottom: '16px', padding: '4px 16px' },
  inputIcon: { fontSize: '20px', marginRight: '12px' },
  input: { flex: 1, background: 'transparent', border: 'none', padding: '14px 0', color: 'white', fontSize: '16px', outline: 'none' },
  loginButton: { width: '100%', background: 'white', color: '#667eea', fontWeight: 'bold', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', marginTop: '24px' },
  divider: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '24px 0', width: '100%', maxWidth: '320px' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' },
  dividerText: { color: 'rgba(255,255,255,0.6)', padding: '0 16px', fontSize: '12px' },
  googleButton: { width: '100%', maxWidth: '320px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' },
  footer: { marginTop: '32px', textAlign: 'center' },
  driverLink: { background: 'none', border: 'none', color: '#ff9800', cursor: 'pointer', fontSize: '14px', textDecoration: 'underline' },
};

export default Login;