// pages/AdminOrderManagement.tsx
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext, useAuth } from '../contexts/AppContext';
import Button from '../components/Button';
import { Order } from '../types';

const AdminOrderManagement: React.FC = () => {
  const navigate = useNavigate();
  const { adminLogout } = useAuth();
  const { orders, updateOrderStatus } = useAppContext();

  const [showCompletedOrders, setShowCompletedOrders] = useState(false);

  const pendingOrders = useMemo(() => orders.filter(order => order.status !== 'Delivered'), [orders]);
  const completedOrders = useMemo(() => orders.filter(order => order.status === 'Delivered'), [orders]);

  const handleMarkAsDelivered = (orderId: string) => {
    if (window.confirm('Are you sure you want to mark this order as Delivered?')) {
      updateOrderStatus(orderId, 'Delivered');
      alert(`Order ${orderId} marked as Delivered!`);
    }
  };

  const handleLogout = () => {
    adminLogout();
    navigate('/admin/login');
  };

  const renderOrderCard = (order: Order) => (
    <div key={order.id} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4 pb-4 border-b border-gray-200">
        <div>
          <h3 className="text-xl font-bold text-gray-900">Order ID: {order.id}</h3>
          <p className="text-sm text-gray-600">
            Ordered on: {new Date(order.orderDate).toLocaleDateString()}
          </p>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-semibold ${
            order.status === 'Delivered' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Customer Information:</h4>
        <p className="text-gray-700">Name: {order.customerInfo.name}</p>
        <p className="text-gray-700">Mobile: {order.customerInfo.mobile}</p>
        <p className="text-gray-700">Address: {order.customerInfo.address}</p>
      </div>

      <div className="mb-4">
        <h4 className="font-semibold text-gray-800 mb-2">Items:</h4>
        <ul className="list-disc list-inside text-gray-700">
          {order.items.map((item, index) => (
            <li key={index} className="flex justify-between">
              <span>{item.quantity}x {item.product.title} (Size: {item.selectedSize})</span>
              <span>₹{(item.quantity * item.product.price).toFixed(2)}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="flex justify-between items-center pt-4 border-t border-gray-200">
        <p className="text-xl font-bold text-indigo-700">Total: ₹{order.total.toFixed(2)}</p>
        {order.status !== 'Delivered' && (
          <Button onClick={() => handleMarkAsDelivered(order.id)} variant="primary">
            Mark as Delivered
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <div className="py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-extrabold text-gray-900">Order Management</h1>
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => navigate('/admin')}>
            Back to Dashboard
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>

      <div className="mb-8 flex space-x-4">
        <Button
          variant={!showCompletedOrders ? 'primary' : 'secondary'}
          onClick={() => setShowCompletedOrders(false)}
        >
          Pending Orders ({pendingOrders.length})
        </Button>
        <Button
          variant={showCompletedOrders ? 'primary' : 'secondary'}
          onClick={() => setShowCompletedOrders(true)}
        >
          Completed Orders ({completedOrders.length})
        </Button>
      </div>

      <section>
        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          {showCompletedOrders ? 'Completed Orders' : 'Pending Orders'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {(showCompletedOrders ? completedOrders : pendingOrders).length === 0 ? (
            <p className="text-gray-600 col-span-full">
              {showCompletedOrders ? 'No completed orders yet.' : 'No pending orders at the moment.'}
            </p>
          ) : (
            (showCompletedOrders ? completedOrders : pendingOrders).map(renderOrderCard)
          )}
        </div>
      </section>
    </div>
  );
};

export default AdminOrderManagement;