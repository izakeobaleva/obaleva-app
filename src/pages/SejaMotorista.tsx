import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const SejaMotorista = () => {
  const navigate = useNavigate();
  const [nome, setNome] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [cpf, setCpf] = useState('');
  const [dataNasc, setDataNasc] = useState('');
  const [cnh, setCnh] = useState('');
  const [carregando, setCarregando] = useState(false);

  // Máscara para data (DD/MM/AAAA)
  const handleDataChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let valor = e.target.value.replace(/\D/g, '');
    if (valor.length > 8) valor = valor.slice(0, 8);
    if (valor.length >= 3) valor = valor.replace(/^(\d{2})(\d)/, '$1/$2');
    if (valor.length >= 7) valor = valor.replace(/^(\d{2})\/(\d{2})(\d)/, '$1/$2/$3');
    setDataNasc(valor);
  };

  const handleSubmit = async () => {
    if (!nome || !whatsapp || !cpf || dataNasc.length !== 10 || !cnh) {
      alert('⚠️ Preencha todos os campos');
      return;
    }
    
    setCarregando(true);
    // Simula envio
    setTimeout(() => {
      alert('✅ Cadastro de motorista solicitado com sucesso!');
      setCarregando(false);
      navigate('/profile');
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528]">
      {/* Cabeçalho */}
      <div className="bg-[#1A1528] border-b border-white/10 px-4 py-3 flex items-center gap-3">
        <button onClick={() => navigate('/profile')} className="text-[#A0A0B0] hover:text-white transition p-1">
          ← Voltar
        </button>
        <h1 className="text-lg font-bold text-white">🚛 Seja Motorista</h1>
      </div>

      {/* Conteúdo */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-4">
        {/* Frase motivacional */}
        <div className="bg-gradient-to-r from-purple-900/40 to-amber-900/40 rounded-2xl p-5 border border-[#F4D03F]/20 text-center">
          <p className="text-white text-sm leading-relaxed">
            🌟 "Transforme sua paixão por dirigir em uma jornada de sucesso. Cada quilômetro é uma nova conquista!"
          </p>
        </div>

        {/* Formulário */}
        <div className="bg-[#1A1528] rounded-2xl p-5 border border-white/10 space-y-4">
          <div>
            <label className="block text-sm text-white/70 mb-1">👤 Nome completo *</label>
            <input
              type="text"
              placeholder="Digite seu nome completo"
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">📱 WhatsApp *</label>
            <input
              type="tel"
              inputMode="numeric"
              placeholder="11999999999"
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
              value={whatsapp}
              onChange={(e) => setWhatsapp(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">🆔 CPF *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="00000000000"
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
              value={cpf}
              onChange={(e) => setCpf(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">📅 Data de nascimento *</label>
            <input
              type="text"
              inputMode="numeric"
              placeholder="DD/MM/AAAA"
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
              value={dataNasc}
              onChange={handleDataChange}
              maxLength={10}
            />
            <p className="text-[10px] text-[#A0A0B0] mt-1">Digite usando o teclado numérico (ex: 25051990)</p>
          </div>

          <div>
            <label className="block text-sm text-white/70 mb-1">📄 Número da CNH *</label>
            <input
              type="text"
              placeholder="Digite o número da CNH"
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
              value={cnh}
              onChange={(e) => setCnh(e.target.value)}
            />
          </div>
        </div>

        {/* Botão */}
        <button
          onClick={handleSubmit}
          disabled={carregando}
          className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#22C55E] to-[#16A34A] text-white hover:shadow-lg transition-all disabled:opacity-50 text-lg"
        >
          {carregando ? '⏳ Enviando...' : '✅ Quero ser Motorista'}
        </button>
      </div>
    </div>
  );
};

export default SejaMotorista;