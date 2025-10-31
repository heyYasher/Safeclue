import React, { useState, useMemo } from 'react';
import { ChevronLeftIcon, SafeClueLogo } from '../shared/icons';

interface SmartEstimatorScreenProps {
  onBack?: () => void;
  onCTAClick?: () => void;
  isLanding?: boolean;
}

const FINISH_QUALITY_CONFIG = {
  levels: ['Basic', 'Standard', 'Premium'],
  costs: [1200, 1500, 1900],
  descriptions: [
    'Functional finishes with standard materials.',
    'Enhanced durability and aesthetic appeal.',
    'High-end materials and luxury features.'
  ]
};

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

const QualityOption: React.FC<{
    level: string;
    cost: number;
    description: string;
    isActive: boolean;
    onClick: () => void;
}> = ({ level, cost, description, isActive, onClick }) => {
    return (
        <button
            onClick={onClick}
            className={`p-4 border-2 rounded-lg text-left transition-all duration-200 w-full ${
                isActive
                ? 'bg-blue-50 border-brand-blue shadow-md'
                : 'bg-slate-50 border-slate-200 hover:border-slate-400'
            }`}
        >
            <div className="flex justify-between items-center">
                <h4 className="font-bold text-slate-800">{level}</h4>
                <p className="font-semibold text-brand-blue-dark">{formatCurrency(cost)}<span className="text-xs font-normal text-slate-500">/sqft</span></p>
            </div>
            <p className="text-sm text-slate-600 mt-1">{description}</p>
        </button>
    );
};


const SmartEstimatorScreen: React.FC<SmartEstimatorScreenProps> = ({ onBack, onCTAClick, isLanding = false }) => {
  const [plotSize, setPlotSize] = useState(1200);
  const [qualityIndex, setQualityIndex] = useState(1); // Default to 'Standard'

  const { estimatedCostPerSqFt, totalCost } = useMemo(() => {
    const costPerSqFt = FINISH_QUALITY_CONFIG.costs[qualityIndex];
    const total = plotSize * costPerSqFt;
    return { estimatedCostPerSqFt: costPerSqFt, totalCost: total };
  }, [plotSize, qualityIndex]);

  const handlePlotSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseInt(e.target.value);
      setPlotSize(isNaN(value) || value < 0 ? 0 : value);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4" style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23e2e8f0' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
      backgroundAttachment: 'fixed'
    }}>
       {!isLanding && onBack && (
         <button onClick={onBack} className="fixed top-6 left-6 p-3 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:bg-white transition-colors z-20">
            <ChevronLeftIcon className="w-6 h-6 text-slate-800" />
        </button>
       )}

      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden my-8">
        <div className="grid grid-cols-1 md:grid-cols-2">
            
          {/* Left Column: Controls */}
          <div className="p-8 md:p-10">
            <div className="flex items-center space-x-4 mb-6">
                <SafeClueLogo className="w-12 h-12" />
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Smart Estimator</h1>
                    <p className="text-sm text-slate-500 font-medium">Powered by SafeClue</p>
                </div>
            </div>
            
            <p className="text-slate-600 mb-8">
              Get an instant, data-driven cost projection for your new construction project.
            </p>

            <div className="space-y-6">
              <div>
                <label htmlFor="plot-size" className="block text-lg font-semibold text-slate-800 mb-2">1. Plot Area</label>
                 <div className="relative">
                     <input
                      type="number"
                      id="plot-size"
                      value={plotSize}
                      onChange={handlePlotSizeChange}
                      className="w-full bg-slate-100 border-2 border-slate-200 rounded-lg shadow-inner px-4 py-3 text-slate-900 text-lg font-medium focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue"
                    />
                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500">sq ft</span>
                 </div>
              </div>

              <div>
                <label className="block text-lg font-semibold text-slate-800 mb-2">2. Finish Quality</label>
                <div className="space-y-3">
                    {FINISH_QUALITY_CONFIG.levels.map((level, index) => (
                        <QualityOption
                            key={level}
                            level={level}
                            cost={FINISH_QUALITY_CONFIG.costs[index]}
                            description={FINISH_QUALITY_CONFIG.descriptions[index]}
                            isActive={qualityIndex === index}
                            onClick={() => setQualityIndex(index)}
                        />
                    ))}
                </div>
              </div>

             {isLanding && (
                <div className="pt-6">
                    <button 
                        onClick={onCTAClick} 
                        className="w-full bg-slate-800 text-white font-bold py-4 px-6 rounded-lg text-lg hover:bg-slate-900 transition-transform transform hover:scale-105 shadow-lg"
                    >
                        Save Estimate & Get Started
                    </button>
                </div>
             )}
            </div>
          </div>
          
          {/* Right Column: Results */}
          <div className="bg-slate-800 text-white p-8 md:p-10 flex flex-col justify-center">
            <div className="text-center">
                <h2 className="text-lg font-medium text-slate-300 mb-2">Estimated Project Cost</h2>
                <p className="text-5xl md:text-6xl font-bold tracking-tight mb-4">{formatCurrency(totalCost)}</p>
                
                <div className="bg-white/10 rounded-lg p-4 inline-block">
                    <p className="text-lg font-medium">
                        {formatCurrency(estimatedCostPerSqFt)}
                        <span className="text-sm text-slate-300 font-normal"> / sq ft</span>
                        <span className="text-sm text-slate-300 font-normal mx-2">×</span>
                        {plotSize.toLocaleString()}
                        <span className="text-sm text-slate-300 font-normal"> sq ft</span>
                    </p>
                </div>

                <p className="text-xs text-slate-400 mt-8 max-w-xs mx-auto">
                    This is a preliminary estimate for construction costs only. It excludes land cost, architectural fees, permits, and other miscellaneous charges.
                </p>

                {!isLanding && (
                     <div className="mt-8">
                        <button 
                            onClick={() => onCTAClick ? onCTAClick() : alert('Booking functionality is being implemented.')}
                            className="w-full bg-brand-teal text-white font-bold py-3 px-6 rounded-lg hover:bg-brand-teal-dark transition-transform transform hover:scale-105 shadow-lg"
                        >
                            Book a Free Consultation
                        </button>
                    </div>
                )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default SmartEstimatorScreen;