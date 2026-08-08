import { NavLink } from 'react-router-dom';
import { Map, Compass, MapPin, User } from 'lucide-react';

const items = [
  { to: '/', label: 'HerMap', icon: Map },
  { to: '/journey', label: 'Journey', icon: Compass },
  { to: '/places', label: 'Places', icon: MapPin },
  { to: '/profile', label: 'Profile', icon: User },
];

const MobileNav = () => (
  <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-surface border-t border-gray-100 z-30 safe-area-bottom">
    <div className="flex items-center justify-around h-16">
      {items.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex flex-col items-center justify-center gap-0.5 px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
              isActive
                ? 'text-plum'
                : 'text-text-secondary hover:text-text-primary'
            }`
          }
        >
          <Icon size={20} />
          <span>{label}</span>
        </NavLink>
      ))}
    </div>
  </nav>
);

export default MobileNav;