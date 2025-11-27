// pages/CartPage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import Button from '../components/Button';

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateCartItemQuantity, clearCart } = useAppContext();

  const calculateItemTotal = (price: number, quantity: number) => price * quantity;
  const subtotal = cart.reduce(
    (acc, item) => acc + calculateItemTotal(item.product.price, item.quantity),
    0
  );

  const handleQuantityChange = (
    productId: string,
    selectedSize: string,
    newQuantity: number,
    stockQuantity: number // Pass stockQuantity here
  ) => {
    // Ensure newQuantity is at least 1 and not more than stockQuantity
    const validQuantity = Math.max(1, Math.min(newQuantity, stockQuantity));
    if (!isNaN(validQuantity)) {
      updateCartItemQuantity(productId, selectedSize, validQuantity);
    }
  };

  const handleDecrement = (productId: string, selectedSize: string, currentQuantity: number, stockQuantity: number) => {
    handleQuantityChange(productId, selectedSize, currentQuantity - 1, stockQuantity);
  };

  const handleIncrement = (productId: string, selectedSize: string, currentQuantity: number, stockQuantity: number) => {
    handleQuantityChange(productId, selectedSize, currentQuantity + 1, stockQuantity);
  };


  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Your Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="text-center bg-white p-8 rounded-lg shadow-md">
          <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
          <Link to="/">
            <Button>Continue Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cart.map((item) => (
              <div
                key={`${item.product.id}-${item.selectedSize}`}
                className="flex items-center gap-4 py-4 border-b border-gray-200 last:border-b-0"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.title}
                  className="w-20 h-20 object-cover rounded-md"
                />
                <div className="flex-grow">
                  <h2 className="text-lg font-semibold text-gray-900">{item.product.title}</h2>
                  <p className="text-sm text-gray-600">Size: {item.selectedSize}</p>
                  <p className="text-md font-medium text-gray-800">₹{item.product.price.toFixed(2)}</p>
                  {item.product.stockQuantity <= 5 && item.product.stockQuantity > 0 && (
                    <p className="text-xs text-red-500">Only {item.product.stockQuantity} left in stock!</p>
                  )}
                  {item.product.stockQuantity === 0 && (
                    <p className="text-xs text-red-500 font-semibold">Out of stock!</p>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleDecrement(item.product.id, item.selectedSize, item.quantity, item.product.stockQuantity)}
                    disabled={item.quantity <= 1} // Disable decrement if quantity is 1
                  >
                    -
                  </Button>
                  <input
                    type="number"
                    min="1"
                    max={item.product.stockQuantity} // Max quantity is stock
                    value={item.quantity}
                    onChange={(e) => handleQuantityChange(item.product.id, item.selectedSize, parseInt(e.target.value, 10), item.product.stockQuantity)}
                    className="w-16 p-2 border border-gray-300 rounded-md text-center focus:ring-indigo-500 focus:border-indigo-500"
                    aria-label={`Quantity for ${item.product.title} size ${item.selectedSize}`}
                    disabled={item.product.stockQuantity === 0}
                  />
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => handleIncrement(item.product.id, item.selectedSize, item.quantity, item.product.stockQuantity)}
                    disabled={item.quantity >= item.product.stockQuantity || item.product.stockQuantity === 0} // Disable increment if quantity equals stock or out of stock
                  >
                    +
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removeFromCart(item.product.id, item.selectedSize)}
                    title="Remove item"
                  >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </Button>
                </div>
                <div className="text-lg font-bold text-gray-900 min-w-[80px] text-right">
                  ₹{calculateItemTotal(item.product.price, item.quantity).toFixed(2)}
                </div>
              </div>
            ))}
            <div className="flex justify-end pt-4">
              <Button variant="outline" onClick={clearCart}>
                Clear Cart
              </Button>
            </div>
          </div>

          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 sticky top-24 h-fit">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
            <div className="flex justify-between items-center text-lg mb-4">
              <span className="text-gray-700">Subtotal:</span>
              <span className="font-semibold text-gray-900">₹{subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between items-center text-lg mb-6">
              <span className="text-gray-700">Shipping:</span>
              <span className="font-semibold text-gray-900">Free</span> {/* Mock shipping */}
            </div>
            <div className="flex justify-between items-center text-2xl font-bold text-indigo-600 border-t pt-4">
              <span>Total:</span>
              <span>₹{subtotal.toFixed(2)}</span>
            </div>
            <Link to="/checkout" className="block mt-6">
              <Button className="w-full text-lg py-3">
                Proceed to Checkout
              </Button>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;