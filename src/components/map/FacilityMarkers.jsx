// src/components/map/FacilityMarkers.jsx
import { Marker, Popup } from 'react-leaflet';
import { createCustomMarker } from './markerIcons';
import { facilities } from '../../data/facilities';
import Badge from '../ui/Badge';

const typeIcons = {
  bus: '🚌',
  pharmacy: '💊',
  hospital: '🏥',
  police: '👮',
  cafe: '☕',
  atm: '🏧',
};

const FacilityMarkers = () => {
  return (
    <>
      {facilities.map((f) => (
        <Marker
          key={f.id}
          position={f.coords}
          icon={createCustomMarker('border-rose', typeIcons[f.type] || '📍')}
        >
          <Popup>
            <div className="p-2 min-w-[200px]">
              <h3 className="font-semibold text-plum">{f.name}</h3>
              <Badge variant="safe" className="mt-1">HerSpace {f.herSpace}/100</Badge>
              <div className="text-xs space-y-1 mt-2">
                <div className="flex justify-between"><span>Lighting</span><span className="font-medium">{f.lighting}</span></div>
                <div className="flex justify-between"><span>Security</span><span className="font-medium">{f.security}</span></div>
                <div className="flex justify-between"><span>Footfall</span><span className="font-medium">{f.footfall}</span></div>
                <div className="flex justify-between"><span>Accessibility</span><span className="font-medium">{f.accessibility}</span></div>
              </div>
              {f.note && <p className="text-xs text-concern mt-2">⚠ {f.note}</p>}
            </div>
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default FacilityMarkers;