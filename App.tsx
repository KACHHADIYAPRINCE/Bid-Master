import React, { useState, useEffect, useCallback } from 'react';
import { User, Product, UserRole } from './types';
import { dbService } from './services/dbService';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import ListProduct from './pages/ListProduct';
import ProductDetail from './pages/ProductDetail';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [currentView, setCurrentView] = useState<string>('home');
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);

  const loadData = useCallback(() => {
    const loggedUser = dbService.getLoggedUser();
    if (loggedUser) setCurrentUser(loggedUser);

    const allProducts = dbService.getProducts();
    setProducts(allProducts);
    
    // Initialize users (seeds admin if necessary)
    dbService.getUsers();
  }, []);

  useEffect(() => {
    loadData();
    // Auto-refresh timer to update auction statuses
    const interval = setInterval(() => {
      setProducts(dbService.getProducts());
    }, 10000);
    return () => clearInterval(interval);
  }, [loadData]);

  const refreshProducts = () => {
    setProducts(dbService.getProducts());
  };

  const handleLogout = () => {
    dbService.logout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
    window.scrollTo(0, 0);
  };

  const handleViewChange = (view: string) => {
    setCurrentView(view);
    window.scrollTo(0, 0);
  };

  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home products={products} onSelect={navigateToProduct} />;
      case 'login':
        return <Login onLogin={(u) => { setCurrentUser(u); handleViewChange('home'); }} onNavigate={() => handleViewChange('register')} />;
      case 'register':
        return <Register onRegister={() => handleViewChange('login')} onNavigate={() => handleViewChange('login')} />;
      case 'user-dashboard':
        return currentUser ? <UserDashboard user={currentUser} products={products} onRefresh={refreshProducts} onSelect={navigateToProduct} /> : <Home products={products} onSelect={navigateToProduct} />;
      case 'admin-dashboard':
        return currentUser && currentUser.role === UserRole.ADMIN ? <AdminDashboard user={currentUser} products={products} onRefresh={refreshProducts} onSelect={navigateToProduct} /> : <Home products={products} onSelect={navigateToProduct} />;
      case 'list-product':
        return currentUser ? <ListProduct user={currentUser} onComplete={() => { refreshProducts(); handleViewChange('user-dashboard'); }} /> : <Login onLogin={(u) => { setCurrentUser(u); handleViewChange('home'); }} onNavigate={() => handleViewChange('register')} />;
      case 'product-detail':
        const p = products.find(x => x.id === selectedProductId);
        return p ? <ProductDetail product={p} user={currentUser} onRefresh={refreshProducts} /> : <Home products={products} onSelect={navigateToProduct} />;
      default:
        return <Home products={products} onSelect={navigateToProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onViewChange={handleViewChange} 
        onLogout={handleLogout} 
        currentView={currentView}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {renderView()}
      </main>
      <footer className="bg-slate-900 text-white py-12 mt-12">
        <div className="container mx-auto px-4 text-center">
          <div className="flex justify-center items-center gap-2 mb-4">
            <i className="fas fa-gavel text-indigo-400 text-2xl"></i>
            <h2 className="text-2xl font-black">BidMaster</h2>
          </div>
          <p className="text-slate-400 text-sm max-w-md mx-auto mb-8">
            The world's premier secure bidding platform. Every item verified, every bid secured.
          </p>
          <div className="flex justify-center gap-6 mb-8">
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"><i className="fab fa-facebook-f"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center hover:bg-indigo-600 transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
          <div className="h-px bg-slate-800 w-full mb-8"></div>
          <p className="text-slate-500 text-xs">© 2024 BidMaster Auction House. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;