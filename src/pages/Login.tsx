import React, { useState } from 'react';

const Login = () => {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [mostrarCadastroMotorista, setMostrarCadastroMotorista] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email && senha) {
      window.location.href = '/home';
    } else {
      alert('Digite email e senha');
    }
  };

  return (
    <>
      {/* TELA DE LOGIN */}
      {!mostrarCadastroMotorista && (
        <div style={styles.container}>
          <div style={styles.logoArea}>
            <div style={styles.logoIcon}>🚗</div>
            <h1 style={styles.logoText}>OBALEVA</h1>
            <p style={styles.logoSubText}>Sua corrida de confiança</p>
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

            <button type="submit" style={styles.button}>
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
              onClick={() => setMostrarCadastroMotorista(true)}
              style={styles.motoristaLink}
            >
              🚛 É motorista? Cadastre-se como motorista
            </button>
          </div>
        </div>
      )}

      {/* TELA DE CADASTRO MOTORISTA */}
      {mostrarCadastroMotorista && (
        <div style={styles.containerCadastro}>
          <div style={styles.headerCadastro}>
            <button onClick={() => setMostrarCadastroMotorista(false)} style={styles.backButton}>← Voltar</button>
            <h1 style={styles.titleCadastro}>🚛 Cadastro Motorista</h1>
            <div style={{ width: 50 }}></div>
          </div>

          <div style={styles.formCadastro}>
            <div style={styles.field}>
              <label style={styles.label}>👤 Nome completo *</label>
              <input type="text" style={styles.inputCadastro} placeholder="Digite seu nome" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📧 E-mail *</label>
              <input type="email" style={styles.inputCadastro} placeholder="seu@email.com" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>🔒 Senha *</label>
              <input type="password" style={styles.inputCadastro} placeholder="Mínimo 6 caracteres" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📱 WhatsApp *</label>
              <input type="tel" style={styles.inputCadastro} placeholder="11999999999" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>🆔 CPF *</label>
              <input type="text" style={styles.inputCadastro} placeholder="00000000000" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📅 Data de nascimento *</label>
              <input type="text" style={styles.inputCadastro} placeholder="DD/MM/AAAA" />
            </div>
            <div style={styles.field}>
              <label style={styles.label}>📄 Número da CNH *</label>
              <input type="text" style={styles.inputCadastro} placeholder="Digite o número da CNH" />
            </div>
          </div>

          <div style={styles.buttonAreaCadastro}>
            <button 
              onClick={() => alert('Cadastro enviado!')}
              style={styles.submitButton}
            >
              ✅ Cadastrar como Motorista
            </button>
          </div>
        </div>
      )}
    </>
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
  logoArea: { textAlign: 'center', marginBottom: '40px' },
  logoIcon: { fontSize: '60px', marginBottom: '10px' },
  logoText: { color: 'white', fontSize: '28px', margin: 0, fontWeight: 'bold' },
  logoSubText: { color: 'rgba(255,255,255,0.8)', fontSize: '14px', marginTop: '5px' },
  form: { width: '100%', maxWidth: '320px' },
  inputGroup: { display: 'flex', alignItems: 'center', background: 'rgba(255,255,255,0.2)', borderRadius: '12px', marginBottom: '12px', padding: '4px 12px' },
  inputIcon: { fontSize: '20px', marginRight: '8px' },
  input: { flex: 1, background: 'transparent', border: 'none', padding: '12px 0', color: 'white', fontSize: '16px', outline: 'none' },
  button: { width: '100%', background: 'white', color: '#667eea', fontWeight: 'bold', padding: '14px', border: 'none', borderRadius: '12px', fontSize: '16px', cursor: 'pointer', marginTop: '20px' },
  divider: { display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '20px 0', width: '100%', maxWidth: '320px' },
  dividerLine: { flex: 1, height: '1px', background: 'rgba(255,255,255,0.3)' },
  dividerText: { color: 'rgba(255,255,255,0.6)', padding: '0 10px', fontSize: '12px' },
  googleButton: { width: '100%', maxWidth: '320px', background: 'rgba(255,255,255,0.2)', color: 'white', padding: '12px', border: 'none', borderRadius: '12px', fontSize: '14px', cursor: 'pointer' },
  footer: { marginTop: '30px', textAlign: 'center' },
  motoristaLink: { background: 'none', border: 'none', color: '#ff9800', cursor: 'pointer', textDecoration: 'underline', fontSize: '14px' },
  containerCadastro: {
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
  headerCadastro: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'white',
    borderBottom: '1px solid #eee',
  },
  backButton: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '8px', color: '#666' },
  titleCadastro: { fontSize: '18px', margin: 0, fontWeight: 'bold' },
  formCadastro: { flex: 1, overflow: 'auto', padding: '16px' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#333' },
  inputCadastro: { width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' },
  buttonAreaCadastro: { flexShrink: 0, padding: '16px', background: '#f5f5f5' },
  submitButton: { width: '100%', background: '#4CAF50', color: 'white', fontWeight: 'bold', padding: '14px', border: 'none', borderRadius: '30px', fontSize: '16px', cursor: 'pointer' },
};

export default Login;