import React, { useState } from 'react';
import { Car, Shield, Star, Zap, Chrome, Eye, EyeOff } from 'lucide-react';

interface LoginScreenProps {
  onGoogleLogin: () => void;
  onEmailLogin: (e: React.FormEvent) => Promise<void>;
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  loginLoading: boolean;
  onSignUpClick: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onGoogleLogin,
  onEmailLogin,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginLoading,
  onSignUpClick,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4 border border-[#F4D03F]/30">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">OBALEVA</h1>
          <p className="text-gray-400 mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-white/10">
          <h2 className="text-xl font-bold text-white text-center mb-6">Bem-vindo de volta!</h2>
          
          <div className="space-y-4">
            <button 
              onClick={onGoogleLogin} 
              className="w-full py-3 rounded-xl border border-white/20 bg-white/5 text-white flex items-center justify-center gap-2 hover:bg-white/10 transition"
            >
              <Chrome size={20} /> Entrar com Google
            </button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-gray-400">ou</span></div>
            </div>

            <form onSubmit={onEmailLogin} className="space-y-3">
              <input 
                type="email" 
                placeholder="E-mail" 
                className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition" 
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                required 
              />
              
              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Senha" 
                  className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white placeholder:text-gray-500 focus:border-[#F4D03F] outline-none transition pr-12" 
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  required 
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-3 text-gray-400 hover:text-white transition">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loginLoading} 
                className="w-full py-3 rounded-xl bg-gradient-to-r from-[#FFD966] to-[#F4D03F] text-[#1A1528] font-bold transition-all hover:shadow-lg disabled:opacity-50"
              >
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            <div className="text-center pt-2">
              <button onClick={onSignUpClick} className="text-[#F4D03F] text-sm hover:underline font-medium">
                Criar nova conta
              </button>
            </div>

            <div className="flex justify-center gap-4 pt-4 border-t border-white/10">
              <div className="flex items-center gap-1"><Shield size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-gray-400">Seguro</span></div>
              <div className="flex items-center gap-1"><Star size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-gray-400">Qualidade</span></div>
              <div className="flex items-center gap-1"><Zap size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-gray-400">Rapidez</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};