import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import RealMap from '../components/RealMap';

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* MAPA NO FUNDO */}
      <div className="absolute inset-0 w-full h-full">
        <RealMap zoom={14} />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CONTAINER CENTRALIZADO */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
        <div className="bg-[#1a1a2e] rounded-3xl p-6 w-full max-w-[320px] border border-purple-500/30 shadow-2xl">
          
          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-yellow-500 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <span className="text-3xl">🚗</span>
            </div>
            <h1 className="text-2xl font-bold text-white">ObaLeva</h1>
            <p className="text-gray-500 text-xs mt-1">Sua corrida, do seu jeito</p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a3e] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a3e] border border-purple-500/30 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
            >
              <span>🔒</span> Entrar
            </button>
          </form>

          {/* DIVISOR */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-500/30"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a2e] text-gray-500">ou</span>
            </div>
          </div>

          {/* BOTÃO GOOGLE COM LOGO - VERMELHO */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-red-600 border border-red-500/30 rounded-xl text-white font-medium flex items-center justify-center gap-3 hover:bg-red-700 transition"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            </svg>
            <span>Entrar com Google</span>
          </button>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <p className="text-gray-400 text-sm">
              Não tem conta? <button className="text-yellow-500 font-medium">Cadastre-se</button>
            </p>
            <button className="text-gray-600 text-xs mt-2 hover:text-gray-500 transition">
              Esqueci minha senha
            </button>
          </div>
        </div>
        
        {/* RODAPÉ */}
        <p className="text-gray-600 text-xs mt-4">obaleva.com.br/login</p>
      </div>
    </div>
  );
};

export default Login;