import { NavLink } from 'react-router-dom';
import { Map, Compass, MapPin, User } from 'lucide-react';

const items = [
  { to: '/', label: 'HerMap', icon: Map },
  { to: '/journey', label: 'Journey', icon: Compass },
  { to: '/places', label: 'Places', icon: MapPin },
  { to: '/profile', label: 'Profile', icon: User },
];

const MobileNav = () => (
  <nav className="md:hidden flex-none h-16 bg-surface border-t border-gray-100 shadow-[0_-1px_3px_rgba(0,0,0,0.05)] z-30">
    <div className="flex items-center justify-around h-full">
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