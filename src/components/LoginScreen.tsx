import { useState } from 'react';
import { Car, Mail, Lock, UserPlus, ArrowRight, Eye, EyeOff, Chrome, Sparkles, Shield, Star, Zap } from 'lucide-react';

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
  const [isFocused, setIsFocused] = useState({ email: false, password: false });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] via-[#120E1F] to-[#1A1528] flex items-center justify-center">
      <div className="max-w-md w-full mx-4">
        
        <div className="text-center mb-8 animate-fade-in-down">
          <div className="relative inline-block">
            <div className="absolute inset-0 bg-[#F4D03F]/30 rounded-full blur-xl animate-pulse"></div>
            <div className="relative w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-[#F4D03F]/30 to-[#8B5CF6]/20 flex items-center justify-center border-2 border-[#F4D03F]/50 shadow-2xl animate-bounce-slow">
              <Car className="w-12 h-12 text-[#F4D03F]" />
            </div>
          </div>
          <h1 className="text-3xl font-black mt-4 bg-gradient-to-r from-white via-[#F4D03F] to-white bg-clip-text text-transparent">
            OBALEVA
          </h1>
          <p className="text-[#A0A0B0] text-sm mt-1 flex items-center justify-center gap-1">
            <Sparkles size={14} className="text-[#F4D03F]" />
            Sua corrida de confiança
            <Sparkles size={14} className="text-[#F4D03F]" />
          </p>
        </div>

        <div className="bg-gradient-to-br from-[#1A1528]/90 to-[#1A1528]/70 backdrop-blur-xl rounded-3xl p-6 border border-[#F4D03F]/20 shadow-2xl animate-fade-in-up">
          <div className="text-center mb-6">
            <h2 className="text-xl font-bold text-white">Bem-vindo de volta!</h2>
            <p className="text-[#A0A0B0] text-sm mt-1">Faça login para continuar</p>
          </div>

          <div className="space-y-4">
            <button 
              onClick={onGoogleLogin} 
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-white/10 to-white/5 border border-white/15 text-white flex items-center justify-center gap-3 font-medium transition-all duration-300 hover:scale-[1.02] hover:border-[#F4D03F]/50 hover:shadow-lg group"
            >
              <Chrome size={20} className="group-hover:scale-110 transition" />
              <span>Continuar com Google</span>
            </button>

            <div className="relative my-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative flex justify-center">
                <span className="bg-gradient-to-r from-transparent via-[#1A1528] to-transparent px-3 text-xs text-[#A0A0B0]">ou</span>
              </div>
            </div>

            <form onSubmit={onEmailLogin} className="space-y-3">
              <div className={`relative transition-all duration-300 ${isFocused.email ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Mail size={18} className={`transition-colors ${isFocused.email ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`} />
                </div>
                <input 
                  type="email" 
                  placeholder="Seu e-mail"
                  className="w-full py-3.5 pl-12 pr-4 rounded-xl bg-white/10 border-2 transition-all duration-300 focus:outline-none text-white placeholder:text-[#A0A0B0]"
                  style={{ borderColor: isFocused.email ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                  value={loginEmail} 
                  onFocus={() => setIsFocused({ ...isFocused, email: true })}
                  onBlur={() => setIsFocused({ ...isFocused, email: false })}
                  onChange={e => setLoginEmail(e.target.value)} 
                  required 
                />
              </div>

              <div className={`relative transition-all duration-300 ${isFocused.password ? 'transform scale-[1.02]' : ''}`}>
                <div className="absolute left-4 top-1/2 -translate-y-1/2">
                  <Lock size={18} className={`transition-colors ${isFocused.password ? 'text-[#F4D03F]' : 'text-[#A0A0B0]'}`} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Sua senha"
                  className="w-full py-3.5 pl-12 pr-12 rounded-xl bg-white/10 border-2 transition-all duration-300 focus:outline-none text-white placeholder:text-[#A0A0B0]"
                  style={{ borderColor: isFocused.password ? '#F4D03F' : 'rgba(255,255,255,0.1)' }}
                  value={loginPassword} 
                  onFocus={() => setIsFocused({ ...isFocused, password: true })}
                  onBlur={() => setIsFocused({ ...isFocused, password: false })}
                  onChange={e => setLoginPassword(e.target.value)} 
                  required 
                />
                <button 
                  type="button" 
                  onClick={() => setShowPassword(!showPassword)} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A0A0B0] hover:text-[#F4D03F] transition"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>

              <button 
                type="submit" 
                disabled={loginLoading} 
                className="w-full py-3.5 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-xl flex items-center justify-center gap-2 group"
              >
                {loginLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1A1528] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    Entrar
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition" />
                  </>
                )}
              </button>
            </form>

            <div className="text-center pt-2">
              <p className="text-[#A0A0B0] text-sm">
                Não tem uma conta?{' '}
                <button 
                  onClick={onSignUpClick}
                  className="text-[#F4D03F] font-bold hover:underline transition-all flex items-center gap-1 inline-flex group"
                >
                  Criar conta grátis
                  <UserPlus size={14} className="group-hover:scale-110 transition" />
                </button>
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-4 pt-3 border-t border-white/10">
              <div className="flex items-center gap-1">
                <Shield size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Seguro total</span>
              </div>
              <div className="flex items-center gap-1">
                <Star size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Motoristas top</span>
              </div>
              <div className="flex items-center gap-1">
                <Zap size={12} className="text-[#F4D03F]" />
                <span className="text-[10px] text-[#A0A0B0]">Chegada rápida</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}