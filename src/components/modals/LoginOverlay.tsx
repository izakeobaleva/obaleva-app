import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginOverlay() {
  const navigate = useNavigate();

  return (
    <div className="relative w-full h-screen overflow-hidden flex items-center justify-center">
      
      {/* FUNDO ESCURO SÓLIDO (Substitui o mapa vazando) */}
      <div 
        className="absolute inset-0 z-0"
        style={{ 
          backgroundColor: '#1E1B4B', // Cor primária escura
        }}
      ></div>

      {/* CONTEÚDO CENTRALIZADO */}
      <div className="relative z-10 w-full max-w-sm mx-auto p-8 text-center">
        
        {/* Logo */}
        <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] rounded-3xl flex items-center justify-center shadow-2xl">
          <span className="text-5xl">🚕</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-2">ObaLeva</h1>
        <p className="text-[#C4B5FD] mb-8">Sua corrida, do seu jeito</p>

        {/* FORMULÁRIO */}
        <div className="space-y-4">
          <input
            type="email"
            placeholder="E-mail"
            className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl 
                       text-white placeholder-[#C4B5FD] outline-none focus:border-[#F59E0B] transition-all"
          />
          
          <div className="relative">
            <input
              type="password"
              placeholder="Senha"
              className="w-full px-4 py-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl 
                         text-white placeholder-[#C4B5FD] outline-none focus:border-[#F59E0B] transition-all pr-10"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[#C4B5FD] cursor-pointer">
              👁️
            </span>
          </div>

          <button 
            onClick={() => navigate('/home')}
            className="w-full h-14 bg-[#F59E0B] 
                       text-white font-bold text-lg rounded-2xl 
                       shadow-lg hover:shadow-xl 
                       active:scale-95 transition-all duration-200"
          >
            ENTRAR
          </button>

          <div className="flex items-center justify-center gap-4 my-4">
            <div className="h-px bg-white/20 flex-1"></div>
            <span className="text-white/50 text-sm">ou</span>
            <div className="h-px bg-white/20 flex-1"></div>
          </div>

          <button className="w-full h-14 bg-white/10 backdrop-blur-sm border border-white/20 
                             text-white font-bold rounded-2xl 
                             active:scale-95 transition-all flex items-center justify-center gap-3">
            <span className="text-xl">🔵</span>
            Entrar com Google
          </button>

          <p className="text-[#C4B5FD] text-sm mt-6">
            Não tem conta?{' '}
            <span className="text-[#F59E0B] font-bold cursor-pointer" onClick={() => navigate('/register')}>
              Cadastre-se
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}