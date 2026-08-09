import { Polyline } from 'react-leaflet';

// Mock safety segments: 0 = safe (green), 1 = moderate (yellow), 2 = caution (red)
const getMockSegments = (coordinates) => {
  if (!coordinates || coordinates.length < 2) return [];
  const segments = [];
  for (let i = 0; i < coordinates.length - 1; i++) {
    const start = coordinates[i];
    const end = coordinates[i + 1];
    // Assign safety level based on position (mock)
    const lat = (start[0] + end[0]) / 2;
    const lng = (start[1] + end[1]) / 2;
    let level = 0; // safe by default
    if (lng > 73.8575) level = 2; // east part less safe
    else if (lat > 18.521) level = 1; // north part moderate
    segments.push({ positions: [start, end], level });
  }
  return segments;
};

const levelColors = {
  0: '#3E9B70', // safe green
  1: '#D49A3A', // moderate yellow
  2: '#C95C5C', // caution red
};

const RouteSafetyLayer = ({ route }) => {
  if (!route || !route.geometry) return null;
  const coords = route.geometry.coordinates.map(([lng, lat]) => [lat, lng]);
  const segments = getMockSegments(coords);

  return (
    <>
      {segments.map((seg, idx) => (
        <Polyline
          key={idx}
          positions={seg.positions}
          color={levelColors[seg.level]}
          weight={6}
          opacity={0.9}
        />
      ))}
    </>
  );
};

export default RouteSafetyLayer;