
import React from 'react';
import { User, Booking, Notification } from '../../types';
import type { View } from '../../types';
import Header from '../shared/Header';
import { CalendarIcon } from '../shared/icons';

interface BookingsScreenProps {
  user: User;
  bookings: Booking[];
  onLogout: () => void;
  onNavigate: (view: View) => void;
  notifications: Notification[];
}

const BookingsScreen: React.FC<BookingsScreenProps> = ({ user, bookings, onLogout, onNavigate, notifications }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} notifications={notifications} />
      <main className="container mx-auto p-4 md:p-6 pb-20">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-3xl font-bold text-slate-800">My Bookings</h2>
            <p className="font-semibold text-brand-blue">{bookings.length} upcoming</p>
        </div>
        
        <div className="space-y-4">
          {bookings.length > 0 ? bookings.map(booking => (
            <div key={booking.id} className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <div className="bg-blue-100 text-brand-blue rounded-full p-3">
                        <CalendarIcon className="w-6 h-6" />
                    </div>
                    <div>
                        <p className="font-bold text-slate-900">{booking.projectName}</p>
                        <p className="text-sm text-slate-600">{booking.date} at {booking.time}</p>
                    </div>
                </div>
                 <div className="flex items-center space-x-2">
                     <button className="text-xs font-semibold text-slate-600 hover:text-slate-900">Reschedule</button>
                     <button className="text-xs font-semibold text-red-500 hover:text-red-700">Cancel</button>
                 </div>
            </div>
          )) : (
            <div className="text-center py-12 bg-white rounded-lg shadow-md">
                <p className="text-slate-500">You have no upcoming bookings.</p>
                <button 
                    onClick={() => onNavigate('project_list')}
                    className="mt-4 bg-brand-blue text-white font-bold py-2 px-4 rounded-md hover:bg-brand-blue-light transition-colors"
                >
                    Book a Demo
                </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default BookingsScreen;