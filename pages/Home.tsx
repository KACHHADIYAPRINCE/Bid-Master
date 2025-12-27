
import React, { useState } from 'react';
import { Product, ProductStatus } from '../types';

interface HomeProps {
  products: Product[];
  onSelect: (id: string) => void;
}

const Home: React.FC<HomeProps> = ({ products, onSelect }) => {
  const [filter, setFilter] = useState('all');
  const activeProducts = products.filter(p => p.status === ProductStatus.ACTIVE);

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-indigo-900 rounded-3xl overflow-hidden mb-12 relative text-white">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img src="https://images.unsplash.com/photo-1543002588-bfa74002ed7e?auto=format&fit=crop&q=80&w=1587" className="w-full h-full object-cover" alt="bg" />
        </div>
        <div className="relative p-12 md:p-20 text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-black mb-6 leading-tight">Bid on Rare Finds & Collectibles</h1>
          <p className="text-xl text-indigo-100 mb-8 font-light">Join thousands of bidders daily. From vintage watches to modern electronics, your next treasure is one bid away.</p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button className="bg-white text-indigo-900 font-bold px-8 py-4 rounded-full shadow-xl hover:scale-105 transition-transform">Start Bidding</button>
            <button className="bg-indigo-700 text-white font-bold px-8 py-4 rounded-full border border-indigo-500 hover:bg-indigo-600 transition-colors">How it works</button>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <div className="mb-8 flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800">Featured Auctions</h2>
        <div className="flex bg-slate-200 p-1 rounded-xl">
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white shadow-sm text-indigo-600">All Items</button>
          <button className="px-4 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900">Closing Soon</button>
        </div>
      </div>

      {activeProducts.length === 0 ? (
        <div className="bg-white border-2 border-dashed border-slate-200 rounded-3xl py-20 text-center">
          <i className="fas fa-box-open text-5xl text-slate-300 mb-4"></i>
          <h3 className="text-xl font-bold text-slate-400">No active auctions right now</h3>
          <p className="text-slate-400">Check back later or list your own items!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {activeProducts.map(product => (
            <div 
              key={product.id} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 hover:shadow-2xl transition-all group flex flex-col h-full cursor-pointer"
              onClick={() => onSelect(product.id)}
            >
              <div className="relative aspect-square overflow-hidden bg-slate-100">
                <img 
                  src={product.imageUrl} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                  alt={product.name} 
                />
                <div className="absolute top-3 left-3 flex gap-2">
                  <span className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-indigo-600 border border-slate-200 shadow-sm">
                    {product.bids.length} Bids
                  </span>
                </div>
              </div>
              <div className="p-5 flex flex-col flex-grow">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-slate-800 text-lg line-clamp-1">{product.name}</h3>
                </div>
                <p className="text-slate-500 text-sm line-clamp-2 mb-4 flex-grow">{product.description}</p>
                <div className="mt-auto">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <span className="text-xs text-slate-400 block font-medium uppercase tracking-tight">Current Bid</span>
                      <span className="text-2xl font-black text-slate-900">${product.currentPrice.toLocaleString()}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-xs text-slate-400 block font-medium uppercase tracking-tight">Ends In</span>
                      <span className="text-sm font-bold text-red-500">
                        {Math.max(0, Math.floor((product.endTime - Date.now()) / (1000 * 60 * 60)))}h left
                      </span>
                    </div>
                  </div>
                  <button className="w-full bg-slate-900 group-hover:bg-indigo-600 text-white font-bold py-3 rounded-xl transition-colors">
                    Place Bid
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
