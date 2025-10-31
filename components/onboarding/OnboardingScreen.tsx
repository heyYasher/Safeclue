import React, { useState } from 'react';
import { SafeClueLogo } from '../shared/icons';

const onboardingSteps = [
    {
        image: 'https://picsum.photos/seed/construction-tech/800/600',
        title: 'Welcome to SafeClue',
        description: 'Your eyes on your construction site, anywhere, anytime. Track progress with complete transparency.',
    },
    {
        image: 'https://picsum.photos/seed/project-dashboard/800/600',
        title: 'Track Your Project in Real-Time',
        description: 'Get live photo & video updates, monitor construction timelines, and never miss a single milestone.',
    },
    {
        image: 'https://picsum.photos/seed/team-communication/800/600',
        title: 'Seamless Communication',
        description: 'Chat with support, book demo visits, and manage payments all in one secure and easy-to-use platform.',
    }
];

interface OnboardingScreenProps {
    onFinish: () => void;
}

const OnboardingScreen: React.FC<OnboardingScreenProps> = ({ onFinish }) => {
    const [currentStep, setCurrentStep] = useState(0);

    const handleNext = () => {
        if (currentStep < onboardingSteps.length - 1) {
            setCurrentStep(currentStep + 1);
        } else {
            onFinish();
        }
    };
    
    const isLastStep = currentStep === onboardingSteps.length - 1;
    const step = onboardingSteps[currentStep];

    return (
        <div className="min-h-screen flex flex-col bg-white">
            <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
                <SafeClueLogo className="w-10 h-10" />
                <button 
                    onClick={onFinish}
                    className="bg-black/20 text-white text-sm font-semibold py-1 px-4 rounded-full backdrop-blur-sm hover:bg-black/40 transition-colors"
                >
                    Skip
                </button>
            </header>

            <main className="flex-1 flex flex-col">
                <div className="w-full h-3/5 sm:h-2/3 bg-slate-200">
                    <img src={step.image} alt={step.title} className="w-full h-full object-cover" />
                </div>
                
                <div className="flex-1 p-8 flex flex-col justify-between text-center">
                    <div>
                        <h1 className="text-3xl font-bold text-slate-900">{step.title}</h1>
                        <p className="text-slate-600 mt-4 max-w-md mx-auto">{step.description}</p>
                    </div>

                    <div className="flex flex-col items-center">
                        <div className="flex space-x-2 my-6">
                            {onboardingSteps.map((_, index) => (
                                <div
                                    key={index}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                        currentStep === index ? 'bg-brand-blue scale-125' : 'bg-slate-300'
                                    }`}
                                />
                            ))}
                        </div>

                        <button
                            onClick={handleNext}
                            className="w-full max-w-sm bg-brand-blue text-white font-bold py-4 px-8 rounded-lg text-lg hover:bg-brand-blue-dark transition-transform transform hover:scale-105 shadow-lg"
                        >
                            {isLastStep ? 'Get Started' : 'Next'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default OnboardingScreen;