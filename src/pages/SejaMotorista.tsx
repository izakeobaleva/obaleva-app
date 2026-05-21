import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SejaMotorista = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Máscara para data (DD/MM/AAAA)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const validar = () => {
    const novosErros: Record<string, string> = {};
    if (!nome) novosErros.nome = 'Nome é obrigatório';
    if (!whatsapp) novosErros.whatsapp = 'WhatsApp é obrigatório';
    if (!cpf) novosErros.cpf = 'CPF é obrigatório';
    if (dataNasc.length !== 10) novosErros.dataNasc = 'Data completa é obrigatória';
    if (!cnh) novosErros.cnh = 'CNH é obrigatória';
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const handleSubmit = async () => {
    if (!validar()) return;
    
    setCarregando(true);
    // Simula envio - substitua pela sua API
    setTimeout(() => {
      alert('✅ Cadastro de motorista solicitado com sucesso!');
      setCarregando(false);
      navigate('/profile');
    }, 1500);
  };

  const styles: Record<string, React.CSSProperties> = {
    container: {
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
    header: {
      flexShrink: 0,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '16px',
      background: 'white',
      borderBottom: '1px solid #eee',
    },
    btnVoltar: {
      background: 'none',
      border: 'none',
      fontSize: '16px',
      cursor: 'pointer',
      padding: '8px',
      color: '#666',
    },
    titulo: {
      fontSize: '18px',
      margin: 0,
      fontWeight: 'bold',
    },
    areaRolavel: {
      flex: 1,
      overflowY: 'auto',
      padding: '16px',
      paddingBottom: '20px',
    },
    fraseBox: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '20px',
      textAlign: 'center',
    },
    fraseTexto: {
      color: 'white',
      fontSize: '14px',
      margin: 0,
      lineHeight: 1.5,
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
      fontWeight: 'bold',
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
    },
    hint: {
      display: 'block',
      fontSize: '11px',
      color: '#999',
      marginTop: '4px',
    },
    erro: {
      color: '#ff4444',
      fontSize: '12px',
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
      fontWeight: 'bold',
      fontSize: '16px',
      padding: '14px',
      border: 'none',
      borderRadius: '30px',
      cursor: 'pointer' as const,
    },
    btnConfirmarDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed' as const,
    },
  };

  return (
    <div style={styles.container}>
      {/* CABEÇALHO */}
      <div style={styles.header}>
        <button onClick={() => navigate('/profile')} style={styles.btnVoltar}>
          ← Voltar
        </button>
        <h1 style={styles.titulo}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      {/* ÁREA ROLÁVEL */}
      <div style={styles.areaRolavel}>
        {/* FRASE MOTIVACIONAL */}
        <div style={styles.fraseBox}>
          <p style={styles.fraseTexto}>
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso."
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
            {erros.nome && <div style={styles.erro}>{erros.nome}</div>}
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
            {erros.whatsapp && <div style={styles.erro}>{erros.whatsapp}</div>}
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
            {erros.cpf && <div style={styles.erro}>{erros.cpf}</div>}
          </div>

          <div style={styles.campo}>
            <label style={styles.label}>📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              style={styles.input}
              value={dataNasc}
              onChange={handleDataChange}
              maxLength={10}
            />
            <small style={styles.hint}>💡 Digite usando o teclado numérico (ex: 25051990)</small>
            {erros.dataNasc && <div style={styles.erro}>{erros.dataNasc}</div>}
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
            {erros.cnh && <div style={styles.erro}>{erros.cnh}</div>}
          </div>
        </div>
      </div>

      {/* BOTÃO FIXO */}
      <div style={styles.botaoContainer}>
        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{
            ...styles.btnConfirmar,
            ...(carregando ? styles.btnConfirmarDisabled : {}),
          }}
        >
          {carregando ? '⏳ Enviando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default SejaMotorista;