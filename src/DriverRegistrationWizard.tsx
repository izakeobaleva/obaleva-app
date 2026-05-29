import React, { useState } from 'react';
import { supabase } from './lib/supabaseClient';

interface Props {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  onLogout?: () => void;
}

const DriverRegistrationWizard: React.FC<Props> = ({ user, onClose, onSuccess, onLogout }) => {
  const [etapa, setEtapa] = useState(1);
  const [loading, setLoading] = useState(false);
  const [erros, setErros] = useState<Record<string, string>>({});
  const [cnhFile, setCnhFile] = useState<File | null>(null);
  const [fotoFile, setFotoFile] = useState<File | null>(null);

  const [form, setForm] = useState({
    nome: user?.user_metadata?.nome_completo || '',
    telefone: '',
    cpf: '',
    dataNasc: '',
    endereco: '',
    cnhNumero: '',
    cnhCategoria: '',
    cnhValidade: '',
    placa: '',
    modelo: '',
    ano: '',
    cor: '',
  });

  const handleChange = (campo: string, valor: string) => {
    setForm(prev => ({ ...prev, [campo]: valor }));
    if (erros[campo]) {
      setErros(prev => {
        const copy = { ...prev };
        delete copy[campo];
        return copy;
      });
    }
  };

  const validar = () => {
    const novos: Record<string, string> = {};
    if (etapa === 1) {
      if (!form.nome.trim()) novos.nome = 'Obrigatório';
      if (!form.telefone.replace(/\D/g, '').length) novos.telefone = 'Obrigatório';
      if (form.cpf.replace(/\D/g, '').length !== 11) novos.cpf = '11 dígitos';
      if (form.dataNasc.length < 10) novos.dataNasc = 'Obrigatório';
    }
    if (etapa === 2 && !form.endereco.trim()) novos.endereco = 'Obrigatório';
    if (etapa === 3) {
      if (!form.cnhNumero.trim()) novos.cnhNumero = 'Obrigatório';
      if (!form.cnhCategoria.trim()) novos.cnhCategoria = 'Obrigatório';
      if (form.cnhValidade.length < 10) novos.cnhValidade = 'Obrigatório';
    }
    if (etapa === 4) {
      if (!form.placa.trim()) novos.placa = 'Obrigatório';
      if (!form.modelo.trim()) novos.modelo = 'Obrigatório';
      if (!form.ano.trim()) novos.ano = 'Obrigatório';
      if (!form.cor.trim()) novos.cor = 'Obrigatório';
    }
    setErros(novos);
    return Object.keys(novos).length === 0;
  };

  const avancar = () => { if (validar()) setEtapa(etapa + 1); };
  const voltar = () => setEtapa(etapa - 1);

  const submit = async () => {
    if (!validar()) return;
    setLoading(true);
    try {
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      await supabase.from('motoristas').insert({
        id: user.id,
        status: 'pendente',
        nome_completo: form.nome,
        telefone: form.telefone.replace(/\D/g, ''),
        cpf: form.cpf.replace(/\D/g, ''),
        data_nascimento: form.dataNasc,
        endereco: form.endereco,
        dados_veiculo: { placa: form.placa.toUpperCase(), modelo: form.modelo, ano: form.ano, cor: form.cor },
        documentos: { cnh_numero: form.cnhNumero, cnh_categoria: form.cnhCategoria, cnh_validade: form.cnhValidade }
      });
      alert('✅ Enviado! Aguarde aprovação.');
      onSuccess();
    } catch (err: any) { alert('Erro: ' + err.message); }
    setLoading(false);
  };

  const inputStyle = {
    width: '100%',
    padding: '12px',
    fontSize: '16px',
    background: '#1A1528',
    border: '1px solid rgba(255,255,255,0.15)',
    borderRadius: '12px',
    color: '#fff',
    outline: 'none',
    boxSizing: 'border-box' as const,
  };

  const labelStyle: React.CSSProperties = {
    display: 'block',
    fontSize: '13px',
    color: '#A0A0B0',
    marginBottom: '4px',
    fontWeight: 500,
  };

  const renderCampo = (label: string, valor: string, onChange: (v: string) => void, placeholder = '', tipo = 'text') => (
    <div style={{ marginBottom: '12px' }}>
      <label style={labelStyle}>{label}</label>
      <input
        type={tipo}
        placeholder={placeholder}
        value={valor}
        onChange={e => onChange(e.target.value)}
        style={inputStyle}
      />
      {erros[label] && <p style={{ color: '#ef4444', fontSize: '11px', marginTop: '2px' }}>{erros[label]}</p>}
    </div>
  );

  return (
    <div style={{
      position: 'fixed', inset: 0, background: '#0F0B1A', zIndex: 50,
      display: 'flex', flexDirection: 'column', height: '100dvh',
    }}>
      {/* Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)',
        flexShrink: 0,
      }}>
        <button onClick={onLogout || (() => { supabase.auth.signOut(); window.location.href = '/'; })}
          style={{ color: '#ef4444', fontSize: '14px', background: 'none', border: 'none', cursor: 'pointer' }}>
          Sair
        </button>
        <span style={{ color: '#fff', fontWeight: 'bold', fontSize: '16px' }}>Cadastro Motorista</span>
        <span style={{ color: '#A0A0B0', fontSize: '12px' }}>{etapa}/4</span>
      </div>

      {/* Progresso */}
      <div style={{ padding: '4px 16px', flexShrink: 0 }}>
        <div style={{ height: '4px', background: 'rgba(255,255,255,0.1)', borderRadius: '4px', overflow: 'hidden' }}>
          <div style={{ height: '100%', width: `${(etapa / 4) * 100}%`, background: '#F4D03F', borderRadius: '4px', transition: 'width 0.3s' }} />
        </div>
      </div>

      {/* Conteúdo com scroll */}
      <div style={{
        flex: 1, overflowY: 'auto', padding: '12px 16px',
        paddingBottom: '100px',
      }}>
        {etapa === 1 && (
          <>
            {renderCampo('nome', form.nome, v => handleChange('nome', v), 'Nome completo')}
            {renderCampo('telefone', form.telefone, v => handleChange('telefone', v), '(11) 99999-9999')}
            {renderCampo('cpf', form.cpf, v => handleChange('cpf', v), '000.000.000-00')}
            {renderCampo('dataNasc', form.dataNasc, v => handleChange('dataNasc', v), 'DD/MM/AAAA')}
          </>
        )}

        {etapa === 2 && (
          <>
            {renderCampo('endereco', form.endereco, v => handleChange('endereco', v), 'Rua, número, bairro, cidade')}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>CNH (opcional)</label>
              <input type="file" accept="image/*,.pdf" onChange={e => setCnhFile(e.target.files?.[0] || null)}
                style={{ color: '#fff', fontSize: '12px' }} />
              {cnhFile && <p style={{ color: '#A0A0B0', fontSize: '11px', marginTop: '2px' }}>{cnhFile.name}</p>}
            </div>
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>Foto de perfil (opcional)</label>
              <input type="file" accept="image/*" onChange={e => setFotoFile(e.target.files?.[0] || null)}
                style={{ color: '#fff', fontSize: '12px' }} />
              {fotoFile && <p style={{ color: '#A0A0B0', fontSize: '11px', marginTop: '2px' }}>{fotoFile.name}</p>}
            </div>
          </>
        )}

        {etapa === 3 && (
          <>
            {renderCampo('cnhNumero', form.cnhNumero, v => handleChange('cnhNumero', v), 'Número da CNH')}
            {renderCampo('cnhCategoria', form.cnhCategoria, v => handleChange('cnhCategoria', v), 'A, B, C, D ou E')}
            {renderCampo('cnhValidade', form.cnhValidade, v => handleChange('cnhValidade', v), 'DD/MM/AAAA')}
          </>
        )}

        {etapa === 4 && (
          <>
            {renderCampo('placa', form.placa, v => handleChange('placa', v), 'ABC-1234')}
            {renderCampo('modelo', form.modelo, v => handleChange('modelo', v), 'Ex: Toyota Corolla')}
            {renderCampo('ano', form.ano, v => handleChange('ano', v), '2023')}
            {renderCampo('cor', form.cor, v => handleChange('cor', v), 'Preto')}
          </>
        )}

        <div style={{ textAlign: 'center', padding: '12px', color: '#F4D03F', fontSize: '12px', opacity: 0.8 }}>
          ✨ Juntos, construímos viagens mais seguras e conectadas. ✨
        </div>
      </div>

      {/* Botão fixo */}
      <div style={{
        position: 'fixed', bottom: '70px', left: 0, right: 0,
        padding: '8px 16px', zIndex: 60,
      }}>
        <div style={{ display: 'flex', gap: '8px', maxWidth: '500px', margin: '0 auto' }}>
          {etapa > 1 && (
            <button onClick={voltar}
              style={{
                flex: '0 0 auto', padding: '12px 20px', borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.2)', background: 'transparent',
                color: '#fff', fontWeight: 'bold', fontSize: '14px', cursor: 'pointer',
              }}>
              ← Voltar
            </button>
          )}
          {etapa < 4 ? (
            <button onClick={avancar}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                background: 'linear-gradient(135deg, #FFD966, #F4D03F)',
                color: '#1E1E2F', fontWeight: 'bold', fontSize: '16px',
                border: 'none', cursor: 'pointer',
              }}>
              Continuar
            </button>
          ) : (
            <button onClick={submit} disabled={loading}
              style={{
                flex: 1, padding: '12px', borderRadius: '12px',
                background: loading ? '#666' : 'linear-gradient(135deg, #22C55E, #16A34A)',
                color: '#fff', fontWeight: 'bold', fontSize: '16px',
                border: 'none', cursor: loading ? 'not-allowed' : 'pointer',
              }}>
              {loading ? 'Enviando...' : '✅ Confirmar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default DriverRegistrationWizard;