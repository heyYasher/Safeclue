


import React, { useState, useRef } from 'react';
import { Project, User, TimelineStatus, Invoice, Transaction, TransactionStatus, Booking } from '../../types';
import { ChevronLeftIcon, MapPinIcon, CreditCardIcon, PaperClipIcon, CalendarIcon, CheckCircleIcon } from '../shared/icons';
import { MOCK_INVOICES } from '../../constants';

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

interface ProjectDetailProps {
  project: Project;
  user: User;
  onBack: () => void;
  onUpdateProject: (project: Project) => void;
  onAddBooking: (bookingDetails: Omit<Booking, 'id'>) => void;
}

type Tab = 'overview' | 'timeline' | 'payments';

const BookingModal: React.FC<{
  project: Project;
  onClose: () => void;
  onSubmit: (details: { date: string; time: string }) => void;
}> = ({ project, onClose, onSubmit }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !time) {
      alert("Please select a date and time.");
      return;
    }
    onSubmit({ date, time });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold text-slate-800 mb-2">Book a Site Visit</h2>
        <p className="text-slate-600 mb-6">Schedule a visit for <span className="font-semibold">{project.name}</span>.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="visit-date" className="block text-sm font-medium text-slate-700">Date</label>
              <input type="date" id="visit-date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
            </div>
            <div>
              <label htmlFor="visit-time" className="block text-sm font-medium text-slate-700">Time</label>
              <input type="time" id="visit-time" value={time} onChange={e => setTime(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
            </div>
          </div>
          <div className="flex justify-end space-x-4 pt-4">
            <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Cancel</button>
            <button type="submit" className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-blue-light">Confirm Booking</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const ConfirmationModal: React.FC<{
  project: Project;
  bookingDetails: { date: string; time: string };
  onClose: () => void;
}> = ({ project, bookingDetails, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 w-full max-w-md text-center">
        <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
        <h2 className="text-2xl font-bold mb-2 text-slate-800">Booking Confirmed!</h2>
        <p className="text-slate-600 mb-6">
          Your site visit for <span className="font-semibold">{project.name}</span> on 
          <span className="font-semibold"> {bookingDetails.date} at {bookingDetails.time}</span> is confirmed. 
          Our team will be in touch with you shortly.
        </p>
        <button onClick={onClose} className="w-full bg-brand-blue text-white font-bold py-2.5 rounded-md hover:bg-brand-blue-dark transition-colors">
          Done
        </button>
      </div>
    </div>
  );
};


const ProjectDetail: React.FC<ProjectDetailProps> = ({ project, user, onBack, onUpdateProject, onAddBooking }) => {
  const [activeTab, setActiveTab] = useState<Tab>('overview');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [confirmedBookingDetails, setConfirmedBookingDetails] = useState<{ date: string; time: string } | null>(null);

  const isOwner = user.id === project.userId;

  const handlePaymentProofUpload = (file: File, transaction: Transaction) => {
    const proofUrl = URL.createObjectURL(file);
    const updatedTransaction = { ...transaction, status: TransactionStatus.AWAITING_APPROVAL, proofUrl };
    const updatedTransactions = project.transactions.map(t => t.id === transaction.id ? updatedTransaction : t);
    onUpdateProject({ ...project, transactions: updatedTransactions });
    setIsPaymentModalOpen(false);
  };
  
  const handleBookVisit = (details: { date: string, time: string }) => {
    onAddBooking({
        projectId: project.id,
        projectName: project.name,
        date: details.date,
        time: details.time,
    });
    setConfirmedBookingDetails(details);
    setIsBookingModalOpen(false);
    setIsConfirmationModalOpen(true);
  };


  const TabButton: React.FC<{tab: Tab, label: string}> = ({ tab, label }) => (
    <button
        onClick={() => setActiveTab(tab)}
        className={`px-4 py-3 font-semibold text-sm rounded-t-lg transition-colors whitespace-nowrap ${activeTab === tab ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500 hover:text-brand-blue'}`}
    >
        {label}
    </button>
  );

  const OverviewTab: React.FC<{
    project: Project;
    isOwner: boolean;
  }> = ({ project, isOwner }) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-slate-800 mb-4">About This Project</h3>
      <p className="text-slate-600 leading-relaxed whitespace-pre-line">{project.description}</p>
      {!isOwner && (
        <div className="mt-6 pt-6 border-t border-slate-200">
            <h4 className="text-lg font-semibold text-slate-800 mb-3">Interested in this project?</h4>
            <p className="text-slate-600 mb-4">Schedule a personalized site visit with one of our experts to learn more about the property and our construction process.</p>
            <button
                onClick={() => setIsBookingModalOpen(true)}
                className="bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3 px-6 rounded-md text-base transition-transform transform hover:scale-105 shadow flex items-center justify-center space-x-2 w-full sm:w-auto"
            >
                <CalendarIcon className="w-5 h-5" />
                <span>Book a Site Visit</span>
            </button>
        </div>
      )}
    </div>
  );

  const TimelineTab: React.FC<{project: Project}> = ({project}) => (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-bold text-slate-800 mb-6">Construction Timeline</h3>
      {project.timeline.map((stage, index) => (
        <div key={stage.id} className="relative pl-8 mb-8 border-l-2 border-slate-300">
          <div className={`absolute -left-4 top-1 w-8 h-8 rounded-full flex items-center justify-center ${stage.status === TimelineStatus.COMPLETED ? 'bg-green-500' : stage.status === TimelineStatus.IN_PROGRESS ? 'bg-brand-teal animate-pulse' : 'bg-slate-300'}`}>
            <span className="text-white font-bold">{index + 1}</span>
          </div>
          <h4 className="text-lg font-semibold text-slate-900">{stage.name}</h4>
          <p className={`text-sm font-medium ${stage.status === TimelineStatus.COMPLETED ? 'text-green-600' : 'text-slate-500'}`}>{stage.status}</p>
          <div className="w-full bg-slate-200 rounded-full h-2.5 mt-2">
            <div className={`h-2.5 rounded-full ${stage.status === TimelineStatus.COMPLETED ? 'bg-green-500' : 'bg-brand-teal'}`} style={{ width: `${stage.progress}%` }}></div>
          </div>
        </div>
      ))}
    </div>
  );

  const StatusBadge: React.FC<{ status: TransactionStatus }> = ({ status }) => {
    const baseClasses = "px-2.5 py-0.5 text-xs font-medium rounded-full";
    switch (status) {
        case TransactionStatus.PAID:
            return <span className={`${baseClasses} bg-green-100 text-green-800`}>Paid</span>;
        case TransactionStatus.PENDING:
            return <span className={`${baseClasses} bg-yellow-100 text-yellow-800`}>Pending</span>;
        case TransactionStatus.AWAITING_APPROVAL:
            return <span className={`${baseClasses} bg-blue-100 text-blue-800`}>Awaiting Approval</span>;
        case TransactionStatus.FAILED:
            return <span className={`${baseClasses} bg-red-100 text-red-800`}>Failed</span>;
        default:
            return <span className={`${baseClasses} bg-slate-100 text-slate-800`}>Unknown</span>;
    }
  };

  const PaymentsTab: React.FC<{project: Project}> = ({project}) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <h3 className="text-xl font-bold text-slate-800 p-6 pb-0">Payment History</h3>
        <ul className="divide-y divide-slate-200">
          {project.transactions.length > 0 ? project.transactions.map(tx => (
            <li key={tx.id} className="p-4 hover:bg-slate-50 flex flex-col sm:flex-row justify-between sm:items-center">
              <div className="flex items-center space-x-4 mb-2 sm:mb-0">
                <div className="flex-shrink-0 w-10 h-10 bg-brand-teal text-white rounded-full flex items-center justify-center">
                    <CreditCardIcon className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">{tx.description}</p>
                  <p className="text-sm text-slate-500">Date: {tx.date} | Amount: {formatCurrency(tx.amount)}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4 self-end sm:self-center">
                <StatusBadge status={tx.status} />
                {tx.status === TransactionStatus.PENDING && (
                  <button onClick={() => { setSelectedTransaction(tx); setIsPaymentModalOpen(true); }} className="text-sm font-medium text-white bg-brand-orange hover:bg-brand-orange-dark px-3 py-1 rounded-md">
                    Pay Now
                  </button>
                )}
                {tx.status === TransactionStatus.PAID && (
                  <button 
                    onClick={() => {
                      const invoice = MOCK_INVOICES.find(inv => inv.id === tx.invoiceId);
                      if (invoice) setSelectedInvoice(invoice);
                    }}
                    className="text-sm font-medium text-brand-blue hover:underline"
                  >
                    View Invoice
                  </button>
                )}
              </div>
            </li>
          )) : (
            <li className="p-6 text-center text-slate-500">
                No transactions found for this project.
            </li>
          )}
        </ul>
    </div>
  );
  
  const PaymentModal: React.FC<{
    transaction: Transaction;
    onClose: () => void;
    onUpload: (file: File, transaction: Transaction) => void;
  }> = ({ transaction, onClose, onUpload }) => {
      const [paymentMethod, setPaymentMethod] = useState<'offline' | 'upload'>('upload');
      const fileInputRef = useRef<HTMLInputElement>(null);
      const [selectedFile, setSelectedFile] = useState<File | null>(null);

      const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setSelectedFile(e.target.files[0]);
        }
      };

      const handleUploadClick = () => {
          if (selectedFile) {
              onUpload(selectedFile, transaction);
          } else {
              alert("Please select a file to upload.");
          }
      };
      
      return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-md">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">Complete Your Payment</h2>
                <p className="text-slate-600 mb-6">For {transaction.description} of <span className="font-semibold">{formatCurrency(transaction.amount)}</span>.</p>
                
                <div className="flex border-b mb-4">
                    <button onClick={() => setPaymentMethod('upload')} className={`flex-1 py-2 font-semibold ${paymentMethod === 'upload' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500'}`}>Upload Proof</button>
                    <button onClick={() => setPaymentMethod('offline')} className={`flex-1 py-2 font-semibold ${paymentMethod === 'offline' ? 'text-brand-blue border-b-2 border-brand-blue' : 'text-slate-500'}`}>Offline Payment</button>
                </div>

                {paymentMethod === 'upload' && (
                    <div>
                        <p className="text-sm text-slate-600 mb-4">Upload a screenshot or receipt of your online transaction. Your payment will be marked as 'Paid' after admin approval.</p>
                        <input type="file" ref={fileInputRef} onChange={handleFileSelect} accept="image/*,.pdf" className="hidden" />
                        <button onClick={() => fileInputRef.current?.click()} className="w-full flex items-center justify-center space-x-2 p-4 border-2 border-dashed rounded-lg text-slate-500 hover:border-brand-blue hover:text-brand-blue">
                            <PaperClipIcon className="w-5 h-5" />
                            <span>{selectedFile ? selectedFile.name : 'Choose a file...'}</span>
                        </button>
                        {selectedFile && <img src={URL.createObjectURL(selectedFile)} alt="Preview" className="mt-4 rounded-lg max-h-40 mx-auto" />}
                         <button onClick={handleUploadClick} disabled={!selectedFile} className="mt-4 w-full bg-brand-blue text-white font-bold py-2.5 rounded-md hover:bg-brand-blue-dark disabled:bg-slate-400">
                            Submit for Approval
                        </button>
                    </div>
                )}
                
                {paymentMethod === 'offline' && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                        <h4 className="font-semibold text-slate-800 mb-2">Bank Transfer Details</h4>
                        <p className="text-sm text-slate-600"><strong>Bank Name:</strong> SafeClue Bank</p>
                        <p className="text-sm text-slate-600"><strong>Account No:</strong> 123456789012</p>
                        <p className="text-sm text-slate-600"><strong>IFSC Code:</strong> SCBL0001234</p>
                        <p className="text-sm text-slate-600 mt-2">Please mention your Project ID in the remarks. After payment, please upload the receipt using the 'Upload Proof' option.</p>
                    </div>
                )}

                <div className="flex justify-end mt-6">
                    <button type="button" onClick={onClose} className="px-4 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Close</button>
                </div>
            </div>
        </div>
      );
  };

  const InvoiceModal: React.FC<{invoice: Invoice, onClose: () => void}> = ({invoice, onClose}) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
                <h2 className="text-2xl font-bold text-brand-blue-dark">Invoice #{invoice.invoiceNumber}</h2>
                <StatusBadge status={invoice.status} />
            </div>
            <div className="overflow-y-auto">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600 mb-6">
                    <div>
                        <p className="font-semibold text-slate-800">Billed To:</p>
                        <p>{user.name}</p>
                        <p>{user.email}</p>
                    </div>
                    <div className="sm:text-right">
                        <p><span className="font-semibold text-slate-800">Date:</span> {invoice.date}</p>
                        <p><span className="font-semibold text-slate-800">Due Date:</span> {invoice.dueDate}</p>
                    </div>
                </div>
                <table className="w-full text-left">
                    <thead>
                        <tr className="bg-slate-100">
                            <th className="p-3 font-semibold text-sm text-slate-700">Description</th>
                            <th className="p-3 font-semibold text-sm text-right text-slate-700">Amount</th>
                        </tr>
                    </thead>
                    <tbody>
                        {invoice.items.map((item, index) => (
                            <tr key={index} className="border-b border-slate-200">
                                <td className="p-3 text-slate-700">{item.description}</td>
                                <td className="p-3 text-right text-slate-700">{formatCurrency(item.amount)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                <div className="mt-6 flex justify-end">
                    <div className="w-full max-w-xs text-right text-slate-700">
                        <div className="flex justify-between py-2 border-b">
                            <span className="font-semibold">Subtotal</span>
                            <span>{formatCurrency(invoice.items.reduce((sum, item) => sum + item.amount, 0))}</span>
                        </div>
                        <div className="flex justify-between py-2 font-bold text-lg text-slate-800">
                            <span>Total Amount</span>
                            <span>{formatCurrency(invoice.totalAmount)}</span>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex justify-end space-x-4 mt-6 flex-shrink-0">
                <button type="button" onClick={onClose} className="px-6 py-2 bg-slate-200 text-slate-800 rounded-md hover:bg-slate-300">Close</button>
                {invoice.status === TransactionStatus.PENDING && (
                    <button 
                        type="button" 
                        onClick={() => {
                            const transaction = project.transactions.find(t => t.invoiceId === invoice.id);
                            if (transaction) {
                                setSelectedTransaction(transaction);
                                setSelectedInvoice(null);
                                setIsPaymentModalOpen(true);
                            }
                        }}
                        className="px-6 py-2 bg-brand-teal text-white rounded-md hover:bg-brand-teal-dark"
                    >
                        Pay Now
                    </button>
                )}
            </div>
        </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 pb-20">
      <div className="relative h-56 bg-cover bg-center" style={{ backgroundImage: `url(${project.images[0]})` }}>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="absolute inset-0 flex flex-col justify-end p-6">
            <h2 className="text-3xl font-bold text-white shadow-lg">{project.name}</h2>
            <p className="text-gray-200 mt-1 shadow-md flex items-center"><MapPinIcon className="w-5 h-5 mr-2" />{project.location}</p>
        </div>
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-white/70 backdrop-blur-sm rounded-full hover:bg-white transition-colors z-10">
            <ChevronLeftIcon className="w-6 h-6 text-slate-800" />
        </button>
      </div>
      
      <div className="sticky top-0 z-10 bg-white shadow-md">
          <div className="container mx-auto px-4">
            <nav className="flex space-x-2 overflow-x-auto -mb-px">
              <TabButton tab="overview" label="Overview" />
              <TabButton tab="timeline" label="Timeline" />
              {isOwner && <TabButton tab="payments" label="Payments" />}
            </nav>
          </div>
      </div>

      <main className="container mx-auto p-4 md:p-6">
          {activeTab === 'overview' && <OverviewTab project={project} isOwner={isOwner} />}
          {activeTab === 'timeline' && <TimelineTab project={project} />}
          {isOwner && activeTab === 'payments' && <PaymentsTab project={project} />}
      </main>
      
      {isOwner && selectedInvoice && <InvoiceModal invoice={selectedInvoice} onClose={() => setSelectedInvoice(null)} />}
      {isOwner && isPaymentModalOpen && selectedTransaction && (
          <PaymentModal 
            transaction={selectedTransaction} 
            onClose={() => setIsPaymentModalOpen(false)}
            onUpload={handlePaymentProofUpload}
          />
      )}
      {!isOwner && isBookingModalOpen && (
        <BookingModal 
          project={project}
          onClose={() => setIsBookingModalOpen(false)}
          onSubmit={handleBookVisit}
        />
      )}
      {!isOwner && isConfirmationModalOpen && confirmedBookingDetails && (
          <ConfirmationModal
              project={project}
              bookingDetails={confirmedBookingDetails}
              onClose={() => {
                  setIsConfirmationModalOpen(false);
                  setConfirmedBookingDetails(null);
              }}
          />
      )}
    </div>
  );
};

export default ProjectDetail;