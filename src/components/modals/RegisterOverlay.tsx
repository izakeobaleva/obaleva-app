import { useState } from 'react';
import InputMask from 'react-input-mask';
import { supabase } from '../../lib/supabaseClient';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Loader, ArrowLeft, Eye, EyeOff } from 'lucide-react';

interface RegisterOverlayProps {
  onSuccess: () => void;
}

export default function RegisterOverlay({ onSuccess }: RegisterOverlayProps) {
  const [step, setStep] = useState<'cadastro' | 'dados'>('cadastro');
  const [form, setForm] = useState({
    nome: '',
    email: '',
    telefone: '',
    dataNascimento: '',
    senha: '',
    confirmSenha: '',
    tipo: 'passageiro' as 'passageiro' | 'motorista',
  });
  const [showSenha, setShowSenha] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!form.nome || !form.email || !form.telefone || !form.dataNascimento || !form.senha) {
      toast.error('Preencha todos os campos');
      return;
    }
    
    if (form.senha.length < 6) {
      toast.error('Senha deve ter no mínimo 6 caracteres');
      return;
    }
    
    if (form.senha !== form.confirmSenha) {
      toast.error('Senhas não conferem');
      return;
    }

    const telefoneLimpo = form.telefone.replace(/\D/g, '');
    if (telefoneLimpo.length < 10) {
      toast.error('Telefone inválido');
      return;
    }

    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: form.email,
        password: form.senha,
        options: {
          data: {
            nome_completo: form.nome,
            telefone: form.telefone,
            data_nascimento: form.dataNascimento,
            tipo: form.tipo
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        await supabase.from('usuarios').insert({
          id: authData.user.id,
          nome_completo: form.nome,
          email: form.email,
          telefone: form.telefone,
          data_nascimento: form.dataNascimento,
          tipo: form.tipo
        });

        if (form.tipo === 'passageiro') {
          await supabase.from('passageiros').insert({ id: authData.user.id });
        } else {
          await supabase.from('motoristas').insert({
            id: authData.user.id,
            status: 'pendente'
          });
        }
      }

      toast.success('Conta criada com sucesso!');
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || 'Erro ao criar conta');
    }
    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-md w-full mx-auto"
    >
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
          <span className="text-3xl">🚕</span>
        </div>
        <h2 className="text-2xl font-bold text-[#1E1B4B]">Criar Conta</h2>
        <p className="text-[#6B7280] text-sm mt-1">Preencha seus dados para começar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Tipo de conta */}
        <div className="flex gap-3 mb-4">
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, tipo: 'passageiro' }))}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              form.tipo === 'passageiro'
                ? 'bg-[#7C3AED] text-white shadow-lg'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            🚶 Passageiro
          </button>
          <button
            type="button"
            onClick={() => setForm(f => ({ ...f, tipo: 'motorista' }))}
            className={`flex-1 py-3 rounded-xl font-bold text-sm transition-all ${
              form.tipo === 'motorista'
                ? 'bg-[#7C3AED] text-white shadow-lg'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
            }`}
          >
            🚗 Motorista
          </button>
        </div>

        {/* Nome */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            👤 Nome Completo
          </label>
          <input
            type="text"
            placeholder="Seu nome completo"
            value={form.nome}
            onChange={e => setForm(f => ({ ...f, nome: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all placeholder:text-[#9CA3AF]"
            required
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            📧 Email
          </label>
          <input
            type="email"
            placeholder="seu@email.com"
            value={form.email}
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all placeholder:text-[#9CA3AF]"
            required
          />
        </div>

        {/* Telefone com máscara */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            📱 Telefone
          </label>
          <InputMask
            mask="(99) 99999-9999"
            maskChar=""
            value={form.telefone}
            onChange={e => setForm(f => ({ ...f, telefone: e.target.value }))}
          >
            <input
              type="tel"
              placeholder="(11) 99999-9999"
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all placeholder:text-[#9CA3AF]"
              required
            />
          </InputMask>
        </div>

        {/* Data de Nascimento */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            📅 Data de Nascimento
          </label>
          <input
            type="date"
            value={form.dataNascimento}
            onChange={e => setForm(f => ({ ...f, dataNascimento: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all"
            style={{ colorScheme: 'light' }}
            required
          />
        </div>

        {/* Senha */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            🔒 Senha
          </label>
          <div className="relative">
            <input
              type={showSenha ? 'text' : 'password'}
              placeholder="Mínimo 6 caracteres"
              value={form.senha}
              onChange={e => setForm(f => ({ ...f, senha: e.target.value }))}
              className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all placeholder:text-[#9CA3AF] pr-12"
              required
              minLength={6}
            />
            <button
              type="button"
              onClick={() => setShowSenha(!showSenha)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showSenha ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirmar Senha */}
        <div>
          <label className="block text-sm font-semibold text-[#1E1B4B] mb-1.5">
            🔁 Confirmar Senha
          </label>
          <input
            type="password"
            placeholder="Repita a senha"
            value={form.confirmSenha}
            onChange={e => setForm(f => ({ ...f, confirmSenha: e.target.value }))}
            className="w-full px-4 py-3 bg-white border-2 border-[#E5E7EB] rounded-xl text-[#1E1B4B] text-base outline-none focus:border-[#7C3AED] focus:shadow-[0_0_0_4px_rgba(124,58,237,0.15)] transition-all placeholder:text-[#9CA3AF]"
            required
            minLength={6}
          />
        </div>

        {/* Botão Cadastrar */}
        <motion.button
          whileTap={{ scale: 0.98 }}
          type="submit"
          disabled={loading}
          className="w-full py-3.5 rounded-xl font-bold bg-gradient-to-r from-[#7C3AED] to-[#5B21B6] text-white shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 flex items-center justify-center gap-2 text-base"
        >
          {loading ? (
            <><Loader size={20} className="animate-spin" /> Criando conta...</>
          ) : (
            '✅ Cadastrar'
          )}
        </motion.button>

        {/* Botão Google */}
        <button
          type="button"
          onClick={async () => {
            try {
              const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: { redirectTo: window.location.origin }
              });
              if (error) throw error;
            } catch (err: any) {
              toast.error(err.message || 'Erro ao fazer login com Google');
            }
          }}
          className="w-full py-3.5 rounded-xl font-bold border-2 border-[#E5E7EB] text-[#1E1B4B] hover:bg-gray-50 transition-all flex items-center justify-center gap-3 text-base"
        >
          <span className="text-xl">🔵</span>
          Cadastrar com Google
        </button>
      </form>
    </motion.div>
  );
}