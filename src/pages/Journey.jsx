import { useState } from 'react';
import { MapPin, Search, Navigation, CheckCircle } from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import RouteCard from '../components/journey/RouteCard';
import { useLocation } from '../context/LocationContext';

const mockRoutes = [
  { type: 'safest', duration: 24, distance: 4.2, safetyScore: 91, lighting: 'Good', crowd: 'Moderate', publicTransport: 'Nearby' },
  { type: 'fastest', duration: 18, distance: 3.8, safetyScore: 68, lighting: 'Average', crowd: 'Low', publicTransport: 'Nearby' },
  { type: 'balanced', duration: 21, distance: 4.0, safetyScore: 84, lighting: 'Good', crowd: 'Moderate', publicTransport: 'Available' },
];

const Journey = () => {
  const { currentLocation } = useLocation();
  const [destinationInput, setDestinationInput] = useState('');
  const [destination, setDestination] = useState(null);
  const [routes, setRoutes] = useState([]);
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(null);
  const [journeyActive, setJourneyActive] = useState(false);
  const [journeyCompleted, setJourneyCompleted] = useState(false);
  const [showRoutes, setShowRoutes] = useState(false);

  const handleFindRoutes = () => {
    if (destinationInput.trim()) {
      setDestination(destinationInput.trim());
      // Simulate API call - use mock routes
      setRoutes(mockRoutes);
      setShowRoutes(true);
      setSelectedRouteIndex(null);
      setJourneyActive(false);
      setJourneyCompleted(false);
    }
  };

  const handleSelectRoute = (index) => {
    setSelectedRouteIndex(index);
  };

  const handleStartJourney = () => {
    if (selectedRouteIndex !== null) {
      setJourneyActive(true);
      setShowRoutes(false);
    }
  };

  const handleEndJourney = () => {
    setJourneyActive(false);
    setJourneyCompleted(true);
  };

  const handlePlanAnother = () => {
    setDestinationInput('');
    setDestination(null);
    setRoutes([]);
    setSelectedRouteIndex(null);
    setJourneyActive(false);
    setJourneyCompleted(false);
    setShowRoutes(false);
  };

  const selectedRoute = selectedRouteIndex !== null ? routes[selectedRouteIndex] : null;

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 space-y-6 pb-20 md:pb-6">
      <h1 className="text-2xl font-bold text-plum">Your Journey</h1>

      {/* Current location */}
      <Card className="p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-plum/10 flex items-center justify-center">
          <MapPin size={20} className="text-plum" />
        </div>
        <div>
          <p className="text-sm text-text-secondary">Current location</p>
          <p className="font-medium">{currentLocation ? 'Location detected' : 'Locating...'}</p>
        </div>
      </Card>

      {/* Destination search if no journey active/completed */}
      {!journeyActive && !journeyCompleted && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary" />
              <input
                type="text"
                placeholder="Where do you want to go?"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-surface border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-plum/20 focus:border-plum transition"
              />
            </div>
            <Button onClick={handleFindRoutes} disabled={!destinationInput.trim()}>
              Find Routes
            </Button>
          </div>

          {/* Route comparison */}
          {showRoutes && destination && routes.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-plum">Routes for {destination}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {routes.map((route, index) => (
                  <RouteCard
                    key={route.type}
                    {...route}
                    isSelected={index === selectedRouteIndex}
                    onSelect={() => handleSelectRoute(index)}
                  />
                ))}
              </div>
              {selectedRouteIndex !== null && (
                <Button onClick={handleStartJourney} size="lg" className="w-full">
                  <Navigation size={18} className="mr-2" />
                  Start Journey
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Active journey */}
      {journeyActive && selectedRoute && (
        <Card className="space-y-4 bg-plum/5 border-plum">
          <div className="flex items-center gap-2 text-safe font-medium">
            <div className="w-2 h-2 rounded-full bg-safe animate-pulse" />
            Journey Started
          </div>
          <div>
            <p className="text-sm text-text-secondary">Destination</p>
            <p className="text-lg font-semibold text-plum">{destination}</p>
          </div>
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-text-secondary">ETA</p>
              <p className="font-medium">{selectedRoute.duration} min</p>
            </div>
            <div>
              <p className="text-text-secondary">Distance</p>
              <p className="font-medium">{selectedRoute.distance} km</p>
            </div>
            <div>
              <p className="text-text-secondary">Safety Score</p>
              <p className="font-medium text-plum">{selectedRoute.safetyScore}/100</p>
            </div>
            <div>
              <p className="text-text-secondary">Lighting</p>
              <p className="font-medium">{selectedRoute.lighting}</p>
            </div>
            <div>
              <p className="text-text-secondary">Crowd</p>
              <p className="font-medium">{selectedRoute.crowd}</p>
            </div>
            <div>
              <p className="text-text-secondary">Public transport</p>
              <p className="font-medium">{selectedRoute.publicTransport}</p>
            </div>
          </div>
          <Button onClick={handleEndJourney} variant="secondary" className="w-full">
            End Journey
          </Button>
        </Card>
      )}

      {/* Journey completed */}
      {journeyCompleted && selectedRoute && (
        <Card className="space-y-4 text-center">
          <CheckCircle size={40} className="mx-auto text-safe" />
          <h2 className="text-xl font-bold text-plum">Journey Completed</h2>
          <p className="text-text-secondary">You reached {destination} safely!</p>
          <div className="text-sm text-text-secondary space-y-1">
            <p>Route: {selectedRoute.type}</p>
            <p>Duration: {selectedRoute.duration} min</p>
          </div>
          <Button onClick={handlePlanAnother} variant="primary" className="w-full">
            Plan Another Journey
          </Button>
        </Card>
      )}
    </div>
  );
};

export default Journey;