

import React from 'react';
import { User } from '../../types';
import { MOCK_USERS, MOCK_PROJECTS } from '../../constants';
import Header from '../shared/Header';

interface SuperAdminDashboardProps {
  user: User;
  onLogout: () => void;
}

const SuperAdminDashboard: React.FC<SuperAdminDashboardProps> = ({ user, onLogout }) => {
    const users = MOCK_USERS;
    const projects = MOCK_PROJECTS;
    
  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={user} onLogout={onLogout} />
      <main className="container mx-auto p-4 md:p-8">
        <h2 className="text-3xl font-bold text-slate-800 mb-6">Super Admin Dashboard</h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* User Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-blue-dark mb-4">User Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Name</th>
                                <th scope="col" className="px-6 py-3">Role</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(u => (
                                <tr key={u.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{u.name}</td>
                                    <td className="px-6 py-4">{u.role}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button className="font-medium text-blue-600 hover:underline">Edit</button>
                                        <button className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Project Management */}
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-brand-blue-dark mb-4">Project Management</h3>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-slate-500">
                        <thead className="text-xs text-slate-700 uppercase bg-slate-50">
                            <tr>
                                <th scope="col" className="px-6 py-3">Project Name</th>
                                <th scope="col" className="px-6 py-3">Builder</th>
                                <th scope="col" className="px-6 py-3">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {projects.map(p => (
                                <tr key={p.id} className="bg-white border-b hover:bg-slate-50">
                                    <td className="px-6 py-4 font-medium text-slate-900">{p.name}</td>
                                    <td className="px-6 py-4">{p.builder}</td>
                                    <td className="px-6 py-4 space-x-2">
                                        <button className="font-medium text-blue-600 hover:underline">View</button>
                                        <button className="font-medium text-red-600 hover:underline">Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
      </main>
    </div>
  );
};

export default SuperAdminDashboard;