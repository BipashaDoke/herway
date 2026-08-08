import { useEffect, useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker';
import FacilityMarkers from './FacilityMarkers';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import { createCustomMarker } from './markerIcons';

const DEFAULT_CENTER = [18.5204, 73.8567];
const DEFAULT_ZOOM = 15;

const MapContent = ({
  destination,
  routes,
  selectedRoute,
  onLocationFound,
  showCurrentLocMarker,
  currentLocation,
}) => {
  useMapEvents({
    locationfound(e) {
      onLocationFound(e.latlng);
    },
  });

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
  const [mapCenter, setMapCenter] = useState(DEFAULT_CENTER);

  const handleLocationFound = useCallback(
    (latlng) => {
      if (!currentLocation) {
        setCurrentLocation([latlng.lat, latlng.lng]);
        setMapCenter([latlng.lat, latlng.lng]);
        setShowCurrentLocMarker(true);
      }
    },
    [currentLocation, setCurrentLocation, setShowCurrentLocMarker]
  );

  return (
    <div className="relative w-full h-full">
      <MapContainer
  center={mapCenter}
  zoom={DEFAULT_ZOOM}
  scrollWheelZoom={true}
  style={{ height: '100%', width: '100%' }}
  className="h-full w-full rounded-2xl"
  zoomControl={false}
>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControls />
        <MapContent
          destination={destination}
          routes={routes}
          selectedRoute={selectedRoute}
          onLocationFound={handleLocationFound}
          showCurrentLocMarker={showCurrentLocMarker}
          currentLocation={currentLocation}
        />
      </MapContainer>
    </div>
  );
};

export default HerMapView;