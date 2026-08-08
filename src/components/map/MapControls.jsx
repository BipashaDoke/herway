// src/components/map/MapControls.jsx
import { useMap } from 'react-leaflet';
import { Crosshair } from 'lucide-react';

const MapControls = () => {
  const map = useMap();

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={() => map.locate({ setView: true, maxZoom: 16 })}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50 transition-colors"
        aria-label="Find my location"
      >
        <Crosshair size={20} className="text-plum" />
      </button>
      <button
        onClick={() => map.zoomIn()}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
        aria-label="Zoom in"
      >
        <span className="text-lg font-bold">+</span>
      </button>
      <button
        onClick={() => map.zoomOut()}
        className="bg-white p-2 rounded-full shadow-md hover:bg-gray-50"
        aria-label="Zoom out"
      >
        <span className="text-lg font-bold">−</span>
      </button>
    </div>
  );
};

export default MapControls;