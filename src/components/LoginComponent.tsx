import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';
import { Eye, EyeOff, Loader } from 'lucide-react';

export function LoginComponent({ onSuccess }: { onSuccess?: () => void }) {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Preencha todos os campos');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado!');
      if (onSuccess) onSuccess();
      else navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
      if (error) throw error;
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login com Google');
    }
  };

  return (
    <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8 w-full max-w-sm">
      <div className="text-center mb-6">
        <div className="w-16 h-16 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
          <span className="text-3xl">🚕</span>
        </div>
        <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
        <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="flex items-center gap-2 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3 focus-within:ring-2 focus-within:ring-[#F4D03F]">
          <span className="text-lg">📧</span>
          <input
            type="email"
            placeholder="seu@email.com"
            className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>

        <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 focus-within:ring-2 focus-within:ring-[#F4D03F]">
          <span className="text-lg mr-2">🔒</span>
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            className="flex-1 py-3 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition">
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {loading ? <><Loader size={16} className="animate-spin" /> Entrando...</> : '🔐 Entrar'}
        </button>
      </form>

      <div className="my-4 flex items-center gap-3">
        <div className="flex-1 h-px bg-white/10" />
        <span className="text-xs text-[#A0A0B0]">ou</span>
        <div className="flex-1 h-px bg-white/10" />
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full py-3 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-sm"
      >
        <span className="text-xl">🔵</span>
        Continuar com Google
      </button>

      <div className="mt-6 text-center text-sm text-[#A0A0B0] space-y-2">
        <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline block w-full font-medium">
          Criar conta
        </button>
        <button onClick={() => navigate('/forgot-password')} className="text-[#A0A0B0] hover:text-white block w-full">
          Esqueci minha senha
        </button>
      </div>
    </div>
  );
}