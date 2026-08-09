import { useState, useEffect, useRef } from 'react';
import { Search, MapPin, Clock, Play, StopCircle, AlertTriangle } from 'lucide-react';
import { useJourney } from '../context/JourneyContext';
import { useLocation } from '../context/LocationContext';
import { useUserPreferences } from '../context/UserPreferencesContext';
import HerMapView from '../components/map/HerMapView';
import JourneySearch from '../components/journey/JourneySearch';
import RouteCard from '../components/journey/RouteCard';
import RouteSummaryCard from '../components/journey/RouteSummaryCard';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const timePresets = [
  { label: 'Morning', hour: 8 },
  { label: 'Afternoon', hour: 13 },
  { label: 'Evening', hour: 18 },
  { label: 'Night', hour: 22 },
];

// Compute a deterministic time factor (0-100) based on hour
const getTimeFactor = (hour) => {
  if (hour >= 6 && hour < 18) return 90;      // daytime – good
  if (hour >= 18 && hour < 22) return 60;     // evening – moderate
  return 30;                                   // night – poor
};

// Compute risk penalty based on time and lighting
const getRiskPenalty = (hour, lighting) => {
  let penalty = 0;
  if (hour < 6 || hour > 21) penalty += 15;   // night penalty
  if (lighting < 50) penalty += 10;           // poor lighting penalty
  return penalty;
};

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
  const [facilityFilters, setFacilityFilters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const watchIdRef = useRef(null);

  // Sync start location from global GPS
  useEffect(() => {
    if (sharedLocation) setStartLocation({ name: 'Current Location', coords: sharedLocation });
  }, [sharedLocation, setStartLocation]);

  // Live location watcher for active journey
  useEffect(() => {
    if (isActive) {
      if (navigator.geolocation) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (pos) => setCurrentLocation([pos.coords.latitude, pos.coords.longitude]),
          () => {},
          { enableHighAccuracy: true, maximumAge: 10000 }
        );
      }
      return () => { if (watchIdRef.current) navigator.geolocation?.clearWatch(watchIdRef.current); };
    }
  }, [isActive, setCurrentLocation]);

  // Geocode typed destination if not already selected from suggestions
  const geocodeDestination = async (text) => {
    if (destination?.coords) return destination;
    if (!text.trim()) return null;
    try {
      const params = new URLSearchParams({ q: text, format: 'json', limit: 1 });
      if (sharedLocation) params.append('lat', sharedLocation[0]).append('lon', sharedLocation[1]);
      const res = await fetch(`https://nominatim.openstreetmap.org/search?${params}`);
      const data = await res.json();
      if (data.length > 0) return { name: data[0].display_name, coords: [parseFloat(data[0].lat), parseFloat(data[0].lon)] };
    } catch {}
    return null;
  };

  const handleFindRoutes = async () => {
    if (!sharedLocation) {
      if (locationError === 'permission_denied') alert('Location permission required.');
      else if (isLocating) alert('Detecting location… please wait.');
      else alert('Location unavailable. Retry?');
      return;
    }

    let dest = destination;
    if (!dest?.coords) {
      dest = await geocodeDestination(destinationInput);
      if (dest) setDestination(dest);
      else { alert('Please select a valid destination.'); return; }
    }

    setIsLoading(true);
    try {
      const [lat1, lng1] = sharedLocation;
      const [lat2, lng2] = dest.coords;
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?alternatives=true&geometries=geojson&overview=full`;
      const res = await fetch(url);
      const data = await res.json();
      if (!data.routes?.length) throw new Error('No routes');

      const hour = travelTime.getHours();
      const timeFactor = getTimeFactor(hour);

      // Helper to generate a fully‑populated route object
      const createRoute = (osrmRoute, type) => {
        const dist = (osrmRoute.distance / 1000).toFixed(1);
        const dur = Math.round(osrmRoute.duration / 60);

        // Base mock metrics (we'll adjust per type)
        let lighting = 70, crowd = 60, emergency = 80, facilities = 70;
        // Adjust based on type
        if (type === 'safest') {
          lighting = 90; crowd = 85; emergency = 95; facilities = 85;
        } else if (type === 'fastest') {
          lighting = 60; crowd = 50; emergency = 70; facilities = 60;
        } else { // balanced
          lighting = 80; crowd = 75; emergency = 85; facilities = 75;
        }

        // Apply time-of-day adjustments to lighting/crowd
        if (hour < 6 || hour > 21) {
          lighting = Math.max(0, lighting - 20);
          crowd = Math.max(0, crowd - 25);
        } else if (hour >= 18 && hour <= 21) {
          lighting = Math.max(0, lighting - 10);
          crowd = Math.max(0, crowd - 10);
        }

        // Safety Score = 0.30*lighting + 0.20*crowd + 0.20*emergency + 0.15*facilities + 0.15*timeFactor
        let safetyScore = Math.round(
          0.30 * lighting + 0.20 * crowd + 0.20 * emergency + 0.15 * facilities + 0.15 * timeFactor
        );
        // Risk penalty
        const riskPenalty = getRiskPenalty(hour, lighting);
        safetyScore = Math.max(0, Math.min(100, safetyScore - riskPenalty));

        return {
          ...osrmRoute,
          type,
          distance: dist,
          duration: dur,
          safety: safetyScore,
          lighting,
          crowd,
          transport: emergency,  // we map 'emergency' to transport for the card
          emergency,             // keep raw emergency score
          facilities,
          herRouteScore: safetyScore,
          geometry: osrmRoute.geometry,
        };
      };

      let baseRoutes = data.routes;
      let enriched = [];
      if (baseRoutes.length >= 2) {
        enriched = [
          createRoute(baseRoutes[1], 'safest'),  // use second as safest (maybe longer)
          createRoute(baseRoutes[0], 'fastest'), // first as fastest
          createRoute(baseRoutes[0], 'balanced'), // balanced from first
        ];
        // Adjust balanced duration slightly
        enriched[2].duration = Math.round(parseFloat(enriched[0].duration) * 1.1).toString();
      } else if (baseRoutes.length === 1) {
        enriched = [
          createRoute(baseRoutes[0], 'safest'),
          createRoute(baseRoutes[0], 'fastest'),
          createRoute(baseRoutes[0], 'balanced'),
        ];
        enriched[0].duration = Math.round(parseFloat(enriched[0].duration) * 1.25).toString();
        enriched[2].duration = Math.round(parseFloat(enriched[0].duration) * 1.1).toString();
      }

      setRoutes(enriched);
      setSelectedRoute(null);
    } catch (err) {
      console.error(err);
      alert('Unable to calculate routes. Try again later.');
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
            facilityFilters={facilityFilters}
            setFacilityFilters={setFacilityFilters}
            travelTime={travelTime}
          />
        </div>
        <div className="flex-none bg-surface border-t p-3">
          <RouteSummaryCard route={currentRoute} travelTime={travelTime} />
        </div>
      </div>
    );
  }

  // ----- PLANNING MODE -----
  return (
    <div className="h-full overflow-y-auto p-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-plum">Plan Your Journey</h1>
      <Card className="flex items-center gap-3">
        <MapPin size={20} className="text-rose" />
        <div>
          <p className="text-sm font-medium">From</p>
          {sharedLocation ? (
            <p className="text-xs text-text-secondary">Current Location</p>
          ) : locationError ? (
            <div>
              <p className="text-xs text-concern">{locationError === 'permission_denied' ? 'Permission denied' : 'Unavailable'}</p>
              <button onClick={requestLocation} className="text-xs text-plum underline">Retry Location</button>
            </div>
          ) : (
            <p className="text-xs text-text-secondary">Detecting…</p>
          )}
        </div>
      </Card>

      <div>
        <label className="text-sm font-medium text-plum mb-1 block">To</label>
        <JourneySearch onSelect={handleDestinationSelect} disabled={isActive} currentLocation={sharedLocation} />
      </div>

      <div>
        <div className="flex items-center gap-2 mb-2"><Clock size={16} /> <span className="text-sm font-medium">Travel time</span></div>
        <div className="flex flex-wrap gap-2">
          {timePresets.map(p => (
            <button key={p.label} onClick={() => { const d = new Date(); d.setHours(p.hour,0,0,0); setTravelTime(d); }}
              className={`px-3 py-1 text-xs rounded-full border ${travelTime.getHours() === p.hour ? 'bg-plum text-white border-plum' : 'border-gray-200 hover:bg-ivory'}`}
            >{p.label}</button>
          ))}
          <input type="time" value={travelTime.toTimeString().slice(0,5)} onChange={e => { const [h,m]=e.target.value.split(':'); const d=new Date(travelTime); d.setHours(h,m); setTravelTime(d); }}
            className="border border-gray-200 rounded-xl px-2 py-1 text-sm w-24" />
        </div>
      </div>

      <Button onClick={handleFindRoutes} disabled={isLoading || isActive} className="w-full" size="lg">
        {isLoading ? <><span className="animate-spin">⏳</span> Finding Routes...</> : <><Search size={18} /> Find Routes</>}
      </Button>

      {routes.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-plum">Available Routes</h2>
          <div className="grid gap-3 md:grid-cols-3">
            {routes.map((route, idx) => (
              <RouteCard key={idx} route={route} isSelected={selectedRoute === idx} onSelect={() => setSelectedRoute(idx)} />
            ))}
          </div>
          {selectedRoute !== null && (
            <Button onClick={startJourney} className="w-full" size="lg"><Play size={18} /> Start Journey</Button>
          )}
        </div>
      )}
    </div>
  );
};

export default Journey;