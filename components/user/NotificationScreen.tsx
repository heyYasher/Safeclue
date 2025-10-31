
import React from 'react';
import { Notification, NotificationType, User } from '../../types';
import Header from '../shared/Header';
import { 
    ClipboardListIcon, 
    CreditCardIcon, 
    ChatBubbleIcon,
    SpeakerphoneIcon
} from '../shared/icons';

interface NotificationScreenProps {
  user: User;
  notifications: Notification[];
  onBack: () => void;
  onMarkAsRead: (id: string) => void;
  onLogout: () => void;
}

const NotificationIcon: React.FC<{ type: NotificationType }> = ({ type }) => {
    const iconProps = { className: "w-6 h-6 text-white" };
    let bgColor = 'bg-slate-500';

    switch (type) {
        case NotificationType.PROJECT_UPDATE:
            bgColor = 'bg-brand-blue';
            return <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}><ClipboardListIcon {...iconProps} /></div>;
        case NotificationType.PAYMENT_REMINDER:
            bgColor = 'bg-red-500';
            return <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}><CreditCardIcon {...iconProps} /></div>;
        case NotificationType.GENERAL_ANNOUNCEMENT:
            bgColor = 'bg-purple-500';
            return <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}><SpeakerphoneIcon {...iconProps} /></div>;
        default:
            return <div className={`w-12 h-12 rounded-full flex items-center justify-center ${bgColor}`}><div className="w-6 h-6 bg-white rounded-full"></div></div>;
    }
};

const NotificationScreen: React.FC<NotificationScreenProps> = ({ user, notifications, onBack, onMarkAsRead, onLogout }) => {
  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={user} onLogout={onLogout} onBack={onBack} notifications={notifications} onNavigate={() => {}} />
      <main className="container mx-auto p-4 md:p-6 pb-20">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Notifications</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            {notifications.length > 0 ? (
                <ul className="divide-y divide-slate-200">
                    {notifications.map(notification => (
                        <li 
                            key={notification.id} 
                            onClick={() => onMarkAsRead(notification.id)}
                            className={`p-4 flex items-start space-x-4 cursor-pointer transition-colors ${!notification.read ? 'bg-blue-50 hover:bg-blue-100' : 'hover:bg-slate-50'}`}
                        >
                            <div className="flex-shrink-0 relative">
                                <NotificationIcon type={notification.type} />
                                {!notification.read && <span className="absolute top-0 right-0 block h-3 w-3 rounded-full bg-brand-blue ring-2 ring-white"></span>}
                            </div>
                            <div className="flex-1">
                                <div className="flex justify-between items-center">
                                    <h3 className="font-bold text-slate-800">{notification.title}</h3>
                                    <p className="text-xs text-slate-500 whitespace-nowrap">{notification.timestamp}</p>
                                </div>
                                <p className="text-sm text-slate-600 mt-1">{notification.message}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <div className="p-8 text-center text-slate-500">
                    You have no notifications.
                </div>
            )}
        </div>
      </main>
    </div>
  );
};

export default NotificationScreen;