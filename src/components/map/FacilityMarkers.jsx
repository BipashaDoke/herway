import { Marker, Popup } from 'react-leaflet';
import { createCustomMarker } from './markerIcons';
import { mapPoints } from '../../data/mapPoints';
import Badge from '../ui/Badge';
import { useEffect, useRef } from 'react';

const categoryIcons = {
  safety: '🛡',
  lighting: '💡',
  emergency: '🚑',
  facilities: '🏢',
  transit: '🚌',
  shops: '🛍',
  alerts: '⚠️',
  access: '♿',
};

const getTimeBasedStatus = (point, travelTime) => {
  const hour = travelTime?.getHours() || 12;
  if (point.type === 'lighting') {
    return hour >= 6 && hour < 20 ? 'Well‑lit (day)' : 'Dim – caution at night';
  }
  if (point.type === 'alerts') {
    return hour >= 6 && hour < 20 ? 'Warning – daytime activity' : 'Higher risk – few people around';
  }
  return point.status;
};

const FacilityMarkers = ({ activeCategory = 'all', travelTime, activeServiceId, setActiveServiceId }) => {
  const visiblePoints = activeCategory === 'all'
    ? mapPoints
    : mapPoints.filter(p => p.type === activeCategory);

  const markerRefs = useRef({});

  useEffect(() => {
    if (activeServiceId && markerRefs.current[activeServiceId]) {
      const marker = markerRefs.current[activeServiceId];
      if (marker && marker.openPopup) {
        marker.openPopup();
      }
    }
  }, [activeServiceId]);

  return (
    <>
      {visiblePoints.map(point => {
        const icon = categoryIcons[point.type] || '📍';
        const status = getTimeBasedStatus(point, travelTime);
        return (
          <Marker
            key={point.id}
            position={point.coords}
            icon={createCustomMarker('border-rose', icon)}
            ref={(ref) => { markerRefs.current[point.id] = ref; }}
          >
            <Popup>
              <div className="p-2 min-w-[200px]">
                <p className="font-semibold text-plum flex items-center gap-2">
                  <span>{icon}</span> {point.name}
                </p>
                <p className="text-xs capitalize text-text-secondary mt-1">{point.type}</p>
                <p className="text-xs mt-1">{point.description}</p>
                <Badge variant="neutral" className="mt-2">{status}</Badge>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default FacilityMarkers;