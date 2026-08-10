import { useState, useCallback } from 'react';
import { MapContainer, TileLayer, Marker } from 'react-leaflet';
import CurrentLocationMarker from './CurrentLocationMarker';
import FacilityMarkers from './FacilityMarkers';
import RouteLayer from './RouteLayer';
import MapControls from './MapControls';
import FitBounds from './FitBounds';
import FacilityChips from './FacilityChips';
import RouteSafetyLayer from './RouteSafetyLayer';
import { createCustomMarker } from './markerIcons';

const DEFAULT_CENTER = [18.5204, 73.8567];
const DEFAULT_ZOOM = 15;

const MapContent = ({
  destination,
  routes,
  selectedRoute,
  showCurrentLocMarker,
  currentLocation,
  activeCategory,
  travelTime,
  activeServiceId,
  setActiveServiceId,
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
      <FacilityMarkers
        activeCategory={activeCategory}
        travelTime={travelTime}
        activeServiceId={activeServiceId}
        setActiveServiceId={setActiveServiceId}
      />
      {routes.length > 0 && selectedRoute !== null && (
        <RouteSafetyLayer route={routes[selectedRoute]} />
      )}
      {routes.length > 0 && (
        <RouteLayer routes={routes} selectedRoute={selectedRoute} />
      )}
    </>
  );
};

const HerMapView = ({
  destination,
  setDestination,
  routes,
  setRoutes,
  selectedRoute,
  setSelectedRoute,
  currentLocation,
  setCurrentLocation,
  showCurrentLocMarker,
  setShowCurrentLocMarker,
  activeMapLayers,
  setActiveMapLayers,
  activeCategory,
  setActiveCategory,
  travelTime,
  activeServiceId,
  setActiveServiceId,
  onMapReady,
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
        whenReady={(map) => onMapReady && onMapReady(map.target)}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapControls onLocate={handleLocate} />
        <FitBounds routes={routes} selectedRoute={selectedRoute} />
        <div className="absolute top-2 left-2 z-[1000]">
          <FacilityChips
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
          />
        </div>
        <MapContent
          destination={destination}
          routes={routes}
          selectedRoute={selectedRoute}
          showCurrentLocMarker={showCurrentLocMarker}
          currentLocation={currentLocation}
          activeCategory={activeCategory}
          travelTime={travelTime}
          activeServiceId={activeServiceId}
          setActiveServiceId={setActiveServiceId}
        />
      </MapContainer>
    </div>
  );
};

export default HerMapView;