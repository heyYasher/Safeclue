import React, { useState } from 'react';
import { SafeClueLogo } from '../shared/icons';

interface VerifyOtpScreenProps {
  onVerify: (otp: string) => void;
  onNavigateToLogin: () => void;
}

const VerifyOtpScreen: React.FC<VerifyOtpScreenProps> = ({ onVerify, onNavigateToLogin }) => {
    const [otp, setOtp] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onVerify(otp);
    };
    
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-100 p-4">
            <div className="max-w-md w-full mx-auto bg-white rounded-2xl shadow-xl p-8">
                <div className="text-center mb-8">
                    <SafeClueLogo className="w-24 h-24 mx-auto" />
                    <h1 className="text-3xl font-bold text-slate-800 mt-4">Verify Your Identity</h1>
                    <p className="text-slate-600 mt-2">Enter the 6-digit OTP sent to your mobile number.</p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="otp" className="block text-sm font-medium text-slate-700">One-Time Password (OTP)</label>
                        <input 
                            type="text" 
                            id="otp" 
                            value={otp} 
                            onChange={(e) => setOtp(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue text-center tracking-[0.5em] sm:tracking-[1em] text-lg" 
                            maxLength={6} 
                            placeholder="••••••"
                        />
                    </div>
                    <div>
                        <button type="submit" className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-brand-blue hover:bg-brand-blue-dark">
                           Verify
                        </button>
                    </div>
                </form>
                <p className="mt-6 text-center text-sm text-slate-600">
                    Remember your password?{' '}
                    <button onClick={onNavigateToLogin} className="font-medium text-brand-blue hover:text-brand-blue-dark">
                        Sign in
                    </button>
                </p>
            </div>
        </div>
    );
};

export default VerifyOtpScreen;