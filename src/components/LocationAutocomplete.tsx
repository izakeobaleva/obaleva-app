import { useState, useEffect, useRef } from 'react';
import { MapPin, Navigation } from 'lucide-react';

interface LocationAutocompleteProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  icon?: 'origin' | 'destination';
  onPlaceSelected?: (lat: number, lng: number, address: string) => void;
}

export function LocationAutocomplete({ 
  placeholder, 
  value, 
  onChange, 
  icon = 'origin',
  onPlaceSelected 
}: LocationAutocompleteProps) {
  const [focused, setFocused] = useState(false);
  const [suggestions, setSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout>();
  const autocompleteService = useRef<any>(null);
  const geocoderService = useRef<any>(null);

  useEffect(() => {
    // Initialize Google services once loaded
    if (window.google && window.google.maps) {
      if (!autocompleteService.current) {
        autocompleteService.current = new window.google.maps.places.AutocompleteService();
      }
      if (!geocoderService.current) {
        geocoderService.current = new window.google.maps.Geocoder();
      }
    }
  }, []);

  const handleInputChange = (val: string) => {
    onChange(val);
    
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    if (val.length < 3) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    debounceRef.current = setTimeout(() => {
      if (autocompleteService.current) {
        autocompleteService.current.getPlacePredictions(
          {
            input: val,
            types: ['address'],
            componentRestrictions: { country: 'br' },
          },
          (predictions: any[], status: string) => {
            if (status === 'OK' && predictions) {
              setSuggestions(predictions);
              setShowSuggestions(true);
            } else {
              setSuggestions([]);
              setShowSuggestions(false);
            }
          }
        );
      }
    }, 300);
  };

  const handleSelectSuggestion = (suggestion: any) => {
    const address = suggestion.description;
    onChange(address);
    setShowSuggestions(false);

    // Get lat/lng from the selected address
    if (geocoderService.current && onPlaceSelected) {
      geocoderService.current.geocode(
        { address: address },
        (results: any[], status: string) => {
          if (status === 'OK' && results[0]) {
            const location = results[0].geometry.location;
            onPlaceSelected(location.lat(), location.lng(), address);
          }
        }
      );
    }
  };

  return (
    <div className="relative w-full">
      <div className={`
        flex items-center gap-3 bg-[#0F0B1A] border rounded-2xl px-4 py-3 transition-all
        ${focused ? 'border-[#F4D03F] ring-2 ring-[#F4D03F]/20' : 'border-white/10'}
      `}>
        {icon === 'origin' ? (
          <MapPin size={18} className="text-green-400 shrink-0" />
        ) : (
          <Navigation size={18} className="text-red-400 shrink-0" />
        )}
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => {
            setFocused(false);
            // Delay to allow click on suggestion
            setTimeout(() => setShowSuggestions(false), 200);
          }}
          className="w-full bg-transparent text-white placeholder-white/40 focus:outline-none text-sm"
          autoComplete="off"
        />
      </div>

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-[#1A1528] border border-white/10 rounded-2xl shadow-xl max-h-60 overflow-y-auto">
          {suggestions.map((suggestion: any) => (
            <button
              key={suggestion.place_id}
              onMouseDown={() => handleSelectSuggestion(suggestion)}
              className="w-full text-left px-4 py-3 text-white text-sm hover:bg-white/5 transition border-b border-white/5 last:border-0 flex items-center gap-3"
            >
              <MapPin size={14} className="text-[#A0A0B0] shrink-0" />
              <span className="truncate">{suggestion.description}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}