import { useEffect } from 'react';
import { useMap } from 'react-leaflet';

const FitBounds = ({ routes, selectedRoute }) => {
  const map = useMap();

  useEffect(() => {
    if (!routes || routes.length === 0) return;
    const route = selectedRoute !== null && routes[selectedRoute] ? routes[selectedRoute] : routes[0];
    if (!route || !route.geometry) return;
    const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
    if (coords.length > 0) {
      map.fitBounds(coords, { padding: [50, 50] });
    }
  }, [routes, selectedRoute, map]);

  return null;
};

export default FitBounds;