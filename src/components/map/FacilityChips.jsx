import { Shield, Lightbulb, Building2, Bus, AlertTriangle, HeartPulse, Wrench, Footprints, ShoppingBag, AlertOctagon, Phone, Accessibility, Home } from 'lucide-react';

const chipOptions = [
  { id: 'all', label: 'All', icon: null },
  { id: 'safety', label: 'Safety', icon: Shield },
  { id: 'lighting', label: 'Lighting', icon: Lightbulb },
  { id: 'emergency', label: 'Emergency', icon: Phone },
  { id: 'facilities', label: 'Facilities', icon: Building2 },
  { id: 'transit', label: 'Transit', icon: Bus },
  { id: 'shops', label: 'Shops', icon: ShoppingBag },
  { id: 'alerts', label: 'Alerts', icon: AlertOctagon },
  { id: 'accessibility', label: 'Access', icon: Accessibility },
];

const FacilityChips = ({ activeFilters = [], setActiveFilters }) => {
  const toggleFilter = (id) => {
    setActiveFilters(prev => {
      const current = prev || [];
      if (id === 'all') return [];
      return current.includes(id) ? current.filter(f => f !== id) : [...current, id];
    });
  };

  return (
    <div className="flex gap-2 px-1 py-1 overflow-x-auto scrollbar-hide">
      {chipOptions.map(opt => {
        const isAll = opt.id === 'all';
        const isActive = isAll ? activeFilters.length === 0 : activeFilters.includes(opt.id);
        return (
          <button
            key={opt.id}
            onClick={() => toggleFilter(opt.id)}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-full border whitespace-nowrap transition-colors ${
              isActive
                ? 'bg-plum text-white border-plum'
                : 'bg-white/80 text-text-secondary border-gray-200 hover:bg-white hover:border-plum'
            }`}
          >
            {opt.icon && <opt.icon size={12} />}
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};

export default FacilityChips;