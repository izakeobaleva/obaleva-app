import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Loader } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { toast.error('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('✅ Login realizado!');
      navigate('/');
    } catch (err: any) {
      toast.error(err.message || 'Erro ao fazer login');
    }
    setLoading(false);
  };

  const handleGoogleLogin = async () => {
    try {
      await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[400px] h-[400px] bg-[#F4D03F]/5 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[300px] h-[300px] bg-purple-700/10 rounded-full blur-[100px]" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 w-full max-w-sm"
      >
        <div className="bg-[#1A1528]/95 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 mx-auto mb-5 bg-gradient-to-br from-[#FFD966] to-[#F4D03F] rounded-2xl flex items-center justify-center shadow-xl shadow-[#F4D03F]/20">
              <span className="text-4xl">🚕</span>
            </div>
            <h1 className="text-2xl font-bold text-white" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif", letterSpacing: '-0.03em' }}>ObaLeva</h1>
            <p className="text-sm text-[#A0A0B0] mt-1">Faça login para continuar</p>
          </div>

          {/* Form */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F] focus-within:border-transparent transition-all">
              <Mail size={18} className="text-[#F4D03F] shrink-0" />
              <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              />
            </div>

            <div className="flex items-center bg-[#0F0B1A] border border-white/10 rounded-2xl px-4 py-3.5 focus-within:ring-2 focus-within:ring-[#F4D03F] transition-all">
              <Lock size={18} className="text-[#F4D03F] shrink-0 mr-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="flex-1 bg-transparent text-white placeholder-white/30 focus:outline-none text-sm"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0] hover:text-white transition shrink-0">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleLogin}
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2"
            >
              {loading ? <><Loader size={16} className="animate-spin" /> Entrando...</> : '🔐 Entrar'}
            </motion.button>

            <div className="flex items-center gap-4 my-6">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#A0A0B0]">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <motion.button
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              className="btn-outline w-full flex items-center justify-center gap-3"
            >
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Continuar com Google
            </motion.button>

            <div className="pt-4 space-y-3 text-center">
              <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium block w-full text-sm">
                Criar Conta Gratuita
              </button>
              <button onClick={() => navigate('/forgot-password')} className="text-[#A0A0B0] hover:text-white block w-full text-xs">
                Esqueci minha senha
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}