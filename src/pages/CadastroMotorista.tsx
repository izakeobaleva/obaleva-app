import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const CadastroMotorista = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);

  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const handleSubmit = () => {
    if (!nome || !whatsapp || !cpf || dataNasc.length !== 10 || !cnh) {
      alert('⚠️ Preencha todos os campos');
      return;
    }
    setCarregando(true);
    setTimeout(() => {
      alert('✅ Cadastro enviado com sucesso!');
      setCarregando(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
      background: '#f5f5f5', display: 'flex', flexDirection: 'column', overflow: 'hidden'
    }}>
      <div style={{
        padding: '16px', background: 'white', borderBottom: '1px solid #eee',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/profile')} style={{
          background: 'none', border: 'none', fontSize: '16px', cursor: 'pointer', padding: '8px', color: '#666'
        }}>← Voltar</button>
        <h1 style={{ fontSize: '18px', margin: 0 }}>🚛 Seja Motorista</h1>
        <div style={{ width: 50 }}></div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: '16px', padding: '20px', marginBottom: '20px', textAlign: 'center'
        }}>
          <p style={{ color: 'white', margin: 0 }}>🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso."</p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '16px' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>👤 Nome completo *</label>
            <input type="text" value={nome} onChange={e => setNome(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>📱 WhatsApp *</label>
            <input type="tel" inputMode="numeric" value={whatsapp} onChange={e => setWhatsapp(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>🆔 CPF *</label>
            <input type="text" inputMode="numeric" value={cpf} onChange={e => setCpf(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>📅 Data de nascimento *</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={dataNasc} onChange={handleDataChange} maxLength={10}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }} />
            <small style={{ fontSize: '11px', color: '#999', display: 'block', marginTop: '4px' }}>Digite usando o teclado numérico (ex: 25051990)</small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold' }}>📄 Número da CNH *</label>
            <input type="text" value={cnh} onChange={e => setCnh(e.target.value)}
              style={{ width: '100%', padding: '12px', border: '1px solid #ddd', borderRadius: '10px', boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px 16px', background: '#f5f5f5' }}>
        <button onClick={handleSubmit} disabled={carregando}
          style={{
            width: '100%', background: '#4CAF50', color: 'white', fontWeight: 'bold',
            fontSize: '16px', padding: '14px', border: 'none', borderRadius: '30px',
            cursor: 'pointer', opacity: carregando ? 0.6 : 1
          }}>
          {carregando ? '⏳ Enviando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default CadastroMotorista;