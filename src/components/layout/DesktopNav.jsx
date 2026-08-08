import { NavLink } from 'react-router-dom';
import { Map, Compass, MapPin, User } from 'lucide-react';
import HerWayLogo from '../branding/HerWayLogo';

const navItems = [
  { to: '/', label: 'HerMap', icon: Map },
  { to: '/journey', label: 'Journey', icon: Compass },
  { to: '/places', label: 'Places', icon: MapPin },
  { to: '/profile', label: 'Profile', icon: User },
];

const DesktopNav = () => (
  <header className="hidden md:flex items-center justify-between h-16 px-6 bg-surface border-b border-gray-100 sticky top-0 z-30">
    {/* Logo with text – always visible on desktop */}
    <NavLink to="/" className="flex items-center gap-2">
      <HerWayLogo />
    </NavLink>

    <nav className="flex items-center gap-1">
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
              isActive
                ? 'bg-plum/10 text-plum'
                : 'text-text-secondary hover:text-text-primary hover:bg-gray-50'
            }`
          }
        >
          <Icon size={18} />
          {label}
        </NavLink>
      ))}
    </nav>

    <button
      className="w-9 h-9 rounded-full bg-rose/10 flex items-center justify-center text-rose hover:bg-rose/20 transition-colors"
      aria-label="Profile"
    >
      <User size={18} />
    </button>
  </header>
);

export default DesktopNav;