import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  return (
    <div className="w-full h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-100px] right-[-100px] w-[300px] h-[300px] bg-[#F4D03F]/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-[-50px] left-[-50px] w-[250px] h-[250px] bg-[#6B2D8C]/20 rounded-full blur-[100px]" />
      </div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="relative z-10 w-full">
        <div className="bg-[#1A1528] rounded-3xl border border-white/10 shadow-xl p-8 max-w-[95%] w-[480px] mx-auto">
          <div className="text-center mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
              <span className="text-4xl">🚕</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
          </div>

          <div className="space-y-4">
            <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] text-base" />
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} placeholder="Senha" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-[#0F0B1A] border border-white/10 rounded-2xl px-5 py-4 text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-[#F4D03F] pr-12 text-base" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-white transition">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            <button onClick={() => navigate('/home')} className="w-full py-4 rounded-2xl font-bold bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1E1E2F] hover:shadow-lg transition-all text-base">
              🔐 Entrar
            </button>
            <div className="flex items-center gap-3 my-2">
              <div className="flex-1 h-px bg-white/10" />
              <span className="text-xs text-[#A0A0B0]">ou</span>
              <div className="flex-1 h-px bg-white/10" />
            </div>
            <button className="w-full py-4 rounded-2xl font-bold border border-white/20 text-white hover:bg-white/5 transition-all flex items-center justify-center gap-2 text-base">
              <svg viewBox="0 0 48 48" className="w-5 h-5">
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                <path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"/>
                <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
              </svg>
              Entrar com Google
            </button>
            <div className="mt-4 text-center space-y-3">
              <button onClick={() => navigate('/register')} className="text-[#F4D03F] hover:underline font-medium block w-full">Criar Conta Gratuita</button>
              <button onClick={() => navigate('/forgot-password')} className="text-[#A0A0B0] hover:text-white block w-full text-sm">Esqueci minha senha</button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}