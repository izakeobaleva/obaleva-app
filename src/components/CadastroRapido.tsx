import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, EyeOff } from 'lucide-react';

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
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data: auth, error } = await supabase.auth.signUp({ 
        email, 
        password, 
        options: { data: { nome_completo: nome, tipo } } 
      });
      if (error) throw error;
      if (!auth.user) throw new Error('Erro ao criar usuário');
      
      await supabase.from('usuarios').insert({ 
        id: auth.user.id, 
        nome_completo: nome, 
        cpf, 
        telefone, 
        email, 
        tipo 
      });
      
      if (tipo === 'passageiro') {
        await supabase.from('passageiros').insert({ id: auth.user.id });
      } else {
        await supabase.from('motoristas').insert({ 
          id: auth.user.id, 
          status: 'pendente', 
          dados_veiculo: { placa, modelo: 'Não informado', ano: '2024', cor: 'Não informado' } 
        });
      }
      
      toast.success('Cadastro realizado! Faça login.');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#1A1528] to-[#1A1528] rounded-2xl p-5 border border-[#F4D03F]/20">
      <h2 className="text-white font-bold text-lg mb-4">Cadastro {tipo === 'passageiro' ? 'Passageiro' : 'Motorista'}</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <InputField emoji="👤" placeholder="Nome completo" value={nome} onChange={setNome} />
        <InputField emoji="🆔" placeholder="CPF" value={cpf} onChange={setCpf} />
        <InputField emoji="📱" placeholder="Telefone" value={telefone} onChange={setTelefone} />
        <InputField emoji="📧" placeholder="E-mail" type="email" value={email} onChange={setEmail} />
        <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
          <div className="flex items-center gap-3 px-4 py-3">
            <span className="text-[#A0A0B0] text-lg">🔒</span>
            <input type={showPassword ? "text" : "password"} placeholder="Senha" className="flex-1 bg-transparent text-white outline-none text-sm" value={password} onChange={e => setPassword(e.target.value)} required />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-[#F4D03F] transition">
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
        </div>
        {tipo === 'motorista' && (
          <InputField emoji="🚗" placeholder="Placa" value={placa} onChange={setPlaca} />
        )}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold transition-all duration-200">
          {loading ? 'Cadastrando...' : 'Cadastrar'}
        </button>
      </form>
    </div>
  );
}

const InputField = ({ emoji, placeholder, type = 'text', value, onChange }: any) => (
  <div className="bg-white/5 rounded-xl border border-white/10 overflow-hidden">
    <div className="flex items-center gap-3 px-4 py-3">
      <span className="text-[#A0A0B0] text-lg">{emoji}</span>
      <input type={type} placeholder={placeholder} className="flex-1 bg-transparent text-white outline-none text-sm" value={value} onChange={e => onChange(e.target.value)} required />
    </div>
  </div>
);