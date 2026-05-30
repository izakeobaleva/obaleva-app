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
    navigate('/home');
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/home');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA AO VIVO - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CARD CENTRAL */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-6">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[320px] border border-gray-800">
          
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
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500"
            />

            <button
              type="submit"
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2"
            >
              <span>🔒</span> Entrar
            </button>
          </form>

          {/* DIVISOR */}
          <div className="relative my-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-700"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-[#1a1a1a] text-gray-500">ou</span>
            </div>
          </div>

          {/* GOOGLE LOGIN */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2"
          >
            <span>🔗</span> Entrar com Google
          </button>

          {/* LINKS */}
          <div className="mt-5 text-center">
            <p className="text-gray-400 text-sm">
              Não tem conta? <button className="text-yellow-500 font-medium">Cadastre-se</button>
            </p>
            <button className="text-gray-600 text-xs mt-2">Esqueci minha senha</button>
          </div>
        </div>
        
        {/* RODAPÉ FORA DO CARD */}
        <p className="text-gray-600 text-xs mt-4">obaleva.com.br/login</p>
      </div>
    </div>
  );
}