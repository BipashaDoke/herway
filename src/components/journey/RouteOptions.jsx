// src/components/journey/RouteOptions.jsx
import { Clock, Shield, Accessibility } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const RouteOptions = ({ routes, selectedRoute, onSelectRoute, onStartJourney }) => {
  if (!routes || routes.length === 0) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'fastest': return <Clock size={18} />;
      case 'safer': return <Shield size={18} />;
      case 'accessible': return <Accessibility size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-lg border border-gray-100 p-4 space-y-3">
      <h3 className="font-semibold text-plum">Choose your journey</h3>
      <div className="space-y-2">
        {routes.map((route, idx) => {
          const isSelected = idx === selectedRoute;
          return (
            <button
              key={idx}
              onClick={() => onSelectRoute(idx)}
              className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-colors ${
                isSelected
                  ? 'border-plum bg-plum/5'
                  : 'border-gray-200 hover:bg-ivory'
              }`}
            >
              <div className="text-2xl">{getIcon(route.type)}</div>
              <div className="flex-1 text-left">
                <div className="flex items-center gap-2">
                  <span className="font-medium capitalize">{route.type}</span>
                  <Badge variant="safe">HerRoute {route.herRouteScore}</Badge>
                </div>
                <p className="text-xs text-text-secondary">
                  {route.distance} km • {route.duration} min
                </p>
              </div>
            </button>
          );
        })}
      </div>
      <Button onClick={onStartJourney} className="w-full" size="lg">
        Start Journey
      </Button>
    </div>
  );
};

export default RouteOptions;