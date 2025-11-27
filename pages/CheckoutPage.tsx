// pages/CheckoutPage.tsx
import React, { useState, FormEvent } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { CustomerInfo } from '../types';
import Button from '../components/Button';

const CheckoutPage: React.FC = () => {
  const { cart, placeOrder } = useAppContext();
  const navigate = useNavigate();

  const [customerInfo, setCustomerInfo] = useState<CustomerInfo>({
    name: '',
    mobile: '',
    address: '',
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isPlacingOrder, setIsPlacingOrder] = useState<boolean>(false); // New state for loading

  const subtotal = cart.reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  const validateForm = () => {
    const newErrors: { [key: string]: string } = {};
    if (!customerInfo.name.trim()) newErrors.name = 'Name is required';
    if (!customerInfo.mobile.trim()) {
      newErrors.mobile = 'Mobile number is required';
    } else if (!/^\d{10}$/.test(customerInfo.mobile.trim())) {
      newErrors.mobile = 'Mobile number must be 10 digits';
    }
    if (!customerInfo.address.trim()) newErrors.address = 'Address is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => { // Made async to simulate delay
    event.preventDefault();
    if (cart.length === 0) {
      alert('Your cart is empty. Please add items before checking out.');
      navigate('/');
      return;
    }

    if (validateForm()) {
      setIsPlacingOrder(true); // Start loading
      // Simulate a brief network request/processing time for placing order
      await new Promise(resolve => setTimeout(resolve, 1000)); 

      const newOrder = placeOrder(customerInfo, subtotal);
      setIsPlacingOrder(false); // End loading
      navigate(`/order-confirmation/${newOrder.id}`);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-xl text-gray-600 mb-4">Your cart is empty. Please add items to checkout.</h1>
        <Link to="/">
          <Button>Continue Shopping</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="py-8 max-w-2xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Checkout</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Order</h2>
        <ul className="divide-y divide-gray-200">
          {cart.map((item) => (
            <li key={`${item.product.id}-${item.selectedSize}`} className="py-3 flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{item.product.title} (Size: {item.selectedSize})</p>
                <p className="text-sm text-gray-600">{item.quantity} x ₹{item.product.price.toFixed(2)}</p>
              </div>
              <p className="font-semibold text-gray-900">₹{(item.quantity * item.product.price).toFixed(2)}</p>
            </li>
          ))}
        </ul>
        <div className="border-t border-gray-200 mt-4 pt-4 flex justify-between items-center text-xl font-bold text-indigo-600">
          <span>Total:</span>
          <span>₹{subtotal.toFixed(2)}</span>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Customer Information</h2>
        
        <div className="mb-4">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Full Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={customerInfo.name}
            onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
            required
            aria-invalid={errors.name ? "true" : "false"}
            aria-describedby={errors.name ? "name-error" : undefined}
          />
          {errors.name && <p id="name-error" className="mt-1 text-sm text-red-600">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <label htmlFor="mobile" className="block text-sm font-medium text-gray-700 mb-1">
            Mobile Number
          </label>
          <input
            type="tel"
            id="mobile"
            name="mobile"
            value={customerInfo.mobile}
            onChange={(e) => setCustomerInfo({ ...customerInfo, mobile: e.target.value })}
            className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
            required
            aria-invalid={errors.mobile ? "true" : "false"}
            aria-describedby={errors.mobile ? "mobile-error" : undefined}
          />
          {errors.mobile && <p id="mobile-error" className="mt-1 text-sm text-red-600">{errors.mobile}</p>}
        </div>

        <div className="mb-6">
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
            Shipping Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={customerInfo.address}
            onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={errors.address ? "true" : "false"}
            aria-describedby={errors.address ? "address-error" : undefined}
          ></textarea>
          {errors.address && <p id="address-error" className="mt-1 text-sm text-red-600">{errors.address}</p>}
        </div>
        
        <div className="sticky bottom-0 bg-white py-4 border-t border-gray-100 -mx-6 px-6">
          <Button 
            type="submit" 
            className="w-full text-lg py-3"
            loading={isPlacingOrder} // Pass loading state to Button
            disabled={isPlacingOrder}
          >
            Place Order
          </Button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutPage;