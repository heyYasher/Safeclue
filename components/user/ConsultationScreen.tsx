import React, { useState } from 'react';
import { ChevronLeftIcon } from '../shared/icons';

interface ConsultationScreenProps {
  onBack: () => void;
}

const ConsultationScreen: React.FC<ConsultationScreenProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    propertyType: 'Residential',
    plotSize: '',
    date: '',
    time: '',
    city: 'Pune', // Pre-filled
    message: '',
    agree: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checkboxValue = (e.target as HTMLInputElement).checked;

    setFormData(prev => ({
      ...prev,
      [name]: isCheckbox ? checkboxValue : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.agree) {
      alert('You must agree to be contacted.');
      return;
    }
    console.log('Consultation Form Data:', formData);
    alert('Thank you! Your consultation has been scheduled. Our team will contact you shortly.');
    onBack();
  };

  const inputClass = "bg-brand-beige w-full p-4 rounded-lg border border-transparent focus:outline-none focus:ring-2 focus:ring-brand-dark text-slate-800 placeholder-slate-500";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1 sr-only";

  return (
    <div className="min-h-screen bg-white">
      <div className="relative p-4">
        <button onClick={onBack} className="absolute top-4 left-4 p-2 bg-slate-100 rounded-full hover:bg-slate-200 transition-colors z-10" aria-label="Go back">
          <ChevronLeftIcon className="w-6 h-6 text-slate-800" />
        </button>
      </div>

      <div className="max-w-2xl mx-auto p-4 sm:p-8">
        <h2 className="text-3xl sm:text-4xl font-bold text-center text-slate-900 mb-8">
          Schedule Your Consultation
        </h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="fullName" className={labelClass}>Full Name*</label>
              <input type="text" id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Full Name*" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="phone" className={labelClass}>Phone*</label>
              <input type="tel" id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="phone*" required className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="email" className={labelClass}>Email*</label>
            <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} placeholder="email*" required className={inputClass} />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="propertyType" className="block text-sm font-medium text-slate-700 sr-only">Property Type*</label>
              <select id="propertyType" name="propertyType" value={formData.propertyType} onChange={handleChange} required className={inputClass}>
                <option>Residential</option>
                <option>Commercial</option>
                <option>Industrial</option>
              </select>
            </div>
            <div>
              <label htmlFor="plotSize" className={labelClass}>Plot Size (sqft)*</label>
              <input type="number" id="plotSize" name="plotSize" value={formData.plotSize} onChange={handleChange} placeholder="Plot Size (sqft)*" required className={inputClass} />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label htmlFor="date" className={labelClass}>Choose date*</label>
              <input type="text" onFocus={(e) => e.target.type = 'date'} onBlur={(e) => e.target.type = 'text'} id="date" name="date" value={formData.date} onChange={handleChange} placeholder="Choose date*" required className={inputClass} />
            </div>
            <div>
              <label htmlFor="time" className={labelClass}>Choose time*</label>
              <input type="text" onFocus={(e) => e.target.type = 'time'} onBlur={(e) => e.target.type = 'text'} id="time" name="time" value={formData.time} onChange={handleChange} placeholder="Choose time*" required className={inputClass} />
            </div>
          </div>

          <div>
            <label htmlFor="city" className={labelClass}>City</label>
            <input type="text" id="city" name="city" value={formData.city} onChange={handleChange} placeholder="Pune" className={inputClass} />
          </div>

          <div>
            <label htmlFor="message" className={labelClass}>Message (optional)</label>
            <textarea id="message" name="message" value={formData.message} onChange={handleChange} placeholder="Message (optional)" rows={4} className={inputClass}></textarea>
          </div>

          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input id="agree" name="agree" type="checkbox" checked={formData.agree} onChange={handleChange} className="focus:ring-brand-dark h-4 w-4 text-brand-dark border-gray-300 rounded" />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agree" className="text-slate-600">
                I agree to be contacted on phone/WhatsApp for this consultation.
              </label>
            </div>
          </div>

          <div className="pt-4 text-center">
            <button type="submit" className="w-full sm:w-auto bg-white border-2 border-slate-900 text-slate-900 font-bold py-4 px-12 rounded-full hover:bg-slate-100 transition-colors duration-300 text-lg">
              Book Consultation Now
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConsultationScreen;