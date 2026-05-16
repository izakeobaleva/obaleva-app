import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

interface CadastroRapidoProps {
  tipo: 'passageiro' | 'motorista';
  onSuccess: () => void;
}

export default function CadastroRapido({ tipo, onSuccess }: CadastroRapidoProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: auth, error } = await supabase.auth.signUp({ email, password, options: { data: { nome_completo: nome, tipo } } });
      if (error) throw error;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      await supabase.from('usuarios').insert({ id: auth.user.id, nome_completo: nome, cpf, telefone, email, tipo });
      if (tipo === 'passageiro') await supabase.from('passageiros').insert({ id: auth.user.id });
      else await supabase.from('motoristas').insert({ id: auth.user.id, status: 'pendente', dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } });
      toast.success('Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#1A1528]/90 backdrop-blur-sm rounded-xl p-4 border border-white/10">
      <h2 className="text-white font-bold text-sm mb-3">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-2">
        <input placeholder="Nome completo" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={email} onChange={e => setEmail(e.target.value)} required />
        <input type="password" placeholder="Senha" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-2 rounded-lg bg-[#0F0B1A] border border-white/10 text-white text-sm" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="btn-amarelo w-full py-2 rounded-lg font-bold text-sm">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
}