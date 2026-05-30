"use client";

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA NO FUNDO */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      
      {/* CONTAINER CENTRAL */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#1a0a2e] rounded-3xl p-6 w-full max-w-[340px] border-2 border-yellow-500/80 shadow-2xl shadow-yellow-500/10">
          
          {/* LOGO */}
          <div className="text-center mb-6">
            <div className="text-5xl mb-2">🚗</div>
            <h1 className="text-3xl font-bold text-yellow-400">ObaLeva</h1>
            <p className="text-gray-300 text-xs mt-1">Sua corrida, do seu jeito</p>
          </div>

          {/* FORMULÁRIO */}
          <form onSubmit={handleLogin} className="space-y-3">
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-700/60 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-purple-900/30 border border-purple-700/60 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-yellow-500 focus:ring-1 focus:ring-yellow-500/50"
            />

            {/* BOTÃO VERDE */}
            <button
              type="submit"
              className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98]"
            >
              <span>🔒</span> ENTRAR
            </button>
          </form>

          {/* DIVISOR */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-purple-700/50"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a0a2e] text-gray-400">ou</span>
            </div>
          </div>

          {/* BOTÃO VERMELHO - GOOGLE */}
          <button
            onClick={() => {
              localStorage.setItem('isLoggedIn', 'true');
              navigate('/');
            }}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 mb-4 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
          >
            <span>🔗</span> ENTRAR COM GOOGLE
          </button>

          {/* LINKS */}
          <div className="text-center">
            <p className="text-gray-300 text-sm">
              Não tem conta?{' '}
              <button className="text-yellow-400 font-medium hover:underline">Cadastre-se</button>
            </p>
            <button className="text-gray-500 text-xs mt-2 hover:text-gray-300">Esqueci minha senha</button>
          </div>

          {/* BOTÃO VINHO */}
          <button
            onClick={() => navigate('/')}
            className="w-full mt-4 py-3 bg-[#800020] hover:bg-[#a00030] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#800020]/20 active:scale-[0.98]"
          >
            <span>⏰</span> AGORA NÃO
          </button>
        </div>
      </div>
    </div>
  );
}