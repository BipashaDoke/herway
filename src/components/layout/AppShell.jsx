import { Outlet } from 'react-router-dom';
import DesktopNav from './DesktopNav';
import MobileNav from './MobileNav';
import HerWayLogo from '../branding/HerWayLogo';
import { User } from 'lucide-react';

const AppShell = () => (
  <div className="min-h-screen flex flex-col bg-ivory">
    {/* Desktop top navigation */}
    <DesktopNav />

    {/* Mobile top header (compact) */}
    <div className="md:hidden sticky top-0 z-20 bg-surface border-b border-gray-100 px-4 h-14 flex items-center justify-between">
      <HerWayLogo compact />
      <button
        className="w-8 h-8 rounded-full bg-rose/10 flex items-center justify-center text-rose hover:bg-rose/20"
        aria-label="Profile"
      >
        <User size={16} />
      </button>
    </div>

    {/* Main content area (map / pages) */}
    <main className="flex-1 pb-16 md:pb-0">
      <Outlet />
    </main>

    {/* Mobile bottom navigation */}
    <MobileNav />
  </div>
);

export default AppShell;