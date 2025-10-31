
import React, { useState, useMemo } from 'react';
import { User, Project, TimelineStage, TimelineStatus, Transaction, TransactionStatus } from '../../types';
import Header from '../shared/Header';
import { generateProgressSummary } from '../../services/geminiService';
import { MapPinIcon, CreditCardIcon } from '../shared/icons';

interface AdminDashboardProps {
  user: User;
  projects: Project[];
  onLogout: () => void;
  onUpdateProject: (project: Project) => void;
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const SiteCheckIn: React.FC<{ project: Project }> = ({ project }) => {
    const [status, setStatus] = useState<'idle' | 'checking' | 'success' | 'error'>('idle');
    const [message, setMessage] = useState('');

    const handleCheckIn = () => {
        setStatus('checking');
        setMessage('Getting your location...');
        navigator.geolocation.getCurrentPosition(
            (position) => {
                const { latitude, longitude } = position.coords;
                // Simple distance calculation (Haversine formula approximation)
                const R = 6371; // Radius of the Earth in km
                const dLat = (latitude - project.coords.lat) * (Math.PI / 180);
                const dLon = (longitude - project.coords.lng) * (Math.PI / 180);
                const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                          Math.cos(project.coords.lat * (Math.PI / 180)) * Math.cos(latitude * (Math.PI / 180)) *
                          Math.sin(dLon / 2) * Math.sin(dLon / 2);
                const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                const distance = R * c; // Distance in km

                if (distance <= 0.5) { // 500 meters radius
                    setStatus('success');
                    setMessage(`Check-in successful! You are ${Math.round(distance*1000)}m from the site.`);
                } else {
                    setStatus('error');
                    setMessage(`Check-in failed. You are ${distance.toFixed(2)}km away from the site. Please be within 500m to check in.`);
                }
            },
            (error) => {
                setStatus('error');
                setMessage(`Could not get location: ${error.message}`);
            },
            { enableHighAccuracy: true }
        );
    };

    return (
        <div className="mt-4 p-4 bg-slate-50 rounded-lg">
            <h4 className="font-semibold text-slate-700">Site Review Check-in</h4>
            <p className="text-sm text-slate-500 mb-2">You must be within 500m of the project site to post updates.</p>
            <button onClick={handleCheckIn} disabled={status === 'checking'} className="bg-brand-blue-light text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-brand-blue-dark disabled:bg-slate-400">
                {status === 'checking' ? 'Checking...' : 'Verify Location'}
            </button>
            {message && <p className={`text-sm mt-2 ${status === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message}</p>}
        </div>
    );
};

const TimelineUpdateModal: React.FC<{ project: Project; onClose: () => void; onSave: (updatedTimeline: TimelineStage[]) => void }> = ({ project, onClose, onSave }) => {
    const [timeline, setTimeline] = useState([...project.timeline]);

    const handleProgressChange = (id: string, progress: number) => {
        setTimeline(timeline.map(stage => {
            if (stage.id === id) {
                const newStatus = progress === 100 ? TimelineStatus.COMPLETED : progress > 0 ? TimelineStatus.IN_PROGRESS : TimelineStatus.PENDING;
                return { ...stage, progress, status: newStatus };
            }
            return stage;
        }));
    };
    
    const handleSaveChanges = () => {
        onSave(timeline);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-lg">
                <h3 className="text-2xl font-bold mb-4">Update Timeline for {project.name}</h3>
                <div className="space-y-4 max-h-96 overflow-y-auto">
                    {timeline.map(stage => (
                        <div key={stage.id}>
                            <label className="font-semibold">{stage.name} ({stage.progress}%)</label>
                            <input
                                type="range"
                                min="0"
                                max="100"
                                value={stage.progress}
                                onChange={(e) => handleProgressChange(stage.id, parseInt(e.target.value))}
                                className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer"
                            />
                        </div>
                    ))}
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                    <button onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
                    <button onClick={handleSaveChanges} className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light">Save Changes</button>
                </div>
            </div>
        </div>
    );
};

const PendingApprovals: React.FC<{ projects: Project[]; onUpdateProject: (project: Project) => void; }> = ({ projects, onUpdateProject }) => {
    const pendingTransactions = useMemo(() => {
        const allPending: { project: Project; transaction: Transaction }[] = [];
        projects.forEach(project => {
            project.transactions
                .filter(tx => tx.status === TransactionStatus.AWAITING_APPROVAL)
                .forEach(tx => {
                    allPending.push({ project, transaction: tx });
                });
        });
        return allPending;
    }, [projects]);

    const handleApproval = (project: Project, transaction: Transaction, newStatus: TransactionStatus) => {
        const updatedTransactions = project.transactions.map(tx => 
            tx.id === transaction.id ? { ...tx, status: newStatus, proofUrl: newStatus === TransactionStatus.PENDING ? undefined : tx.proofUrl } : tx
        );
        onUpdateProject({ ...project, transactions: updatedTransactions });
    };

    if (pendingTransactions.length === 0) return null;

    return (
        <div className="mb-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-brand-orange-dark mb-4">Pending Payment Approvals</h3>
            <div className="space-y-4">
                {pendingTransactions.map(({ project, transaction }) => (
                    <div key={transaction.id} className="p-4 border rounded-lg flex flex-col sm:flex-row justify-between sm:items-center">
                        <div>
                            <p className="font-bold text-slate-800">{project.name}</p>
                            <p className="text-sm text-slate-600">{transaction.description} - <span className="font-semibold">{formatCurrency(transaction.amount)}</span></p>
                            <a href={transaction.proofUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-brand-blue hover:underline">View Proof</a>
                        </div>
                        <div className="flex space-x-2 mt-2 sm:mt-0">
                            <button onClick={() => handleApproval(project, transaction, TransactionStatus.PAID)} className="bg-green-500 text-white px-3 py-1 text-sm rounded-md hover:bg-green-600">Approve</button>
                            <button onClick={() => handleApproval(project, transaction, TransactionStatus.PENDING)} className="bg-red-500 text-white px-3 py-1 text-sm rounded-md hover:bg-red-600">Reject</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};


const AdminDashboard: React.FC<AdminDashboardProps> = ({ user, projects, onLogout, onUpdateProject }) => {
    const [selectedProjectForUpdate, setSelectedProjectForUpdate] = useState<Project | null>(null);
    const [generatingSummaryFor, setGeneratingSummaryFor] = useState<string | null>(null);
    const [summary, setSummary] = useState<string>('');

    const handleGenerateSummary = async (project: Project) => {
        setGeneratingSummaryFor(project.id);
        setSummary('Generating summary...');
        const result = await generateProgressSummary(project.name, project.timeline);
        setSummary(result);
        setGeneratingSummaryFor(null);
    };
    
    const handleSaveTimeline = (updatedTimeline: TimelineStage[]) => {
        if (selectedProjectForUpdate) {
            const updatedProject = { ...selectedProjectForUpdate, timeline: updatedTimeline };
            onUpdateProject(updatedProject);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100">
            <Header user={user} onLogout={onLogout} />
            <main className="container mx-auto p-4 md:p-8">
                <PendingApprovals projects={projects} onUpdateProject={onUpdateProject} />
                <h2 className="text-3xl font-bold text-slate-800 mb-6">Manage Projects</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {projects.map(project => (
                        <div key={project.id} className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col">
                            <img src={project.images[0]} alt={project.name} className="w-full h-48 object-cover"/>
                            <div className="p-6 flex flex-col flex-grow">
                                <h3 className="text-2xl font-bold text-brand-blue-dark">{project.name}</h3>
                                <div className="flex items-center text-slate-600 mt-1">
                                    <MapPinIcon className="w-5 h-5 mr-2 text-slate-400" />
                                    <span>{project.location}</span>
                                </div>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <button className="bg-brand-teal text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-brand-teal-dark">Upload Media</button>
                                    <button onClick={() => setSelectedProjectForUpdate(project)} className="bg-brand-blue-light text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-brand-blue-dark">Update Timeline</button>
                                    <button onClick={() => handleGenerateSummary(project)} disabled={generatingSummaryFor === project.id} className="bg-purple-500 text-white px-3 py-1 rounded-md text-sm font-semibold hover:bg-purple-600 disabled:bg-slate-400">
                                        {generatingSummaryFor === project.id ? 'Generating...' : 'AI Summary'}
                                    </button>
                                </div>
                                {summary && generatingSummaryFor === project.id && (
                                    <div className="mt-4 p-4 bg-slate-50 border rounded-md">
                                        <h4 className="font-semibold text-slate-800">AI Generated Summary:</h4>
                                        <p className="text-slate-700 whitespace-pre-wrap">{summary}</p>
                                    </div>
                                )}
                                <div className="mt-auto pt-4">
                                  <SiteCheckIn project={project} />
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
            {selectedProjectForUpdate && (
                <TimelineUpdateModal 
                    project={selectedProjectForUpdate} 
                    onClose={() => setSelectedProjectForUpdate(null)} 
                    onSave={handleSaveTimeline} 
                />
            )}
        </div>
    );
};

export default AdminDashboard;