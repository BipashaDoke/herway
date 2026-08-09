import { Marker, Popup } from 'react-leaflet';
import { createCustomMarker } from './markerIcons';
import { useMemo } from 'react';
import Badge from '../ui/Badge';

const markerTypes = [
  { type: 'lighting', emoji: '💡', label: 'Lighting' },
  { type: 'police', emoji: '👮', label: 'Police' },
  { type: 'hospital', emoji: '🏥', label: 'Hospital' },
  { type: 'washroom', emoji: '🚻', label: 'Washroom' },
  { type: 'pharmacy', emoji: '💊', label: 'Pharmacy' },
  { type: 'bus', emoji: '🚌', label: 'Bus Stop' },
  { type: 'metro', emoji: '🚇', label: 'Metro' },
  { type: 'shop', emoji: '🏪', label: 'Shop' },
  { type: 'activity', emoji: '👥', label: 'High Activity' },
  { type: 'alert', emoji: '⚠️', label: 'Safety Alert' },
  { type: 'emergency', emoji: '🆘', label: 'Emergency' },
  { type: 'accessibility', emoji: '♿', label: 'Accessible' },
];

const generateRouteMarkers = (routeGeometry, time) => {
  if (!routeGeometry || !routeGeometry.coordinates || routeGeometry.coordinates.length === 0) return [];
  const coords = routeGeometry.coordinates.map(([lng, lat]) => [lat, lng]);
  const markers = [];
  const step = Math.max(1, Math.floor(coords.length / 15)); // aim for ~15 markers
  for (let i = 0; i < coords.length; i += step) {
    const base = coords[i];
    const mt = markerTypes[Math.floor(Math.random() * markerTypes.length)];
    const latOff = (Math.random() - 0.5) * 0.002;
    const lngOff = (Math.random() - 0.5) * 0.002;
    markers.push({
      id: `${mt.type}-${i}`,
      type: mt.type,
      coords: [base[0] + latOff, base[1] + lngOff],
      title: mt.label,
      emoji: mt.emoji,
      description: getDescription(mt.type, time),
      confidence: 60 + Math.floor(Math.random() * 30),
    });
  }
  return markers;
};

const getDescription = (type, time) => {
  const hour = time ? time.getHours() : 12;
  const day = hour >= 6 && hour < 20;
  switch (type) {
    case 'lighting': return day ? 'Well-lit' : 'Dim – caution';
    case 'police': return day ? 'Patrol active' : 'Reduced patrol';
    case 'hospital': return '24/7 emergency';
    case 'washroom': return day ? 'Open' : 'Closed after 8 PM';
    case 'pharmacy': return day ? 'Open' : 'Closed after 9 PM';
    case 'bus': return day ? 'Frequent buses' : 'Reduced schedule';
    case 'metro': return day ? 'Operational' : 'Limited service';
    case 'shop': return day ? 'Open' : 'Mostly closed';
    case 'activity': return day ? 'Crowded' : 'Low activity';
    case 'alert': return day ? 'Safe' : 'Be cautious';
    case 'emergency': return 'Available';
    case 'accessibility': return 'Ramp available';
    default: return '';
  }
};

const FacilityMarkers = ({ filters = [], route, travelTime }) => {
  const markers = useMemo(() => {
    if (!route) return [];
    let all = generateRouteMarkers(route.geometry, travelTime);
    if (filters.length > 0 && !filters.includes('all')) {
      all = all.filter(m => filters.includes(m.type));
    }
    return all;
  }, [route, travelTime, filters]);

  return (
    <>
      {markers.map(m => (
        <Marker key={m.id} position={m.coords} icon={createCustomMarker('border-rose', m.emoji)}>
          <Popup>
            <div className="p-2 min-w-[180px]">
              <p className="font-semibold text-plum">{m.title}</p>
              <p className="text-xs text-text-secondary">{m.description}</p>
              <Badge variant="safe" className="mt-1">Confidence {m.confidence}%</Badge>
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default FacilityMarkers;