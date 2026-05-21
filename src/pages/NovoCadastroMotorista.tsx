import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const NovoCadastroMotorista = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    nome: '',
    whatsapp: '',
    cpf: '',
    nascimento: '',
    cnh: ''
  });
  const [loading, setLoading] = useState(false);

  const handleNascimento = (e: React.ChangeEvent<HTMLInputElement>) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 8) val = val.slice(0, 8);
    if (val.length >= 3) val = val.replace(/^(\d{2})(\d)/, '$1/$2');
    if (val.length >= 7) val = val.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setForm({ ...form, nascimento: val });
  };

  const enviar = () => {
    if (!form.nome || !form.whatsapp || !form.cpf || form.nascimento.length !== 10 || !form.cnh) {
      alert('Preencha todos os campos');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert('Cadastro enviado!');
      setLoading(false);
      navigate('/profile');
    }, 1000);
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
      background: '#f5f5f5', display: 'flex', flexDirection: 'column'
    }}>
      <div style={{ padding: 16, background: 'white', borderBottom: '1px solid #ddd', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', fontSize: 18, cursor: 'pointer' }}>←</button>
        <h1 style={{ margin: 0, fontSize: 18 }}>🚛 Seja Motorista</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ background: '#667eea', borderRadius: 16, padding: 16, marginBottom: 16, textAlign: 'center' }}>
          <p style={{ color: 'white', margin: 0 }}>🌟 Sua jornada começa aqui!</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 16 }}>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>👤 Nome</label>
            <input type="text" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>📱 WhatsApp</label>
            <input type="tel" inputMode="numeric" value={form.whatsapp} onChange={e => setForm({...form, whatsapp: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>🆔 CPF</label>
            <input type="text" inputMode="numeric" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>📅 Data Nascimento</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={form.nascimento} onChange={handleNascimento} maxLength={10} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>📄 CNH</label>
            <input type="text" value={form.cnh} onChange={e => setForm({...form, cnh: e.target.value})} style={{ width: '100%', padding: 10, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: '#f5f5f5' }}>
        <button onClick={enviar} disabled={loading} style={{
          width: '100%', background: '#4CAF50', color: 'white', fontWeight: 'bold',
          padding: 14, border: 'none', borderRadius: 30, fontSize: 16, cursor: 'pointer'
        }}>
          {loading ? '...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default NovoCadastroMotorista;