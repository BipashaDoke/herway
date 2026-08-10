import { ChevronRight } from 'lucide-react';

const categoryIcons = {
  safety: '🛡',
  lighting: '💡',
  emergency: '🚑',
  facilities: '🏢',
  transit: '🚌',
  shops: '🛍',
  alerts: '⚠️',
  access: '♿',
};

const NearbyServices = ({ activeCategory, services, onServiceClick }) => {
  const filtered = activeCategory === 'all'
    ? services
    : services.filter(s => s.type === activeCategory);

  if (filtered.length === 0) {
    return (
      <div className="p-3">
        <p className="text-sm text-text-secondary">No nearby services found for this category.</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-plum mb-2">Nearby Services</h4>
      <p className="text-xs text-text-secondary -mt-1 mb-3">Around your journey</p>
      {filtered.map(service => (
        <div
          key={service.id}
          className="flex items-center justify-between bg-ivory rounded-xl p-3 cursor-pointer hover:bg-rose/5 transition-colors"
          onClick={() => onServiceClick(service)}
        >
          <div className="flex items-center gap-3">
            <span className="text-xl">{categoryIcons[service.type] || '📍'}</span>
            <div>
              <p className="text-sm font-medium">{service.name}</p>
              <div className="flex items-center gap-2 text-xs text-text-secondary">
                <span>{service.distance}</span>
                {service.onRoute && <span className="text-safe">✓ On your route</span>}
                <span>• {service.status}</span>
              </div>
            </div>
          </div>
          <ChevronRight size={16} className="text-text-secondary" />
        </div>
      ))}
    </div>
  );
};

export default NearbyServices;