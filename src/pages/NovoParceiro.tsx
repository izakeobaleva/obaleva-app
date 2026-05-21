import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

const NovoParceiro = () => {
  const [form, setForm] = useState({
    nome: '',
    telefone: '',
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

  const enviar = async () => {
    if (!form.nome || !form.telefone || !form.cpf || form.nascimento.length !== 10 || !form.cnh) {
      alert('Preencha todos os campos!');
      return;
    }
    setLoading(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        alert('Faça login primeiro!');
        setLoading(false);
        return;
      }
      
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', session.user.id);
      await supabase.from('motoristas').insert({
        id: session.user.id,
        status: 'pendente',
        nome_completo: form.nome,
        telefone: form.telefone,
        cpf: form.cpf,
        data_nascimento: form.nascimento,
        documentos: { cnh_numero: form.cnh }
      });
      
      alert('✅ Cadastro enviado! Aguarde aprovação.');
      window.location.href = '/profile';
    } catch (err: any) {
      alert('❌ Erro: ' + (err.message || 'Erro desconhecido'));
    }
    setLoading(false);
  };

  const inputStyle: React.CSSProperties = {
    width: '100%',
    padding: '12px',
    border: '1px solid #e5e7eb',
    borderRadius: '12px',
    fontSize: '16px',
    boxSizing: 'border-box',
    background: '#fafafa'
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    marginBottom: '6px',
    fontWeight: 'bold',
    fontSize: '14px',
    color: '#1f2937'
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
      {/* Cabeçalho */}
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
        <h1 style={{ fontSize: '18px', margin: 0, color: '#1f2937' }}>🚀 Novo Parceiro</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
          borderRadius: '20px',
          padding: '24px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <p style={{ color: 'white', margin: 0, fontSize: '15px', lineHeight: 1.5 }}>
            ✨ "Faça parte do time que transforma vidas através da mobilidade. Seu sucesso é o nosso sucesso!"
          </p>
        </div>

        <div style={{
          background: 'white',
          borderRadius: '20px',
          padding: '20px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>👤 Nome completo</label>
            <input type="text" placeholder="Digite seu nome completo" value={form.nome} onChange={e => setForm({...form, nome: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>📱 WhatsApp</label>
            <input type="tel" inputMode="numeric" placeholder="11999999999" value={form.telefone} onChange={e => setForm({...form, telefone: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>🆔 CPF</label>
            <input type="text" inputMode="numeric" placeholder="00000000000" value={form.cpf} onChange={e => setForm({...form, cpf: e.target.value})} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>📅 Data de nascimento</label>
            <input type="text" inputMode="numeric" placeholder="DD/MM/AAAA" value={form.nascimento} onChange={handleNascimento} maxLength={10} style={inputStyle} />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>📄 Número da CNH</label>
            <input type="text" placeholder="Digite o número da CNH" value={form.cnh} onChange={e => setForm({...form, cnh: e.target.value})} style={inputStyle} />
          </div>
        </div>
      </div>

      {/* Botão fixo */}
      <div style={{ padding: '12px 16px 20px', background: '#f3f4f6' }}>
        <button
          onClick={enviar}
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
          {loading ? '⏳ Enviando...' : '✅ Quero ser Parceiro'}
        </button>
      </div>
    </div>
  );
};

export default NovoParceiro;