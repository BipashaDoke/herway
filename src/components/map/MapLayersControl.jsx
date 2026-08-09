import { useState } from 'react';
import { Layers } from 'lucide-react';

const layerOptions = [
  { id: 'safety', label: 'Safety' },
  { id: 'lighting', label: 'Lighting' },
  { id: 'transport', label: 'Public Transport' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'reports', label: 'Community Reports' },
  { id: 'accessibility', label: 'Accessibility' },
];

const MapLayersControl = ({ activeLayers, setActiveLayers }) => {
  const [open, setOpen] = useState(false);

  const toggleLayer = (id) => {
    setActiveLayers(prev =>
      prev.includes(id) ? prev.filter(l => l !== id) : [...prev, id]
    );
  };

  return (
    <div className="absolute top-16 right-4 z-[1000]">
      <button
        onClick={() => setOpen(!open)}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Map layers"
      >
        <Layers size={20} className="text-plum" />
      </button>
      {open && (
        <div className="mt-2 bg-surface border border-gray-100 rounded-xl shadow-lg p-3 w-48">
          <h4 className="font-medium text-sm text-plum mb-2">Map Layers</h4>
          {layerOptions.map(opt => (
            <label key={opt.id} className="flex items-center gap-2 text-sm py-1 cursor-pointer">
              <input
                type="checkbox"
                checked={activeLayers.includes(opt.id)}
                onChange={() => toggleLayer(opt.id)}
                className="rounded text-plum focus:ring-plum"
              />
              {opt.label}
            </label>
          ))}
        </div>
      )}
    </div>
  );
};

export default MapLayersControl;