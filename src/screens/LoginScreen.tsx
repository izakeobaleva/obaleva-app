import { useState } from 'react';
import { Car, Chrome } from 'lucide-react';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => Promise<{ error: boolean }>;
  onGoogleLogin: () => void;
  onSignUp: () => void;
}

export function LoginScreen({ onLogin, onGoogleLogin, onSignUp }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    setError('');
    setLoading(true);
    const result = await onLogin(email, password);
    if (result?.error) setError('E-mail ou senha inválidos');
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0F0B1A] to-[#1A1528] flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="w-20 h-20 mx-auto rounded-full bg-[#F4D03F]/20 flex items-center justify-center mb-4">
            <Car size={40} className="text-[#F4D03F]" />
          </div>
          <h1 className="text-3xl font-bold text-white">ObaLeva</h1>
          <p className="text-[#A0A0B0] text-sm mt-1">Sua corrida de confiança</p>
        </div>

        <div className="bg-[#1A1528] rounded-2xl p-6 border border-[#F4D03F]/20">
          {error && (
            <div className="mb-3 p-2 text-center text-sm text-red-400 bg-red-500/10 rounded">
              {error}
            </div>
          )}

          <button
            onClick={onGoogleLogin}
            className="w-full py-3 rounded-xl border border-[#F4D03F]/30 bg-white/10 text-white flex items-center justify-center gap-2"
          >
            <Chrome size={20} /> Entrar com Google
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-white/10" />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-[#1A1528] px-3 text-xs text-[#A0A0B0]">ou</span>
            </div>
          </div>

          <input
            type="email"
            placeholder="E-mail"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-3"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Senha"
            className="w-full p-3 rounded-xl bg-white/10 border border-white/15 text-white mb-4"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className="w-full py-3 rounded-xl bg-[#F4D03F] text-black font-bold"
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </button>

          <button onClick={onSignUp} className="w-full mt-3 text-[#F4D03F] text-sm">
            Criar conta
          </button>
        </div>
      </div>
    </div>
  );
}