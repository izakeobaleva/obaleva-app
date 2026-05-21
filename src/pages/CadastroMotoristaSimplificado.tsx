import React, { useState } from 'react';

const styles: Record<string, React.CSSProperties> = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    backgroundColor: '#f0f4ff',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    fontFamily: 'system-ui, -apple-system, sans-serif',
    zIndex: 9999,
  },
  header: {
    padding: '16px',
    background: 'white',
    borderBottom: '1px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backBtn: {
    background: 'none',
    border: 'none',
    fontSize: '15px',
    color: '#555',
    cursor: 'pointer',
    padding: '6px 10px',
  },
  title: {
    fontSize: '17px',
    fontWeight: 'bold',
    margin: 0,
    color: '#333',
  },
  scrollArea: {
    flex: 1,
    overflowY: 'auto',
    padding: '16px',
    paddingBottom: '120px',
  },
  banner: {
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    borderRadius: '14px',
    padding: '18px',
    marginBottom: '20px',
    textAlign: 'center',
  },
  bannerText: {
    color: 'white',
    fontSize: '14px',
    margin: 0,
    lineHeight: 1.6,
  },
  card: {
    background: 'white',
    borderRadius: '14px',
    padding: '16px',
    boxShadow: '0 1px 4px rgba(0,0,0,0.08)',
    marginBottom: '12px',
  },
  field: {
    marginBottom: '14px',
  },
  label: {
    display: 'block',
    fontSize: '13px',
    fontWeight: 600,
    color: '#444',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '11px 12px',
    fontSize: '15px',
    border: '1px solid #ddd',
    borderRadius: '10px',
    boxSizing: 'border-box',
    background: '#fafafa',
  },
  hint: {
    fontSize: '11px',
    color: '#999',
    marginTop: '3px',
    display: 'block',
  },
  error: {
    color: '#e53e3e',
    fontSize: '12px',
    marginTop: '3px',
  },
  fixedBottom: {
    position: 'absolute',
    bottom: '70px',
    left: '16px',
    right: '16px',
  },
  submitBtn: {
    width: '100%',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '14px',
    border: 'none',
    borderRadius: '30px',
    cursor: 'pointer',
    boxShadow: '0 4px 12px rgba(118, 75, 162, 0.3)',
  },
  submitBtnDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
};

const CadastroMotoristaSimplificado = ({ onFechar }: { onFechar?: () => void }) => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Máscara de data: DD/MM/AAAA
  const handleData = (e: React.ChangeEvent<HTMLInputElement>) => {
    let v = e.target.value.replace(/\D/g, '').slice(0, 8);
    if (v.length >= 3) v = v.replace(/^(\d{2})(\d)/, '$1/$2');
    if (v.length >= 7) v = v.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(v);
  };

  const validar = () => {
    const errs: Record<string, string> = {};
    if (!nome.trim()) errs.nome = 'Obrigatório';
    if (!whatsapp.trim()) errs.whatsapp = 'Obrigatório';
    if (!cpf.trim()) errs.cpf = 'Obrigatório';
    if (dataNasc.length !== 10) errs.dataNasc = 'Digite DD/MM/AAAA';
    if (!cnh.trim()) errs.cnh = 'Obrigatório';
    setErros(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = () => {
    if (!validar()) return;
    setLoading(true);
    setTimeout(() => {
      alert('✅ Cadastro enviado!');
      setLoading(false);
      if (onFechar) onFechar();
    }, 1200);
  };

  const handleSair = () => {
    if (confirm('Sair? Dados não salvos serão perdidos.')) {
      window.location.href = '/';
    }
  };

  const Campo = ({ label, value, onChange, placeholder, inputMode, maxLength, erro }: any) => (
    <div style={styles.field}>
      <label style={styles.label}>{label}</label>
      <input
        type="text"
        inputMode={inputMode || 'text'}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        maxLength={maxLength}
        style={styles.input}
      />
      {erro && <p style={styles.error}>{erro}</p>}
    </div>
  );

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <button style={styles.backBtn} onClick={handleSair}>← Sair</button>
        <h1 style={styles.title}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }} />
      </div>

      {/* Scroll */}
      <div style={styles.scrollArea}>
        <div style={styles.banner}>
          <p style={styles.bannerText}>
            🌟 Junte-se a nós e transforme sua paixão por dirigir em uma jornada de sucesso. Cada quilômetro é uma nova conquista!
          </p>
        </div>

        <div style={styles.card}>
          <Campo label="👤 Nome completo *" value={nome} onChange={(e: any) => setNome(e.target.value)} placeholder="Digite seu nome" erro={erros.nome} />
          <Campo label="📱 WhatsApp *" value={whatsapp} onChange={(e: any) => setWhatsapp(e.target.value)} placeholder="11999999999" inputMode="numeric" erro={erros.whatsapp} />
          <Campo label="🆔 CPF *" value={cpf} onChange={(e: any) => setCpf(e.target.value)} placeholder="000.000.000-00" inputMode="numeric" erro={erros.cpf} />
          
          {/* Data - SEMPRE DIGITÁVEL, NUNCA USA Calendar */}
          <div style={styles.field}>
            <label style={styles.label}>📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={dataNasc}
              onChange={handleData}
              maxLength={10}
              style={styles.input}
            />
            <small style={styles.hint}>Digite usando o teclado numérico (ex: 25051990)</small>
            {erros.dataNasc && <p style={styles.error}>{erros.dataNasc}</p>}
          </div>

          <Campo label="📄 Número da CNH *" value={cnh} onChange={(e: any) => setCnh(e.target.value)} placeholder="Digite o número da CNH" erro={erros.cnh} />
        </div>
      </div>

      {/* Botão fixo */}
      <div style={styles.fixedBottom}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{ ...styles.submitBtn, ...(loading ? styles.submitBtnDisabled : {}) }}
        >
          {loading ? '⏳ Enviando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default CadastroMotoristaSimplificado;