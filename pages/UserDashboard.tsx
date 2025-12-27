
import React, { useState } from 'react';
import { User, Product, ProductStatus } from '../types';

interface UserDashboardProps {
  user: User;
  products: Product[];
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

const UserDashboard: React.FC<UserDashboardProps> = ({ user, products, onSelect }) => {
  const [tab, setTab] = useState<'listings' | 'won' | 'bidding'>('listings');

  // Listings by the user
  const myListings = products.filter(p => p.sellerId === user.id);
  
  // Items won by the user
  const myWins = products.filter(p => p.winnerId === user.id);

  // Active items user has bid on
  const myActiveBids = products.filter(p => 
    p.status === ProductStatus.ACTIVE && 
    p.bids.some(b => b.userId === user.id)
  );

  return (
    <div className="space-y-8">
      {/* Profile Header */}
      <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center gap-8">
        <img 
          src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&size=200`} 
          className="w-32 h-32 rounded-3xl border-4 border-white shadow-lg"
          alt="avatar"
        />
        <div className="flex-grow text-center md:text-left">
          <h1 className="text-3xl font-black text-slate-900">{user.name}</h1>
          <p className="text-slate-500 font-medium mb-4">{user.email}</p>
          <div className="flex flex-wrap justify-center md:justify-start gap-4">
            <div className="bg-indigo-50 px-4 py-2 rounded-xl">
              <span className="text-indigo-600 font-black text-xl block">{myListings.length}</span>
              <span className="text-xs text-indigo-400 font-bold uppercase tracking-widest">Listings</span>
            </div>
            <div className="bg-emerald-50 px-4 py-2 rounded-xl">
              <span className="text-emerald-600 font-black text-xl block">{myWins.length}</span>
              <span className="text-xs text-emerald-400 font-bold uppercase tracking-widest">Items Won</span>
            </div>
            <div className="bg-amber-50 px-4 py-2 rounded-xl">
              <span className="text-amber-600 font-black text-xl block">{myActiveBids.length}</span>
              <span className="text-xs text-amber-400 font-bold uppercase tracking-widest">Active Bids</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200">
        <button 
          onClick={() => setTab('listings')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${tab === 'listings' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          My Listings
        </button>
        <button 
          onClick={() => setTab('won')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${tab === 'won' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Items Won
        </button>
        <button 
          onClick={() => setTab('bidding')}
          className={`px-6 py-4 text-sm font-bold border-b-2 transition-all ${tab === 'bidding' ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}
        >
          Current Bidding
        </button>
      </div>

      {/* Tab Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {tab === 'listings' && (
          myListings.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 italic">You haven't listed any items yet.</p>
            </div>
          ) : (
            myListings.map(p => (
              <DashboardCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
            ))
          )
        )}

        {tab === 'won' && (
          myWins.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 italic">No won items yet. Start bidding!</p>
            </div>
          ) : (
            myWins.map(p => (
              <DashboardCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
            ))
          )
        )}

        {tab === 'bidding' && (
          myActiveBids.length === 0 ? (
            <div className="col-span-full py-20 text-center bg-white rounded-3xl border border-slate-200">
              <p className="text-slate-400 italic">You aren't currently bidding on anything.</p>
            </div>
          ) : (
            myActiveBids.map(p => (
              <DashboardCard key={p.id} product={p} onClick={() => onSelect(p.id)} />
            ))
          )
        )}
      </div>
    </div>
  );
};

const DashboardCard: React.FC<{ product: Product, onClick: () => void }> = ({ product, onClick }) => {
  const statusColors = {
    [ProductStatus.PENDING]: 'bg-amber-100 text-amber-700',
    [ProductStatus.ACTIVE]: 'bg-emerald-100 text-emerald-700',
    [ProductStatus.REJECTED]: 'bg-red-100 text-red-700',
    [ProductStatus.SOLD]: 'bg-slate-100 text-slate-700',
  };

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl border border-slate-200 hover:shadow-lg transition-all cursor-pointer group flex items-center gap-4"
    >
      <img src={product.imageUrl} className="w-20 h-20 rounded-xl object-cover" alt={product.name} />
      <div className="flex-grow min-w-0">
        <h4 className="font-bold text-slate-800 truncate">{product.name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${statusColors[product.status]}`}>
            {product.status}
          </span>
          <span className="text-sm font-bold text-indigo-600">${product.currentPrice.toLocaleString()}</span>
        </div>
      </div>
      <div className="text-slate-300 group-hover:text-indigo-600 transition-colors">
        <i className="fas fa-chevron-right"></i>
      </div>
    </div>
  );
};

export default UserDashboard;
