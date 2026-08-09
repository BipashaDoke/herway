import { useState, useEffect, useCallback } from 'react';
import HerMapView from '../components/map/HerMapView';
import JourneySearch from '../components/journey/JourneySearch';
import SmartRecommendationCard from '../components/journey/SmartRecommendationCard';
import GuardianMode from '../components/guardian/GuardianMode';
import QuickReport from '../components/reports/QuickReport';
import RouteSummaryCard from '../components/journey/RouteSummaryCard';
import { Shield, Clock, MapPin } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useUserPreferences } from '../context/UserPreferencesContext';

const timePresets = [
  { label: 'Now', getValue: () => new Date() },
  { label: 'Morning', hour: 8 },
  { label: 'Afternoon', hour: 13 },
  { label: 'Evening', hour: 18 },
  { label: 'Night', hour: 22 },
];

const HerMap = () => {
  const { currentLocation, setCurrentLocation, showCurrentLocMarker, setShowCurrentLocMarker } = useLocation();
  const { preferences } = useUserPreferences();

  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [travelTime, setTravelTime] = useState(new Date());
  const [showGuardian, setShowGuardian] = useState(false);
  const [facilityFilters, setFacilityFilters] = useState([]);

  // Route fetching & scoring
  useEffect(() => {
    if (!currentLocation || !destination) return;
    const fetchRoutes = async () => {
      const [lat1, lng1] = currentLocation;
      const [lat2, lng2] = destination.coords;
      const url = `https://router.project-osrm.org/route/v1/driving/${lng1},${lat1};${lng2},${lat2}?alternatives=true&geometries=geojson&overview=full`;
      try {
        const res = await fetch(url);
        if (!res.ok) throw new Error('Routing failed');
        const data = await res.json();
        if (!data.routes) throw new Error('No routes');

        const hour = travelTime.getHours();
        const enriched = data.routes.map((route, idx) => {
          const dist = (route.distance / 1000).toFixed(1);
          const dur = Math.round(route.duration / 60);
          // base mock safety metrics
          let safety = 75 + Math.floor(Math.random() * 15);
          let lighting = 70 + Math.floor(Math.random() * 20);
          let activity = 60 + Math.floor(Math.random() * 30);
          let transport = 80 + Math.floor(Math.random() * 15);
          let emergency = 85 + Math.floor(Math.random() * 10);
          // time-based adjustments
          if (hour < 6 || hour > 21) {
            safety -= 15; lighting -= 20; activity -= 25; transport -= 15;
          } else if (hour >= 18 && hour <= 21) {
            safety -= 5; lighting -= 10; activity -= 10;
          }
          safety = Math.min(100, Math.max(0, safety));
          lighting = Math.min(100, Math.max(0, lighting));
          activity = Math.min(100, Math.max(0, activity));
          transport = Math.min(100, Math.max(0, transport));
          emergency = Math.min(100, Math.max(0, emergency));
          const herRouteScore = Math.round(
            safety * 0.35 + lighting * 0.2 + activity * 0.15 + transport * 0.15 + emergency * 0.15
          );
          const type = idx === 0 ? 'fastest' : idx === 1 ? 'safer' : 'accessible';
          return { ...route, type, distance: dist, duration: dur, safety, lighting, activity, transport, emergency, herRouteScore };
        });

        // weight by user preferences
        const computeWeighted = (route) => {
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
        };
        const weightedRoutes = enriched.map(r => ({ ...r, weightedScore: computeWeighted(r) }));
        const recommended = weightedRoutes.reduce((best, curr) =>
          curr.weightedScore > best.weightedScore ? curr : best, weightedRoutes[0]
        );
        const recIdx = weightedRoutes.indexOf(recommended);
        setRoutes(weightedRoutes);
        setSelectedRoute(recIdx >= 0 ? recIdx : 0);
      } catch (err) {
        console.error('Routing error:', err);
        alert('Could not find a route. Please try again.');
      }
    };
    fetchRoutes();
  }, [currentLocation, destination, travelTime, preferences]);

  const handleDestinationSelect = (place) => {
    setDestination(place);
    setJourneyStarted(false);
    setRoutes([]);
    setSelectedRoute(null);
  };

  const handleStartJourney = () => setJourneyStarted(true);

  const currentRoute = routes[selectedRoute];

  return (
    <div className="h-full flex flex-col">
      {/* Header: search + time controls */}
      <div className="p-3 md:p-4 bg-surface border-b border-gray-100 flex-none space-y-2">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <JourneySearch onSelect={handleDestinationSelect} disabled={journeyStarted} currentLocation={currentLocation} />
          <div className="hidden md:flex items-center gap-1 text-xs">
            {timePresets.map(p => (
              <button
                key={p.label}
                onClick={() => setTravelTime(p.getValue ? p.getValue() : (() => { const d = new Date(); d.setHours(p.hour, 0, 0, 0); return d; })())}
                className={`px-2 py-1 rounded-full border transition-colors ${
                  travelTime.getHours() === (p.hour || new Date().getHours()) ? 'bg-plum text-white border-plum' : 'border-gray-200 hover:bg-ivory'
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
      </div>

      {/* Map area */}
      <div className="flex-1 min-h-0 relative">
        <HerMapView
          destination={destination?.coords || null}
          routes={routes}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          showCurrentLocMarker={showCurrentLocMarker}
          setShowCurrentLocMarker={setShowCurrentLocMarker}
          facilityFilters={facilityFilters}
          setFacilityFilters={setFacilityFilters}
          travelTime={travelTime}
        />
        {/* Floating Guardian button */}
        <div className="absolute bottom-4 left-4 z-[1000] flex flex-col gap-2">
          <button
            onClick={() => setShowGuardian(!showGuardian)}
            className="bg-white p-2 rounded-full shadow-lg border border-gray-200 hover:bg-rose/10 transition-colors"
            aria-label="Guardian Mode"
          >
            <Shield size={20} className={showGuardian ? 'text-safe' : 'text-plum'} />
          </button>
        </div>
        <QuickReport />
        {showGuardian && (
          <div className="absolute top-4 left-4 z-[1001] w-64 md:w-72">
            <GuardianMode />
          </div>
        )}
      </div>

      {/* Bottom cards: recommendation + route summary */}
      {destination && !journeyStarted && currentRoute && (
        <div className="flex-none bg-surface border-t border-gray-100 p-4 space-y-3">
          <div className="max-w-2xl mx-auto">
            <SmartRecommendationCard route={currentRoute} onStartJourney={handleStartJourney} />
            <RouteSummaryCard route={currentRoute} travelTime={travelTime} />
          </div>
        </div>
      )}

      {/* Journey active state */}
      {journeyStarted && currentRoute && (
        <div className="flex-none bg-surface border-t border-gray-100 p-4">
          <div className="max-w-2xl mx-auto text-center">
            <p className="text-lg font-medium text-plum">Journey to {destination.name}</p>
            <p className="text-sm text-text-secondary">{currentRoute.distance} km • {currentRoute.duration} min</p>
            <button onClick={() => setJourneyStarted(false)} className="mt-2 text-sm text-rose underline">
              End Journey
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HerMap;