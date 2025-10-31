



import React, { useState } from 'react';
import { SafeClueLogo } from '../shared/icons';

interface RegisterScreenProps {
  onRegister: (name: string, email: string, mobile: string, pass: string) => void;
  onNavigateToLogin: () => void;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ onRegister, onNavigateToLogin }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [mobile, setMobile] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }
        onRegister(name, email, mobile, password);
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <SafeClueLogo className="w-24 h-24 mx-auto" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Create Your Account</h1>
                    <p className="text-slate-600 mt-2">Join SafeClue to track your new construction projects.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700">Full Name</label>
                        <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                    </div>
                    <div>
                        <label htmlFor="email-register" className="block text-sm font-medium text-slate-700">Email Address</label>
                        <input type="email" id="email-register" value={email} onChange={(e) => setEmail(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                    </div>
                    <div>
                        <label htmlFor="mobile-register" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                        <input type="tel" id="mobile-register" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                    </div>
                    <div>
                        <label htmlFor="password-register" className="block text-sm font-medium text-slate-700">Password</label>
                        <input type="password" id="password-register" value={password} onChange={(e) => setPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                    </div>
                     <div>
                        <label htmlFor="confirm-password" className="block text-sm font-medium text-slate-700">Confirm Password</label>
                        <input type="password" id="confirm-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark">
                            Create Account
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                    Already have an account?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-brand-blue hover:text-brand-blue-dark">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default RegisterScreen;