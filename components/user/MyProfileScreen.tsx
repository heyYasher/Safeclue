
import React, { useState } from 'react';
import { User, Project, TimelineStatus, TransactionStatus } from '../../types';
import type { View } from '../../types';
import { UserIcon, CogIcon, SafeCoinIcon, LogoutIcon, CheckCircleIcon, BuildingIcon } from '../shared/icons';

interface MyProfileScreenProps {
  user: User;
  onLogout: () => void;
  projects: Project[];
  onSelectProject: (project: Project) => void;
  onNavigate: (view: View) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const formatSafeCoins = (amount: number) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

const maskMobileNumber = (mobile: string): string => {
  if (!mobile || mobile.length < 10) {
    return '**********';
  }
  return `${mobile.substring(0, 3)}****${mobile.substring(mobile.length - 3)}`;
};

const QUERY_TOPICS = [
    "New Construction",
    "Home Renovation",
    "Site Visit",
    "Payment Question",
    "Other",
];

interface StartProjectFormProps {
  onSubmit: (data: { name: string; mobile: string; topic: string; details: string; }) => void;
  onClose: () => void;
  user?: User;
}

const StartProjectForm: React.FC<StartProjectFormProps> = ({ onSubmit, onClose, user }) => {
    const [name, setName] = useState(user?.name || '');
    const [mobile, setMobile] = useState(user?.mobile || '');
    const [details, setDetails] = useState('');
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic) {
            alert('Please select a topic for your query.');
            return;
        }
        onSubmit({ name, mobile, topic: selectedTopic, details });
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg relative">
                <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-800 text-3xl font-light leading-none" aria-label="Close form">&times;</button>
                <h3 className="text-2xl font-bold text-slate-800 mb-4">Start Your Project Journey</h3>
                <p className="text-slate-600 mb-6">Tell us a bit about your project, and our experts will get in touch with you.</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-2">I'm interested in:</label>
                        <div className="flex flex-wrap gap-2">
                            {QUERY_TOPICS.map(topic => (
                                <button
                                    key={topic}
                                    type="button"
                                    onClick={() => setSelectedTopic(topic)}
                                    className={`px-3 py-1.5 text-sm font-semibold rounded-full border transition-colors ${
                                        selectedTopic === topic
                                            ? 'bg-brand-blue text-white border-brand-blue'
                                            : 'bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200'
                                    }`}
                                >
                                    {topic}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="form-name" className="block text-sm font-medium text-slate-700">Full Name</label>
                            <input type="text" id="form-name" value={name} onChange={(e) => setName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                        </div>
                        <div>
                            <label htmlFor="form-mobile" className="block text-sm font-medium text-slate-700">Mobile Number</label>
                            <input type="tel" id="form-mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
                        </div>
                    </div>
                    <div>
                        <label htmlFor="form-details" className="block text-sm font-medium text-slate-700">Project Details</label>
                        <textarea id="form-details" rows={3} value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Tell us more about your requirements..." className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
                    </div>
                    <div className="pt-2">
                        <button type="submit" className="w-full bg-brand-teal text-white font-bold py-3 px-4 rounded-md hover:bg-brand-teal-dark transition-colors">
                            Request a Call Back
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


const MyProfileScreen: React.FC<MyProfileScreenProps> = ({ user, onLogout, projects, onSelectProject, onNavigate }) => {
  const [isWithdrawModalOpen, setIsWithdrawModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
    bankName: '',
    accountNumber: '',
    ifsc: ''
  });
  const [isProjectFormOpen, setIsProjectFormOpen] = useState(false);

  const SERVICE_CHARGE_PERCENT = 2;
  const PLATFORM_CHARGE_PERCENT = 1;

  const handleWithdrawalRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const amount = parseFloat(withdrawalAmount);
    if (isNaN(amount) || amount <= 0) {
        alert("Please enter a valid amount of SafeCoins.");
        return;
    }
    if (amount < 10000) {
        alert(`Minimum withdrawal amount is 10,000 SafeCoins.`);
        return;
    }
    if (amount > user.safeCoinBalance) {
        alert("Withdrawal amount cannot exceed your SafeCoin balance.");
        return;
    }
    console.log("Withdrawal Request:", { ...bankDetails, amountSC: withdrawalAmount });
    setIsWithdrawModalOpen(false);
    setIsSuccessModalOpen(true);
  };

  const handleCloseSuccessModal = () => {
      setIsSuccessModalOpen(false);
      setWithdrawalAmount('');
      setBankDetails({ bankName: '', accountNumber: '', ifsc: '' });
  };
  
  const handleProjectFormSubmit = (data: { name: string; mobile: string; topic: string; details: string; }) => {
    console.log("New Project Inquiry from Profile page:", data);
    setIsProjectFormOpen(false);
    alert(`Thank you, ${data.name}! Our team will contact you shortly regarding your new project inquiry.`);
  };


  const WithdrawModal = () => {
    const amountSC = parseFloat(withdrawalAmount) || 0;
    const serviceCharge = amountSC * (SERVICE_CHARGE_PERCENT / 100);
    const platformCharge = amountSC * (PLATFORM_CHARGE_PERCENT / 100);
    const totalDeductions = serviceCharge + platformCharge;
    const finalAmountINR = amountSC - totalDeductions;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4 text-slate-800">Withdraw SafeCoins</h2>
            <p className="text-sm text-slate-600 mb-6">Convert your SafeCoins to INR. Charges will be applied.</p>
            <form onSubmit={handleWithdrawalRequest} className="space-y-4">
              <div>
                <label htmlFor="bankName" className="block text-sm font-medium text-slate-700">Bank Name</label>
                <input type="text" id="bankName" value={bankDetails.bankName} onChange={e => setBankDetails({...bankDetails, bankName: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
              </div>
              <div>
                <label htmlFor="accountNumber" className="block text-sm font-medium text-slate-700">Account Number</label>
                <input type="text" id="accountNumber" value={bankDetails.accountNumber} onChange={e => setBankDetails({...bankDetails, accountNumber: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
              </div>
              <div>
                <label htmlFor="ifsc" className="block text-sm font-medium text-slate-700">IFSC Code</label>
                <input type="text" id="ifsc" value={bankDetails.ifsc} onChange={e => setBankDetails({...bankDetails, ifsc: e.target.value})} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" />
              </div>
              <div>
                <label htmlFor="amount" className="block text-sm font-medium text-slate-700">Amount to Withdraw (SafeCoins)</label>
                <input type="number" id="amount" value={withdrawalAmount} onChange={e => setWithdrawalAmount(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm text-slate-900 focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder={`Balance: ${formatSafeCoins(user.safeCoinBalance)}`} />
              </div>
              
              {amountSC > 0 && (
                <div className="p-4 bg-slate-50 rounded-lg text-sm space-y-2">
                    <div className="flex justify-between"><span>Service Charge ({SERVICE_CHARGE_PERCENT}%):</span> <span className="font-medium text-red-600">- {formatSafeCoins(serviceCharge)} SC</span></div>
                    <div className="flex justify-between"><span>Platform Charge ({PLATFORM_CHARGE_PERCENT}%):</span> <span className="font-medium text-red-600">- {formatSafeCoins(platformCharge)} SC</span></div>
                    <hr className="my-1"/>
                    <div className="flex justify-between font-bold text-base"><span>You will receive:</span> <span className="text-green-600">{formatCurrency(finalAmountINR)}</span></div>
                </div>
              )}

              <div className="flex justify-end space-x-4 pt-4">
                <button type="button" onClick={() => setIsWithdrawModalOpen(false)} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light">Request Withdrawal</button>
              </div>
            </form>
          </div>
        </div>
      );
  };

  const SuccessModal = () => {
    const amountSC = parseFloat(withdrawalAmount) || 0;
    const serviceCharge = amountSC * (SERVICE_CHARGE_PERCENT / 100);
    const platformCharge = amountSC * (PLATFORM_CHARGE_PERCENT / 100);
    const finalAmountINR = amountSC - (serviceCharge + platformCharge);

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
            <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-2 text-slate-800">Request Submitted</h2>
            <p className="text-slate-600 mb-6">Your withdrawal request for <span className="font-semibold">{formatCurrency(finalAmountINR)}</span> has been submitted. It will be processed within 3-5 business days.</p>
            <button onClick={handleCloseSuccessModal} className="w-full bg-brand-blue text-white font-bold py-2.5 rounded-md hover:bg-brand-blue-dark transition-colors">
              Done
            </button>
          </div>
        </div>
    );
  };

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Custom Profile Header */}
      <div className="bg-brand-blue-dark p-6 pb-20 rounded-b-3xl">
        <div className="flex items-center space-x-4">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
                <UserIcon className="w-12 h-12 text-white" />
            </div>
            <div>
                <h2 className="text-3xl font-bold text-white">{user.name}</h2>
                <p className="text-blue-200">{maskMobileNumber(user.mobile)}</p>
            </div>
        </div>
      </div>

      <main className="container mx-auto p-4 md:p-6 -mt-16 pb-24">
        <div className="space-y-6">

            {/* My Projects Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                    <BuildingIcon className="w-6 h-6 text-brand-teal mr-3"/>
                    <h3 className="text-xl font-bold text-brand-blue-dark">My Projects</h3>
                </div>
                {projects.length > 0 ? (
                    <div className="space-y-4">
                        {projects.map(project => {
                             const overallProgress = project.timeline.length > 0
                                ? Math.round(project.timeline.reduce((acc, stage) => acc + stage.progress, 0) / project.timeline.length)
                                : 0;
                            
                            const currentStage = project.timeline.find(s => s.status === TimelineStatus.IN_PROGRESS);

                            const hasPendingPayment = project.transactions.some(tx => 
                                tx.status === TransactionStatus.PENDING || tx.status === TransactionStatus.AWAITING_APPROVAL
                            );
                            
                            const paymentStatusText = hasPendingPayment ? "Action Required" : "Up-to-date";
                            const paymentStatusColor = hasPendingPayment ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800";

                            return (
                                <div key={project.id} className="bg-slate-50 p-4 rounded-lg flex flex-col sm:flex-row sm:items-center justify-between transition-shadow hover:shadow-md">
                                    <div className="flex items-start sm:items-center space-x-4 flex-1 mb-4 sm:mb-0">
                                        <img src={project.images[0]} alt={project.name} className="w-20 h-20 object-cover rounded-md flex-shrink-0" />
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 text-lg">{project.name}</h4>
                                            <p className="text-xs text-slate-500 mb-2">{project.location}</p>

                                            {/* Timeline Progress */}
                                            <div className="mb-2">
                                                <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                                                    <span>Overall Progress</span>
                                                    <span>{overallProgress}%</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-1.5">
                                                    <div className="bg-brand-teal h-1.5 rounded-full" style={{ width: `${overallProgress}%` }}></div>
                                                </div>
                                                {currentStage && <p className="text-xs text-slate-500 mt-1">Current stage: <span className="font-semibold">{currentStage.name}</span></p>}
                                            </div>
                                            
                                            {/* Payment Status */}
                                            <div>
                                                <p className="text-xs text-slate-500">
                                                    Payment Status: <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${paymentStatusColor}`}>{paymentStatusText}</span>
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button 
                                        onClick={() => onSelectProject(project)} 
                                        className="bg-brand-blue text-white font-bold py-2 px-6 rounded-md text-sm hover:bg-brand-blue-light transition-colors self-end sm:self-center"
                                    >
                                        View Details
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                ) : (
                    <div className="text-center py-8 px-4 bg-slate-50 rounded-lg">
                        <BuildingIcon className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                        <h4 className="text-xl font-bold text-slate-800">Your Projects Will Appear Here</h4>
                        <p className="text-slate-500 mt-2 mb-6 max-w-md mx-auto">Once you start a project with us, you can track its entire lifecycle from this dashboard.</p>
                        <button 
                            onClick={() => setIsProjectFormOpen(true)}
                            className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded-full text-lg transition-transform transform hover:scale-105 shadow-md"
                        >
                            Start My First Project
                        </button>
                    </div>
                )}
            </div>

            {/* Refer & Earn Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                    <SafeCoinIcon className="w-6 h-6 text-brand-teal mr-3"/>
                    <h3 className="text-xl font-bold text-brand-blue-dark">Refer & Earn</h3>
                </div>
                <div className="text-center bg-teal-50 p-6 rounded-lg">
                    <div className="flex justify-between items-center">
                        <p className="text-slate-600">Your SafeCoin Balance</p>
                        <button 
                            onClick={() => setIsWithdrawModalOpen(true)}
                            className="text-sm font-semibold text-brand-blue hover:underline"
                        >
                            Withdraw
                        </button>
                    </div>

                    <p className="text-4xl font-bold text-brand-teal-dark my-2">{formatSafeCoins(user.safeCoinBalance)}</p>
                    <p className="text-sm text-slate-500 mb-4">Refer a friend and you both get a <span className="font-semibold">5,000 SafeCoin</span> bonus when they start their first project!</p>
                    
                    <p className="text-slate-600 mt-6">Your Referral Code:</p>
                    <div className="my-2 p-3 border-2 border-dashed border-slate-300 rounded-md bg-white">
                      <p className="text-2xl font-mono tracking-widest text-slate-800">{user.referralCode}</p>
                    </div>

                    <button 
                      onClick={() => alert(`Share your code: ${user.referralCode}`)}
                      className="mt-4 w-full bg-brand-teal text-white font-bold py-2.5 rounded-md hover:bg-brand-teal-dark transition-colors"
                    >
                      Share Now
                    </button>
                </div>
            </div>

            {/* App Settings Section */}
            <div className="bg-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center mb-4">
                    <CogIcon className="w-6 h-6 text-brand-blue-dark mr-3"/>
                    <h3 className="text-xl font-bold text-brand-blue-dark">App Settings</h3>
                </div>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                        <label htmlFor="notifications" className="font-medium text-slate-700">Project Notifications</label>
                        <label className="switch relative inline-block w-12 h-6">
                            <input type="checkbox" id="notifications" className="opacity-0 w-0 h-0" defaultChecked/>
                             <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 transition rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full"></span>
                        </label>
                    </div>
                     <div className="flex justify-between items-center">
                        <label htmlFor="theme" className="font-medium text-slate-700">Dark Mode</label>
                         <label className="switch relative inline-block w-12 h-6">
                            <input type="checkbox" id="theme" className="opacity-0 w-0 h-0"/>
                             <span className="slider absolute cursor-pointer top-0 left-0 right-0 bottom-0 bg-slate-300 transition rounded-full before:absolute before:content-[''] before:h-4 before:w-4 before:left-1 before:bottom-1 before:bg-white before:transition before:rounded-full"></span>
                        </label>
                    </div>
                </div>
            </div>
             <div className="pt-4">
                <button 
                  onClick={onLogout}
                  className="w-full flex items-center justify-center space-x-2 bg-red-500 text-white font-bold py-3 rounded-lg hover:bg-red-600 transition-colors"
                >
                  <LogoutIcon className="w-6 h-6"/>
                  <span>Logout</span>
                </button>
            </div>
        </div>
      </main>

      {isWithdrawModalOpen && <WithdrawModal />}
      {isSuccessModalOpen && <SuccessModal />}
      {isProjectFormOpen && <StartProjectForm user={user} onSubmit={handleProjectFormSubmit} onClose={() => setIsProjectFormOpen(false)} />}


      <style>{`
        .switch input:checked + .slider { background-color: #2563eb; }
        .switch input:checked + .slider:before { transform: translateX(24px); }
      `}</style>
    </div>
  );
};

export default MyProfileScreen;