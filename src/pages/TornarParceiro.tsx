import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const TornarParceiro = () => {
  const navigate = useNavigate();
  const [dados, setDados] = useState({
    nomeCompleto: '',
    telefone: '',
    documento: '',
    nascimento: '',
    registroCnh: ''
  });
  const [enviando, setEnviando] = useState(false);

  const formatarData = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDados({ ...dados, nascimento: valor });
  };

  const enviarSolicitacao = () => {
    if (!dados.nomeCompleto || !dados.telefone || !dados.documento || dados.nascimento.length !== 10 || !dados.registroCnh) {
      alert('Por favor, preencha todos os campos');
      return;
    }
    setEnviando(true);
    setTimeout(() => {
      alert('✅ Solicitação enviada! Aguarde aprovação.');
      setEnviando(false);
      navigate('/profile');
    }, 1500);
  };

  const cores = {
    primaria: '#2563eb',
    sucesso: '#16a34a',
    fundo: '#f3f4f6',
    branco: '#ffffff',
    texto: '#1f2937',
    cinza: '#6b7280'
  };

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100dvh',
      background: cores.fundo, display: 'flex', flexDirection: 'column'
    }}>
      {/* Cabeçalho */}
      <div style={{
        padding: '16px 20px', background: cores.branco,
        borderBottom: '1px solid #e5e7eb', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between'
      }}>
        <button onClick={() => navigate('/profile')} style={{
          background: 'none', border: 'none', fontSize: '24px',
          cursor: 'pointer', color: cores.texto, padding: '4px 8px'
        }}>←</button>
        <h1 style={{ fontSize: '18px', margin: 0, color: cores.texto }}>🚀 Tornar-se Parceiro</h1>
        <div style={{ width: 40 }} />
      </div>

      {/* Conteúdo */}
      <div style={{ flex: 1, overflow: 'auto', padding: '16px' }}>
        {/* Banner motivacional */}
        <div style={{
          background: `linear-gradient(135deg, ${cores.primaria}, #7c3aed)`,
          borderRadius: '20px', padding: '24px', marginBottom: '20px',
          textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <p style={{ color: cores.branco, fontSize: '14px', margin: 0, lineHeight: 1.5 }}>
            ✨ "Faça parte do time que transforma vidas através da mobilidade. 
            Seu sucesso é o nosso sucesso!"
          </p>
        </div>

        {/* Formulário */}
        <div style={{ background: cores.branco, borderRadius: '20px', padding: '20px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: cores.texto }}>
              👤 Nome completo
            </label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              value={dados.nomeCompleto}
              onChange={(e) => setDados({...dados, nomeCompleto: e.target.value})}
              style={{
                width: '100%', padding: '12px', fontSize: '16px',
                border: '1px solid #e5e7eb', borderRadius: '12px',
                boxSizing: 'border-box' as const
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: cores.texto }}>
              📱 WhatsApp
            </label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="11999999999"
              value={dados.telefone}
              onChange={(e) => setDados({...dados, telefone: e.target.value})}
              style={{
                width: '100%', padding: '12px', fontSize: '16px',
                border: '1px solid #e5e7eb', borderRadius: '12px',
                boxSizing: 'border-box' as const
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: cores.texto }}>
              🆔 CPF
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="00000000000"
              value={dados.documento}
              onChange={(e) => setDados({...dados, documento: e.target.value})}
              style={{
                width: '100%', padding: '12px', fontSize: '16px',
                border: '1px solid #e5e7eb', borderRadius: '12px',
                boxSizing: 'border-box' as const
              }}
            />
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: cores.texto }}>
              📅 Data de nascimento
            </label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              value={dados.nascimento}
              onChange={formatarData}
              maxLength={10}
              style={{
                width: '100%', padding: '12px', fontSize: '16px',
                border: '1px solid #e5e7eb', borderRadius: '12px',
                boxSizing: 'border-box' as const
              }}
            />
            <small style={{ fontSize: '11px', color: cores.cinza, display: 'block', marginTop: '4px' }}>
              💡 Digite usando o teclado numérico (ex: 25051990)
            </small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', marginBottom: '6px', color: cores.texto }}>
              📄 Número da CNH
            </label>
            <input
              type="text"
              placeholder="Digite o número da CNH"
              value={dados.registroCnh}
              onChange={(e) => setDados({...dados, registroCnh: e.target.value})}
              style={{
                width: '100%', padding: '12px', fontSize: '16px',
                border: '1px solid #e5e7eb', borderRadius: '12px',
                boxSizing: 'border-box' as const
              }}
            />
          </div>
        </div>
      </div>

      {/* Botão fixo */}
      <div style={{ padding: '12px 16px 20px', background: cores.fundo }}>
        <button
          onClick={enviarSolicitacao}
          disabled={enviando}
          style={{
            width: '100%', background: cores.sucesso, color: cores.branco,
            fontWeight: 'bold', fontSize: '16px', padding: '14px',
            border: 'none', borderRadius: '40px', cursor: 'pointer' as const,
            opacity: enviando ? 0.6 : 1
          }}
        >
          {enviando ? '⏳ Enviando...' : '✅ Quero ser Parceiro'}
        </button>
      </div>
    </div>
  );
};

export default TornarParceiro;