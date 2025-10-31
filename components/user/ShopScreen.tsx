
import React from 'react';
import { User, Notification } from '../../types';
import type { View } from '../../types';
import Header from '../shared/Header';
import { SafeCoinIcon } from '../shared/icons';

interface ShopScreenProps {
  user: User;
  onLogout: () => void;
  onNavigate: (view: View) => void;
  notifications: Notification[];
}

const mockProducts = [
  { id: 'prod1', name: 'Premium Faucet Set', image: 'https://picsum.photos/seed/faucet/400/300', price: 5000 },
  { id: 'prod2', name: 'Designer LED Chandelier', image: 'https://picsum.photos/seed/chandelier/400/300', price: 15000 },
  { id: 'prod3', name: 'Italian Marble Slab (10 sqft)', image: 'https://picsum.photos/seed/marble/400/300', price: 8500 },
  { id: 'prod4', name: 'Smart Home Hub', image: 'https://picsum.photos/seed/smarthome/400/300', price: 12000 },
  { id: 'prod5', name: 'Vastu Consultation Voucher', image: 'https://picsum.photos/seed/vastu/400/300', price: 2500 },
  { id: 'prod6', name: 'Epoxy Flooring Kit', image: 'https://picsum.photos/seed/epoxy/400/300', price: 7800 },
];

const formatSafeCoins = (amount: number) => {
  return new Intl.NumberFormat('en-IN').format(amount);
};

const ShopScreen: React.FC<ShopScreenProps> = ({ user, onLogout, onNavigate, notifications }) => {
  
  const handlePurchase = (productName: string, price: number) => {
    if (user.safeCoinBalance >= price) {
        alert(`Congratulations! You have successfully purchased "${productName}". Your SafeCoin balance will be updated upon confirmation.`);
    } else {
        alert("You do not have enough SafeCoins to make this purchase.");
    }
  };
    
  return (
    <div className="min-h-screen bg-slate-100">
      <Header user={user} onLogout={onLogout} onNavigate={onNavigate} notifications={notifications} />
      <main className="container mx-auto p-4 md:p-6 pb-24">
        <div className="bg-gradient-to-r from-brand-blue to-brand-teal text-white p-6 rounded-2xl shadow-lg mb-8 flex justify-between items-center">
          <div>
            <p className="text-lg font-medium opacity-80">Your Balance</p>
            <p className="text-4xl font-bold">{formatSafeCoins(user.safeCoinBalance)} SafeCoins</p>
          </div>
          <SafeCoinIcon className="w-16 h-16 opacity-50" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-800 mb-6">SafeClue Shop</h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {mockProducts.map(product => (
            <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden flex flex-col">
              <img src={product.image} alt={product.name} className="w-full h-32 object-cover" />
              <div className="p-4 flex flex-col flex-grow">
                <h3 className="font-bold text-slate-800 text-base flex-grow">{product.name}</h3>
                <p className="text-sm text-slate-500 my-2">
                  <span className="font-semibold text-brand-orange-dark">{formatSafeCoins(product.price)}</span> SafeCoins
                </p>
                <button 
                    onClick={() => handlePurchase(product.name, product.price)}
                    className="w-full bg-brand-blue text-white font-bold py-2 px-3 rounded-md text-sm hover:bg-brand-blue-light transition-colors mt-auto"
                >
                    Buy Now
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default ShopScreen;