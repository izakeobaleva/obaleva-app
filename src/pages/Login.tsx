import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { GoogleMap, useLoadScript } from '@react-google-maps/api';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

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
    <div className="relative h-screen w-full overflow-hidden">
      
      {/* MAPA REAL DO GOOGLE - TELA INTEIRA */}
      <div className="absolute inset-0 w-full h-full">
        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={{ lat: -23.5505, lng: -46.6333 }}
            zoom={14}
            options={{
              disableDefaultUI: true,
              zoomControl: false,
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: false,
            }}
          />
        ) : (
          <div className="w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="text-center">
              <div className="w-8 h-8 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
              <p className="text-gray-400">Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>
      
      {/* ESCUREÇO O FUNDO */}
      <div className="absolute inset-0 bg-black/60" />
      
      {/* CONTAINER CENTRALIZADO */}
      <div className="absolute inset-0 flex flex-col items-center justify-center p-5">
        <div className="bg-[#1a1a1a] rounded-3xl p-6 w-full max-w-[320px] border border-gray-700 shadow-2xl">
          
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
              className="w-full py-3 bg-yellow-500 text-black font-bold rounded-xl flex items-center justify-center gap-2 hover:bg-yellow-400 transition"
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
            className="w-full py-3 bg-[#2a2a2a] border border-gray-700 rounded-xl text-white font-medium flex items-center justify-center gap-2 hover:bg-[#333] transition"
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
        
        {/* RODAPÉ */}
        <p className="text-gray-600 text-xs mt-4">obaleva.com.br/login</p>
      </div>
    </div>
  );
}