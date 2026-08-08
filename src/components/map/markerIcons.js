import L from 'leaflet';

export const createCustomMarker = (colorClass, icon = '📍') =>
  L.divIcon({
    className: '', // reset Leaflet default
    html: `<div class="flex items-center justify-center w-8 h-8 rounded-full bg-white shadow-md border-2 ${colorClass} text-lg">${icon}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });