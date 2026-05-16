import { useState } from 'react';
import { Car, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  onGoogleLogin: () => void;
  onEmailLogin: (e: React.FormEvent) => Promise<void>;
  loginEmail: string;
  setLoginEmail: (value: string) => void;
  loginPassword: string;
  setLoginPassword: (value: string) => void;
  loginLoading: boolean;
}

export function LoginForm({
  onGoogleLogin,
  onEmailLogin,
  loginEmail,
  setLoginEmail,
  loginPassword,
  setLoginPassword,
  loginLoading,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15 mt-2">
      <div className="text-center mb-2">
        <div className="w-10 h-10 mx-auto mb-1 rounded-full bg-gradient-to-br from-[#F4D03F]/20 to-[#8B5CF6]/20 flex items-center justify-center">
          <Car className="text-[#F4D03F] w-5 h-5" />
        </div>
        <h2 className="text-sm font-bold text-white">Bem-vindo</h2>
        <p className="text-[#A0A0B0] text-[10px]">Faça login para solicitar</p>
      </div>
      
      <div className="space-y-2">
        <button onClick={onGoogleLogin} className="w-full py-1.5 rounded-lg border border-[#F4D03F]/30 bg-white/5 text-white flex items-center justify-center gap-2 text-xs">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
            <path fill="#EA4335" d="M5.26620003,9.76452941 C6.19878754,6.93863203 8.85444915,4.90909091 12,4.90909091 C13.6909091,4.90909091 15.2181818,5.50909091 16.4181818,6.49090909 L19.9090909,3 C17.7818182,1.14545455 15.0181818,0 12,0 C7.27090909,0 3.19745455,2.69832759 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#34A853" d="M5.26620003,9.76452941 C4.45454545,10.7909091 4,12 4,13.1818182 C4,14.3636364 4.45454545,15.5727273 5.26620003,16.5990909 L1.23990909,19.713292 C0.439909091,18.0145909 0,16.0909091 0,13.1818182 C0,10.2727273 0.439909091,8.34904545 1.23990909,6.65032759 L5.26620003,9.76452941 Z"/>
            <path fill="#FBBC05" d="M12,22.3636364 C15.0181818,22.3636364 17.7818182,21.2181818 19.9090909,19.3636364 L16.4181818,15.8727273 C15.2181818,16.8545455 13.6909091,17.4545455 12,17.4545455 C8.85444915,17.4545455 6.19878754,15.425004 5.26620003,12.5981066 L1.23990909,15.7123077 C3.19745455,19.6634077 7.27090909,22.3636364 12,22.3636364 Z"/>
            <path fill="#4285F4" d="M19.9090909,19.3636364 L16.4181818,15.8727273 C17.7818182,14.8909091 19.0909091,13.3636364 19.0909091,11.5454545 L12,11.5454545 L12,14.7272727 L18.1818182,14.7272727 C18.1818182,15.3636364 17.7818182,16.0909091 17.0909091,16.7272727 L19.9090909,19.3636364 Z"/>
          </svg>
          Google
        </button>
        
        <div className="relative">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-white/10"></div></div>
          <div className="relative flex justify-center text-[9px]"><span className="bg-[#1A1528] px-2 text-[#A0A0B0]">ou</span></div>
        </div>

        <form onSubmit={onEmailLogin} className="space-y-1.5">
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="text-xs">📧</span>
              <input type="email" placeholder="E-mail" className="flex-1 bg-transparent text-white outline-none text-xs" value={loginEmail} onChange={e => setLoginEmail(e.target.value)} required />
            </div>
          </div>
          
          <div className="bg-white/5 rounded-lg border border-white/10">
            <div className="flex items-center gap-2 px-2 py-1.5">
              <span className="text-xs">🔒</span>
              <input type={showPassword ? "text" : "password"} placeholder="Senha" className="flex-1 bg-transparent text-white outline-none text-xs" value={loginPassword} onChange={e => setLoginPassword(e.target.value)} required />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#A0A0B0]">{showPassword ? <EyeOff size={12} /> : <Eye size={12} />}</button>
            </div>
          </div>
          
          <button type="submit" disabled={loginLoading} className="w-full py-1.5 rounded-lg bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-[#1A1528] font-bold text-xs">
            {loginLoading ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
      </div>
    </div>
  );
}