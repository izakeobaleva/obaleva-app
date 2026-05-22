import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const MotoristaCadastro = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);

  const formatarData = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const handleSubmit = () => {
    if (!nome || !email || !senha || !whatsapp || !cpf || dataNasc.length !== 10 || !cnh) {
      alert('⚠️ Preencha todos os campos');
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      alert('✅ Cadastro de motorista enviado! Faça login.');
      setCarregando(false);
      navigate('/');
    }, 1500);
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <button onClick={() => navigate('/')} style={styles.backBtn}>← Voltar</button>
        <h1 style={styles.title}>🚛 Cadastro Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          <div style={styles.field}>
            <label style={styles.label}>👤 Nome completo *</label>
            <input type="text" style={styles.input} value={nome} onChange={e => setNome(e.target.value)} placeholder="Digite seu nome" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>📧 E-mail *</label>
            <input type="email" style={styles.input} value={email} onChange={e => setEmail(e.target.value)} placeholder="seu@email.com" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🔒 Senha *</label>
            <input type="password" style={styles.input} value={senha} onChange={e => setSenha(e.target.value)} placeholder="Mínimo 6 caracteres" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>📱 WhatsApp *</label>
            <input type="tel" inputMode="numeric" style={styles.input} value={whatsapp} onChange={e => setWhatsapp(e.target.value)} placeholder="11999999999" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>🆔 CPF *</label>
            <input type="text" inputMode="numeric" style={styles.input} value={cpf} onChange={e => setCpf(e.target.value)} placeholder="00000000000" />
          </div>
          <div style={styles.field}>
            <label style={styles.label}>📅 Data de nascimento *</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" style={styles.input} value={dataNasc} onChange={formatarData} maxLength={10} />
            <small style={styles.hint}>Digite usando o teclado numérico (ex: 25051990)</small>
          </div>
          <div style={styles.field}>
            <label style={styles.label}>📄 Número da CNH *</label>
            <input type="text" style={styles.input} value={cnh} onChange={e => setCnh(e.target.value)} placeholder="Digite o número da CNH" />
          </div>
        </div>
      </div>

      <div style={styles.footer}>
        <button onClick={handleSubmit} disabled={carregando} style={styles.submitBtn}>
          {carregando ? '⏳ Enviando...' : '✅ Cadastrar como Motorista'}
        </button>
      </div>
    </div>
  );
};

const styles: Record<string, React.CSSProperties> = {
  container: { position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh', background: '#f5f5f5', display: 'flex', flexDirection: 'column', overflow: 'hidden' },
  header: { flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: 'white', borderBottom: '1px solid #eee' },
  backBtn: { background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '8px', color: '#666' },
  title: { fontSize: '18px', margin: 0, fontWeight: 'bold' },
  content: { flex: 1, overflow: 'auto', padding: '16px' },
  card: { background: 'white', borderRadius: '20px', padding: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' },
  field: { marginBottom: '16px' },
  label: { display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px', color: '#333' },
  input: { width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' },
  hint: { display: 'block', fontSize: '11px', color: '#999', marginTop: '4px' },
  footer: { flexShrink: 0, padding: '16px', background: '#f5f5f5' },
  submitBtn: { width: '100%', background: '#4CAF50', color: 'white', fontWeight: 'bold', padding: '14px', border: 'none', borderRadius: '30px', fontSize: '16px', cursor: 'pointer' },
};

export default MotoristaCadastro;