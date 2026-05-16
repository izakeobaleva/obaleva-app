import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

interface CadastroRapidoProps {
  tipo: 'passageiro' | 'motorista';
  onSuccess: () => void;
}

export function CadastroRapido({ tipo, onSuccess }: CadastroRapidoProps) {
  const [nome, setNome] = useState('');
  const [cpf, setCpf] = useState('');
  const [telefone, setTelefone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [placa, setPlaca] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15">
      <h2 className="text-white font-bold text-sm mb-2">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-1.5">
        <input placeholder="Nome completo" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={nome} onChange={e => setNome(e.target.value)} required />
        <input placeholder="CPF" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={cpf} onChange={e => setCpf(e.target.value)} required />
        <input placeholder="Telefone" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={telefone} onChange={e => setTelefone(e.target.value)} required />
        <input type="email" placeholder="E-mail" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={email} onChange={e => setEmail(e.target.value)} required />
        <div className="relative">
          <input type={showPassword ? "text" : "password"} placeholder="Senha" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs pr-7" value={password} onChange={e => setPassword(e.target.value)} required />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1.5 text-[#A0A0B0]">{showPassword ? <EyeOff size={12} /> : <Eye size={12} />}</button>
        </div>
        {tipo === 'motorista' && <input placeholder="Placa" className="w-full p-1.5 rounded-lg bg-white/5 border border-white/10 text-white text-xs" value={placa} onChange={e => setPlaca(e.target.value)} required />}
        <button type="submit" disabled={loading} className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-xs">{loading ? 'Cadastrando...' : 'Cadastrar'}</button>
      </form>
    </div>
  );
}