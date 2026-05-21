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

  // Máscara para data (DD/MM/AAAA)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const handleSubmit = async () => {
    if (!nome || !whatsapp || !cpf || dataNasc.length !== 10 || !cnh) {
      alert('⚠️ Preencha todos os campos');
      return;
    }
    
    setCarregando(true);
    // Simula envio
    setTimeout(() => {
      alert('✅ Cadastro de motorista solicitado com sucesso!');
      setCarregando(false);
      navigate('/perfil');
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      background: '#f5f5f5',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      {/* CABEÇALHO */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #eee',
      }}>
        <button onClick={() => navigate('/perfil')} style={{
          background: 'none',
          border: 'none',
          fontSize: '16px',
          cursor: 'pointer',
          padding: '8px',
          color: '#666',
        }}>← Voltar</button>
        
        <h1 style={{ fontSize: '18px', margin: 0 }}>🚛 Seja Motorista</h1>
        
        <div style={{ width: 50 }}></div>
      </div>

      {/* ÁREA ROLÁVEL */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: '20px',
      }}>
        {/* FRASE MOTIVACIONAL */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <p style={{ color: 'white', fontSize: '14px', margin: 0 }}>
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso."
          </p>
        </div>

        {/* FORMULÁRIO */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '16px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>👤 Nome completo *</label>
            <input
              type="text"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }}
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>📱 WhatsApp *</label>
            <input
              type="tel"
              inputMode="numeric"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }}
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
              placeholder="11999999999"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>🆔 CPF *</label>
            <input
              type="text"
              inputMode="numeric"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }}
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
              placeholder="00000000000"
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }}
              value={dataNasc}
              onChange={handleDataChange}
              maxLength={10}
            />
            <small style={{ display: 'block', fontSize: '11px', color: '#999', marginTop: '4px' }}>
              💡 Digite usando o teclado numérico (ex: 25051990)
            </small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: 'bold', marginBottom: '6px' }}>📄 Número da CNH *</label>
            <input
              type="text"
              style={{ width: '100%', padding: '12px', fontSize: '16px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }}
              value={cnh}
              onChange={(e) => setCnh(e.target.value)}
              placeholder="Digite o número da CNH"
            />
          </div>
        </div>
      </div>

      {/* BOTÃO FIXO */}
      <div style={{
        flexShrink: 0,
        padding: '12px 16px 20px 16px',
        background: '#f5f5f5',
      }}>
        <button
          onClick={handleSubmit}
          disabled={carregando}
          style={{
            width: '100%',
            background: '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '14px',
            border: 'none',
            borderRadius: '30px',
            cursor: 'pointer',
            opacity: carregando ? 0.6 : 1,
          }}
        >
          {carregando ? '⏳ Enviando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default SejaMotorista;