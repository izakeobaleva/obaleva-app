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
    alert('✅ Registration sent successfully!');
    navigate('/profile');
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
        <button onClick={() => navigate('/profile')} style={{ background: 'none', border: 'none', fontSize: 24, cursor: 'pointer' }}>←</button>
        <h1 style={{ fontSize: 18, margin: 0 }}>🚀 Drive with Us</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: 16 }}>
        <div style={{ background: 'linear-gradient(135deg, #667eea, #764ba2)', borderRadius: 16, padding: 20, marginBottom: 20, textAlign: 'center' }}>
          <p style={{ color: 'white', margin: 0, fontSize: 15 }}>✨ Join our team and start earning!</p>
        </div>

        <div style={{ background: 'white', borderRadius: 16, padding: 16 }}>
          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#333' }}>Full Name *</label>
            <input type="text" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#333' }}>WhatsApp *</label>
            <input type="tel" inputMode="numeric" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#333' }}>CPF *</label>
            <input type="text" inputMode="numeric" value={formData.document} onChange={e => setFormData({...formData, document: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#333' }}>Birth Date *</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/YYYY" value={formData.birthDate} onChange={formatDate} maxLength={10} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>

          <div style={{ marginBottom: 16 }}>
            <label style={{ display: 'block', marginBottom: 6, fontWeight: 'bold', color: '#333' }}>Driver's License *</label>
            <input type="text" value={formData.driversLicense} onChange={e => setFormData({...formData, driversLicense: e.target.value})} style={{ width: '100%', padding: 12, border: '1px solid #ddd', borderRadius: 8, boxSizing: 'border-box' }} />
          </div>
        </div>
      </div>

      <div style={{ padding: 16, background: '#f5f5f5' }}>
        <button onClick={handleSubmit} style={{ width: '100%', background: '#16a34a', color: 'white', fontWeight: 'bold', padding: 14, border: 'none', borderRadius: 40, fontSize: 16, cursor: 'pointer' }}>
          ✅ Become a Driver
        </button>
      </div>
    </div>
  );
};

export default RegisterDriver;