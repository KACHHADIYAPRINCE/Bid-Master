import { Product, User, UserRole, ProductStatus, Bid } from '../types';

const STORAGE_KEY_PRODUCTS = 'bidmaster_products';
const STORAGE_KEY_USERS = 'bidmaster_users';
const STORAGE_KEY_AUTH = 'bidmaster_auth';

export const dbService = {
  getUsers: (): User[] => {
    const data = localStorage.getItem(STORAGE_KEY_USERS);
    let users: User[] = data ? JSON.parse(data) : [];
    
    // Always ensure the Super Admin exists in the list
    const adminEmail = 'admin@bidmaster.com';
    if (!users.find(u => u.email === adminEmail)) {
      const admin: User = {
        id: 'admin-1',
        name: 'Super Admin',
        email: adminEmail,
        role: UserRole.ADMIN,
        avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=admin'
      };
      users.push(admin);
      localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
    }
    return users;
  },

  register: (user: User) => {
    const users = dbService.getUsers();
    if (users.find(u => u.email === user.email)) return; // Prevent duplicates
    users.push(user);
    localStorage.setItem(STORAGE_KEY_USERS, JSON.stringify(users));
  },

  login: (email: string): User | null => {
    const users = dbService.getUsers();
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (user) {
      localStorage.setItem(STORAGE_KEY_AUTH, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY_AUTH);
  },

  getLoggedUser: (): User | null => {
    const data = localStorage.getItem(STORAGE_KEY_AUTH);
    return data ? JSON.parse(data) : null;
  },

  getProducts: (): Product[] => {
    const data = localStorage.getItem(STORAGE_KEY_PRODUCTS);
    const products: Product[] = data ? JSON.parse(data) : [];
    
    const now = Date.now();
    let updated = false;
    const processed = products.map(p => {
      if (p.status === ProductStatus.ACTIVE && now > p.endTime) {
        p.status = ProductStatus.SOLD;
        if (p.bids.length > 0) {
          const highestBid = p.bids[p.bids.length - 1];
          p.winnerId = highestBid.userId;
        }
        updated = true;
      }
      return p;
    });

    if (updated) {
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(processed));
    }
    return processed;
  },

  saveProduct: (product: Product) => {
    const products = dbService.getProducts();
    products.push(product);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
  },

  updateProduct: (updatedProduct: Product) => {
    const products = dbService.getProducts();
    const index = products.findIndex(p => p.id === updatedProduct.id);
    if (index !== -1) {
      products[index] = updatedProduct;
      localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(products));
    }
  },

  deleteProduct: (id: string) => {
    const products = dbService.getProducts();
    const filtered = products.filter(p => p.id !== id);
    localStorage.setItem(STORAGE_KEY_PRODUCTS, JSON.stringify(filtered));
  },

  placeBid: (productId: string, userId: string, userName: string, amount: number) => {
    const products = dbService.getProducts();
    const product = products.find(p => p.id === productId);
    if (!product) return null;

    if (amount <= product.currentPrice) return { error: `Bid must be higher than $${product.currentPrice}` };

    const newBid: Bid = {
      id: Math.random().toString(36).substr(2, 9),
      userId,
      userName,
      amount,
      timestamp: Date.now()
    };

    product.bids.push(newBid);
    product.currentPrice = amount;

    dbService.updateProduct(product);
    return product;
  }
};