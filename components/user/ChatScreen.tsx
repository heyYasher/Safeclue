
import React, { useState, useRef, useEffect } from 'react';
import { User, Notification } from '../../types';
import type { View } from '../../types';
import Header from '../shared/Header';

interface ChatScreenProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  notifications: Notification[];
}

interface Message {
    id: number;
    text?: string;
    sender: 'user' | 'bot';
    component?: React.ReactNode;
}

const ChatScreen: React.FC<ChatScreenProps> = ({ user, onLogout, onNavigate, notifications }) => {
    const [messages, setMessages] = useState<Message[]>([
        { id: 1, sender: 'bot', text: 'Welcome to SafeClue! How can I help you today?' }
    ]);
    const [inputValue, setInputValue] = useState('');
    const [isFormSubmitted, setIsFormSubmitted] = useState(false);
    const [isAwaitingForm, setIsAwaitingForm] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const handleFormSubmit = (data: { mobile: string; queryTopic: string; queryDetails: string }) => {
        console.log('Form data submitted for admin:', data);

        // Remove the form from chat
        setMessages(prev => prev.filter(m => !m.component));

        // Add confirmation message
        setTimeout(() => {
            setMessages(prev => [
                ...prev,
                { id: Date.now(), sender: 'bot', text: 'Thank you! Someone from the SafeClue team will contact you within 24 hours.' }
            ]);
            setIsFormSubmitted(true);
            setIsAwaitingForm(false);
        }, 500);
    };

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (!inputValue.trim() || isAwaitingForm) return;

        const userMessage: Message = { id: Date.now(), sender: 'user', text: inputValue };
        
        setMessages(prev => [...prev, userMessage]);
        
        // If this is the first user message, trigger the form
        if (messages.filter(m => m.sender === 'user').length === 0) {
            setIsAwaitingForm(true);
            setTimeout(() => {
                const botMessage: Message = { 
                    id: Date.now() + 1, 
                    sender: 'bot', 
                    text: 'Thanks for reaching out! To help us understand your needs, please select a topic and provide some details.' 
                };
                const formMessage: Message = {
                    id: Date.now() + 2,
                    sender: 'bot',
                    component: <ContactForm initialQuery={inputValue} initialMobile={user.mobile} onSubmit={handleFormSubmit} />
                };
                setMessages(prev => [...prev, botMessage, formMessage]);
            }, 1000);
        }

        setInputValue('');
    };
    
    return (
        <div className="flex flex-col h-screen bg-slate-100 pb-[68px] box-border">
            <Header user={user} onLogout={onLogout} onNavigate={onNavigate} notifications={notifications} />
            <main
                role="log"
                aria-live="polite"
                className="flex-1 overflow-y-auto p-4 space-y-4"
            >
                {messages.map((msg) => (
                    <div key={msg.id} className={`flex items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                        {msg.sender === 'bot' && (
                            <div aria-hidden="true" className="w-8 h-8 rounded-full bg-brand-blue text-white flex items-center justify-center font-bold text-sm mr-2 flex-shrink-0">S</div>
                        )}
                        <div className={`max-w-[85%] sm:max-w-md p-3 rounded-lg ${msg.sender === 'user' ? 'bg-brand-blue text-white rounded-br-none' : 'bg-white text-slate-800 rounded-bl-none shadow-sm'}`}>
                            {msg.text && <p>{msg.text}</p>}
                            {msg.component}
                        </div>
                    </div>
                ))}
                <div ref={chatEndRef} />
            </main>
            <footer className="p-4 bg-white border-t">
                <form onSubmit={handleSendMessage} className="flex items-center space-x-2">
                    <input
                        type="text"
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        placeholder={isFormSubmitted ? "Our team will contact you shortly." : isAwaitingForm ? "Please fill out the form above..." : "Type your message..."}
                        disabled={isFormSubmitted || isAwaitingForm}
                        className="flex-1 p-3 border rounded-full bg-slate-100 focus:ring-brand-blue focus:border-brand-blue transition"
                        aria-label="Chat input"
                    />
                    <button
                        type="submit"
                        disabled={isFormSubmitted || isAwaitingForm || !inputValue.trim()}
                        className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center flex-shrink-0 disabled:bg-slate-400 transition-colors"
                        aria-label="Send message"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    </button>
                </form>
            </footer>
        </div>
    );
};

interface ContactFormProps {
    initialQuery: string;
    initialMobile: string;
    onSubmit: (data: { mobile: string; queryTopic: string; queryDetails: string }) => void;
}

const QUERY_TOPICS = [
    "New Construction",
    "Home Renovation",
    "Site Visit",
    "Payment Question",
    "Other",
];

const ContactForm: React.FC<ContactFormProps> = ({ initialQuery, initialMobile, onSubmit }) => {
    const [mobile, setMobile] = useState(initialMobile);
    const [queryDetails, setQueryDetails] = useState(initialQuery);
    const [selectedTopic, setSelectedTopic] = useState<string | null>(null);
    
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedTopic) {
            alert('Please select a query topic.');
            return;
        }
        onSubmit({ mobile, queryTopic: selectedTopic, queryDetails });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-3 mt-2 text-slate-800">
            <div>
                <label className="text-sm font-medium">I have a question about:</label>
                <div className="flex flex-wrap gap-2 mt-2">
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
            <div>
                <label htmlFor="mobile" className="text-sm font-medium">Mobile Number</label>
                <input type="tel" id="mobile" name="mobile" value={mobile} onChange={(e) => setMobile(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue"/>
            </div>
             <div>
                <label htmlFor="queryDetails" className="text-sm font-medium">Details</label>
                <textarea id="queryDetails" name="queryDetails" value={queryDetails} onChange={(e) => setQueryDetails(e.target.value)} required rows={2} className="mt-1 block w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue" placeholder="Please provide any additional details..." />
            </div>
            <button type="submit" className="w-full bg-brand-teal text-white font-bold py-2 px-4 rounded-md hover:bg-brand-teal-dark transition-colors">
                Submit Details
            </button>
        </form>
    );
};


export default ChatScreen;