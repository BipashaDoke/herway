// src/components/map/CurrentLocationMarker.jsx
import { Marker, Circle } from 'react-leaflet';
import { createCustomMarker } from './markerIcons';

const CurrentLocationMarker = ({ position }) => {
  if (!position) return null;
  return (
    <>
      <Marker position={position} icon={createCustomMarker('border-plum bg-plum/20', '📍')} />
      <Circle
        center={position}
        radius={30}
        pathOptions={{ color: '#5B315D', fillOpacity: 0.2, weight: 1 }}
      />
    </>
  );
};

export default CurrentLocationMarker;