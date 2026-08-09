import { Shield, Clock, Accessibility, Sparkles } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const SmartRecommendationCard = ({ route, onStartJourney }) => {
  if (!route) return null;

  const isNight = new Date().getHours() < 6 || new Date().getHours() > 20;
  const getIcon = (type) => {
    switch (type) {
      case 'safer': return <Shield size={18} />;
      case 'fastest': return <Clock size={18} />;
      case 'accessible': return <Accessibility size={18} />;
      default: return <Shield size={18} />;
    }
  };

  return (
    <div className="bg-surface rounded-2xl shadow-lg border-2 border-rose p-4 space-y-3">
      <div className="flex items-center gap-2">
        <Sparkles size={16} className="text-rose" />
        <span className="font-semibold text-plum">Recommended for you 🌸</span>
      </div>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-lg font-bold capitalize">{route.type} Route</p>
          <p className="text-sm text-text-secondary">{route.distance} km • {route.duration} min</p>
        </div>
        <Badge variant="safe">Journey Score {route.herRouteScore || route.weightedScore?.toFixed(0)}</Badge>
      </div>
      <div className="text-xs space-y-1">
        {route.lighting > 70 ? <p>✓ Good lighting</p> : <p>⚠ Dim lighting</p>}
        {route.activity > 60 ? <p>✓ High activity</p> : <p>⚠ Low activity</p>}
        {route.transport > 70 ? <p>✓ Good transport</p> : <p>⚠ Limited transport</p>}
        {route.emergency > 80 ? <p>✓ Emergency access nearby</p> : <p>⚠ Limited emergency access</p>}
        {isNight && <p className="text-concern">⚠ Night travel – extra caution</p>}
      </div>
      <Button onClick={onStartJourney} className="w-full" size="lg">
        Start Journey
      </Button>
    </div>
  );
};

export default SmartRecommendationCard;