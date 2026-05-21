import React, { useState } from 'react';

const BecomeDriver = () => {
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [document, setDocument] = useState('');
  const [birthDate, setBirthDate] = useState('');
  const [driversLicense, setDriversLicense] = useState('');
  const [loading, setLoading] = useState(false);

  const formatDate = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    if (value.length >= 3) value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    if (value.length >= 7) value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setBirthDate(value);
  };

  const handleSubmit = async () => {
    if (!fullName || !phone || !document || birthDate.length !== 10 || !driversLicense) {
      alert('Please fill all fields!');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      alert('✅ Registration sent! We will review your application.');
      setLoading(false);
      window.location.href = '/';
    }, 1500);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      background: '#f3f4f6',
      display: 'flex',
      flexDirection: 'column',
      zIndex: 9999
    }}>
      <div style={{
        padding: '16px',
        background: 'white',
        borderBottom: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <button onClick={() => window.location.href = '/profile'} style={{
          background: 'none',
          border: 'none',
          fontSize: '24px',
          cursor: 'pointer',
          color: '#1f2937'
        }}>←</button>
        <h1 style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>🚀 Become a Driver</h1>
        <div style={{ width: 40 }} />
      </div>

      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'white', margin: 0, fontSize: '15px', lineHeight: 1.5 }}>
            ✨ "Join our team and start earning. Your success is our success!"
          </p>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '16px' }}>
          <Field label="👤 Full Name *" value={fullName} onChange={setFullName} />
          <Field label="📱 WhatsApp *" value={phone} onChange={setPhone} inputMode="numeric" />
          <Field label="🆔 CPF *" value={document} onChange={setDocument} inputMode="numeric" />
          
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>📅 Birth Date *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/YYYY"
              value={birthDate}
              onChange={formatDate}
              maxLength={10}
              style={inputStyle}
            />
          </div>

          <Field label="📄 Driver's License *" value={driversLicense} onChange={setDriversLicense} />
        </div>
      </div>

      <div style={{ padding: '12px 16px 20px', background: '#f3f4f6' }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: '#16a34a',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '16px',
            padding: '14px',
            border: 'none',
            borderRadius: '40px',
            cursor: 'pointer',
            opacity: loading ? 0.6 : 1
          }}
        >
          {loading ? '⏳ Sending...' : '✅ Become a Driver'}
        </button>
      </div>
    </div>
  );
};

const Field = ({ label, value, onChange, inputMode }: any) => (
  <div style={{ marginBottom: '16px' }}>
    <label style={{ display: 'block', marginBottom: '6px', fontWeight: 'bold', fontSize: '14px', color: '#1f2937' }}>{label}</label>
    <input
      type="text"
      inputMode={inputMode || 'text'}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      style={inputStyle}
    />
  </div>
);

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '12px',
  border: '1px solid #e5e7eb',
  borderRadius: '8px',
  fontSize: '16px',
  boxSizing: 'border-box',
  background: '#fafafa'
};

export default BecomeDriver;