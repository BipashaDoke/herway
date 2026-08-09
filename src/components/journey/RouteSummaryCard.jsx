import Card from '../ui/Card';
import { Shield, Lightbulb, Footprints, Bus, AlertTriangle, Clock } from 'lucide-react';

const RouteSummaryCard = ({ route, travelTime }) => {
  if (!route) return null;
  const hour = travelTime?.getHours() || 12;
  const isNight = hour < 6 || hour > 20;
  return (
    <Card className="mt-3 space-y-3">
      <h4 className="font-medium text-sm text-plum">Route Details</h4>
      <div className="grid grid-cols-2 gap-2 text-sm">
        <div className="flex items-center gap-2"><Shield size={14} className="text-safe" /> Safety <span className="ml-auto font-medium">{route.safety}/100</span></div>
        <div className="flex items-center gap-2"><Lightbulb size={14} className={isNight ? 'text-concern' : 'text-safe'} /> Lighting <span className="ml-auto font-medium">{route.lighting}/100</span></div>
        <div className="flex items-center gap-2"><Footprints size={14} /> Activity <span className="ml-auto font-medium">{route.activity}/100</span></div>
        <div className="flex items-center gap-2"><Bus size={14} /> Transit <span className="ml-auto font-medium">{route.transport}/100</span></div>
        <div className="flex items-center gap-2"><AlertTriangle size={14} /> Emergency <span className="ml-auto font-medium">{route.emergency}/100</span></div>
        <div className="flex items-center gap-2"><Clock size={14} /> Time <span className="ml-auto font-medium">{isNight ? 'Night' : 'Day'}</span></div>
      </div>
      {isNight && <p className="text-xs text-concern">⚠ Safety decreases after dark. Some facilities may be closed.</p>}
      <p className="text-xs text-text-secondary">* Demo intelligence – not real‑time data</p>
    </Card>
  );
};

export default RouteSummaryCard;