// src/components/journey/DestinationCard.jsx
import { MapPin, ShieldCheck, Eye, Accessibility, Droplets, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const DestinationCard = ({ destination }) => {
  if (!destination) return null;

  return (
    <Card className="space-y-3">
      <div className="flex items-center gap-2">
        <MapPin size={18} className="text-rose" />
        <h3 className="font-semibold">{destination.name}</h3>
      </div>
      <Badge variant="safe">HerSpace {destination.herSpaceScore}/100</Badge>
      <div className="space-y-1 text-sm">
        <div className="flex items-center gap-2"><ShieldCheck size={14} className="text-safe" /> Security</div>
        <div className="flex items-center gap-2"><Accessibility size={14} className="text-safe" /> Accessibility</div>
        <div className="flex items-center gap-2"><Droplets size={14} className="text-caution" /> Menstrual facilities (limited)</div>
        <div className="flex items-center gap-2"><AlertTriangle size={14} className="text-safe" /> Emergency access</div>
      </div>
      <p className="text-xs text-text-secondary">* Demo data</p>
    </Card>
  );
};

export default DestinationCard;