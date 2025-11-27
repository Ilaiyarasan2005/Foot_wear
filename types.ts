// types.ts

export interface Product {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
  availableSizes: string[];
  description: string;
  dateAdded: string; // Added for sorting and tracking creation date
  stockQuantity: number; // New: Current stock quantity for the product
}

export interface Review {
  id: string;
  productId: string;
  userName: string;
  rating: number; // 1-5 star rating
  comment: string;
  date: string; // ISO string format
}

export interface CartItem {
  product: Product;
  selectedSize: string;
  quantity: number;
}

export interface CustomerInfo {
  name: string;
  mobile: string;
  address: string;
}

export interface Order {
  id: string;
  items: CartItem[];
  customerInfo: CustomerInfo;
  total: number;
  orderDate: string;
  status: 'Pending' | 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled';
}

export enum LOCAL_STORAGE_KEYS {
  PRODUCTS = 'sole_stride_products',
  CART = 'sole_stride_cart',
  ORDERS = 'sole_stride_orders',
  ADMIN_AUTH = 'sole_stride_admin_auth',
  REVIEWS = 'sole_stride_reviews', // Added for product reviews
}