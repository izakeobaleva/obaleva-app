import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Car, Mail, Lock, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { toast } from 'sonner';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) { toast.error('Preencha todos os campos'); return; }
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast.success('Login realizado!');
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
    <div className="h-screen w-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-80px] left-[-80px] w-[300px] h-[300px] bg-yellow-400/5 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] right-[-50px] w-[250px] h-[250px] bg-purple-600/10 rounded-full blur-[80px]" />
      </div>

      <div className="text-center mb-8 relative z-10">
        <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl shadow-yellow-400/20">
          <Car className="w-10 h-10 text-gray-900" />
        </div>
        <h1 className="text-3xl font-bold text-yellow-400">ObaLeva</h1>
        <p className="text-gray-400 text-sm mt-1">Sua corrida, do seu jeito</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 relative z-10">
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type="email"
            placeholder="E-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-gray-800/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
          />
        </div>
        
        <div className="relative">
          <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500" />
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder="Senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full pl-12 pr-12 py-3.5 bg-gray-800/80 border border-gray-700 rounded-2xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400 focus:ring-2 focus:ring-yellow-400/20 transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300"
          >
            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3.5 bg-yellow-400 text-gray-900 font-bold rounded-2xl text-lg hover:bg-yellow-300 transition-all disabled:opacity-50 shadow-lg shadow-yellow-400/20"
        >
          {loading ? 'Entrando...' : 'Entrar'}
        </button>
      </form>

      <div className="relative w-full max-w-sm my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-700"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-3 bg-gray-900 text-gray-500">ou</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm py-3.5 bg-gray-800/80 border border-gray-700 rounded-2xl text-white font-medium hover:bg-gray-700 transition-all flex items-center justify-center gap-3"
      >
        <svg viewBox="0 0 24 24" className="w-5 h-5">
          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
        </svg>
        Entrar com Google
      </button>

      <div className="mt-6 text-center space-y-2">
        <button onClick={() => navigate('/register')} className="text-yellow-400 font-medium hover:underline">
          Criar conta gratuita
        </button>
        <br />
        <button className="text-gray-500 text-xs hover:text-gray-400 transition">
          Esqueci minha senha
        </button>
      </div>

      <p className="text-gray-600 text-xs mt-8">ObaLeva — Mobilidade Premium</p>
    </div>
  );
};

export default Login;