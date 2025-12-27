
import React from 'react';
import { User, Product, ProductStatus } from '../types';
import { dbService } from '../services/dbService';

interface AdminDashboardProps {
  user: User;
  products: Product[];
  onRefresh: () => void;
  onSelect: (id: string) => void;
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ products, onRefresh, onSelect }) => {
  const pendingProducts = products.filter(p => p.status === ProductStatus.PENDING);
  const totalBids = products.reduce((acc, p) => acc + p.bids.length, 0);
  const totalRevenue = products.filter(p => p.status === ProductStatus.SOLD).reduce((acc, p) => acc + p.currentPrice, 0);

  const handleStatusUpdate = (id: string, status: ProductStatus) => {
    const product = products.find(p => p.id === id);
    if (product) {
      dbService.updateProduct({ ...product, status });
      onRefresh();
    }
  };

  return (
    <div className="space-y-10">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i className="fas fa-hourglass-half"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Pending Review</p>
          <h3 className="text-3xl font-black text-slate-900">{pendingProducts.length}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i className="fas fa-dollar-sign"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Volume</p>
          <h3 className="text-3xl font-black text-slate-900">${totalRevenue.toLocaleString()}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i className="fas fa-gavel"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Bids</p>
          <h3 className="text-3xl font-black text-slate-900">{totalBids}</h3>
        </div>
        <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-xl flex items-center justify-center text-xl mb-4">
            <i className="fas fa-boxes"></i>
          </div>
          <p className="text-slate-500 text-sm font-medium">Total Listings</p>
          <h3 className="text-3xl font-black text-slate-900">{products.length}</h3>
        </div>
      </div>

      {/* Verification Queue */}
      <section>
        <div className="flex items-center gap-3 mb-6">
          <h2 className="text-2xl font-black text-slate-900">Verification Queue</h2>
          <span className="bg-amber-100 text-amber-600 px-3 py-1 rounded-full text-xs font-black">{pendingProducts.length} Needs Attention</span>
        </div>

        {pendingProducts.length === 0 ? (
          <div className="bg-white p-12 rounded-3xl border-2 border-dashed border-slate-200 text-center">
            <p className="text-slate-400 font-medium">No pending products for verification.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {pendingProducts.map(p => (
              <div key={p.id} className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col sm:flex-row gap-6">
                <img src={p.imageUrl} className="w-32 h-32 rounded-2xl object-cover" alt={p.name} />
                <div className="flex-grow">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="text-xl font-bold text-slate-800">{p.name}</h4>
                    <span className="text-sm font-bold text-indigo-600">${p.startingPrice}</span>
                  </div>
                  <p className="text-slate-500 text-sm mb-4 line-clamp-2">{p.description}</p>
                  <p className="text-xs text-slate-400 mb-4">Seller: <span className="font-bold">{p.sellerName}</span></p>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => handleStatusUpdate(p.id, ProductStatus.ACTIVE)}
                      className="flex-grow bg-emerald-600 hover:bg-emerald-700 text-white py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      Approve Listing
                    </button>
                    <button 
                      onClick={() => handleStatusUpdate(p.id, ProductStatus.REJECTED)}
                      className="px-4 bg-red-50 hover:bg-red-100 text-red-600 py-2 rounded-xl text-sm font-bold transition-all"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Global Bid History View */}
      <section className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-xl font-black text-slate-900">Global Activity Monitor</h2>
          <button onClick={onRefresh} className="text-indigo-600 text-sm font-bold hover:underline">Refresh Data</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50 text-slate-500 text-xs font-black uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Item</th>
                <th className="px-6 py-4">Current Highest Bidder</th>
                <th className="px-6 py-4">Amount</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.filter(p => p.status !== ProductStatus.PENDING).map(p => (
                <tr key={p.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <img src={p.imageUrl} className="w-10 h-10 rounded-lg object-cover" alt="p" />
                      <span className="font-bold text-slate-700">{p.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-slate-600">{p.bids.length > 0 ? p.bids[p.bids.length - 1].userName : 'No bids'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="font-black text-slate-900">${p.currentPrice.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${p.status === ProductStatus.ACTIVE ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-700'}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => onSelect(p.id)} className="text-indigo-600 hover:text-indigo-800 transition-colors">
                      <i className="fas fa-external-link-alt"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
