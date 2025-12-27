
import React from 'react';
import { User, UserRole } from '../types';

interface NavbarProps {
  user: User | null;
  onViewChange: (view: string) => void;
  onLogout: () => void;
  currentView: string;
}

const Navbar: React.FC<NavbarProps> = ({ user, onViewChange, onLogout, currentView }) => {
  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => onViewChange('home')}
              className="text-2xl font-black text-indigo-600 flex items-center gap-2"
            >
              <i className="fas fa-gavel"></i>
              <span>BidMaster</span>
            </button>
            <div className="hidden md:flex gap-6">
              <button 
                onClick={() => onViewChange('home')}
                className={`text-sm font-medium ${currentView === 'home' ? 'text-indigo-600' : 'text-slate-600 hover:text-indigo-600'}`}
              >
                Browse Auctions
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {user ? (
              <div className="flex items-center gap-4">
                {user.role === UserRole.ADMIN ? (
                  <button 
                    onClick={() => onViewChange('admin-dashboard')}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-800 px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2"
                  >
                    <i className="fas fa-user-shield"></i>
                    Admin Portal
                  </button>
                ) : (
                  <button 
                    onClick={() => onViewChange('list-product')}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors flex items-center gap-2 shadow-lg shadow-indigo-100"
                  >
                    <i className="fas fa-plus"></i>
                    List Item
                  </button>
                )}
                
                <div className="h-8 w-px bg-slate-200"></div>

                <div className="group relative">
                  <button 
                    onClick={() => onViewChange(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'user-dashboard')}
                    className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                  >
                    <img 
                      src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`} 
                      className="h-8 w-8 rounded-full border border-slate-200"
                      alt="avatar"
                    />
                    <span className="hidden sm:inline text-sm font-medium text-slate-700">{user.name}</span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white border border-slate-200 rounded-lg shadow-xl py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                    <button 
                      onClick={() => onViewChange(user.role === UserRole.ADMIN ? 'admin-dashboard' : 'user-dashboard')}
                      className="w-full text-left px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                    >
                      <i className="fas fa-tachometer-alt"></i> Dashboard
                    </button>
                    <button 
                      onClick={onLogout}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                    >
                      <i className="fas fa-sign-out-alt"></i> Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => onViewChange('login')}
                  className="text-sm font-semibold text-slate-700 hover:text-indigo-600 px-4 py-2"
                >
                  Log in
                </button>
                <button 
                  onClick={() => onViewChange('register')}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-semibold transition-all shadow-md"
                >
                  Sign up
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
