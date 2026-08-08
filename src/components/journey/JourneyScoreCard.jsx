// src/components/journey/JourneyScoreCard.jsx
import { Shield, Zap, Eye, Footprints, Truck, AlertTriangle } from 'lucide-react';
import Card from '../ui/Card';

const JourneyScoreCard = ({ route, destination, timeContext }) => {
  if (!route) return null;

  return (
    <Card className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-plum">HerRoute Score</h3>
        <span className="text-2xl font-bold text-plum">{route.herRouteScore}/100</span>
      </div>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between"><span className="flex items-center gap-2"><Shield size={14} /> Safety</span><span className="font-medium">{route.safety}</span></div>
        <div className="flex justify-between"><span className="flex items-center gap-2"><Eye size={14} /> Lighting</span><span className="font-medium">{route.lighting}</span></div>
        <div className="flex justify-between"><span className="flex items-center gap-2"><Footprints size={14} /> Footfall</span><span className="font-medium">{route.footfall}</span></div>
        <div className="flex justify-between"><span className="flex items-center gap-2"><Truck size={14} /> Transport</span><span className="font-medium">{route.transport}</span></div>
        <div className="flex justify-between"><span className="flex items-center gap-2"><AlertTriangle size={14} /> Emergency</span><span className="font-medium">{route.emergency}</span></div>
      </div>
      <p className="text-xs text-text-secondary">* Safety intelligence — MVP demo data</p>
    </Card>
  );
};

export default JourneyScoreCard;