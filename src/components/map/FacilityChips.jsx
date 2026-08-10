import { Shield, Lightbulb, Phone, Building2, Bus, ShoppingBag, AlertOctagon, Accessibility } from 'lucide-react';

const chipOptions = [
  { id: 'all', label: 'All', icon: null },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
  { id: 'emergency', label: 'Emergency', icon: Phone },
  { id: 'facilities', label: 'Facilities', icon: Building2 },
  { id: 'transit', label: 'Transit', icon: Bus },
  { id: 'shops', label: 'Shops', icon: ShoppingBag },
  { id: 'alerts', label: 'Alerts', icon: AlertOctagon },
  { id: 'access', label: 'Access', icon: Accessibility },
];

const FacilityChips = ({ activeCategory = 'all', setActiveCategory }) => {
  return (
    <div className="flex gap-2 px-1 py-1 overflow-x-auto scrollbar-hide">
      {chipOptions.map(opt => (
        <button
          key={opt.id}
          onClick={() => setActiveCategory(opt.id)}
          className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-colors ${
            activeCategory === opt.id
              ? 'bg-plum text-white border-plum'
              : 'bg-white/80 text-text-secondary border-gray-200 hover:bg-white hover:border-plum'
          }`}
        >
          {opt.icon && <opt.icon size={12} />}
          {opt.label}
        </button>
      ))}
    </div>
  );
};

export default FacilityChips;