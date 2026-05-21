import React, { useState } from 'react';

// ESTILOS DIRETO NO COMPONENTE (sem CSS externo)
const styles = {
  container: {
    position: 'fixed' as const,
    top: 0,
    left: 0,
    width: '100%',
    height: '100dvh',
    backgroundColor: '#ffffff',
    display: 'flex',
    flexDirection: 'column' as const,
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
    zIndex: 100,
  },
  header: {
    padding: '16px',
    backgroundColor: '#fff',
    borderBottom: '1px solid #eee',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  btnVoltar: {
    background: 'none',
    border: 'none',
    fontSize: '16px',
    color: '#666',
    cursor: 'pointer',
    padding: '8px',
  },
  titulo: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: 0,
  },
  areaRolavel: {
    flex: 1,
    overflowY: 'auto' as const,
    padding: '16px',
    paddingBottom: '100px',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: '12px',
    padding: '16px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    border: '1px solid #f0f0f0',
  },
  fraseBox: {
    backgroundColor: '#4a90e2',
    borderRadius: '12px',
    padding: '20px',
    marginBottom: '24px',
    textAlign: 'center' as const,
  },
  fraseTexto: {
    color: '#fff',
    fontSize: '14px',
    lineHeight: 1.5,
    margin: 0,
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
    borderRadius: '8px',
    boxSizing: 'border-box' as const,
  },
  erro: {
    color: '#ff4444',
    fontSize: '12px',
    marginTop: '4px',
  },
  botaoFixo: {
    position: 'absolute' as const,
    bottom: '60px',
    left: '16px',
    right: '16px',
  },
  btnConfirmar: {
    width: '100%',
    backgroundColor: '#4CAF50',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '16px',
    padding: '14px',
    border: 'none',
    borderRadius: '25px',
    cursor: 'pointer',
  },
  btnConfirmarDisabled: {
    backgroundColor: '#ccc',
    cursor: 'not-allowed',
  },
};

const CadastroMotorista = ({ onFechar }: { onFechar?: () => void }) => {
  // Estados
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});

  // Máscara de data (DD/MM/AAAA)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    
    if (valor.length >= 3) {
      valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (valor.length >= 7) {
      valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    
    setDataNasc(valor);
    
    // Validação simples
    if (valor.length === 10) {
      const [dia, mes, ano] = valor.split('/').map(Number);
      if (dia > 31 || mes > 12 || ano < 1900 || ano > 2025) {
        setErros(prev => ({ ...prev, dataNasc: 'Data inválida' }));
      } else {
        setErros(prev => ({ ...prev, dataNasc: '' }));
      }
    } else if (valor.length > 0) {
      setErros(prev => ({ ...prev, dataNasc: 'Digite DD/MM/AAAA' }));
    } else {
      setErros(prev => ({ ...prev, dataNasc: '' }));
    }
  };

  // Validar campos obrigatórios
  const validar = () => {
    const novosErros: Record<string, string> = {};
    if (!nome.trim()) novosErros.nome = 'Nome é obrigatório';
    if (!whatsapp.trim()) novosErros.whatsapp = 'WhatsApp é obrigatório';
    if (!cpf.trim()) novosErros.cpf = 'CPF é obrigatório';
    if (dataNasc.length !== 10) novosErros.dataNasc = 'Data completa é obrigatória';
    if (!cnh.trim()) novosErros.cnh = 'CNH é obrigatória';
    
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  // Enviar formulário
  const handleSubmit = async () => {
    if (!validar()) return;
    
    setCarregando(true);
    
    // Simula envio para API
    setTimeout(() => {
      alert('✅ Cadastro realizado com sucesso!\nBem-vindo(a) ao time!');
      setCarregando(false);
      if (onFechar) onFechar();
    }, 1500);
  };

  // Sair/logout
  const handleSair = () => {
    if (confirm('Deseja realmente sair? Os dados não salvos serão perdidos.')) {
      window.location.href = '/';
    }
  };

  return (
    <div style={styles.container}>
      {/* CABEÇALHO */}
      <div style={styles.header}>
        <button style={styles.btnVoltar} onClick={handleSair}>
          ← Sair
        </button>
        <h1 style={styles.titulo}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      {/* CONTEÚDO ROLÁVEL */}
      <div style={styles.areaRolavel}>
        {/* Frase motivacional */}
        <div style={styles.fraseBox}>
          <p style={styles.fraseTexto}>
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso. 
            Aqui, cada quilômetro é uma nova conquista!"
          </p>
        </div>

        {/* CARD DO FORMULÁRIO */}
        <div style={styles.card}>
          {/* Campo Nome */}
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

          {/* Campo WhatsApp */}
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

          {/* Campo CPF */}
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

          {/* Campo DATA - DIGITÁVEL (sem calendário) */}
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
            <small style={{ fontSize: '11px', color: '#999' }}>
              Digite usando o teclado numérico (ex: 25051990)
            </small>
            {erros.dataNasc && <div style={styles.erro}>{erros.dataNasc}</div>}
          </div>

          {/* Campo CNH */}
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
      <div style={styles.botaoFixo}>
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

export default CadastroMotorista;