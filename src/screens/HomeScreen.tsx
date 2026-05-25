import React, { useState } from 'react';
import { GoogleMap, useJsApiLoader, Autocomplete } from '@react-google-maps/api';

// CONFIGURAÇÕES
const C = {
  primary: '#7C3AED',
  deep: '#5B21B6',
  gold: '#F59E0B',
  darkText: '#1E1B4B',
  grayText: '#6B7280',
  border: '#E5E7EB',
  bgLight: '#FAF5FF',
};

const containerStyle = {
  width: '100%',
  height: '100vh',
};

// COMPONENTE DE CAMPO COM AUTOCOMPLETE
const AutocompleteInput = ({ 
  label, 
  value, 
  onChange, 
  placeholder 
}: { 
  label: string; 
  value: string; 
  onChange: (v: string) => void; 
  placeholder: string;
}) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="w-full mb-4">
      <label className="block text-sm font-semibold text-[#1E1B4B] mb-2">
        {label}
      </label>
      <div className={`
        relative px-4 py-3 bg-white border-2 rounded-xl transition-all duration-200
        ${focused ? 'border-[#7C3AED] shadow-[0_0_0_4px_rgba(124,58,237,0.15)]' : 'border-[#E5E7EB]'}
      `}>
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xl text-[#7C3AED]">
          📍
        </span>
        <Autocomplete
          onLoad={(autocomplete) => {
            // Opcional: Restringir sugestões apenas ao Brasil
            // const options = { types: ['address'], componentRestrictions: { country: 'br' } };
            // autocomplete.setOptions(options);
          }}
          onPlaceChanged={() => {
            // Aqui você pode pegar os detalhes do local selecionado
            // const place = autocompleteRef.current.getPlace();
          }}
        >
          <input
            type="text"
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full pl-10 pr-4 py-2 bg-transparent text-[#1E1B4B] text-base outline-none placeholder:text-[#6B7280]"
            style={{ fontSize: '16px' }}
          />
        </Autocomplete>
      </div>
    </div>
  );
};

export default function HomeScreen() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY || 'SUA_CHAVE_AQUI',
    libraries: ["places"], // Essencial para o Autocomplete
  });

  const [origin, setOrigin] = useState("Rua Santo Antônio, 1095 - Centro, São Paulo - SP");
  const [destination, setDestination] = useState("");

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#FAF5FF]">
      
      {/* 🗺️ MAPA FUNDO (IFRAME) */}
      <div className="absolute inset-0 z-0">
        <iframe
          title="Google Maps Background"
          width="100%"
          height="100%"
          style={{ border: 0, filter: 'blur(1px)' }} // Leve blur para o texto sobressair
          loading="lazy"
          src={`https://www.google.com/maps/embed/v1/view?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY}&center=-23.5505,-46.6333&zoom=14&maptype=roadmap`}
          allowFullScreen
        />
      </div>

      {/* 📱 CONTEÚDO PRINCIPAL */}
      <div className="relative z-10 h-full flex flex-col p-6 pt-12 pb-24">
        
        {/* Header Simples */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-[#1E1B4B]">ObaLeva</h1>
          <div className="w-10 h-10 rounded-full bg-[#7C3AED] flex items-center justify-center text-white font-bold shadow-md">
            U
          </div>
        </div>

        {/* Cards de Entrada */}
        <div className="flex-1 flex flex-col justify-center space-y-4">
          
          {/* ORIGEM COM AUTOCOMPLETE */}
          <AutocompleteInput
            label="ONDE VOCÊ ESTÁ?"
            value={origin}
            onChange={setOrigin}
            placeholder="Digite seu endereço de origem"
          />

          {/* DESTINO */}
          <AutocompleteInput
            label="PARA ONDE VOCÊ VAI?"
            value={destination}
            onChange={setDestination}
            placeholder="Digite o endereço de destino"
          />

          {/* BOTÃO CHAMAR */}
          <button className="w-full h-16 bg-[#F59E0B] 
                     text-white font-bold text-lg rounded-2xl 
                     shadow-lg hover:shadow-xl 
                     active:scale-95 transition-all duration-200
                     flex items-center justify-center gap-3 mt-4 border-none cursor-pointer">
            <span className="text-2xl">🚕</span>
            CHAMAR OBALEVA
          </button>
        </div>
      </div>

      {/* 🏠 BOTTOM NAVIGATION */}
      <div className="absolute bottom-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-md border-t border-[#E5E7EB] shadow-lg">
        <div className="flex items-center justify-around h-20 px-2">
          {['Início', 'Buscar', 'Atividade', 'Perfil'].map((item, i) => (
            <button key={i} className="flex flex-col items-center gap-1 w-16">
              <span className="text-3xl">
                {i === 0 ? '🏠' : i === 1 ? '🔍' : i === 2 ? '📋' : '👤'}
              </span>
              <span className={`text-[11px] font-semibold ${i === 0 ? 'text-[#7C3AED]' : 'text-[#6B7280]'}`}>
                {item}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}