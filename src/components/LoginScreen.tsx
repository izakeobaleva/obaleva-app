import { useState } from 'react';
import { Car, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff, Shield, Star, Zap } from 'lucide-react';

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

export function LoginScreen({ onGoogleLogin, onEmailLogin, loginEmail, setLoginEmail, loginPassword, setLoginPassword, loginLoading, onSignUpClick }: LoginScreenProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#120E1F] to-[#1A1528] flex items-center justify-center pb-32">
      <div className="max-w-md w-full mx-4">
        
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F4D03F]/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-2xl">
              <Car className="w-12 h-12 text-[#F4D03F]" />
            </div>
          </div>
          <h1 className="text-3xl font-black mt-4 bg-gradient-to-r from-white via-[#F4D03F] to-white bg-clip-text text-transparent">
            OBALEVA
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        {/* Card de Login */}
        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta!</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
          </div>

          <div className="space-y-4">
            {/* Botão Google */}
            <button 
              onClick={onGoogleLogin} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/15 text-white flex items-center justify-center gap-3 font-medium transition-all hover:scale-[1.02] group"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
                <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
                <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
              </svg>
              <span>Continuar com Google</span>
            </button>

            {/* Divisor */}
            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
              <div className="relative flex justify-center"><span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span></div>
            </div>

            {/* Formulário */}
            <form onSubmit={onEmailLogin} className="space-y-3">
              <input 
                type="email" 
                placeholder="Seu e-mail"
                className="w-full py-3.5 px-4 rounded-xl bg-white/10 border-2 border-white/10 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition-all outline-none"
                value={loginEmail} 
                onChange={e => setLoginEmail(e.target.value)} 
                required 
              />

              <div className="relative">
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Sua senha"
                  className="w-full py-3.5 px-4 rounded-xl bg-white/10 border-2 border-white/10 text-white placeholder:text-[#A0A0B0] focus:border-[#F4D03F] transition-all outline-none pr-12"
                  value={loginPassword} 
                  onChange={e => setLoginPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loginLoading} 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base transition-all hover:scale-[1.02]"
              >
                {loginLoading ? 'Entrando...' : 'Entrar'}
              </button>
            </form>

            {/* ============================================ */}
            {/* BOTÃO CRIAR CONTA - VERSÃO DESTACADA */}
            {/* ============================================ */}
            <div className="mt-4 pt-3 border-t border-white/10">
              <p className="text-center text-[#A0A0B0] text-sm mb-2">
                Ainda não tem uma conta?
              </p>
              <button 
                onClick={onSignUpClick}
                className="w-full py-3 rounded-xl border-2 border-[#F4D03F]/40 bg-[#F4D03F]/10 text-[#F4D03F] font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:bg-[#F4D03F]/20 flex items-center justify-center gap-2"
              >
                <UserPlus size={18} />
                Criar minha conta grátis
                <ArrowRight size={16} />
              </button>
            </div>

            {/* Benefícios */}
            <div className="flex justify-center gap-4 mt-3 pt-2 border-t border-white/10">
              <div className="flex items-center gap-1"><Shield size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Seguro total</span></div>
              <div className="flex items-center gap-1"><Star size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Motoristas top</span></div>
              <div className="flex items-center gap-1"><Zap size={12} className="text-[#F4D03F]" /><span className="text-[10px] text-[#A0A0B0]">Chegada rápida</span></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}