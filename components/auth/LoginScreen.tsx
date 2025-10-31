
import React, { useState } from 'react';
import { SafeClueLogo } from '../shared/icons';

interface LoginScreenProps {
  onLogin: (mobile: string, pass: string) => void;
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToAdminLogin: () => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigateToRegister, onNavigateToForgotPassword, onNavigateToAdminLogin }) => {
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(mobile, password);
  };

  return (
    <div className="min-h-screen flex flex-col justify-end bg-gradient-to-br from-brand-blue-dark to-brand-teal-dark">
      <div className="bg-white rounded-t-3xl p-8 pt-12 shadow-2xl">
        <div className="text-center mb-8">
            <SafeClueLogo className="w-20 h-20 mx-auto" />
            <h1 className="text-3xl font-bold text-slate-800 mt-4">Welcome Back</h1>
            <p className="text-slate-500 mt-1">Sign in to continue with SafeClue</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="mobile" className="block text-sm font-medium text-slate-700">Mobile Number</label>
            <input
              type="tel"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="10-digit mobile number"
            />
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label htmlFor="password"className="block text-sm font-medium text-slate-700">Password</label>
              <button type="button" onClick={onNavigateToForgotPassword} className="text-sm font-medium text-brand-blue hover:text-brand-blue-dark">Forgot Password?</button>
            </div>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 block w-full px-4 py-3 bg-slate-100 border border-slate-200 rounded-lg shadow-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
              placeholder="••••••••"
            />
          </div>
          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-lg font-medium text-white bg-brand-blue hover:bg-brand-blue-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue"
            >
              Sign In
            </button>
          </div>
        </form>
        <p className="mt-8 text-center text-sm text-slate-600">
          New to SafeClue?{' '}
          <button onClick={onNavigateToRegister} className="font-medium text-brand-blue hover:text-brand-blue-dark">
            Create an Account
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginScreen;