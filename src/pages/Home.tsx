import { useState, useCallback, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useGoogleMaps } from '../hooks/useGoogleMaps';
import { useGeolocation } from '../hooks/useGeolocation';
import { useRideRequest } from '../hooks/useRideRequest';
import { LogOut, Bell, MapPin, Navigation, Crosshair, Car, Edit2, Check } from 'lucide-react';
import { UserAvatar } from '../components/UserAvatar';
import { toast } from 'sonner';

export default function Home() {
  const { user, profile, signOut } = useAuth();
  const navigate = useNavigate();
  const { mapsLoaded, buscarSugestoes, reverseGeocode } = useGoogleMaps();
  const { userLocation, getCurrentLocation } = useGeolocation();
  const { solicitando, solicitarCorrida } = useRideRequest();

  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [editingOrigem, setEditingOrigem] = useState(false);
  const [editingDestino, setEditingDestino] = useState(false);
  const [buscandoEndereco, setBuscandoEndereco] = useState(false);
  const [sugestoesOrigem, setSugestoesOrigem] = useState<any[]>([]);
  const [sugestoesDestino, setSugestoesDestino] = useState<any[]>([]);
  const [showSugestoesOrigem, setShowSugestoesOrigem] = useState(false);
  const [showSugestoesDestino, setShowSugestoesDestino] = useState(false);

  const enderecoBuscado = useRef(false);

  useEffect(() => {
    if (userLocation && !origem && !enderecoBuscado.current) {
      enderecoBuscado.current = true;
      setBuscandoEndereco(true);
      reverseGeocode(userLocation.lat, userLocation.lng).then((endereco) => {
        if (endereco) setOrigem(endereco);
        setBuscandoEndereco(false);
      });
    }
  }, [userLocation, origem, reverseGeocode]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const handleGetCurrentLocation = useCallback(async () => {
    const loc = await getCurrentLocation();
    if (loc) {
      setBuscandoEndereco(true);
      const endereco = await reverseGeocode(loc.lat, loc.lng);
      if (endereco) setOrigem(endereco);
      setBuscandoEndereco(false);
      toast.success('📍 Localização atualizada!');
    } else {
      toast.error('Erro ao obter localização. Verifique o GPS.');
    }
  }, [getCurrentLocation, reverseGeocode]);

  const handleSolicitarCorrida = async () => {
    if (!destino) {
      toast.error('Digite o destino');
      return;
    }
    await solicitarCorrida({ userId: user?.id, origem, destino });
    setDestino('');
  };

  return (
    <div className="map-screen">
      {/* TOP BAR */}
      <header style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 20,
        height: 56, background: 'rgba(26, 21, 40, 0.95)',
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '0 16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button onClick={handleSignOut} className="w-8 h-8 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center" title="Sair">
            <LogOut size={14} className="text-red-400" />
          </button>
          <h1 style={{ color: '#F4D03F', fontSize: 20, fontWeight: 'bold' }}>ObaLeva</h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <button className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center relative">
            <Bell size={16} className="text-[#F4D03F]" />
            <span style={{
              position: 'absolute', top: -2, right: -2, width: 14, height: 14,
              background: '#EF4444', borderRadius: '50%', fontSize: 8,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: 'white', fontWeight: 'bold'
            }}>3</span>
          </button>
          <button onClick={() => navigate('/profile')}>
            <UserAvatar url={profile?.avatar_url} name={profile?.nome_completo} size="sm" />
          </button>
        </div>
      </header>

      {/* MAPA */}
      <div className="map-area" style={{ marginTop: 56, height: 'calc(100% - 56px)' }}>
        <div className="map-placeholder">
          🗺️ Mapa indisponível
          {userLocation && (
            <div className="coordinates">
              📍 {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* BOTTOM SHEET */}
      <div className="ride-bottom-sheet" style={{ paddingTop: 20 }}>
        {/* ORIGEM */}
        <div className="location-field">
          <div className="location-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MapPin size={12} className="text-green-400" />
              ONDE VOCÊ ESTÁ?
            </span>
          </div>
          {editingOrigem ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                placeholder="Digite seu endereço"
                className="w-full bg-[#1A1528] text-white border border-[#F4D03F] rounded-xl px-4 py-2 text-sm focus:outline-none"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => { setEditingOrigem(false); setShowSugestoesOrigem(false); }}
                className="bg-[#22C55E] text-white px-3 py-2 rounded-xl text-xs font-medium"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="location-value">
              <span>{buscandoEndereco ? 'Buscando...' : origem || 'Toque para definir'}</span>
              <span className="edit-link" onClick={() => setEditingOrigem(true)}>
                <Edit2 size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Editar
              </span>
            </div>
          )}
        </div>

        {/* DESTINO */}
        <div className="location-field">
          <div className="location-label">
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Navigation size={12} className="text-red-400" />
              PARA ONDE VOCÊ VAI?
            </span>
          </div>
          {editingDestino ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <input
                type="text"
                placeholder="Digite o destino"
                className="w-full bg-[#1A1528] text-white border border-[#F4D03F] rounded-xl px-4 py-2 text-sm focus:outline-none"
                value={destino}
                onChange={(e) => setDestino(e.target.value)}
                autoFocus
              />
              <button
                onClick={() => { setEditingDestino(false); setShowSugestoesDestino(false); }}
                className="bg-[#22C55E] text-white px-3 py-2 rounded-xl text-xs font-medium"
              >
                OK
              </button>
            </div>
          ) : (
            <div className="location-value">
              <span style={{ color: destino ? 'white' : '#A0A0B0' }}>{destino || 'Para onde vai?'}</span>
              <span className="edit-link" onClick={() => setEditingDestino(true)}>
                <Edit2 size={14} style={{ marginRight: 4, verticalAlign: 'middle' }} />
                Editar
              </span>
            </div>
          )}
        </div>

        <button className="ride-button" onClick={handleSolicitarCorrida} disabled={solicitando}>
          {solicitando ? 'Buscando motorista...' : 'Chamar ObaLeva'}
        </button>

        {/* OUTDOOR INFO */}
        <div style={{
          marginTop: 16, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.05)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8
        }}>
          <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.3)' }}>
            📢 Baixe o app e ganhe <strong style={{ color: '#F4D03F' }}>R$ 10</strong> na primeira corrida!
          </span>
        </div>
      </div>
    </div>
  );
}