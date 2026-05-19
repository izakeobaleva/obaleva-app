// ============================================
// TELA PRINCIPAL (HOME) - ESTILO 99 COM AUTOCOMPLETE
// ============================================
const HomeScreen = ({ user }: any) => {
  const [origem, setOrigem] = useState('');
  const [destino, setDestino] = useState('');
  const [origemLocation, setOrigemLocation] = useState<any>(null);
  const [destinoLocation, setDestinoLocation] = useState<any>(null);
  const origemInputRef = useRef<HTMLInputElement>(null);
  const destinoInputRef = useRef<HTMLInputElement>(null);

  // Inicializar autocomplete do Google Maps
  useEffect(() => {
    if (!window.google || !origemInputRef.current || !destinoInputRef.current) {
      console.log('⏳ Aguardando Google Maps carregar para autocomplete...');
      return;
    }

    try {
      // Autocomplete para origem
      const origemAuto = new window.google.maps.places.Autocomplete(origemInputRef.current, {
        fields: ['formatted_address', 'geometry', 'name'],
      });
      origemAuto.addListener('place_changed', () => {
        const place = origemAuto.getPlace();
        if (place.geometry) {
          setOrigem(place.formatted_address || place.name);
          setOrigemLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
          });
        }
      });

      // Autocomplete para destino
      const destinoAuto = new window.google.maps.places.Autocomplete(destinoInputRef.current, {
        fields: ['formatted_address', 'geometry', 'name'],
      });
      destinoAuto.addListener('place_changed', () => {
        const place = destinoAuto.getPlace();
        if (place.geometry) {
          setDestino(place.formatted_address || place.name);
          setDestinoLocation({
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
            address: place.formatted_address
          });
        }
      });

      console.log('✅ Autocomplete Google Maps ativado!');
    } catch (err) {
      console.error('❌ Erro ao inicializar autocomplete:', err);
    }
  }, []);

  const handleChamarObaLeva = () => {
    if (!destino) {
      alert('Digite um destino primeiro!');
      return;
    }
    alert(`🚗 Corrida solicitada de: ${origem || 'Sua localização'}\nPara: ${destino}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 pb-24">
      {/* Header */}
      <div className="flex justify-between items-center py-3">
        <h1 className="text-xl font-bold text-white">OBALEVA</h1>
        <div className="flex items-center gap-3">
          <button className="text-[#A0A0B0] text-xs">Mudar passageiro</button>
          <button onClick={fazerLogout} className="text-red-400 text-xs">Sair</button>
        </div>
      </div>

      {/* Mapa */}
      <div className="relative h-[280px] rounded-xl overflow-hidden mb-3 shadow-lg">
        <MapComponent />
        <button className="absolute bottom-3 right-3 bg-[#1A1528] rounded-full p-2 shadow-lg border border-[#F4D03F]/30">
          <MapPin size={20} className="text-[#F4D03F]" />
        </button>
      </div>

      {/* Campo de ORIGEM com autocomplete */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
          <input
            ref={origemInputRef}
            type="text"
            placeholder="Onde você está?"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#A0A0B0]"
            defaultValue={origem}
            onChange={(e) => setOrigem(e.target.value)}
          />
        </div>
      </div>

      {/* Campo de DESTINO com autocomplete */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/20 mb-2">
        <div className="flex items-center gap-3">
          <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
          <input
            ref={destinoInputRef}
            type="text"
            placeholder="Para onde você vai?"
            className="flex-1 bg-transparent text-white text-sm outline-none placeholder-[#A0A0B0]"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
          />
        </div>
      </div>

      {/* BOTÃO CHAMAR OBALEVALe - LOGO ABAIXO DO CAMPO */}
      <button
        onClick={handleChamarObaLeva}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#F4D03F] to-[#FFD966] text-black font-bold text-base flex items-center justify-center gap-2 mb-3"
      >
        <Car size={18} /> CHAMAR OBALEVALe
      </button>

      {/* Banner de promoção */}
      <div className="bg-gradient-to-r from-[#F4D03F]/20 to-[#8B5CF6]/20 rounded-xl p-3 mb-2 flex justify-between items-center">
        <div>
          <div className="flex items-center gap-1">
            <span className="text-2xl">🍔</span>
            <span className="text-white font-bold text-sm">Almoço com até 50% OFF</span>
          </div>
          <p className="text-[#A0A0B0] text-xs mt-1">Peça agora</p>
        </div>
        <ChevronRight size={20} className="text-[#F4D03F]" />
      </div>

      {/* Lojas recomendadas */}
      <div className="bg-[#1A1528] rounded-xl p-3 border border-[#F4D03F]/15">
        <div className="flex justify-between items-center mb-2">
          <span className="text-white font-bold text-sm">🏪 Lojas recomendadas na região</span>
          <span className="text-[#F4D03F] text-xs">Mais ›</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            <Star size={14} className="text-[#F4D03F] fill-[#F4D03F]" />
            <span className="text-white text-sm font-bold">4.6</span>
          </div>
          <span className="text-[#A0A0B0] text-xs">Itens com até 95% ...</span>
        </div>
      </div>
    </div>
  );
};