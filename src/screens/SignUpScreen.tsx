import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface SignUpScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function SignUpScreen({ onBack, onSuccess }: SignUpScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nome, setNome] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    setError('');
    if (!nome || !email || !password) {
      setError('Preencha todos os campos');
      return;
    }
    if (password.length < 6) {
      setError('Senha: mínimo 6 caracteres');
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { nome_completo: nome } },
      });
      if (error) throw error;
      if (data.user) {
        await supabase.from('usuarios').insert({
          id: data.user.id,
          nome_completo: nome,
          email: email,
          tipo: 'passageiro',
        });
        await supabase.from('passageiros').insert({ id: data.user.id });
        alert('✅ Conta criada! Faça login.');
        onSuccess();
      }
    } catch (error: any) {
      setError(error.message.includes('already') ? 'E-mail já cadastrado' : error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <button onClick={onBack} className="text-[#A0A0B0] mb-4">
          ← Voltar
        </button>
        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          <h2 className="text-xl font-bold text-white text-center mb-6">Criar Conta</h2>
          {error && (
            <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">
              {error}
            </div>
          )}
          <input
            type="text"
            placeholder="Nome completo"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha (mínimo 6)"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            onClick={handleSignUp}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
          >
            {loading ? 'Criando...' : 'Cadastrar'}
          </button>
        </div>
      </div>
    </div>
  );
}