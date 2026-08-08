import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker';
import FacilityMarkers from './FacilityMarkers';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import { createCustomMarker } from './markerIcons';
import FitBounds from './FitBounds';

const DEFAULT_CENTER = [18.5204, 73.8567];
const DEFAULT_ZOOM = 15;

const MapContent = ({
  destination,
  routes,
  selectedRoute,
  showCurrentLocMarker,
  currentLocation,
}) => {
  return (
    <>
      {showCurrentLocMarker && currentLocation && (
        <CurrentLocationMarker position={currentLocation} />
      )}
      {destination && (
        <Marker
          position={destination}
          icon={createCustomMarker('border-plum', '📍')}
        />
      )}
      <FacilityMarkers />
      {routes.length > 0 && (
        <RouteLayer routes={routes} selectedRoute={selectedRoute} />
      )}
    </>
  );
};

const HerMapView = ({
  destination,
  routes,
  selectedRoute,
  currentLocation,
  setCurrentLocation,
  showCurrentLocMarker,
  setShowCurrentLocMarker,
}) => {
  const [mapCenter] = useState(DEFAULT_CENTER);

  const handleLocate = useCallback(
    (coords) => {
      setCurrentLocation([coords.lat, coords.lng]);
      setShowCurrentLocMarker(true);
    },
    [setCurrentLocation, setShowCurrentLocMarker]
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
        center={mapCenter}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom={true}
        style={{ height: '100%', width: '100%' }}
        className="rounded-2xl overflow-hidden"
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControls onLocate={handleLocate} />
        <FitBounds routes={routes} selectedRoute={selectedRoute} />
        <MapContent
          destination={destination}
          routes={routes}
          selectedRoute={selectedRoute}
          showCurrentLocMarker={showCurrentLocMarker}
          currentLocation={currentLocation}
        />
      </MapContainer>
    </div>
  );
};

export default HerMapView;
