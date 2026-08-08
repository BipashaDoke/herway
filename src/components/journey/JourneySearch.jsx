// src/components/journey/JourneySearch.jsx
import { useState, useRef, useEffect } from 'react';
import { Search, MapPin } from 'lucide-react';

const suggestions = [
  { name: 'Sinhgad College of Engineering', coords: [18.5204, 73.8567] },
  { name: 'Vadgaon Bus Stop', coords: [18.5208, 73.8572] },
  { name: 'Campus Pharmacy', coords: [18.5199, 73.8564] },
  { name: 'Sinhgad Hospital', coords: [18.5212, 73.8555] },
  { name: 'Police Chowki', coords: [18.5202, 73.8580] },
  { name: 'Cafe Corner', coords: [18.5195, 73.8575] },
  { name: 'ATM', coords: [18.5205, 73.8560] },
];

const JourneySearch = ({ onSelect, disabled }) => {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filtered, setFiltered] = useState([]);
  const inputRef = useRef();

  useEffect(() => {
    if (query.trim().length === 0) {
      setFiltered([]);
      setShowSuggestions(false);
      return;
    }
    const matches = suggestions.filter((s) =>
      s.name.toLowerCase().includes(query.toLowerCase())
    );
    setFiltered(matches);
    setShowSuggestions(true);
  }, [query]);

  const handleSelect = (place) => {
    setQuery(place.name);
    setShowSuggestions(false);
    onSelect(place);
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="relative">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Where do you want to go?"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setShowSuggestions(true)}
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition"
          aria-label="Search destination"
        />
      </div>
      {showSuggestions && filtered.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-surface border border-gray-100 rounded-xl shadow-lg max-h-48 overflow-y-auto">
          {filtered.map((place, idx) => (
            <button
              key={idx}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm hover:bg-ivory transition-colors text-left"
              onMouseDown={() => handleSelect(place)}
            >
              <MapPin size={16} className="text-rose" />
              {place.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneySearch;