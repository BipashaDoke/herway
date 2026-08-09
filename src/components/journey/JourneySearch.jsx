import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Loader2 } from 'lucide-react';

const JourneySearch = ({ onSelect, disabled, currentLocation }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const inputRef = useRef();

  useEffect(() => {
    if (!query.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }
    const delayDebounce = setTimeout(() => {
      fetchSuggestions(query);
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [query]);

  const fetchSuggestions = async (searchText) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        q: searchText,
        format: 'json',
        limit: 8,
        addressdetails: 1,
      });
      if (currentLocation) {
        params.append('lat', currentLocation[0]);
        params.append('lon', currentLocation[1]);
        params.append('bounded', 1); // prefer nearby
        params.append('viewbox', `${currentLocation[1]-0.1},${currentLocation[0]-0.1},${currentLocation[1]+0.1},${currentLocation[0]+0.1}`);
      }
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      const data = await res.json();
      const formatted = data.map(place => ({
        name: place.display_name,
        coords: [parseFloat(place.lat), parseFloat(place.lon)],
        address: place.address?.city || place.address?.town || place.address?.village || '',
        distance: place.distance ? `${(place.distance / 1000).toFixed(1)} km` : null,
      }));
      setResults(formatted);
      setShowDropdown(true);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (place) => {
    setQuery(place.name);
    setShowDropdown(false);
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
          onChange={e => setQuery(e.target.value)}
          onFocus={() => results.length > 0 && setShowDropdown(true)}
          onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
          disabled={disabled}
          className="w-full pl-10 pr-4 py-2.5 bg-surface border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition"
          aria-label="Search destination"
        />
      </div>
      {showDropdown && (
        <div className="absolute z-[1000] mt-1 w-full bg-surface border border-gray-100 rounded-xl shadow-lg max-h-64 overflow-y-auto">
          {loading && (
            <div className="p-3 text-center text-sm text-text-secondary">
              <Loader2 size={16} className="inline animate-spin mr-2" />
              Searching…
            </div>
          )}
          {!loading && results.length === 0 && query.trim() && (
            <div className="p-3 text-sm text-text-secondary">No places found</div>
          )}
          {results.map((place, idx) => (
            <button
              key={idx}
              className="w-full flex items-start gap-3 px-4 py-3 text-sm hover:bg-ivory transition-colors text-left"
              onMouseDown={() => handleSelect(place)}
            >
              <MapPin size={16} className="text-rose shrink-0 mt-0.5" />
              <div className="min-w-0">
                <p className="font-medium truncate">{place.name}</p>
                {place.address && <p className="text-xs text-text-secondary">{place.address}</p>}
                {place.distance && <p className="text-xs text-text-secondary">{place.distance}</p>}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default JourneySearch;