import React, { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { LogOut, Upload, CheckCircle, AlertCircle } from 'lucide-react';

interface SejaMotoristaProps {
  user: any;
  onClose: () => void;
  onSuccess: () => void;
  onLogout?: () => void;
}

type DadosMotorista = {
  nome: string;
  whatsapp: string;
  cpf: string;
  dataNasc: string;
  cnhFile: File | null;
  fotoFile: File | null;
};

const SejaMotorista: React.FC<SejaMotoristaProps> = ({ user, onClose, onSuccess, onLogout }) => {
  const [dados, setDados] = useState<DadosMotorista>({
    nome: user?.user_metadata?.nome_completo || '',
    whatsapp: '',
    cpf: '',
    dataNasc: '',
    cnhFile: null,
    fotoFile: null,
  });
  const [erros, setErros] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  // MÁSCARA PARA DATA (SEM CALENDAR)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    
    if (value.length >= 3) {
      value = value.replace(/^(\d{2})(\d)/, '$1/$2');
    }
    if (value.length >= 7) {
      value = value.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    }
    
    setDados(prev => ({ ...prev, dataNasc: value }));
    
    // Validação
    if (value.length === 10) {
      const [dia, mes, ano] = value.split('/').map(Number);
      const dataValida = dia >= 1 && dia <= 31 && mes >= 1 && mes <= 12 && ano >= 1900 && ano <= new Date().getFullYear();
      if (!dataValida) {
        setErros(prev => ({ ...prev, dataNasc: '📅 Data inválida' }));
      } else {
        const idade = new Date().getFullYear() - ano;
        if (idade < 18) setErros(prev => ({ ...prev, dataNasc: '⚠️ Você precisa ter 18 anos ou mais' }));
        else setErros(prev => ({ ...prev, dataNasc: '' }));
      }
    } else if (value.length > 0 && value.length < 10) {
      setErros(prev => ({ ...prev, dataNasc: '📅 Data incompleta (DD/MM/AAAA)' }));
    } else {
      setErros(prev => ({ ...prev, dataNasc: '' }));
    }
  };

  const handleChange = (campo: keyof DadosMotorista, valor: string) => {
    setDados(prev => ({ ...prev, [campo]: valor }));
    
    if (campo === 'whatsapp') {
      const whats = valor.replace(/\D/g, '');
      if (whats.length > 0 && whats.length < 10) {
        setErros(prev => ({ ...prev, whatsapp: '📱 WhatsApp deve ter 10 ou 11 dígitos' }));
      } else {
        setErros(prev => ({ ...prev, whatsapp: '' }));
      }
    }
    if (campo === 'cpf') {
      const cpfNum = valor.replace(/\D/g, '');
      if (cpfNum.length > 0 && cpfNum.length !== 11) {
        setErros(prev => ({ ...prev, cpf: '🆔 CPF deve ter 11 dígitos' }));
      } else {
        setErros(prev => ({ ...prev, cpf: '' }));
      }
    }
    if (campo === 'nome' && valor.trim() === '') {
      setErros(prev => ({ ...prev, nome: '👤 Nome é obrigatório' }));
    } else {
      setErros(prev => ({ ...prev, nome: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, field: 'cnhFile' | 'fotoFile') => {
    const file = e.target.files?.[0] || null;
    setDados(prev => ({ ...prev, [field]: file }));
  };

  const handleLogout = async () => {
    if (onLogout) { onLogout(); return; }
    await supabase.auth.signOut();
    localStorage.clear();
    window.location.href = '/';
  };

  const handleSubmit = async () => {
    // Validar campos obrigatórios
    const required = ['nome', 'whatsapp', 'cpf', 'dataNasc'];
    let hasError = false;
    required.forEach(campo => {
      if (!dados[campo as keyof DadosMotorista]) {
        setErros(prev => ({ ...prev, [campo]: '⚠️ Campo obrigatório' }));
        hasError = true;
      }
    });
    if (dados.dataNasc.length !== 10) {
      setErros(prev => ({ ...prev, dataNasc: '📅 Data completa obrigatória' }));
      hasError = true;
    }
    if (hasError) return;

    setLoading(true);
    
    try {
      await supabase.from('usuarios').update({ tipo: 'motorista' }).eq('id', user.id);
      await supabase.from('motoristas').insert({
        id: user.id,
        status: 'pendente',
        nome_completo: dados.nome,
        telefone: dados.whatsapp.replace(/\D/g, ''),
        cpf: dados.cpf.replace(/\D/g, ''),
        data_nascimento: dados.dataNasc,
        endereco: '',
        dados_veiculo: { modelo: '', placa: '', ano: '', cor: '' },
        documentos: { cnh_frente: dados.cnhFile?.name || null, cnh_verso: null }
      });

      alert('✅ Parabéns! Cadastro realizado com sucesso!\nBem-vindo à família de motoristas!');
      onSuccess();
    } catch (error: any) {
      alert('❌ Erro: ' + (error.message || 'Erro ao cadastrar'));
    }
    
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100dvh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
      fontFamily: 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif',
      zIndex: 100,
    }}>
      {/* Cabeçalho */}
      <div style={{
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '16px 20px',
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)',
      }}>
        <button onClick={handleLogout} style={{
          background: 'none',
          border: 'none',
          fontSize: '1.2rem',
          color: '#e53935',
          fontWeight: 'bold',
          cursor: 'pointer',
          padding: '8px 12px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <LogOut size={20} /> Sair
        </button>
        <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: '#333', margin: 0 }}>
          🚛 Seja Motorista
        </h2>
        <div style={{ width: 60 }}></div>
      </div>

      {/* Conteúdo rolável */}
      <div style={{
        flex: 1,
        overflowY: 'auto',
        padding: '20px',
        paddingBottom: '100px',
      }}>
        {/* Frase motivacional */}
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '20px',
          marginBottom: '24px',
          textAlign: 'center',
          border: '1px solid rgba(255,255,255,0.3)',
        }}>
          <span style={{ fontSize: '2rem', display: 'block', marginBottom: '8px' }}>🌟</span>
          <p style={{
            color: 'white',
            fontSize: '1.1rem',
            lineHeight: 1.5,
            fontWeight: 500,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}>
            "A estrada é sua aliada, a liberdade seu destino.<br />
            Faça parte do time que move o mundo com responsabilidade e paixão.<br />
            <strong>Sua jornada começa aqui!</strong>"
          </p>
        </div>

        {/* Formulário */}
        <CardCampo label="👤 Nome completo *">
          <InputText
            value={dados.nome}
            onChange={(v) => handleChange('nome', v)}
            placeholder="Digite seu nome completo"
          />
          {erros.nome && <ErroMsg msg={erros.nome} />}
        </CardCampo>

        <CardCampo label="📱 WhatsApp *">
          <InputText
            value={dados.whatsapp}
            onChange={(v) => handleChange('whatsapp', v)}
            placeholder="11999999999"
            inputMode="numeric"
          />
          {erros.whatsapp && <ErroMsg msg={erros.whatsapp} />}
        </CardCampo>

        <CardCampo label="🆔 CPF *">
          <InputText
            value={dados.cpf}
            onChange={(v) => handleChange('cpf', v)}
            placeholder="00000000000"
            inputMode="numeric"
          />
          {erros.cpf && <ErroMsg msg={erros.cpf} />}
        </CardCampo>

        {/* CAMPO DATA DIGITÁVEL - SEM CALENDAR */}
        <CardCampo label="📅 Data de nascimento * (digite DD/MM/AAAA)">
          <input
            type="text"
            inputMode="numeric"
            placeholder="DD/MM/AAAA"
            value={dados.dataNasc}
            onChange={handleDataChange}
            maxLength={10}
            style={inputStyle}
          />
          {erros.dataNasc && <ErroMsg msg={erros.dataNasc} />}
        </CardCampo>

        <CardCampo label="📄 CNH (frente e verso)">
          <UploadArea
            id="upload-cnh"
            file={dados.cnhFile}
            onChange={(e) => handleFileChange(e, 'cnhFile')}
          />
        </CardCampo>

        <CardCampo label="🖼️ Foto de perfil">
          <UploadArea
            id="upload-foto"
            file={dados.fotoFile}
            onChange={(e) => handleFileChange(e, 'fotoFile')}
          />
        </CardCampo>
      </div>

      {/* Botão fixo */}
      <div style={{
        position: 'absolute',
        bottom: '60px',
        left: '20px',
        right: '20px',
        zIndex: 20,
      }}>
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            padding: '16px',
            border: 'none',
            borderRadius: '40px',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: loading ? 'none' : '0 4px 12px rgba(102,126,234,0.4)',
            opacity: loading ? 0.6 : 1,
            transition: 'all 0.2s',
          }}
        >
          {loading ? '⏳ Cadastrando...' : '🚀 Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

// ============ COMPONENTES AUXILIARES ============

const inputStyle: React.CSSProperties = {
  width: '100%',
  padding: '14px 16px',
  fontSize: '1rem',
  border: '1.5px solid #e0e0e0',
  borderRadius: '14px',
  background: '#fafafa',
  transition: 'all 0.2s',
  fontFamily: 'inherit',
  outline: 'none',
  boxSizing: 'border-box',
};

function InputText({ value, onChange, placeholder, inputMode }: any) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      inputMode={inputMode || 'text'}
      style={inputStyle}
      onFocus={(e) => { e.target.style.borderColor = '#667eea'; e.target.style.background = 'white'; e.target.style.boxShadow = '0 0 0 3px rgba(102,126,234,0.1)'; }}
      onBlur={(e) => { e.target.style.borderColor = '#e0e0e0'; e.target.style.background = '#fafafa'; e.target.style.boxShadow = 'none'; }}
    />
  );
}

function CardCampo({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div style={{
      background: 'white',
      borderRadius: '20px',
      padding: '16px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    }}>
      <label style={{
        display: 'block',
        fontSize: '0.9rem',
        fontWeight: 600,
        color: '#555',
        marginBottom: '8px',
      }}>{label}</label>
      {children}
    </div>
  );
}

function ErroMsg({ msg }: { msg: string }) {
  return (
    <p style={{ color: '#e53935', fontSize: '0.75rem', marginTop: '6px', paddingLeft: '4px' }}>
      {msg}
    </p>
  );
}

function UploadArea({ id, file, onChange }: { id: string; file: File | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void }) {
  return (
    <div style={{ marginTop: '8px' }}>
      <input type="file" accept="image/*,application/pdf" onChange={onChange} style={{ display: 'none' }} id={id} />
      <label htmlFor={id} style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        background: '#f0f0f0',
        color: '#555',
        padding: '12px 20px',
        borderRadius: '14px',
        fontSize: '0.9rem',
        cursor: 'pointer',
        transition: 'background 0.2s',
        border: '1.5px dashed #ccc',
        width: '100%',
        justifyContent: 'center',
        boxSizing: 'border-box',
      }}>
        <Upload size={18} />
        {file ? file.name : '📎 Escolher arquivo'}
      </label>
      {file && (
        <div style={{
          fontSize: '0.8rem',
          color: '#667eea',
          marginTop: '8px',
          padding: '8px',
          background: '#f0f0ff',
          borderRadius: '10px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}>
          <CheckCircle size={14} /> {file.name}
        </div>
      )}
    </div>
  );
}

export default SejaMotorista;