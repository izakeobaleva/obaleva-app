import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InputMask from 'react-input-mask';

// ─── PALETA DE CORES ────────────────────────
const COLORS = {
  primary: '#7C3AED',      // Violet
  deep: '#5B21B6',         // Purple
  light: '#A78BFA',        // Light Purple
  gold: '#F59E0B',         // Gold Yellow
  lightGold: '#FCD34D',    // Light Gold
  white: '#FFFFFF',
  bg: '#FAF5FF',           // Light BG
  darkText: '#1E1B4B',
  grayText: '#6B7280',
  danger: '#EF4444',
  success: '#10B981',
  border: '#E5E7EB',
};

// ─── COMPONENTE DATA INPUT ──────────────────
function DateInput({ value, onChange, label = "Data de Nascimento" }: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        📅 {label}
      </label>
      <div className={`
        flex items-center gap-3 px-4 py-3
        bg-white border-2 rounded-xl transition-all duration-200
        ${focused
          ? 'border-[#7C3AED] shadow-[0_0_0_4px_rgba(124,58,237,0.15)]'
          : 'border-[#E5E7EB]'
        }
      `}>
        <span className="text-xl">📅</span>
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-[#1E1B4B] text-base
                     outline-none [appearance:textfield]
                     [&::-webkit-calendar-picker-indicator]:cursor-pointer"
          style={{ colorScheme: 'dark' }}
        />
      </div>
    </div>
  );
}

// ─── COMPONENTE PHONE INPUT ─────────────────
function PhoneInput({ value, onChange, label = "Celular" }: {
  value: string;
  onChange: (v: string) => void;
  label?: string;
}) {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full">
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        📱 {label}
      </label>
      <div className={`
        flex items-center gap-3 px-4 py-3
        bg-white border-2 rounded-xl transition-all duration-200
        ${focused
          ? 'border-[#7C3AED] shadow-[0_0_0_4px_rgba(124,58,237,0.15)]'
          : 'border-[#E5E7EB]'
        }
      `}>
        <span className="text-xl">📱</span>
        <InputMask
          mask="(99) 9 9999-9999"
          maskChar=" "
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          className="flex-1 bg-transparent text-[#1E1B4B] text-base outline-none"
        >
          <input
            type="tel"
            placeholder="(11) 9 9999-9999"
            className="w-full bg-transparent outline-none"
          />
        </InputMask>
      </div>
    </div>
  );
}

// ─── HOME SCREEN PRINCIPAL ──────────────────
export default function HomeScreen() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [userLocation] = useState({ lat: -23.5505, lng: -46.6333 }); // São Paulo

  const [userData] = useState({
    name: 'João Silva',
    phone: '(11) 9 9999-9999',
    birthDate: '1977-11-18',
    avatar: null,
    isDriver: false,
  });

  const GOOGLE_MAPS_KEY = process.env.REACT_APP_GOOGLE_MAPS_API_KEY || 'SUA_CHAVE_AQUI';

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FAF5FF]">

      {/* ═══════════════════════════════════════
          🗺️ MAPA — TELA CHEIA (z-index 0)
          ═══════════════════════════════════════ */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="Google Maps"
          width="100%"
          height="100%"
          style={{ border: 0 }}
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/view?key=${GOOGLE_MAPS_KEY}&center=${userLocation.lat},${userLocation.lng}&zoom=15&maptype=roadmap`}
          allowFullScreen
        />
      </div>

      {/* ═══════════════════════════════════════
          🔍 HEADER FLUTUANTE (z-index 10)
          ═══════════════════════════════════════ */}
      <div className="absolute top-0 left-0 right-0 z-10 p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-gradient-to-br from-[#7C3AED] to-[#5B21B6] flex items-center justify-center text-white font-bold text-lg shadow-lg">
              {userData.name.charAt(0)}
            </div>
            <div>
              <p className="text-white font-bold text-base drop-shadow-md">
                Olá, {userData.name.split(' ')[0]}! 👋
              </p>
              <p className="text-white/80 text-xs drop-shadow-md">
                📍 São Paulo, SP
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate('/profile')}
            className="w-11 h-11 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg"
          >
            <span className="text-xl">👤</span>
          </button>
        </div>

        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-xl px-4 py-3 flex items-center gap-3">
          <span className="text-xl">🔍</span>
          <input
            type="text"
            placeholder="Para onde você quer ir?"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 bg-transparent text-[#1E1B4B] text-base outline-none placeholder:text-[#6B7280]"
          />
        </div>
      </div>

      {/* ═══════════════════════════════════════
          🟢 BOTÃO SOLICITAR CORRIDA (z-index 10)
          ═══════════════════════════════════════ */}
      <div className="absolute bottom-24 left-4 right-4 z-10">
        <button
          onClick={() => navigate('/ride-request')}
          className="w-full h-14 bg-gradient-to-r from-[#7C3AED] to-[#5B21B6]
                     text-white font-bold text-lg rounded-2xl shadow-xl
                     active:scale-95 transition-transform duration-150
                     flex items-center justify-center gap-3"
        >
          <span className="text-2xl">🟢</span>
          SOLICITAR CORRIDA
        </button>
      </div>

      {/* ═══════════════════════════════════════
          🏠 BOTTOM NAVIGATION (z-index 20)
          ═══════════════════════════════════════ */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB]">
        <div className="flex items-center justify-around h-20 px-2">
          {[
            { icon: '🏠', label: 'Início', active: true, path: '/' },
            { icon: '🔍', label: 'Buscar', active: false, path: '/search' },
            { icon: '👤', label: 'Perfil', active: false, path: '/profile' },
            { icon: '📋', label: 'Viagens', active: false, path: '/trips' },
            { icon: '⚙️', label: 'Mais', active: false, path: '/more' },
          ].map((item, i) => (
            <button
              key={i}
              onClick={() => navigate(item.path)}
              className="flex flex-col items-center gap-1"
            >
              <span className="text-2xl">{item.icon}</span>
              <span className={`text-[10px] font-semibold ${
                item.active ? 'text-[#7C3AED]' : 'text-[#6B7280]'
              }`}>
                {item.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ═══════════════════════════════════════
          📊 CARDS FLUTUANTES (z-index 10)
          ═══════════════════════════════════════ */}
      <div className="absolute bottom-36 left-4 right-4 z-10 flex gap-3">
        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide">
            Preço Estimado
          </p>
          <p className="text-2xl font-bold text-[#7C3AED] mt-1">
            R$ 18,50
          </p>
          <p className="text-xs text-[#6B7280] mt-1">
            ⏱ ~12 min • 📏 3.2 km
          </p>
        </div>

        <div className="flex-1 bg-white/95 backdrop-blur-md rounded-2xl shadow-lg p-4">
          <p className="text-[10px] font-semibold text-[#6B7280] uppercase tracking-wide">
            Motorista
          </p>
          <div className="flex items-center gap-2 mt-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#F59E0B] to-[#FCD34D] flex items-center justify-center text-white text-sm font-bold">
              C
            </div>
            <div>
              <p className="text-sm font-bold text-[#1E1B4B]">Carlos</p>
              <p className="text-[10px] text-[#F59E0B] font-semibold">
                ⭐ 4.9
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}