
import React, { useState, useEffect } from 'react';
import { Product, User, ProductStatus } from '../types';
import { dbService } from '../services/dbService';

interface ProductDetailProps {
  product: Product;
  user: User | null;
  onRefresh: () => void;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product, user, onRefresh }) => {
  const [bidAmount, setBidAmount] = useState<string>('');
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState<string>('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = Date.now();
      const diff = product.endTime - now;
      if (diff <= 0) {
        setTimeLeft('Auction Ended');
        clearInterval(timer);
      } else {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const secs = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${mins}m ${secs}s`);
      }
    }, 1000);
    return () => clearInterval(timer);
  }, [product.endTime]);

  const handlePlaceBid = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError('Please log in to place a bid.');
      return;
    }

    const amount = parseFloat(bidAmount);
    if (isNaN(amount) || amount <= product.currentPrice) {
      setError(`Bid must be higher than $${product.currentPrice.toLocaleString()}`);
      return;
    }

    const result = dbService.placeBid(product.id, user.id, user.name, amount);
    if (result && 'error' in result) {
      setError(result.error);
    } else {
      setBidAmount('');
      setError('');
      onRefresh();
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
      {/* Left Column: Media */}
      <div className="space-y-6">
        <div className="bg-white p-2 rounded-[2rem] border border-slate-200 shadow-2xl">
          <img src={product.imageUrl} className="w-full aspect-square object-cover rounded-[1.6rem]" alt={product.name} />
        </div>
        <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-4">Item Description</h3>
          <p className="text-slate-600 leading-relaxed">{product.description}</p>
        </div>
      </div>

      {/* Right Column: Bidding Action */}
      <div className="space-y-6">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h1 className="text-3xl font-black text-slate-900 leading-tight">{product.name}</h1>
              <p className="text-slate-400 mt-1">Listed by <span className="font-bold text-slate-600">{product.sellerName}</span></p>
            </div>
            <div className={`px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-widest ${product.status === ProductStatus.ACTIVE ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}`}>
              {product.status}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-8">
            <div className="bg-slate-50 p-6 rounded-2xl border border-slate-100">
              <span className="text-xs text-slate-400 font-bold uppercase tracking-widest block mb-1">Current Bid</span>
              <span className="text-3xl font-black text-slate-900">${product.currentPrice.toLocaleString()}</span>
            </div>
            <div className="bg-indigo-50 p-6 rounded-2xl border border-indigo-100">
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest block mb-1">Time Remaining</span>
              <span className="text-2xl font-black text-indigo-600 tabular-nums">{timeLeft}</span>
            </div>
          </div>

          {product.status === ProductStatus.ACTIVE ? (
            <div className="space-y-6">
              <form onSubmit={handlePlaceBid} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">Place Your Bid</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">$</span>
                    <input 
                      type="number" 
                      value={bidAmount}
                      onChange={(e) => setBidAmount(e.target.value)}
                      placeholder={(product.currentPrice + 10).toString()}
                      className="w-full pl-8 pr-4 py-4 rounded-2xl border border-slate-200 focus:ring-2 focus:ring-indigo-500 outline-none font-bold"
                    />
                  </div>
                  {error && <p className="text-red-500 text-xs font-bold mt-2 ml-1"><i className="fas fa-info-circle mr-1"></i> {error}</p>}
                </div>
                <button 
                  type="submit"
                  disabled={!user}
                  className={`w-full py-5 rounded-2xl font-black text-lg transition-all shadow-xl ${user ? 'bg-indigo-600 hover:bg-indigo-700 text-white shadow-indigo-100 transform hover:-translate-y-1' : 'bg-slate-100 text-slate-400 cursor-not-allowed'}`}
                >
                  {user ? 'Confirm Bid Now' : 'Login to Bid'}
                </button>
              </form>
              <p className="text-center text-[10px] text-slate-400 font-medium px-8">By placing a bid, you agree to our buyer's terms. Bidding is legally binding.</p>
            </div>
          ) : (
            <div className="bg-slate-900 text-white p-8 rounded-2xl text-center">
              <h3 className="text-2xl font-black mb-2">Auction Ended</h3>
              {product.winnerId ? (
                <div className="flex flex-col items-center gap-2">
                  <p className="text-slate-400">Winning Bid</p>
                  <p className="text-4xl font-black text-emerald-400">${product.currentPrice.toLocaleString()}</p>
                </div>
              ) : (
                <p className="text-slate-400">No successful bids for this item.</p>
              )}
            </div>
          )}
        </div>

        {/* Bid History */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm">
          <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center gap-2">
            <i className="fas fa-history text-indigo-500"></i>
            Bid History
          </h3>
          <div className="space-y-4">
            {product.bids.length === 0 ? (
              <p className="text-slate-400 italic text-center py-4">No bids placed yet. Be the first!</p>
            ) : (
              [...product.bids].reverse().map((bid, i) => (
                <div key={bid.id} className={`flex items-center justify-between p-4 rounded-xl ${i === 0 ? 'bg-indigo-50 border border-indigo-100' : 'bg-slate-50'}`}>
                  <div className="flex items-center gap-3">
                    <img src={`https://ui-avatars.com/api/?name=${encodeURIComponent(bid.userName)}&background=random`} className="w-8 h-8 rounded-full" alt="av" />
                    <div>
                      <p className="text-sm font-bold text-slate-800">{bid.userName}</p>
                      <p className="text-[10px] text-slate-400 uppercase font-black">{new Date(bid.timestamp).toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black ${i === 0 ? 'text-indigo-600 text-lg' : 'text-slate-600'}`}>${bid.amount.toLocaleString()}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
