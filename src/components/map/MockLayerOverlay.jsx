import { useMap } from 'react-leaflet';
import { useEffect } from 'react';
import L from 'leaflet';

const layerStyles = {
  safety: { color: '#3E9B70', fillOpacity: 0.2 },
  lighting: { color: '#D49A3A', fillOpacity: 0.15 },
  transport: { color: '#5B315D', fillOpacity: 0.1 },
  facilities: { color: '#D98BA5', fillOpacity: 0.2 },
  reports: { color: '#C95C5C', fillOpacity: 0.1 },
  accessibility: { color: '#3E9B70', fillOpacity: 0.2 },
};

const MockLayerOverlay = ({ activeLayers }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    // Remove existing layer groups
    map.eachLayer(layer => {
      if (layer.options && layer.options._herwayLayer) map.removeLayer(layer);
    });

    activeLayers.forEach(layerId => {
      const style = layerStyles[layerId] || layerStyles.safety;
      // Add a few mock circles around the center
      const center = map.getCenter();
      const circles = [
        L.circle([center.lat + 0.002, center.lng + 0.002], { radius: 200, ...style, _herwayLayer: true }),
        L.circle([center.lat - 0.001, center.lng - 0.003], { radius: 250, ...style, _herwayLayer: true }),
        L.circle([center.lat + 0.003, center.lng - 0.001], { radius: 300, ...style, _herwayLayer: true }),
      ];
      circles.forEach(c => c.addTo(map));
    });
  }, [activeLayers, map]);

  return null;
};

export default MockLayerOverlay;