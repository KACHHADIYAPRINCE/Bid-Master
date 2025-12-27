
export enum UserRole {
  USER = 'USER',
  ADMIN = 'ADMIN'
}

export enum ProductStatus {
  PENDING = 'PENDING',
  ACTIVE = 'ACTIVE',
  REJECTED = 'REJECTED',
  SOLD = 'SOLD'
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar?: string;
}

export interface Bid {
  id: string;
  userId: string;
  userName: string;
  amount: number;
  timestamp: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  startingPrice: number;
  currentPrice: number;
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  status: ProductStatus;
  endTime: number;
  bids: Bid[];
  winnerId?: string;
}

export interface AppState {
  currentUser: User | null;
  products: Product[];
}
