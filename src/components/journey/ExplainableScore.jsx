import { useState } from 'react';
import { ChevronDown, ChevronUp, Shield, Eye, Footprints, Truck, AlertTriangle, Users } from 'lucide-react';
import Card from '../ui/Card';
import Badge from '../ui/Badge';

const factors = [
  { key: 'safety', label: 'Safety', icon: Shield, weight: 30 },
  { key: 'lighting', label: 'Lighting', icon: Eye, weight: 20 },
  { key: 'footfall', label: 'Footfall', icon: Footprints, weight: 15 },
  { key: 'transport', label: 'Transport', icon: Truck, weight: 15 },
  { key: 'emergency', label: 'Emergency', icon: AlertTriangle, weight: 10 },
  { key: 'community', label: 'Community', icon: Users, weight: 10 },
];

const ExplainableScore = ({ score, breakdown, confidence }) => {
  const [showDetails, setShowDetails] = useState(false);

  return (
    <Card className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-plum">Journey Score</h3>
        <span className="text-2xl font-bold text-plum">{score}/100</span>
      </div>
      {breakdown && (
        <div className="space-y-1">
          {Object.entries(breakdown).map(([key, value]) => (
            <div key={key} className="flex justify-between text-sm">
              <span>{key.charAt(0).toUpperCase() + key.slice(1)}</span>
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setShowDetails(!showDetails)}
        className="flex items-center gap-1 text-xs text-text-secondary hover:text-plum transition-colors"
      >
        {showDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        How is this score calculated?
      </button>
      {showDetails && (
        <div className="text-xs space-y-2 mt-2">
          <p className="font-medium">Weightings</p>
          {factors.map(f => (
            <div key={f.key} className="flex items-center justify-between">
              <span className="flex items-center gap-1"><f.icon size={12} /> {f.label}</span>
              <span>{f.weight}%</span>
            </div>
          ))}
          <div className="flex items-center gap-2 mt-2">
            <span>Data confidence:</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="h-full bg-safe rounded-full"
                style={{ width: `${confidence}%` }}
              />
            </div>
            <span className="text-safe font-medium">{confidence}%</span>
          </div>
          <p className="text-text-secondary">
            Based on {confidence > 80 ? 'high' : confidence > 50 ? 'moderate' : 'limited'} community data and infrastructure information.
          </p>
        </div>
      )}
      <p className="text-xs text-text-secondary">* Demo intelligence – not real‑time safety data</p>
    </Card>
  );
};

export default ExplainableScore;