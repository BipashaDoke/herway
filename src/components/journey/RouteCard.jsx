import { Shield, Zap, Compass, Clock, MapPin, Lightbulb, Users, Bus, AlertTriangle } from 'lucide-react';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

const typeConfig = {
  safest: { icon: Shield, color: 'text-safe', label: 'Safest' },
  fastest: { icon: Zap, color: 'text-caution', label: 'Fastest' },
  balanced: { icon: Compass, color: 'text-plum', label: 'Balanced' },
};

const RouteCard = ({ route, isSelected, onSelect }) => {
  if (!route) return null;

  const config = typeConfig[route.type] || typeConfig.balanced;
  const Icon = config.icon;

  // Fallback values – everything should be defined, but just in case
  const duration = route.duration || '--';
  const distance = route.distance || '--';
  const safety = route.safety ?? route.herRouteScore ?? 0;
  const lighting = route.lighting ?? '--';
  const crowd = route.crowd ?? '--';
  const transport = route.transport ?? '--';
  const emergency = route.emergency ?? '--';

  return (
    <div
      className={`relative bg-surface rounded-2xl border-2 p-4 flex flex-col gap-3 transition-colors ${
        isSelected ? 'border-plum shadow-md' : 'border-gray-100 hover:border-rose'
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon size={20} className={config.color} />
          <span className="font-semibold text-plum">{config.label}</span>
        </div>
        <Badge variant={safety >= 80 ? 'safe' : safety >= 60 ? 'caution' : 'concern'}>
          {safety}/100
        </Badge>
      </div>

      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2"><Clock size={14} className="text-text-secondary" /> <span>{duration} min</span></div>
        <div className="flex items-center gap-2"><MapPin size={14} className="text-text-secondary" /> <span>{distance} km</span></div>
      </div>

      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs text-text-secondary">
        <div className="flex items-center gap-1"><Lightbulb size={12} /> Lighting: {typeof lighting === 'number' ? `${lighting}%` : lighting}</div>
        <div className="flex items-center gap-1"><Users size={12} /> Crowd: {typeof crowd === 'number' ? `${crowd}%` : crowd}</div>
        <div className="flex items-center gap-1"><Bus size={12} /> Transport: {typeof transport === 'number' ? `${transport}%` : transport}</div>
        <div className="flex items-center gap-1"><AlertTriangle size={12} /> Emergency: {typeof emergency === 'number' ? `${emergency}%` : emergency}</div>
      </div>

      <Button
        variant={isSelected ? 'primary' : 'secondary'}
        size="sm"
        className="w-full mt-1"
        onClick={onSelect}
      >
        {isSelected ? 'Selected' : 'Select Route'}
      </Button>
    </div>
  );
};

export default RouteCard;