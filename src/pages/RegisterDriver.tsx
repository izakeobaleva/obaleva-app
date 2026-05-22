import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterDriver = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    document: '',
    birthDate: '',
    driversLicense: ''
  });

  const formatDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    if (value.length >= 7) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setFormData({ ...formData, birthDate: value });
  };

  const handleSubmit = () => {
    alert('✅ Cadastro enviado com sucesso!');
    navigate('/perfil');
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
      background: '#f5f5f5', display: 'flex', flexDirection: 'column', zIndex: 9999
    }}>
      <div style={{
        padding: 16, background: 'white', borderBottom: '1px solid #ddd',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/perfil')} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: 18, margin: 0 }}>🚀 Seja Motorista Parceiro</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'white', margin: 0, fontSize: 15, lineHeight: 1.5 }}>
            ✨ "Transforme sua paixão por dirigir em uma jornada de sucesso!"
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>👤 Nome completo *</label>
            <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>📱 WhatsApp *</label>
            <input type="tel" inputMode="numeric" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>🆔 CPF *</label>
            <input type="text" inputMode="numeric" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>📅 Data de nascimento *</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={formData.birthDate} onChange={formatDate} maxLength={10} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
            <small style={{ fontSize: '11px', color: '#999' }}>💡 Digite usando o teclado numérico (ex: 25051990)</small>
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold' }}>📄 Número da CNH *</label>
            <input type="text" value={formData.driversLicense} onChange={e => setFormData({...formData, driversLicense: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: '#f5f5f5' }}>
        <button onClick={handleSubmit} style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 'bold', padding: 14, border: 'none', borderRadius: 60, fontSize: 16, cursor: 'pointer' }}>
          ✅ Quero ser Motorista Parceiro
        </button>
      </div>
    </div>
  );
};

export default RegisterDriver;