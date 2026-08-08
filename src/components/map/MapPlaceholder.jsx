import { MapPin, Shield } from 'lucide-react';
import Badge from '../ui/Badge';

const zoneIndicators = [
  { top: '25%', left: '30%', variant: 'safe', label: 'Safer' },
  { top: '55%', left: '65%', variant: 'caution', label: 'Needs attention' },
  { top: '15%', left: '70%', variant: 'concern', label: 'Concern' },
];

const MapPlaceholder = () => (
  <div className="relative w-full h-full min-h-[400px] bg-gray-100 map-grid-bg rounded-2xl overflow-hidden border border-gray-200">
    {/* Central location marker */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
      <div className="relative">
        <MapPin size={36} className="text-plum drop-shadow-md" fill="#5B315D" />
        <div className="absolute -top-1 -left-1 w-10 h-10 rounded-full bg-plum/20 animate-ping" />
      </div>
      <span className="mt-2 px-3 py-1 bg-surface rounded-full text-xs font-medium shadow-sm border border-gray-200">
        📍 You are here
      </span>
    </div>

    {/* Zone indicators */}
    {zoneIndicators.map((zone, idx) => (
      <div
        key={idx}
        className="absolute flex flex-col items-center gap-1"
        style={{ top: zone.top, left: zone.left }}
      >
        <div
          className={`w-4 h-4 rounded-full border-2 border-white shadow-sm ${
            zone.variant === 'safe'
              ? 'bg-safe'
              : zone.variant === 'caution'
              ? 'bg-caution'
              : 'bg-concern'
          }`}
        />
        <Badge variant={zone.variant}>{zone.label}</Badge>
      </div>
    ))}

    {/* Placeholder disclaimer */}
    <div className="absolute bottom-3 left-3 right-3 md:left-auto md:right-3 md:w-auto bg-white/80 backdrop-blur-sm rounded-xl px-3 py-1.5 text-xs text-text-secondary text-center">
      🧪 Placeholder map — real safety data coming soon
    </div>

    {/* Guardian button (floating) */}
    <button
      className="absolute bottom-3 right-3 md:bottom-16 md:right-6 flex items-center gap-2 bg-surface rounded-2xl shadow-lg px-4 py-2.5 border border-gray-200 text-plum font-medium hover:bg-plum/5 transition-colors"
      aria-label="Guardian Mode"
    >
      <Shield size={18} />
      <span className="hidden sm:inline">Guardian Mode</span>
    </button>
  </div>
);

export default MapPlaceholder;