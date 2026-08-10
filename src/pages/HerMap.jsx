import { useState, useEffect, useCallback } from 'react';
import HerMapView from '../components/map/HerMapView';
import JourneySearch from '../components/journey/JourneySearch';
import RouteOptions from '../components/journey/RouteOptions';
import JourneyScoreCard from '../components/journey/JourneyScoreCard';
import DestinationCard from '../components/journey/DestinationCard';
import GuardianMode from '../components/guardian/GuardianMode';
import QuickReport from '../components/reports/QuickReport';
import SmartRecommendationCard from '../components/journey/SmartRecommendationCard';
import Card from '../components/ui/Card';
import { MapPin, Shield } from 'lucide-react';
import { useLocation } from '../context/LocationContext';
import { useUserPreferences } from '../context/UserPreferencesContext';

const getTimeContextScore = (time) => {
  const hour = time.getHours();
  if (hour >= 6 && hour < 18) return 10;
  if (hour >= 18 && hour < 22) return 5;
  return -5;
};

const HerMap = () => {
  const { currentLocation, setCurrentLocation, showCurrentLocMarker, setShowCurrentLocMarker } = useLocation();
  const { preferences } = useUserPreferences();

  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRoute, setSelectedRoute] = useState(null);
  const [journeyStarted, setJourneyStarted] = useState(false);
  const [travelTime, setTravelTime] = useState(new Date());
  const [showGuardian, setShowGuardian] = useState(false);
  const [destinationData, setDestinationData] = useState(null);
  const [activeCategory, setActiveCategory] = useState('all');

  // Fetch routes when currentLocation and destination are set
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
        if (data.code !== 'Ok' || !data.routes) throw new Error('No routes');

        const enrichedRoutes = data.routes.map((route, idx) => {
          const dist = (route.distance / 1000).toFixed(1);
          const dur = Math.round(route.duration / 60);
          let type = 'fastest';
          let herRouteScore = 76;
          if (idx === 1) { type = 'safer'; herRouteScore = 89; }
          if (idx === 2) { type = 'accessible'; herRouteScore = 86; }
          return {
            ...route,
            type,
            herRouteScore,
            distance: dist,
            duration: dur,
            geometry: route.geometry,
            safety: 85 + Math.floor(Math.random() * 10),
            lighting: 80 + Math.floor(Math.random() * 15),
            footfall: 75 + Math.floor(Math.random() * 20),
            transport: 80 + Math.floor(Math.random() * 15),
            emergency: 85 + Math.floor(Math.random() * 10),
          };
        });
        setRoutes(enrichedRoutes);
        setSelectedRoute(0);
      } catch (err) {
        console.error(err);
        setRoutes([]);
        alert('Could not find a route. Please try again.');
      }
    };

    fetchRoutes();
  }, [currentLocation, destination]);

  const handleDestinationSelect = (place) => {
    setDestination(place);
    setDestinationData({
      name: place.name,
      herSpaceScore: 87,
    });
    setJourneyStarted(false);
    setRoutes([]);
    setSelectedRoute(null);
  };

  const handleStartJourney = () => {
    setJourneyStarted(true);
  };

  const timeContextScore = getTimeContextScore(travelTime);
  const journeyScore = routes[selectedRoute]
    ? Math.min(100, Math.max(0, routes[selectedRoute].herRouteScore + timeContextScore))
    : 0;

  return (
    <div className="h-full flex flex-col">
      {/* Search bar */}
      <div className="p-3 md:p-4 bg-surface border-b border-gray-100 flex-none">
        <div className="flex items-center gap-3 max-w-2xl mx-auto">
          <JourneySearch onSelect={handleDestinationSelect} disabled={journeyStarted} />
          <div className="hidden md:flex items-center gap-2 text-sm text-text-secondary">
            <input
              type="time"
              value={travelTime.toTimeString().slice(0, 5)}
              onChange={(e) => {
                const [h, m] = e.target.value.split(':');
                const newTime = new Date(travelTime);
                newTime.setHours(h, m);
                setTravelTime(newTime);
              }}
              className="border border-gray-200 rounded-xl px-2 py-1 text-sm"
              title="Travel time"
            />
            <span>Time context</span>
          </div>
        </div>
      </div>

      {/* Map area */}
      <div className="flex-1 min-h-0 relative">
        <HerMapView
          destination={destination?.coords || null}
          setDestination={setDestination}
          routes={routes}
          setRoutes={setRoutes}
          selectedRoute={selectedRoute}
          setSelectedRoute={setSelectedRoute}
          currentLocation={currentLocation}
          setCurrentLocation={setCurrentLocation}
          showCurrentLocMarker={showCurrentLocMarker}
          setShowCurrentLocMarker={setShowCurrentLocMarker}
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          activeServiceId={null}
          setActiveServiceId={() => {}}
          onMapReady={() => {}}
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

        {destination && routes.length > 0 && !journeyStarted && (
          <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-[1000]">
            {routes[selectedRoute] && routes[selectedRoute].weightedScore !== undefined ? (
              <SmartRecommendationCard
                route={routes[selectedRoute]}
                onStartJourney={handleStartJourney}
              />
            ) : (
              <RouteOptions
                routes={routes}
                selectedRoute={selectedRoute}
                onSelectRoute={setSelectedRoute}
                onStartJourney={handleStartJourney}
              />
            )}
          </div>
        )}

        {journeyStarted && routes.length > 0 && (
          <div className="absolute bottom-4 left-4 right-4 md:left-1/2 md:-translate-x-1/2 md:max-w-md z-[1000]">
            <Card className="p-4 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin size={18} className="text-rose" />
                <span className="font-medium">{destination.name}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>Journey Score</span>
                <span className="font-bold text-plum">{journeyScore}/100</span>
              </div>
              <p className="text-xs text-text-secondary">
                {journeyScore >= 85
                  ? 'Recommended: good lighting, high footfall'
                  : 'Be cautious, especially at night'}
              </p>
            </Card>
          </div>
        )}
      </div>

      {/* Desktop bottom panel */}
      {destination && !journeyStarted && (
        <div className="hidden md:block p-4 bg-surface border-t border-gray-100">
          <div className="max-w-2xl mx-auto grid grid-cols-2 gap-4">
            <DestinationCard destination={destinationData} />
            {routes[selectedRoute] && (
              <JourneyScoreCard
                route={routes[selectedRoute]}
                destination={destinationData}
                timeContext={travelTime}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default HerMap;