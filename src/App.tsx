import React, { useState } from 'react';

// COMPONENTE COMPLETO - SEM CALENDAR, ZERO DEPENDÊNCIAS
const SejaMotoristaCompleto = () => {
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Máscara de data - 100% manual, sem Calendar
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const handleSubmit = async () => {
    setCarregando(true);
    setTimeout(() => {
      alert('✅ Cadastro realizado com sucesso!');
      setCarregando(false);
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
      zIndex: 999999,
    }}>
      {/* Cabeçalho */}
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #eee',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <button onClick={() => window.location.href = '/login'} style={{
          background: 'none',
          border: 'none',
          fontSize: '16px',
          color: '#e53935',
          cursor: 'pointer',
          padding: '8px',
        }}>← Sair</button>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#333' }}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      {/* Área rolável */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '16px',
        paddingBottom: '120px',
      }}>
        {/* Banner */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center',
        }}>
          <p style={{ color: 'white', margin: 0, fontSize: '15px', lineHeight: 1.5 }}>
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso. 
            Aqui, cada quilômetro é uma nova conquista!"
          </p>
        </div>

        {/* Formulário */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
        }}>
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>👤 Nome completo *</label>
            <input 
              type="text" 
              value={nome} 
              onChange={e => setNome(e.target.value)}
              placeholder="Digite seu nome completo"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>📱 WhatsApp *</label>
            <input 
              type="tel" 
              inputMode="numeric" 
              value={whatsapp} 
              onChange={e => setWhatsapp(e.target.value)}
              placeholder="11999999999"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }} 
            />
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>🆔 CPF *</label>
            <input 
              type="text" 
              inputMode="numeric" 
              value={cpf} 
              onChange={e => setCpf(e.target.value)}
              placeholder="00000000000"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }} 
            />
          </div>

          {/* DATA - SEM CALENDAR, APENAS DIGITÁVEL */}
          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>📅 Data de nascimento *</label>
            <input 
              type="text" 
              inputMode="numeric" 
              placeholder="DD/MM/AAAA"
              value={dataNasc}
              onChange={handleDataChange}
              maxLength={10}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }} 
            />
            <small style={{ fontSize: '11px', color: '#999', display: 'block', marginTop: '4px' }}>
              💡 Digite usando o teclado numérico (ex: 25051990)
            </small>
          </div>

          <div style={{ marginBottom: '18px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', color: '#444', fontSize: '14px' }}>📄 Número da CNH *</label>
            <input 
              type="text" 
              value={cnh} 
              onChange={e => setCnh(e.target.value)}
              placeholder="Digite o número da CNH"
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' }} 
            />
          </div>
        </div>
      </div>

      {/* Botão fixo - acima da barra inferior */}
      <div style={{
        position: 'absolute',
        bottom: '70px',
        left: '16px',
        right: '16px',
        zIndex: 20,
      }}>
        <button 
          onClick={handleSubmit} 
          disabled={carregando}
          style={{
            width: '100%',
            background: carregando ? '#a5d6a7' : '#4CAF50',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '16px',
            border: 'none',
            borderRadius: '30px',
            cursor: carregando ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(76, 175, 80, 0.3)',
            transition: 'all 0.2s',
          }}>
          {carregando ? '⏳ Cadastrando...' : '✅ Quero ser Motorista'}
        </button>
      </div>

      {/* Barra inferior simulada */}
      <div style={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        height: '60px',
        background: 'white',
        borderTop: '1px solid #e0e0e0',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        zIndex: 10,
      }}>
        <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>🏠 Início</span>
        <span style={{ color: '#999' }}>🔍 Buscar</span>
        <span style={{ color: '#999' }}>📋 Corridas</span>
        <span style={{ color: '#999' }}>👤 Perfil</span>
      </div>
    </div>
  );
};

// APP PRINCIPAL
function App() {
  return <SejaMotoristaCompleto />;
}

export default App;