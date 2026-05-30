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
    <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', overflow: 'hidden' }}>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}>
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
          <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div className="text-center">
              <div style={{ width: 32, height: 32, border: '4px solid #eab308', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 8px' }} />
              <p style={{ color: '#9ca3af' }}>Carregando mapa...</p>
            </div>
          </div>
        )}
      </div>
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: 'rgba(0,0,0,0.6)' }} />
      
      <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#1a1a1a', borderRadius: 24, padding: 24, width: '100%', maxWidth: 320, border: '1px solid #374151', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
          
          <div className="text-center" style={{ marginBottom: 24 }}>
            <div style={{ width: 64, height: 64, background: '#eab308', borderRadius: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px' }}>
              <span style={{ fontSize: 28 }}>🚗</span>
            </div>
            <h1 style={{ fontSize: 24, fontWeight: 'bold', color: '#fff' }}>ObaLeva</h1>
            <p style={{ color: '#6b7280', fontSize: 12, marginTop: 4 }}>Sua corrida, do seu jeito</p>
          </div>

          <form style={{ display: 'flex', flexDirection: 'column', gap: 12 }} onSubmit={handleLogin}>
            <input
              type="email"
              placeholder="E-mail"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: '#2a2a2a', border: '1px solid #374151', borderRadius: 12, color: '#fff', outline: 'none', fontSize: 14 }}
            />
            
            <input
              type="password"
              placeholder="Senha"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: '100%', padding: '12px 16px', background: '#2a2a2a', border: '1px solid #374151', borderRadius: 12, color: '#fff', outline: 'none', fontSize: 14 }}
            />

            <button
              type="submit"
              style={{ width: '100%', padding: '12px 0', background: '#eab308', color: '#000', fontWeight: 'bold', borderRadius: 12, fontSize: 16, border: 'none', cursor: 'pointer' }}
            >
              🔒 Entrar
            </button>
          </form>

          <div style={{ display: 'flex', alignItems: 'center', margin: '20px 0', gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: '#374151' }} />
            <span style={{ color: '#6b7280', fontSize: 14 }}>ou</span>
            <div style={{ flex: 1, height: 1, background: '#374151' }} />
          </div>

          <button
            onClick={handleGoogleLogin}
            style={{ width: '100%', padding: '12px 0', background: '#2a2a2a', border: '1px solid #374151', borderRadius: 12, color: '#fff', fontWeight: 500, cursor: 'pointer' }}
          >
            🔗 Entrar com Google
          </button>

          <div style={{ marginTop: 20, textAlign: 'center' }}>
            <p style={{ color: '#9ca3af', fontSize: 14 }}>
              Não tem conta? <button style={{ color: '#eab308', fontWeight: 500, background: 'none', border: 'none', cursor: 'pointer' }}>Cadastre-se</button>
            </p>
            <button style={{ color: '#6b7280', fontSize: 12, marginTop: 8, background: 'none', border: 'none', cursor: 'pointer' }}>Esqueci minha senha</button>
          </div>
        </div>
        
        <p style={{ color: '#6b7280', fontSize: 12, marginTop: 16 }}>obaleva.com.br/login</p>
      </div>
    </div>
  );
}