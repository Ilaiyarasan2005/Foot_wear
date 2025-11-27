import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './pages/HomePage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import OrderConfirmationPage from './pages/OrderConfirmationPage';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminProductForm from './pages/AdminProductForm';
import AdminOrderManagement from './pages/AdminOrderManagement'; // Import AdminOrderManagement
import ErrorBoundary from './components/ErrorBoundary'; // Import ErrorBoundary

const App: React.FC = () => {
  const { isAdmin } = useAuth();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        <ErrorBoundary> {/* Wrap Routes with ErrorBoundary */}
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmationPage />} />
            
            <Route path="/admin" element={isAdmin ? <AdminDashboard /> : <AdminLogin />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin/products/add" element={isAdmin ? <AdminProductForm /> : <AdminLogin />} />
            <Route path="/admin/products/edit/:id" element={isAdmin ? <AdminProductForm /> : <AdminLogin />} />
            <Route path="/admin/orders" element={isAdmin ? <AdminOrderManagement /> : <AdminLogin />} /> {/* New route */}
            
            {/* Fallback for unknown routes */}
            <Route path="*" element={<h1 className="text-3xl text-center text-red-500">404 - Page Not Found</h1>} />
          </Routes>
        </ErrorBoundary>
      </main>
      <Footer />
    </div>
  );
};

export default App;