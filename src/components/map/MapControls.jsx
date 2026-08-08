import { useMap } from 'react-leaflet';
import { Crosshair } from 'lucide-react';

const MapControls = ({ onLocate }) => {
  const map = useMap();

  const handleRecenter = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by your browser.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        map.flyTo([latitude, longitude], 16);
        if (onLocate) {
          onLocate({ lat: latitude, lng: longitude });
        }
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          alert(
            'Location permission is required to find your current location.\n\n' +
            'If you previously denied permission, please go to your browser settings, find the site permissions for localhost, and allow location access.'
          );
        } else {
          alert('Unable to get your current location. Please try again.');
        }
      }
    );
  };

  return (
    <div className="absolute top-4 right-4 z-[1000] flex flex-col gap-2">
      <button
        onClick={handleRecenter}
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