// src/components/map/RouteLayer.jsx
import { Polyline } from 'react-leaflet';
import L from 'leaflet';

const colors = ['#C95C5C', '#3E9B70', '#5B315D', '#D49A3A']; // different colors for routes

const RouteLayer = ({ routes, selectedRoute }) => {
  if (!routes || routes.length === 0) return null;

  return (
    <>
      {routes.map((route, idx) => (
        <Polyline
          key={idx}
          positions={route.geometry.coordinates.map(([lng, lat]) => [lat, lng])}
          color={idx === selectedRoute ? colors[idx % colors.length] : '#999'}
          weight={idx === selectedRoute ? 6 : 3}
          opacity={idx === selectedRoute ? 0.9 : 0.5}
        />
      ))}
    </>
  );
};

export default RouteLayer;