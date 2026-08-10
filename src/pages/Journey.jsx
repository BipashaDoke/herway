import { useState, useEffect, useRef, useCallback } from 'react';

import { Search, MapPin, Clock, Play, StopCircle, AlertTriangle } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { useLocation } from '../context/LocationContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import HerMapView from '../components/map/HerMapView';
import JourneySearch from '../components/journey/JourneySearch';
import RouteCard from '../components/journey/RouteCard';
import RouteSummaryCard from '../components/journey/RouteSummaryCard';
import SmartRecommendationCard from '../components/journey/SmartRecommendationCard';
import DestinationCard from '../components/journey/DestinationCard';
import NearbyServices from '../components/journey/NearbyServices';
import { nearbyServices } from '../data/nearbyServices';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const timePresets = [
  { label: 'Morning', hour: 8 },
  { label: 'Afternoon', hour: 13 },
  { label: 'Evening', hour: 18 },
  { label: 'Night', hour: 22 },
];

const Journey = () => {
  const { currentLocation: sharedLocation, locationError, isLocating, requestLocation } = useLocation();
  const { preferences } = useUserPreferences();
  const {
    startLocation, setStartLocation,
    destination, setDestination,
    routes, setRoutes,
    selectedRoute, setSelectedRoute,
    travelTime, setTravelTime,
    isActive, setIsActive,
    currentLocation, setCurrentLocation,
    resetJourney,
  } = useJourney();

  const [destinationInput, setDestinationInput] = useState('');
  const [activeCategory, setActiveCategory] = useState('all');
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef(null);
  const [destinationData, setDestinationData] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState(null);

  // Sync start location from shared location (user's GPS)
  useEffect(() => {
    if (sharedLocation) {
      setStartLocation({ name: 'Current Location', coords: sharedLocation });
    }
  }, [sharedLocation, setStartLocation]);

  // Live location tracking when journey is active
  useEffect(() => {
    if (isActive) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => {
            setCurrentLocation([pos.coords.latitude, pos.coords.longitude]);
          },
          (err) => {
            console.warn('Live location error:', err);
          },
          { enableHighAccuracy: true, maximumAge: 10000 }
        );
      }
      return () => {
        if (watchIdRef.current) {
          navigator.geolocation?.clearWatch(watchIdRef.current);
        }
      };
    }
  }, [isActive, setCurrentLocation]);

  // Weighted scoring (same as HerMap)
  const computeWeightedScore = useCallback((route) => {
    const wSafety = preferences.safety / 100;
    const wTime = preferences.time / 100;
    const wAccess = preferences.accessibility / 100;
    const wFac = preferences.facilities / 100;
    const total = wSafety + wTime + wAccess + wFac;
    const norm = total > 0 ? total : 1;
    return (
      (route.safety * wSafety +
        Math.max(0, 100 - route.duration) * wTime +
        (route.transport || 70) * wAccess +
        (route.emergency || 70) * wFac) / norm
    );
  }, [preferences]);

  // Geocode destination text if not already set as object
  const geocodeDestination = async (text) => {
    if (destination && destination.coords) return destination;
    if (!text.trim()) return null;
    try {
      const params = new URLSearchParams({
        q: text,
        format: 'json',
        limit: 1,
        addressdetails: 1,
      });
      if (sharedLocation) {
        params.append('lat', sharedLocation[0]);
        params.append('lon', sharedLocation[1]);
      }
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      const data = await res.json();
      if (data.length > 0) {
        const place = {
          name: data[0].display_name,
          coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
        };
        return place;
      }
      return null;
    } catch {
      return null;
    }
  };

  const handleFindRoutes = async () => {
    // Ensure we have a start location
    if (!sharedLocation) {
      if (locationError === 'permission_denied') {
        alert('Location permission is required. Please allow location access in your browser settings and try again.');
      } else if (isLocating) {
        alert('Still detecting your location. Please wait a moment and try again.');
      } else {
        alert('Unable to get your current location. You can try again.');
      }
      return;
    }

    // Resolve destination
    let dest = destination;
    if (!dest || !dest.coords) {
      dest = await geocodeDestination(destinationInput);
      if (dest) {
        setDestination(dest);
        setDestinationData({ name: dest.name, herSpaceScore: 87 }); // mock HerSpace
      } else {
        alert('Please select a destination from the suggestions or type a valid location.');
        return;
      }
    } else {
      setDestinationData({ name: dest.name, herSpaceScore: 87 });
    }

    setIsLoading(true);
    try {
      const [lat1, lng1] = sharedLocation;
      const [lat2, lng2] = dest.coords;
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?alternatives=true&geometries=geojson&overview=full`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Routing failed');
      const data = await res.json();
      if (!data.routes || data.routes.length === 0) throw new Error('No routes');

      const hour = travelTime.getHours();
      const timeFactor = hour >= 6 && hour < 18 ? 90 : hour >= 18 && hour < 22 ? 60 : 30;

      const createRoute = (osrmRoute, type) => {
        const dist = (osrmRoute.distance / 1000).toFixed(1);
        const dur = Math.round(osrmRoute.duration / 60);
        let lighting = 70, crowd = 60, emergency = 80, facilities = 70;
        if (type === 'safer') { lighting = 90; crowd = 85; emergency = 95; facilities = 85; }
        else if (type === 'fastest') { lighting = 60; crowd = 50; emergency = 70; facilities = 60; }
        else if (type === 'accessible') { lighting = 80; crowd = 75; emergency = 85; facilities = 75; }
        if (hour < 6 || hour > 21) { lighting = Math.max(0, lighting - 20); crowd = Math.max(0, crowd - 25); }
        else if (hour >= 18 && hour <= 21) { lighting = Math.max(0, lighting - 10); crowd = Math.max(0, crowd - 10); }
        let safetyScore = Math.round(0.30 * lighting + 0.20 * crowd + 0.20 * emergency + 0.15 * facilities + 0.15 * timeFactor);
        const riskPenalty = (hour < 6 || hour > 21) ? 15 : (lighting < 50 ? 10 : 0);
        safetyScore = Math.max(0, Math.min(100, safetyScore - riskPenalty));
        return {
          ...osrmRoute,
          type,
          distance: dist,
          duration: dur,
          safety: safetyScore,
          lighting,
          crowd,
          transport: emergency,
          emergency,
          facilities,
          herRouteScore: safetyScore,
          geometry: osrmRoute.geometry,
        };
      };

      let enriched = [];
      if (data.routes.length >= 2) {
        enriched = [
          createRoute(data.routes[1], 'safer'),   // use second as safer (maybe longer)
          createRoute(data.routes[0], 'fastest'),  // first as fastest
          createRoute(data.routes[0], 'accessible'), // balanced renamed to accessible
        ];
        enriched[2].duration = Math.round(parseFloat(enriched[0].duration) * 1.1).toString();
      } else if (data.routes.length === 1) {
        enriched = [
          createRoute(data.routes[0], 'safer'),
          createRoute(data.routes[0], 'fastest'),
          createRoute(data.routes[0], 'accessible'),
        ];
        enriched[0].duration = Math.round(parseFloat(enriched[0].duration) * 1.25).toString();
        enriched[2].duration = Math.round(parseFloat(enriched[0].duration) * 1.1).toString();
      }

      setRoutes(enriched);
      setSelectedRoute(null);
    } catch (err) {
      console.error('Routing error:', err);
      alert('Unable to calculate routes. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDestinationSelect = (place) => {
    setDestination(place);
    setDestinationInput(place.name);
  };

  const startJourney = () => {
    if (selectedRoute !== null && routes[selectedRoute]) setIsActive(true);
  };

  const endJourney = () => {
    resetJourney();
    setDestinationInput('');
  };

  const currentRoute = routes[selectedRoute];

  // ----- ACTIVE JOURNEY MODE -----
  if (isActive && currentRoute) {
    return (
      <div className="h-full flex flex-col">
        <div className="flex-none bg-surface border-b border-gray-100 p-3 flex items-center justify-between">
          <div>
            <p className="font-medium text-plum">Journey to {destination?.name}</p>
            <p className="text-xs text-text-secondary">{currentRoute.distance} km • {currentRoute.duration} min</p>
          </div>
          <div className="flex gap-2">
            <Button onClick={endJourney} variant="secondary" size="sm"><StopCircle size={16} /> End</Button>
            <Button onClick={() => alert('SOS demo: Guardian alert!')} variant="primary" size="sm" className="bg-concern"><AlertTriangle size={16} /> SOS</Button>
          </div>
        </div>
        <div className="flex-1 min-h-0 relative">
          <HerMapView
            destination={destination?.coords || null}
            routes={routes}
            selectedRoute={selectedRoute}
            setSelectedRoute={() => {}}
            currentLocation={currentLocation || sharedLocation}
            setCurrentLocation={setCurrentLocation}
            showCurrentLocMarker={true}
            setShowCurrentLocMarker={() => {}}
            activeCategory={activeCategory}
            setActiveCategory={setActiveCategory}
            activeServiceId={selectedServiceId}
            setActiveServiceId={setSelectedServiceId}
            onMapReady={setMapInstance}
            travelTime={travelTime}
          />
        </div>
        <div className="flex-none bg-surface border-t border-gray-100 p-3 space-y-3">
          <RouteSummaryCard route={currentRoute} travelTime={travelTime} />
          <NearbyServices
            activeCategory={activeCategory}
            services={nearbyServices}
            onServiceClick={(service) => {
              if (mapInstance) {
                mapInstance.flyTo(service.coords, 16);
                setSelectedServiceId(service.id);
              }
            }}
          />
        </div>
      </div>
    );
  }

  // ----- PLANNING MODE -----
  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-plum">Plan Your Journey</h1>

      {/* Start location */}
      <Card className="flex items-center gap-3">
        <MapPin size={20} className="text-rose" />
        <div>
          <p className="text-sm font-medium">From</p>
          {sharedLocation ? (
            <p className="text-xs text-text-secondary">Current Location</p>
          ) : locationError ? (
            <div>
              <p className="text-xs text-concern">
                {locationError === 'permission_denied'
                  ? 'Location permission denied'
                  : 'Location unavailable'}
              </p>
              <button onClick={requestLocation} className="text-xs text-plum underline">
                Retry Location
              </button>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">Detecting your location…</p>
          )}
        </div>
      </Card>

      {/* Destination search */}
      <div>
        <label className="text-sm font-medium text-plum mb-1 block">To</label>
        <JourneySearch
          onSelect={handleDestinationSelect}
          disabled={isActive}
          currentLocation={sharedLocation}
        />
      </div>

      {/* Time selector */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <Clock size={16} className="text-text-secondary" />
          <span className="text-sm font-medium">Travel time</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {timePresets.map(p => (
            <button
              key={p.label}
              onClick={() => {
                const d = new Date();
                d.setHours(p.hour, 0, 0, 0);
                setTravelTime(d);
              }}
              className={`px-3 py-1 text-xs rounded-full border transition-colors ${
                travelTime.getHours() === p.hour ? 'bg-plum text-white border-plum' : 'border-gray-200 hover:bg-ivory'
              }`}
            >
              {p.label}
            </button>
          ))}
          <input
            type="time"
            value={travelTime.toTimeString().slice(0, 5)}
            onChange={e => {
              const [h, m] = e.target.value.split(':');
              const newTime = new Date(travelTime);
              newTime.setHours(h, m);
              setTravelTime(newTime);
            }}
            className="border border-gray-200 rounded-xl px-2 py-1 text-sm w-24"
          />
        </div>
      </div>

      {/* Find Routes button */}
      <Button
        onClick={handleFindRoutes}
        disabled={isLoading || isActive}
        className="w-full"
        size="lg"
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <span className="animate-spin">⏳</span> Finding Routes...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <Search size={18} /> Find Routes
          </span>
        )}
      </Button>

      {/* Destination HerSpace card (shows before routes) */}
      {destinationData && !routes.length && (
        <DestinationCard destination={destinationData} />
      )}

      {/* Route options */}
      {routes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-plum">Available Routes</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {routes.map((route, idx) => (
              <RouteCard
                key={idx}
                route={route}
                isSelected={selectedRoute === idx}
                onSelect={() => setSelectedRoute(idx)}
              />
            ))}
          </div>
          {selectedRoute !== null && (
            <>
              <SmartRecommendationCard route={currentRoute} onStartJourney={() => {}} />
              <Button onClick={startJourney} className="w-full" size="lg">
                <Play size={18} className="mr-2" /> Start Journey
              </Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default Journey;