
import React, { useState, useEffect, useRef } from 'react';
import { User, Notification } from '../../types';
import type { View } from '../../types';
import Header from '../shared/Header';
import { CalculatorIcon, CompassIcon, BuildingIcon, ClipboardListIcon } from '../shared/icons';

interface HomeScreenProps {
  user: User;
  onNavigate: (view: View) => void;
  onLogout: () => void;
  notifications: Notification[];
}

const offerImages = [
  'https://picsum.photos/seed/offer1/800/400',
  'https://picsum.photos/seed/offer2/800/400',
  'https://picsum.photos/seed/offer3/800/400',
  'https://picsum.photos/seed/offer4/800/400',
  'https://picsum.photos/seed/offer5/800/400',
];

const OfferSlider: React.FC = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const timeoutRef = useRef<number | null>(null);

    const resetTimeout = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
    };

    useEffect(() => {
        resetTimeout();
        timeoutRef.current = window.setTimeout(
            () =>
                setCurrentIndex((prevIndex) =>
                    prevIndex === offerImages.length - 1 ? 0 : prevIndex + 1
                ),
            3000 // 3 seconds duration
        );

        return () => {
            if(timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, [currentIndex]);

    const goToSlide = (slideIndex: number) => {
        setCurrentIndex(slideIndex);
    };

    return (
        <div className="mx-4 my-6 rounded-2xl shadow-xl overflow-hidden h-52 relative" role="region" aria-label="Offers Slider">
            <div
                className="whitespace-nowrap transition-transform duration-1000 ease-in-out h-full"
                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
            >
                {offerImages.map((src, index) => (
                    <div className="inline-block w-full h-full" key={index}>
                        <img
                            src={src}
                            alt={`Offer ${index + 1}`}
                            className="w-full h-full object-cover"
                        />
                    </div>
                ))}
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                {offerImages.map((_, slideIndex) => (
                    <button
                        key={slideIndex}
                        onClick={() => goToSlide(slideIndex)}
                        aria-label={`Go to slide ${slideIndex + 1}`}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ease-in-out ${
                            currentIndex === slideIndex ? 'bg-white scale-125' : 'bg-white/50'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
};


const ServiceCard: React.FC<{
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
    tag?: string;
}> = ({ icon, title, description, onClick, tag }) => (
    <button
        onClick={onClick}
        className="bg-white p-4 rounded-xl shadow-lg text-left w-full h-full flex flex-col hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
        <div className="flex justify-between items-start">
            <div className="w-12 h-12 bg-brand-blue-light text-white rounded-lg flex items-center justify-center flex-shrink-0">
                {icon}
            </div>
            {tag && <span className="text-xs font-bold bg-teal-100 text-teal-800 px-2 py-1 rounded-full">{tag}</span>}
        </div>
        <div className="mt-4 flex flex-col flex-grow">
            <h3 className="text-lg font-bold text-slate-800">{title}</h3>
            <p className="text-slate-600 mt-1 text-sm flex-grow">{description}</p>
        </div>
    </button>
);


const HomeScreen: React.FC<HomeScreenProps> = ({ user, onNavigate, onLogout, notifications }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} notifications={notifications} />
      <main className="pb-20">
        <OfferSlider />
        
        <div className="px-4 my-8">
            <h2 className="text-xl font-bold text-slate-900 mb-4">Your Dashboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <ServiceCard
                    icon={<ClipboardListIcon className="w-7 h-7" />}
                    title="My Projects"
                    description="Access and manage your ongoing and completed projects."
                    onClick={() => onNavigate('my_profile')}
                />
                <ServiceCard
                    icon={<BuildingIcon className="w-7 h-7" />}
                    title="Explore Projects"
                    description="View our portfolio of showcase construction projects."
                    onClick={() => onNavigate('project_list')}
                />
                <ServiceCard
                    icon={<CalculatorIcon className="w-7 h-7" />}
                    title="Smart Estimator"
                    description="Get an instant cost projection for your project."
                    onClick={() => onNavigate('smart_estimator')}
                    tag="Popular"
                />
                 <ServiceCard
                    icon={<CompassIcon className="w-7 h-7" />}
                    title="Vastu Consultation"
                    description="Ensure your new home is aligned with positive energy."
                    onClick={() => alert('Vastu Consultation service is coming soon!')}
                    tag="Coming Soon"
                />
            </div>
        </div>
      </main>
    </div>
  );
};

export default HomeScreen;