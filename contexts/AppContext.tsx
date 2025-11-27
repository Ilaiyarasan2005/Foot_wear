// contexts/AppContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Product, CartItem, Order, CustomerInfo, LOCAL_STORAGE_KEYS, Review } from '../types';
import { localStorageService } from '../services/localStorageService';
import { adminAuthService } from '../services/adminAuthService';
import { MOCK_PRODUCTS, MOCK_REVIEWS } from '../constants';

interface AppContextType {
  products: Product[];
  cart: CartItem[];
  orders: Order[];
  reviews: Review[]; // Added reviews state
  isAdmin: boolean;
  loadingProducts: boolean; // Added loadingProducts state
  addProduct: (product: Product) => void;
  updateProduct: (product: Product) => void;
  deleteProduct: (productId: string) => void;
  addToCart: (product: Product, selectedSize: string, quantity: number) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateCartItemQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  placeOrder: (customerInfo: CustomerInfo, total: number) => Order;
  addReview: (review: Review) => void; // Added addReview function
  adminLogin: (username: string, password: string) => boolean;
  adminLogout: () => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void; // New: Update order status
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppContextProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]); // Initialize reviews state
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [loadingProducts, setLoadingProducts] = useState<boolean>(true); // Initialize to true

  // Initialize data from localStorage or mock data
  useEffect(() => {
    const initializeData = () => {
      const storedProducts = localStorageService.getItem<Product[]>(LOCAL_STORAGE_KEYS.PRODUCTS);
      if (storedProducts && storedProducts.length > 0) {
        setProducts(storedProducts);
      } else {
        // If no products in local storage, use mock data and store it
        setProducts(MOCK_PRODUCTS);
        localStorageService.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, MOCK_PRODUCTS);
      }
      
      setCart(localStorageService.getItem<CartItem[]>(LOCAL_STORAGE_KEYS.CART) || []);
      setOrders(localStorageService.getItem<Order[]>(LOCAL_STORAGE_KEYS.ORDERS) || []);
      
      const storedReviews = localStorageService.getItem<Review[]>(LOCAL_STORAGE_KEYS.REVIEWS);
      if (storedReviews && storedReviews.length > 0) {
        setReviews(storedReviews);
      } else {
        setReviews(MOCK_REVIEWS);
        localStorageService.setItem(LOCAL_STORAGE_KEYS.REVIEWS, MOCK_REVIEWS);
      }

      setIsAdmin(adminAuthService.isAuthenticated());
      setLoadingProducts(false); // Set to false after initialization
    };

    initializeData();
  }, []);

  // Persist data to localStorage whenever it changes
  useEffect(() => {
    localStorageService.setItem(LOCAL_STORAGE_KEYS.PRODUCTS, products);
  }, [products]);

  useEffect(() => {
    localStorageService.setItem(LOCAL_STORAGE_KEYS.CART, cart);
  }, [cart]);

  useEffect(() => {
    localStorageService.setItem(LOCAL_STORAGE_KEYS.ORDERS, orders);
  }, [orders]);

  useEffect(() => {
    localStorageService.setItem(LOCAL_STORAGE_KEYS.REVIEWS, reviews);
  }, [reviews]);

  const addProduct = useCallback((product: Product) => {
    setProducts((prevProducts) => [...prevProducts, product]);
  }, []);

  const updateProduct = useCallback((updatedProduct: Product) => {
    setProducts((prevProducts) =>
      prevProducts.map((p) => (p.id === updatedProduct.id ? updatedProduct : p))
    );
  }, []);

  const deleteProduct = useCallback((productId: string) => {
    setProducts((prevProducts) => prevProducts.filter((p) => p.id !== productId));
  }, []);

  const addToCart = useCallback((product: Product, selectedSize: string, quantity: number) => {
    setCart((prevCart) => {
      const existingItemIndex = prevCart.findIndex(
        (item) => item.product.id === product.id && item.selectedSize === selectedSize
      );

      // Check if enough stock is available for the new total quantity
      const currentCartQuantity = existingItemIndex > -1 ? prevCart[existingItemIndex].quantity : 0;
      const totalRequestedQuantity = currentCartQuantity + quantity;

      if (product.stockQuantity < totalRequestedQuantity) {
        alert(`Cannot add ${quantity} of ${product.title} to cart. Only ${product.stockQuantity - currentCartQuantity} left in stock.`);
        return prevCart; // Return original cart if not enough stock
      }

      if (existingItemIndex > -1) {
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex].quantity += quantity;
        return updatedCart;
      } else {
        return [...prevCart, { product, selectedSize, quantity }];
      }
    });
  }, []);

  const removeFromCart = useCallback((productId: string, selectedSize: string) => {
    setCart((prevCart) =>
      prevCart.filter((item) => !(item.product.id === productId && item.selectedSize === selectedSize))
    );
  }, []);

  const updateCartItemQuantity = useCallback(
    (productId: string, selectedSize: string, quantity: number) => {
      setCart((prevCart) =>
        prevCart.map((item) => {
          if (item.product.id === productId && item.selectedSize === selectedSize) {
            // Ensure new quantity does not exceed stock
            const newQuantity = Math.min(quantity, item.product.stockQuantity);
            return { ...item, quantity: newQuantity };
          }
          return item;
        }).filter(item => item.quantity > 0) // Remove if quantity drops to 0
      );
    },
  );

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  const placeOrder = useCallback((customerInfo: CustomerInfo, total: number): Order => {
    const newOrder: Order = {
      id: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      items: cart,
      customerInfo,
      total,
      orderDate: new Date().toISOString(),
      status: 'Pending',
    };
    
    // Decrement stock for each product in the order
    setProducts(prevProducts =>
      prevProducts.map(product => {
        const orderedItem = cart.find(item => item.product.id === product.id);
        if (orderedItem) {
          return { ...product, stockQuantity: product.stockQuantity - orderedItem.quantity };
        }
        return product;
      })
    );

    setOrders((prevOrders) => [...prevOrders, newOrder]);
    clearCart();
    return newOrder;
  }, [cart, clearCart]);

  const addReview = useCallback((review: Review) => {
    setReviews((prevReviews) => [...prevReviews, review]);
  }, []);

  const adminLogin = useCallback((username: string, password: string): boolean => {
    const success = adminAuthService.login(username, password);
    setIsAdmin(success);
    return success;
  }, []);

  const adminLogout = useCallback(() => {
    adminAuthService.logout();
    setIsAdmin(false);
  }, []);

  const updateOrderStatus = useCallback((orderId: string, status: Order['status']) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.id === orderId ? { ...order, status } : order
      )
    );
  }, []);

  const contextValue = {
    products,
    cart,
    orders,
    reviews, // Expose reviews
    isAdmin,
    loadingProducts, // Expose loadingProducts
    addProduct,
    updateProduct,
    deleteProduct,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    clearCart,
    placeOrder,
    addReview, // Expose addReview
    adminLogin,
    adminLogout,
    updateOrderStatus, // Expose updateOrderStatus
  };

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppContextProvider');
  }
  return context;
};

export const useAuth = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAuth must be used within an AppContextProvider');
  }
  return { isAdmin: context.isAdmin, adminLogin: context.adminLogin, adminLogout: context.adminLogout };
};