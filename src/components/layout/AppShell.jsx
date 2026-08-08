import { Outlet } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import HerWayLogo from '../branding/HerWayLogo';
import { User } from 'lucide-react';

const AppShell = () => (
  <div className="h-screen flex flex-col overflow-hidden bg-ivory">
    {/* Desktop top navigation (hidden on mobile) */}
    <DesktopNav />

    {/* Mobile top header (visible only on small screens) */}
    <div className="md:hidden sticky top-0 z-20 bg-surface border-b border-gray-100 px-4 h-14 flex items-center justify-between flex-none">
      <HerWayLogo />
      <button
        className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose hover:bg-rose/20"
        aria-label="Profile"
      >
        <User size={16} />
      </button>
    </div>

    {/* Main content – allows vertical scrolling when needed, extra bottom space for mobile nav */}
    <div className="flex-1 min-h-0 flex flex-col overflow-y-auto pb-16 md:pb-0">
      <Outlet />
    </div>

    {/* Mobile bottom navigation */}
    <MobileNav />
  </div>
);

export default AppShell;