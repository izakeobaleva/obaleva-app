import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
    <div className="h-screen w-full bg-black flex flex-col items-center justify-center p-5">
      
      <div className="text-center mb-8">
        <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-3">
          <span className="text-4xl">🚗</span>
        </div>
        <h1 className="text-3xl font-bold text-white">ObaLeva</h1>
        <p className="text-gray-500 text-sm mt-1">Sua corrida, do seu jeito</p>
      </div>

      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4">
        <input
          type="email"
          placeholder="E-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />
        
        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-gray-900 border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-yellow-400"
        />

        <button
          type="submit"
          className="w-full py-3 bg-yellow-400 text-black font-bold rounded-xl flex items-center justify-center gap-2"
        >
          <span>🔒</span> Entrar
        </button>
      </form>

      <div className="relative w-full max-w-sm my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-800"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-black text-gray-500">ou</span>
        </div>
      </div>

      <button
        onClick={handleGoogleLogin}
        className="w-full max-w-sm py-3 bg-gray-900 border border-gray-800 rounded-xl text-white font-medium flex items-center justify-center gap-2"
      >
        <span>🔗</span> Entrar com Google
      </button>

      <div className="mt-6 text-center">
        <p className="text-gray-400 text-sm">
          Não tem conta? <button className="text-yellow-400 font-medium">Cadastre-se</button>
        </p>
        <button className="text-gray-600 text-xs mt-2">Esqueci minha senha</button>
      </div>

      <p className="text-gray-700 text-xs mt-8">obaleva.com.br/login</p>
    </div>
  );
};

export default Login;