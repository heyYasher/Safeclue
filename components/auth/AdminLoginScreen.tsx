import React from 'react';
import { UserRole } from '../../types';
import { SafeClueLogo, AdminIcon, SuperAdminIcon } from '../shared/icons';

interface AdminLoginScreenProps {
  onLogin: (role: UserRole) => void;
  onNavigateToUserLogin: () => void;
}

const RoleButton: React.FC<{ role: UserRole; icon: React.ReactNode; onClick: (role: UserRole) => void }> = ({ role, icon, onClick }) => (
  <button
    onClick={() => onClick(role)}
    className="w-full flex flex-col items-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg hover:bg-brand-blue-light hover:text-white transition-all duration-300 transform hover:-translate-y-1 group"
  >
    <div className="w-16 h-16 mb-4 text-brand-teal-dark group-hover:text-white transition-colors">{icon}</div>
    <span className="text-lg font-semibold text-slate-700 group-hover:text-white">{role}</span>
  </button>
);

const AdminLoginScreen: React.FC<AdminLoginScreenProps> = ({ onLogin, onNavigateToUserLogin }) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 p-4">
      <div className="max-w-4xl w-full mx-auto">
        <div className="text-center mb-12">
          <SafeClueLogo className="w-28 h-28 mx-auto" />
          <h1 className="text-4xl font-bold text-slate-800 mt-4">Admin & Web Portal</h1>
          <p className="text-slate-600 mt-2">Please select your administrative role to continue.</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <RoleButton role={UserRole.ADMIN} icon={<AdminIcon className="w-full h-full" />} onClick={onLogin} />
          <RoleButton role={UserRole.SUPER_ADMIN} icon={<SuperAdminIcon className="w-full h-full" />} onClick={onLogin} />
        </div>
         <div className="mt-8 text-center">
             <button onClick={onNavigateToUserLogin} className="text-sm text-slate-500 hover:underline">
                Back to User Login
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginScreen;