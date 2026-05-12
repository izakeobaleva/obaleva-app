import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import toast from 'sonner';

export const RegisterDriver = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<any>({});
  const [loading, setLoading] = useState(false);

  const updateForm = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const finalSubmit = async () => {
    setLoading(true);
    try {
      const { nome_completo, cpf, telefone, email, password, placa, modelo, ano, cor, pix } = form;

      // 1. Criar usuário no Auth
      const { data: authData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo, tipo: 'motorista' } },
      });
      if (signUpError) throw signUpError;
      if (!authData.user) throw new Error('Erro ao criar usuário');

      // 2. Inserir na tabela usuarios
      const { error: insertUserError } = await supabase.from('usuarios').insert({
        id: authData.user.id,
        nome_completo,
        cpf,
        telefone,
        email,
        tipo: 'motorista',
      });
      if (insertUserError) throw insertUserError;

      // 3. Inserir na tabela motoristas
      const { error: insertDriverError } = await supabase.from('motoristas').insert({
        id: authData.user.id,
        status: 'pendente',
        dados_veiculo: { placa, modelo, ano, cor },
        conta_bancaria_pix: pix,
      });
      if (insertDriverError) throw insertDriverError;

      toast.success('Cadastro enviado! Aguarde aprovação do administrador.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      toast.error(err.message || 'Erro no cadastro');
    } finally {
      setLoading(false);
    }
  };

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow">
          <h2 className="text-2xl font-bold text-roxo-principal">Cadastro Motorista – Etapa 1</h2>
          <p className="text-gray-600 mb-4">Dados pessoais</p>
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('nome_completo', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="CPF (apenas números)"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('cpf', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Telefone com DDD"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('telefone', e.target.value)}
            required
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('email', e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('password', e.target.value)}
            required
          />
          <button onClick={nextStep} className="btn-amarelo w-full py-2 rounded-lg mt-3">
            Próximo
          </button>
        </div>
      </div>
    );
  }

  if (step === 2) {
    return (
      <div className="min-h-screen bg-gray-100 p-4 flex items-center justify-center">
        <div className="bg-white p-6 rounded-xl max-w-lg w-full shadow">
          <h2 className="text-2xl font-bold text-roxo-principal">Cadastro Motorista – Etapa 2</h2>
          <p className="text-gray-600 mb-4">Dados do veículo e PIX</p>
          <input
            type="text"
            placeholder="Placa"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('placa', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Modelo"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('modelo', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Ano"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('ano', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Cor"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('cor', e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Chave PIX (CPF, e-mail ou telefone)"
            className="w-full p-2 border rounded my-1"
            onChange={(e) => updateForm('pix', e.target.value)}
            required
          />
          <div className="flex gap-2 mt-4">
            <button onClick={prevStep} className="bg-gray-500 text-white px-4 py-2 rounded-lg">
              Voltar
            </button>
            <button
              onClick={finalSubmit}
              disabled={loading}
              className="btn-amarelo flex-1 py-2 rounded-lg"
            >
              {loading ? 'Enviando...' : 'Enviar cadastro'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return null;
};

export default RegisterDriver;