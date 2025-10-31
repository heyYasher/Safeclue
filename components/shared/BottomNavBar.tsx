
import React from 'react';
import type { View } from '../../types';
import { HomeIcon, UserIcon, ClipboardListIcon as BookingsIcon, ChatBubbleIcon, ShoppingBagIcon } from './icons';

interface BottomNavBarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const NavItem: React.FC<{
  label: string;
  icon: React.ReactNode;
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex flex-col items-center justify-center w-full h-full transition-colors duration-200 focus:outline-none ${
      isActive ? 'text-brand-orange' : 'text-slate-400 hover:text-brand-orange'
    }`}
    aria-label={label}
  >
    {icon}
    <span className={`text-xs mt-1 ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
  </button>
);


const BottomNavBar: React.FC<BottomNavBarProps> = ({ currentView, onNavigate }) => {
  const navItems: { view: View; label: string; icon: React.ReactNode }[] = [
    { view: 'user_home', label: 'Home', icon: <HomeIcon className="w-6 h-6" /> },
    { view: 'bookings', label: 'Bookings', icon: <BookingsIcon className="w-6 h-6" /> },
    { view: 'shop', label: 'Shop', icon: <ShoppingBagIcon className="w-6 h-6" /> },
    { view: 'chat', label: 'Chat', icon: <ChatBubbleIcon className="w-6 h-6" /> },
    { view: 'my_profile', label: 'Profile', icon: <UserIcon className="w-6 h-6" /> },
  ];

  return (
      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.05)] flex justify-around z-50 h-[68px] border-t border-slate-100 pt-1 pb-[calc(0.25rem+env(safe-area-inset-bottom))]">
        {navItems.map(({ view, label, icon }) => (
          <NavItem
            key={view}
            label={label}
            icon={icon}
            isActive={currentView === view}
            onClick={() => onNavigate(view)}
          />
        ))}
      </nav>
  );
};

export default BottomNavBar;