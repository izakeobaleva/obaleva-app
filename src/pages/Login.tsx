import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showDriverForm, setShowDriverForm] = useState(false);
  const [driverData, setDriverData] = useState({
    nome: '',
    email: '',
    senha: '',
    whatsapp: '',
    cpf: '',
    dataNasc: '',
    cnh: ''
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      navigate('/home');
    }
  };

  const formatDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    if (value.length >= 7) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDriverData({ ...driverData, dataNasc: value });
  };

  const handleDriverRegister = () => {
    alert('✅ Cadastro de motorista enviado! Faça login.');
    setShowDriverForm(false);
  };

  // TELA DE LOGIN (layout original)
  if (!showDriverForm) {
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
            onClick={() => setShowDriverForm(true)}
            style={styles.driverLink}
          >
            🚛 É motorista? Cadastre-se como motorista
          </button>
        </div>
      </div>
    );
  }

  // TELA DE CADASTRO DE MOTORISTA
  return (
    <div style={styles.driverContainer}>
      <div style={styles.driverHeader}>
        <button onClick={() => setShowDriverForm(false)} style={styles.backButton}>
          ← Voltar
        </button>
        <h1 style={styles.driverTitle}>🚛 Cadastro Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      <div style={styles.driverContent}>
        <div style={styles.driverCard}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Nome completo *</label>
            <input
              type="text"
              style={styles.inputField}
              value={driverData.nome}
              onChange={(e) => setDriverData({...driverData, nome: e.target.value})}
              placeholder="Digite seu nome"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📧 E-mail *</label>
            <input
              type="email"
              style={styles.inputField}
              value={driverData.email}
              onChange={(e) => setDriverData({...driverData, email: e.target.value})}
              placeholder="seu@email.com"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>🔒 Senha *</label>
            <input
              type="password"
              style={styles.inputField}
              value={driverData.senha}
              onChange={(e) => setDriverData({...driverData, senha: e.target.value})}
              placeholder="Mínimo 6 caracteres"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📱 WhatsApp *</label>
            <input
              type="tel"
              inputMode="numeric"
              style={styles.inputField}
              value={driverData.whatsapp}
              onChange={(e) => setDriverData({...driverData, whatsapp: e.target.value})}
              placeholder="11999999999"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>🆔 CPF *</label>
            <input
              type="text"
              inputMode="numeric"
              style={styles.inputField}
              value={driverData.cpf}
              onChange={(e) => setDriverData({...driverData, cpf: e.target.value})}
              placeholder="00000000000"
            />
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              style={styles.inputField}
              value={driverData.dataNasc}
              onChange={formatDate}
              maxLength={10}
            />
            <small style={styles.hint}>Digite usando o teclado numérico (ex: 25051990)</small>
          </div>

          <div style={styles.field}>
            <label style={styles.label}>📄 Número da CNH *</label>
            <input
              type="text"
              style={styles.inputField}
              value={driverData.cnh}
              onChange={(e) => setDriverData({...driverData, cnh: e.target.value})}
              placeholder="Digite o número da CNH"
            />
          </div>
        </div>
      </div>

      <div style={styles.driverFooter}>
        <button onClick={handleDriverRegister} style={styles.submitButton}>
          ✅ Cadastrar como Motorista
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
  logoArea: {
    textAlign: 'center',
    marginBottom: '48px',
  },
  logoIcon: {
    fontSize: '64px',
    marginBottom: '12px',
  },
  logoTitle: {
    color: 'white',
    fontSize: '32px',
    fontWeight: 'bold',
    margin: 0,
    letterSpacing: '2px',
  },
  logoSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: '14px',
    marginTop: '8px',
  },
  form: {
    width: '100%',
    maxWidth: '320px',
  },
  inputGroup: {
    display: 'flex',
    alignItems: 'center',
    background: 'rgba(255,255,255,0.2)',
    borderRadius: '12px',
    marginBottom: '16px',
    padding: '4px 16px',
    backdropFilter: 'blur(10px)',
  },
  inputIcon: {
    fontSize: '20px',
    marginRight: '12px',
  },
  input: {
    flex: 1,
    background: 'transparent',
    border: 'none',
    padding: '14px 0',
    color: 'white',
    fontSize: '16px',
    outline: 'none',
  },
  loginButton: {
    width: '100%',
    background: 'white',
    color: '#667eea',
    fontWeight: 'bold',
    padding: '14px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '16px',
    cursor: 'pointer',
    marginTop: '24px',
  },
  divider: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    margin: '24px 0',
    width: '100%',
    maxWidth: '320px',
  },
  dividerLine: {
    flex: 1,
    height: '1px',
    background: 'rgba(255,255,255,0.3)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.6)',
    padding: '0 16px',
    fontSize: '12px',
  },
  googleButton: {
    width: '100%',
    maxWidth: '320px',
    background: 'rgba(255,255,255,0.2)',
    color: 'white',
    padding: '12px',
    border: 'none',
    borderRadius: '12px',
    fontSize: '14px',
    cursor: 'pointer',
    backdropFilter: 'blur(10px)',
  },
  footer: {
    marginTop: '32px',
    textAlign: 'center',
  },
  driverLink: {
    background: 'none',
    border: 'none',
    color: '#ff9800',
    cursor: 'pointer',
    fontSize: '14px',
    textDecoration: 'underline',
  },
  driverContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
  },
  driverHeader: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'white',
    borderBottom: '1px solid #eee',
  },
  backButton: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    cursor: 'pointer',
    padding: '8px',
    color: '#666',
  },
  driverTitle: {
    fontSize: '18px',
    margin: 0,
    fontWeight: 'bold',
  },
  driverContent: {
    flex: 1,
    overflow: 'auto',
    padding: '16px',
  },
  driverCard: {
    background: 'white',
    borderRadius: '20px',
    padding: '20px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  field: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold',
    marginBottom: '6px',
    color: '#333',
  },
  inputField: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box',
  },
  hint: {
    display: 'block',
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  driverFooter: {
    flexShrink: 0,
    padding: '16px',
    background: '#f5f5f5',
  },
  submitButton: {
    width: '100%',
    background: '#4CAF50',
    color: 'white',
    fontWeight: 'bold',
    padding: '14px',
    border: 'none',
    borderRadius: '30px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Login;