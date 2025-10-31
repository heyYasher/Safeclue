
import React, { useState, useRef, useEffect } from 'react';
import { User, UserRole, Notification } from '../../types';
import type { View } from '../../types';
import { 
    SafeClueLogo, 
    LogoutIcon, 
    ChevronLeftIcon,
    BellIcon,
    UserIcon,
    CalendarIcon,
    WalletIcon,
    CogIcon
} from './icons';

interface HeaderProps {
  user: User;
  onLogout: () => void;
  onBack?: () => void;
  onNavigate?: (view: View) => void;
  notifications?: Notification[];
}

const maskMobileNumber = (mobile: string): string => {
  if (!mobile || mobile.length < 10) {
    return '**********';
  }
  return `${mobile.substring(0, 3)}****${mobile.substring(mobile.length - 3)}`;
};

const Header: React.FC<HeaderProps> = ({ user, onLogout, onBack, onNavigate, notifications }) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications?.filter(n => !n.read).length || 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleNavigateAndClose = (view: View) => {
        if (onNavigate) {
            onNavigate(view);
        }
        setIsMenuOpen(false);
    };

    const UserProfileMenu = () => (
        <div className="relative" ref={menuRef}>
            <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2 rounded-full text-white hover:bg-brand-blue-light transition-colors">
                <UserIcon className="w-6 h-6" />
            </button>

            {isMenuOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl py-2 z-50 text-slate-800">
                    <div className="px-4 py-2 border-b">
                        <p className="font-bold text-slate-900 truncate">{user.name}</p>
                        <p className="text-sm text-slate-500 truncate">{maskMobileNumber(user.mobile)}</p>
                    </div>
                    <ul className="mt-2">
                        <li>
                            <button onClick={() => handleNavigateAndClose('my_profile')} className="w-full text-left flex items-center px-4 py-2 hover:bg-slate-100 transition-colors">
                                <UserIcon className="w-5 h-5 mr-3 text-slate-500"/> My Profile
                            </button>
                        </li>
                        <li>
                             <button onClick={() => handleNavigateAndClose('my_profile')} className="w-full text-left flex items-center px-4 py-2 hover:bg-slate-100 transition-colors">
                                <WalletIcon className="w-5 h-5 mr-3 text-slate-500"/> Refer & Earn
                            </button>
                        </li>
                         <li>
                             <button onClick={() => handleNavigateAndClose('my_profile')} className="w-full text-left flex items-center px-4 py-2 hover:bg-slate-100 transition-colors">
                                <CalendarIcon className="w-5 h-5 mr-3 text-slate-500"/> My Bookings
                            </button>
                        </li>
                         <li>
                             <button onClick={() => handleNavigateAndClose('my_profile')} className="w-full text-left flex items-center px-4 py-2 hover:bg-slate-100 transition-colors">
                                <CogIcon className="w-5 h-5 mr-3 text-slate-500"/> Settings
                            </button>
                        </li>
                        <li className="border-t my-2"></li>
                        <li>
                            <button onClick={onLogout} className="w-full text-left flex items-center px-4 py-2 text-red-600 hover:bg-red-50 transition-colors">
                                <LogoutIcon className="w-5 h-5 mr-3"/> Logout
                            </button>
                        </li>
                    </ul>
                </div>
            )}
        </div>
    );

    return (
        <header className="bg-brand-blue-dark shadow-md sticky top-0 z-50">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <div className="flex items-center space-x-2">
                    {onBack ? (
                        <button onClick={onBack} className="p-2 rounded-full text-white hover:bg-brand-blue transition-colors -ml-2" aria-label="Go back">
                            <ChevronLeftIcon className="w-6 h-6" />
                        </button>
                    ) : (
                        <SafeClueLogo className="w-10 h-10 -ml-2" />
                    )}
                    <h1 className="text-2xl font-bold text-white">SafeClue</h1>
                </div>

                {user.role === UserRole.USER ? (
                    <div className="flex items-center space-x-2">
                        <button 
                            onClick={() => onNavigate ? onNavigate('notifications') : alert('Notifications will be shown here.')} 
                            className="relative p-2 rounded-full text-white hover:bg-brand-blue-light transition-colors" 
                            aria-label="Notifications"
                        >
                            <BellIcon className="w-6 h-6" />
                            {unreadCount > 0 && (
                                <span className="absolute top-1 right-1 flex h-5 w-5">
                                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                    <span className="relative inline-flex rounded-full h-5 w-5 bg-red-500 text-xs font-semibold items-center justify-center">
                                        {unreadCount}
                                    </span>
                                </span>
                            )}
                        </button>
                        <UserProfileMenu />
                    </div>
                ) : (
                    // Admin/SuperAdmin header
                    <div className="flex items-center space-x-4">
                        <div className="text-right hidden sm:block">
                            <p className="text-white font-semibold">{user.name}</p>
                            <p className="text-xs text-blue-200">{user.role}</p>
                        </div>
                        <button
                            onClick={onLogout}
                            className="p-2 rounded-full text-white bg-brand-blue hover:bg-red-500 transition-colors"
                            aria-label="Logout"
                        >
                            <LogoutIcon className="w-6 h-6" />
                        </button>
                    </div>
                )}
            </div>
        </header>
    );
};

export default Header;