// pages/OrderConfirmationPage.tsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';

const OrderConfirmationPage: React.FC = () => {
  const { orderId } = useParams<{ orderId: string }>();
  const { orders } = useAppContext();

  const order = orders.find((o) => o.id === orderId);

  if (!order) {
    return (
      <div className="text-center bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-xl text-red-600 mb-4">Order not found!</h1>
        <Link to="/">
          <Button>Back to Shop</Button>
        </Link>
      </div>
    );
  }

  // Mock UPI details
  const mockUpiId = 'solestride@upi';
  const mockUpiAppUrl = `upi://pay?pa=${mockUpiId}&pn=SoleStride&am=${order.total.toFixed(2)}&cu=INR&tn=Order${order.id}`;

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <div className="bg-white rounded-lg shadow-xl p-8 text-center">
        <svg
          className="mx-auto h-20 w-20 text-green-500 mb-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2"
            d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
          ></path>
        </svg>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Order Placed Successfully!</h1>
        <p className="text-xl text-gray-700 mb-6">Thank you for your purchase.</p>

        <div className="border border-dashed border-gray-300 p-6 rounded-md mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-6">
            <div>
              <p className="text-gray-600">Order ID:</p>
              <p className="font-semibold text-gray-900">{order.id}</p>
            </div>
            <div>
              <p className="text-gray-600">Order Date:</p>
              <p className="font-semibold text-gray-900">{new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="text-gray-600">Customer Name:</p>
              <p className="font-semibold text-gray-900">{order.customerInfo.name}</p>
            </div>
            <div>
              <p className="text-gray-600">Total Amount:</p>
              <p className="font-semibold text-indigo-600 text-2xl">₹{order.total.toFixed(2)}</p>
            </div>
          </div>

          <h3 className="text-xl font-bold text-gray-800 mb-3">Items:</h3>
          <ul className="text-left mb-4 space-y-2">
            {order.items.map((item, index) => (
              <li key={index} className="flex justify-between items-center text-gray-700">
                <span>{item.quantity}x {item.product.title} (Size: {item.selectedSize})</span>
                <span>₹{(item.quantity * item.product.price).toFixed(2)}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-indigo-50 p-6 rounded-md mb-8">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">Advance Payment via UPI</h2>
          <p className="text-gray-700 mb-4">
            Please make an advance payment of <span className="font-bold">₹{order.total.toFixed(2)}</span> using UPI.
          </p>
          <p className="text-lg font-mono text-gray-900 mb-4 bg-gray-100 p-3 rounded-md inline-block">
            UPI ID: <span className="font-bold">{mockUpiId}</span>
          </p>
          <div className="flex flex-col gap-3">
            <a href={mockUpiAppUrl} target="_blank" rel="noopener noreferrer">
              <Button className="w-full text-lg py-3">
                Pay Now with UPI App
              </Button>
            </a>
            <p className="text-sm text-gray-500 mt-2">
              (This will attempt to open your default UPI payment app.)
            </p>
          </div>
        </div>

        <Link to="/">
          <Button variant="secondary" className="text-lg py-3">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default OrderConfirmationPage;