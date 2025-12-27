
import React, { useState, useEffect, useCallback } from 'react';
import { User, Product, UserRole, ProductStatus } from './types';
import { dbService } from './services/dbService';

// Import Pages
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

  // Load initial state
  useEffect(() => {
    const loggedUser = dbService.getLoggedUser();
    if (loggedUser) setCurrentUser(loggedUser);

    const allProducts = dbService.getProducts();
    setProducts(allProducts);

    // Initial check for Admin user to be seeded if no users exist
    const users = dbService.getUsers();
    if (users.length === 0) {
      const admin: User = {
        id: 'admin-1',
        name: 'Super Admin',
        email: 'admin@bidmaster.com',
        role: UserRole.ADMIN,
        avatar: 'https://picsum.photos/seed/admin/200'
      };
      dbService.register(admin);
    }
  }, []);

  const refreshProducts = useCallback(() => {
    setProducts(dbService.getProducts());
  }, []);

  const handleLogout = () => {
    dbService.logout();
    setCurrentUser(null);
    setCurrentView('home');
  };

  const navigateToProduct = (id: string) => {
    setSelectedProductId(id);
    setCurrentView('product-detail');
  };

  // Simple Router
  const renderView = () => {
    switch (currentView) {
      case 'home':
        return <Home products={products} onSelect={navigateToProduct} />;
      case 'login':
        return <Login onLogin={(u) => { setCurrentUser(u); setCurrentView('home'); }} onNavigate={() => setCurrentView('register')} />;
      case 'register':
        return <Register onRegister={() => setCurrentView('login')} onNavigate={() => setCurrentView('login')} />;
      case 'user-dashboard':
        return <UserDashboard user={currentUser!} products={products} onRefresh={refreshProducts} onSelect={navigateToProduct} />;
      case 'admin-dashboard':
        return <AdminDashboard user={currentUser!} products={products} onRefresh={refreshProducts} onSelect={navigateToProduct} />;
      case 'list-product':
        return <ListProduct user={currentUser!} onComplete={() => { refreshProducts(); setCurrentView('user-dashboard'); }} />;
      case 'product-detail':
        const p = products.find(x => x.id === selectedProductId);
        return p ? <ProductDetail product={p} user={currentUser} onRefresh={refreshProducts} /> : <div>Product not found</div>;
      default:
        return <Home products={products} onSelect={navigateToProduct} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar 
        user={currentUser} 
        onViewChange={setCurrentView} 
        onLogout={handleLogout} 
        currentView={currentView}
      />
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        {renderView()}
      </main>
      <footer className="bg-slate-900 text-white py-8 mt-12">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-xl font-bold mb-4">BidMaster™</h2>
          <p className="text-slate-400 text-sm">The world's most trusted bidding platform. Hand-verified products and secure payments.</p>
          <div className="flex justify-center gap-6 mt-6">
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fab fa-facebook"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fab fa-twitter"></i></a>
            <a href="#" className="text-slate-400 hover:text-white transition-colors"><i className="fab fa-instagram"></i></a>
          </div>
          <p className="text-slate-500 text-xs mt-8">© 2024 BidMaster. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default App;
