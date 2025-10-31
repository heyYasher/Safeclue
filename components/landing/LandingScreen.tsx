
import React, { useState } from 'react';
import type { View } from '../../types';
import { SafeClueLogo, CameraIcon, DocumentTextIcon, ChatBubbleIcon, FacebookIcon, TwitterIcon, LinkedInIcon } from '../shared/icons';


interface LandingScreenProps {
    onNavigate: (view: View) => void;
}

const LandingNavbar = ({ onNavigate }: LandingScreenProps) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <nav className="bg-white/80 backdrop-blur-md shadow-sm fixed w-full top-0 z-50">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    <div className="flex items-center">
                        <SafeClueLogo className="h-10 w-10" />
                        <span className="font-bold text-2xl ml-2 text-brand-blue">SafeClue</span>
                    </div>
                    <div className="hidden md:block">
                        <div className="ml-10 flex items-baseline space-x-4">
                            <a href="#home" className="text-gray-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium">Home</a>
                            <a href="#features" className="text-gray-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium">About Us</a>
                            <a href="#services" className="text-gray-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium">Services</a>
                            <a href="#estimator" className="text-gray-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium">Estimator</a>
                            <a href="#contact" className="text-gray-700 hover:text-brand-blue px-3 py-2 rounded-md text-sm font-medium">Contact</a>
                        </div>
                    </div>
                     <div className="hidden md:block">
                        <button 
                            onClick={() => onNavigate('login')}
                            className="bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-blue-dark transition-colors"
                        >
                            Login
                        </button>
                    </div>
                    <div className="md:hidden">
                        <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-brand-blue hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-brand-blue">
                            <span className="sr-only">Open main menu</span>
                            <svg className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                            <svg className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>
            </div>
            <div className={`${isMenuOpen ? 'block' : 'hidden'} md:hidden`}>
                <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                    <a href="#home" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium">Home</a>
                    <a href="#features" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium">About Us</a>
                    <a href="#services" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium">Services</a>
                    <a href="#estimator" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium">Estimator</a>
                    <a href="#contact" onClick={() => setIsMenuOpen(false)} className="text-gray-700 hover:text-brand-blue block px-3 py-2 rounded-md text-base font-medium">Contact</a>
                </div>
                <div className="pt-4 pb-3 border-t border-gray-200">
                    <div className="px-2">
                         <button 
                            onClick={() => { onNavigate('login'); setIsMenuOpen(false); }}
                            className="w-full bg-brand-blue text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-brand-blue-dark transition-colors"
                        >
                            Login
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

const HeroSection = ({ onNavigate }: LandingScreenProps) => (
    <section id="home" className="relative pt-16 h-screen flex items-center justify-center text-white">
        <div className="absolute inset-0 bg-cover bg-center bg-no-repeat" style={{ backgroundImage: "url('https://picsum.photos/seed/homepage-hero/1920/1080')" }}></div>
        <div className="absolute inset-0 bg-black bg-opacity-60"></div>
        <div className="relative z-10 text-center px-4">
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">Streamlining Construction Projects with Advanced Technology</h1>
            <p className="mt-4 max-w-3xl mx-auto text-lg md:text-xl text-gray-300">
                Safeclue provides comprehensive solutions for managing construction projects, ensuring timely completion and quality control through our innovative platform.
            </p>
            <div className="mt-8 flex justify-center gap-4">
                <button
                    onClick={() => onNavigate('register')}
                    className="bg-brand-blue text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-brand-blue-dark transition-transform transform hover:scale-105 shadow-lg"
                >
                    Get Started
                </button>
                 <button
                    onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
                    className="bg-white text-brand-blue font-bold py-3 px-8 rounded-lg text-lg hover:bg-gray-200 transition-transform transform hover:scale-105 shadow-lg"
                >
                    Learn More
                </button>
            </div>
        </div>
    </section>
);

const FeaturesSection = () => (
    <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Why Choose Us?</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                Our platform offers a range of features designed to enhance project management and communication.
            </p>
            <div className="mt-12 grid gap-10 md:grid-cols-3">
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-blue text-white shadow-lg">
                        <CameraIcon className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Real-Time Monitoring</h3>
                    <p className="mt-2 text-base text-gray-500">
                        Keep track of your project's progress with live photo and video updates directly from the site.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-blue text-white shadow-lg">
                        <DocumentTextIcon className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Automated Reporting</h3>
                    <p className="mt-2 text-base text-gray-500">
                        Receive AI-powered, detailed reports on milestones, potential risks, and project timelines.
                    </p>
                </div>
                <div className="flex flex-col items-center">
                    <div className="flex items-center justify-center h-16 w-16 rounded-full bg-brand-blue text-white shadow-lg">
                        <ChatBubbleIcon className="h-8 w-8" />
                    </div>
                    <h3 className="mt-5 text-lg font-medium text-gray-900">Seamless Communication</h3>
                    <p className="mt-2 text-base text-gray-500">
                        Stay connected with project managers and support staff through our integrated chat system.
                    </p>
                </div>
            </div>
        </div>
    </section>
);

const ServicesSection = () => (
     <section id="services" className="py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Our Services</h2>
             <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                We offer a variety of services to meet the diverse needs of our clients.
            </p>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
                <div className="bg-gray-50 rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-brand-blue">Project Management</h3>
                    <p className="mt-4 text-gray-600">End-to-end management of new construction projects, ensuring they are completed on time and within budget.</p>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-brand-blue">Quality Assurance</h3>
                    <p className="mt-4 text-gray-600">Rigorous quality checks at every stage of construction to guarantee the highest standards of workmanship.</p>
                </div>
                <div className="bg-gray-50 rounded-lg shadow-md p-8">
                    <h3 className="text-xl font-bold text-brand-blue">Consultation</h3>
                    <p className="mt-4 text-gray-600">Expert advice and consultation services for planning and executing your new construction ventures.</p>
                </div>
            </div>
        </div>
    </section>
);

const EstimatorCTASection = ({ onNavigate }: LandingScreenProps) => (
    <section id="estimator" className="py-20 bg-brand-beige">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-extrabold text-gray-900">Smart Estimator – Your Cost, Your Control</h2>
            <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-600">
                Get a transparent, live estimate for your construction project in just a few clicks. Adjust plot size and finish quality to see instant changes in your cost per sq ft.
            </p>
            <div className="mt-8">
                <button
                    onClick={() => onNavigate('login')}
                    className="bg-brand-dark text-white font-bold py-3 px-8 rounded-lg text-lg hover:bg-black transition-transform transform hover:scale-105 shadow-lg"
                >
                    Try Our Smart Estimator
                </button>
            </div>
        </div>
    </section>
);

const Footer = () => (
    <footer id="contact" className="bg-gray-800 text-white">
        <div className="container mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="xl:grid xl:grid-cols-3 xl:gap-8">
                <div className="space-y-8 xl:col-span-1">
                    <div className="flex items-center">
                         <SafeClueLogo className="h-10 w-10" />
                         <span className="font-bold text-2xl ml-2 text-white">SafeClue</span>
                    </div>
                    <p className="text-gray-400 text-base">
                        Your trusted partner in construction project management. We bring transparency and efficiency to your projects.
                    </p>
                    <div className="flex space-x-6">
                        <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Facebook</span><FacebookIcon className="h-6 w-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">Twitter</span><TwitterIcon className="h-6 w-6" /></a>
                        <a href="#" className="text-gray-400 hover:text-white"><span className="sr-only">LinkedIn</span><LinkedInIcon className="h-6 w-6" /></a>
                    </div>
                </div>
                <div className="mt-12 grid grid-cols-2 gap-8 xl:mt-0 xl:col-span-2">
                    <div className="md:grid md:grid-cols-2 md:gap-8">
                        <div>
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Links</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#home" className="text-base text-gray-400 hover:text-white">Home</a></li>
                                <li><a href="#features" className="text-base text-gray-400 hover:text-white">About Us</a></li>
                                <li><a href="#services" className="text-base text-gray-400 hover:text-white">Services</a></li>
                            </ul>
                        </div>
                        <div className="mt-12 md:mt-0">
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Legal</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Privacy Policy</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Terms of Service</a></li>
                            </ul>
                        </div>
                    </div>
                     <div className="md:grid md:grid-cols-1">
                         <div>
                            <h3 className="text-sm font-semibold text-gray-200 tracking-wider uppercase">Contact</h3>
                            <ul className="mt-4 space-y-4 text-base text-gray-400">
                                <li><p>123 Construction Ave,</p><p>Metropolis, USA 12345</p></li>
                                <li><p>Email: contact@safeclue.com</p></li>
                                <li><p>Phone: (123) 456-7890</p></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
            <div className="mt-12 border-t border-gray-700 pt-8">
                <p className="text-base text-gray-400 text-center">&copy; {new Date().getFullYear()} SafeClue. All rights reserved.</p>
            </div>
        </div>
    </footer>
);


const LandingScreen: React.FC<LandingScreenProps> = ({ onNavigate }) => {
    return (
        <div className="bg-white">
            <LandingNavbar onNavigate={onNavigate} />
            <main>
                <HeroSection onNavigate={onNavigate} />
                <FeaturesSection />
                <ServicesSection />
                <EstimatorCTASection onNavigate={onNavigate} />
            </main>
            <Footer />
        </div>
    );
};

export default LandingScreen;