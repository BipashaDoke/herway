// src/components/journey/RouteCard.jsx
import { Shield, Zap, GitBranch } from 'lucide-react';
import Button from '../ui/Button';
import Card from '../ui/Card';

const iconMap = {
  safest: Shield,
  fastest: Zap,
  balanced: GitBranch,
};

const RouteCard = ({ type, duration, distance, safetyScore, lighting, crowd, publicTransport, isSelected, onSelect }) => {
  const Icon = iconMap[type] || Shield;
  return (
    <Card className={`cursor-pointer transition-all ${isSelected ? 'border-plum shadow-lg ring-2 ring-plum/20' : 'border-gray-200 hover:border-rose'}`}>
      <div className="flex items-start gap-3">
        <div className="text-2xl"><Icon size={28} className="text-plum" /></div>
        <div className="flex-1">
          <h4 className="font-semibold capitalize text-plum">{type}</h4>
          <div className="text-sm text-text-secondary space-y-1 mt-1">
            <p>Duration: {duration} min</p>
            <p>Distance: {distance} km</p>
            <p>Safety Score: <span className="font-medium text-plum">{safetyScore}/100</span></p>
            <p>Lighting: {lighting}</p>
            <p>Crowd: {crowd}</p>
            <p>Public transport: {publicTransport}</p>
          </div>
        </div>
      </div>
      {!isSelected && (
        <Button variant="secondary" size="sm" className="mt-3 w-full" onClick={onSelect}>
          Select Route
        </Button>
      )}
      {isSelected && <p className="text-xs text-safe mt-2 font-medium">Selected</p>}
    </Card>
  );
};

export default RouteCard;