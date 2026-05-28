import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const loginGratis = () => {
    navigate('/home');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full max-w-md">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-4xl">🚕</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
          </div>

          <div className="space-y-4">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F]"
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Senha"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-3.5 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              onClick={loginGratis}
              className="w-full py-3.5 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all"
            >
              🔐 Entrar
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#A0A0B0]">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>

            <button className="w-full py-3 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2">
              <span className="text-lg">🔵</span>
              Entrar com Google
            </button>

            <div className="mt-4 text-center space-y-2">
              <button
                onClick={() => navigate('/register')}
                className="text-[#F4D03F] hover:underline font-medium block w-full"
              >
                Criar Conta Gratuita
              </button>
              <button
                onClick={() => navigate('/forgot-password')}
                className="text-[#A0A0B0] hover:text-white block w-full text-sm"
              >
                Esqueci minha senha
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}