"use client";

import { useNavigate } from 'react-router-dom';
import { MapBackground } from '../components/MapBackground';

export default function PermissionLocation() {
  const navigate = useNavigate();

  const handleAllowLocation = () => {
    navigator.geolocation.getCurrentPosition(
      () => navigate('/permission-notification'),
      () => navigate('/permission-notification')
    );
  };

  const handleAllowNotifications = () => {
    if ('Notification' in window) Notification.requestPermission();
    navigate('/login');
  };

  const handleEmailLogin = () => {
    navigate('/login');
  };

  const handleGoogleLogin = () => {
    localStorage.setItem('isLoggedIn', 'true');
    navigate('/');
  };

  const handleLater = () => {
    navigate('/');
  };

  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      
      {/* MAPA NO FUNDO - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        <MapBackground zoom={14} center={{ lat: -23.5505, lng: -46.6333 }} />
      </div>
      
      {/* ESCUREÇO O FUNDO PARA DESTACAR O CONTAINER */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/50 to-black/70" />
      
      {/* CONTAINER CENTRAL - CORES VIVAS */}
      <div className="absolute inset-0 flex items-center justify-center p-4">
        <div className="bg-[#1a0a2e] rounded-3xl p-6 w-full max-w-[340px] border-2 border-yellow-500/80 shadow-2xl shadow-yellow-500/10">
          
          {/* LOGO */}
          <div className="text-center mb-4">
            <div className="text-5xl mb-2">🚗</div>
            <h1 className="text-3xl font-bold text-yellow-400" style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}>ObaLeva</h1>
            <p className="text-gray-300 text-xs mt-1">Sua corrida, do seu jeito</p>
          </div>

          {/* TEXTO DE DESCRIÇÃO */}
          <p className="text-white text-sm text-center mb-6 leading-relaxed">
            Para o app funcionar bem, precisamos saber onde você está para encontrar motoristas perto de você.
          </p>

          {/* BOTÃO ROXO - PERMITIR LOCALIZAÇÃO */}
          <button
            onClick={handleAllowLocation}
            className="w-full py-3.5 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-xl mb-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-600/20 active:scale-[0.98]"
          >
            <span>📍</span> PERMITIR LOCALIZAÇÃO
          </button>

          {/* BOTÃO AMARELO - PERMITIR NOTIFICAÇÕES */}
          <button
            onClick={handleAllowNotifications}
            className="w-full py-3.5 bg-yellow-500 hover:bg-yellow-400 text-black font-bold rounded-xl mb-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-yellow-500/20 active:scale-[0.98]"
          >
            <span>🔔</span> PERMITIR NOTIFICAÇÕES
          </button>

          {/* BOTÃO VERDE - ENTRAR COM EMAIL */}
          <button
            onClick={handleEmailLogin}
            className="w-full py-3.5 bg-green-600 hover:bg-green-500 text-white font-bold rounded-xl mb-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-green-600/20 active:scale-[0.98]"
          >
            <span>📧</span> ENTRAR COM EMAIL
          </button>

          {/* BOTÃO VERMELHO - ENTRAR COM GOOGLE */}
          <button
            onClick={handleGoogleLogin}
            className="w-full py-3.5 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl mb-3 flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/20 active:scale-[0.98]"
          >
            <span>🔗</span> ENTRAR COM GOOGLE
          </button>

          {/* BOTÃO VINHO - AGORA NÃO */}
          <button
            onClick={handleLater}
            className="w-full py-3.5 bg-[#800020] hover:bg-[#a00030] text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-[#800020]/20 active:scale-[0.98]"
          >
            <span>⏰</span> AGORA NÃO
          </button>

          {/* RODAPÉ */}
          <p className="text-center text-gray-500 text-[10px] mt-4">obaleva.com.br</p>
        </div>
      </div>
    </div>
  );
}