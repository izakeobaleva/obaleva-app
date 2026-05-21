import React, { useState } from 'react';

const SejaMotorista = () => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Máscara para data (DD/MM/AAAA)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  // Logout (sair do perfil)
  const handleSair = () => {
    if (confirm('Deseja realmente sair?')) {
      // Substitua pela sua lógica de logout
      window.location.href = '/login';
    }
  };

  const handleSubmit = async () => {
    if (!nome || !whatsapp || !cpf || dataNasc.length !== 10 || !cnh) {
      alert('⚠️ Por favor, preencha todos os campos obrigatórios.');
      return;
    }
    
    setCarregando(true);
    // Simula envio - substitua pela sua API
    setTimeout(() => {
      alert('✅ Cadastro realizado com sucesso!\nBem-vindo(a) ao time!');
      setCarregando(false);
    }, 1500);
  };

  return (
    <div style={styles.container}>
      {/* CABEÇALHO */}
      <div style={styles.header}>
        <button onClick={handleSair} style={styles.btnSair}>
          ← Sair
        </button>
        <h1 style={styles.titulo}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      {/* ÁREA ROLÁVEL (apenas os campos) */}
      <div style={styles.areaRolavel}>
        {/* Frase motivacional */}
        <div style={styles.fraseBox}>
          <p style={styles.fraseTexto}>
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso. 
            Aqui, cada quilômetro é uma nova conquista!"
          </p>
        </div>

        {/* FORMULÁRIO */}
        <div style={styles.card}>
          <div style={styles.campo}>
            <label style={styles.label}>👤 Nome completo *</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Digite seu nome completo"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>📱 WhatsApp *</label>
            <input
              type="tel"
              inputMode="numeric"
              style={styles.input}
              placeholder="11999999999"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>🆔 CPF *</label>
            <input
              type="text"
              inputMode="numeric"
              style={styles.input}
              placeholder="00000000000"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataNasc}
              onChange={handleDataChange}
              maxLength={10}
            />
            <small style={styles.hint}>
              💡 Digite usando o teclado numérico (ex: 25051990)
            </small>
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>📄 Número da CNH *</label>
            <input
              type="text"
              style={styles.input}
              placeholder="Digite o número da CNH"
              value={cnh}
              onChange={(e) => setCnh(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* BOTÃO CONFIRMAR FIXO - ACIMA DA BARRA DO APP */}
      <div style={styles.botaoContainer}>
        <button
          style={{
            ...styles.btnConfirmar,
            ...(carregando ? styles.btnConfirmarDisabled : {}),
          }}
          onClick={handleSubmit}
          disabled={carregando}
        >
          {carregando ? '⏳ Cadastrando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

// ESTILOS
const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    background: '#f5f5f5',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
  },
  header: {
    flexShrink: 0,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '16px',
    background: 'white',
    borderBottom: '1px solid #eee',
  },
  btnSair: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#e53935',
    cursor: 'pointer',
    padding: '8px',
  },
  titulo: {
    fontSize: '18px',
    margin: 0,
    fontWeight: 'bold' as const,
  },
  areaRolavel: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    paddingBottom: '20px',
  },
  fraseBox: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '20px',
    textAlign: 'center' as const,
  },
  fraseTexto: {
    color: 'white',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
  },
  card: {
    background: 'white',
    borderRadius: '16px',
    padding: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
  },
  campo: {
    marginBottom: '16px',
  },
  label: {
    display: 'block',
    fontSize: '14px',
    fontWeight: 'bold' as const,
    marginBottom: '6px',
    color: '#333',
  },
  input: {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box' as const,
    background: '#fafafa',
  },
  hint: {
    display: 'block',
    fontSize: '11px',
    color: '#999',
    marginTop: '4px',
  },
  botaoContainer: {
    flexShrink: 0,
    padding: '12px 16px 20px 16px',
    background: '#f5f5f5',
  },
  btnConfirmar: {
    width: '100%',
    background: '#4CAF50',
    color: 'white',
    fontWeight: 'bold' as const,
    fontSize: '16px',
    padding: '14px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(76,175,80,0.3)',
  },
  btnConfirmarDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed' as const,
  },
};

export default SejaMotorista;