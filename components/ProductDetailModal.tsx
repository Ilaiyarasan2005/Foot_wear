// components/ProductDetailModal.tsx
import React, { useState, useMemo } from 'react';
import { Product, Review } from '../types';
import Modal from './Modal';
import Button from './Button';
import StarRating from './StarRating'; // Import StarRating
import ReviewItem from './ReviewItem'; // Import ReviewItem
import { useAppContext } from '../contexts/AppContext'; // Import useAppContext

interface ProductDetailModalProps {
  product: Product;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, selectedSize: string, quantity: number) => void;
}

const ProductDetailModal: React.FC<ProductDetailModalProps> = ({
  product,
  isOpen,
  onClose,
  onAddToCart,
}) => {
  const { reviews, addReview } = useAppContext(); // Get reviews and addReview from context
  const [selectedSize, setSelectedSize] = useState<string>('');
  const [quantity, setQuantity] = useState<number>(1);
  const [error, setError] = useState<string>('');
  const [isAddingToCart, setIsAddingToCart] = useState<boolean>(false); // New state for loading

  // Review form states
  const [newReviewRating, setNewReviewRating] = useState<number>(0);
  const [newReviewComment, setNewReviewComment] = useState<string>('');
  const [newReviewUserName, setNewReviewUserName] = useState<string>('');
  const [reviewFormError, setReviewFormError] = useState<string>('');
  const [isSubmittingReview, setIsSubmittingReview] = useState<boolean>(false);

  // Filter reviews for the current product
  const productReviews = useMemo(() => {
    return reviews.filter((review) => review.productId === product?.id);
  }, [reviews, product?.id]);

  // Calculate average rating
  const averageRating = useMemo(() => {
    if (productReviews.length === 0) return 0;
    const totalRating = productReviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / productReviews.length;
  }, [productReviews]);


  // Reset state when modal opens for a new product
  React.useEffect(() => {
    if (isOpen && product) {
      setSelectedSize(product.availableSizes.length > 0 ? product.availableSizes[0] : '');
      setQuantity(1); // Default to 1, will be constrained by stock
      setError('');
      setIsAddingToCart(false); // Reset loading state
      // Reset review form states
      setNewReviewRating(0);
      setNewReviewComment('');
      setNewReviewUserName('');
      setReviewFormError('');
      setIsSubmittingReview(false);
    }
  }, [isOpen, product]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value, 10);
    if (isNaN(value) || value < 1) {
      setQuantity(1);
      setError('');
      return;
    }
    if (value > product.stockQuantity) {
      setError(`Only ${product.stockQuantity} items left in stock.`);
      setQuantity(product.stockQuantity);
    } else {
      setQuantity(value);
      setError('');
    }
  };

  const handleAddToCart = async () => {
    if (!selectedSize) {
      setError('Please select a size.');
      return;
    }
    if (quantity < 1) {
      setError('Quantity must be at least 1.');
      return;
    }
    if (quantity > product.stockQuantity) {
      setError(`Cannot add ${quantity} items. Only ${product.stockQuantity} left in stock.`);
      return;
    }
    setError('');
    setIsAddingToCart(true);

    await new Promise(resolve => setTimeout(resolve, 500)); 
    
    onAddToCart(product, selectedSize, quantity);
    setIsAddingToCart(false);
    onClose();
  };

  const handleSubmitReview = async () => {
    if (newReviewRating === 0) {
      setReviewFormError('Please provide a rating.');
      return;
    }
    if (!newReviewComment.trim()) {
      setReviewFormError('Please enter a comment.');
      return;
    }

    setReviewFormError('');
    setIsSubmittingReview(true);

    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 700));

    const newReview: Review = {
      id: `rev-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      productId: product.id,
      userName: newReviewUserName.trim() || 'Anonymous',
      rating: newReviewRating,
      comment: newReviewComment.trim(),
      date: new Date().toISOString(),
    };
    addReview(newReview);

    // Reset form
    setNewReviewRating(0);
    setNewReviewComment('');
    setNewReviewUserName('');
    setIsSubmittingReview(false);
    alert('Thank you for your review!');
  };


  if (!product) return null; // Should not happen if isOpen is true

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product.title} className="max-w-4xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="flex flex-col">
          <div className="flex justify-center items-center mb-4">
            <img
              src={product.imageUrl}
              alt={product.title}
              className="w-full max-h-72 object-cover rounded-md shadow-sm"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{product.title}</h2>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={averageRating} size="md" />
            <span className="text-gray-600 text-sm">
              ({productReviews.length} reviews)
            </span>
          </div>
          <p className="text-gray-700 text-lg mb-4">{product.description}</p>
          <p className="text-3xl font-extrabold text-indigo-600 mb-6">₹{product.price.toFixed(2)}</p>
          
          <p className="text-md text-gray-600 mb-4">
            Availability: <span className="font-semibold text-gray-800">{product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}</span>
          </p>

          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
            <div className="flex-1">
              <label htmlFor="size-select" className="block text-sm font-medium text-gray-700 mb-1">
                Foot Size:
              </label>
              <select
                id="size-select"
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md shadow-sm"
              >
                {product.availableSizes.length === 0 && (
                  <option value="" disabled>No sizes available</option>
                )}
                {product.availableSizes.map((size) => (
                  <option key={size} value={size}>
                    {size}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex-1">
              <label htmlFor="quantity-input" className="block text-sm font-medium text-gray-700 mb-1">
                Quantity:
              </label>
              <input
                id="quantity-input"
                type="number"
                min="1"
                max={product.stockQuantity > 0 ? product.stockQuantity : 1} // Max quantity is stock
                value={quantity}
                onChange={handleQuantityChange}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                disabled={product.stockQuantity === 0} // Disable if out of stock
              />
            </div>
          </div>

          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

          <div className="mt-auto sticky bottom-0 bg-white pt-4 pb-2 border-t border-gray-100 -mx-4 px-4 sm:static sm:p-0 sm:border-0">
            <Button
              onClick={handleAddToCart}
              className="w-full text-lg py-3"
              disabled={!selectedSize || quantity < 1 || quantity > product.stockQuantity || product.availableSizes.length === 0 || product.stockQuantity === 0}
              loading={isAddingToCart} // Pass loading state to Button
            >
              Add to Cart
            </Button>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="flex flex-col">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Customer Reviews ({productReviews.length})</h3>
          <div className="max-h-[300px] overflow-y-auto pr-2 mb-6">
            {productReviews.length === 0 ? (
              <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
            ) : (
              productReviews.map((review) => <ReviewItem key={review.id} review={review} />)
            )}
          </div>

          <h3 className="text-xl font-bold text-gray-900 mb-4 mt-auto">Write a Review</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Your Rating:</label>
              <StarRating rating={newReviewRating} onRate={setNewReviewRating} size="lg" />
            </div>
            <div>
              <label htmlFor="review-comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment:
              </label>
              <textarea
                id="review-comment"
                value={newReviewComment}
                onChange={(e) => setNewReviewComment(e.target.value)}
                rows={3}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                placeholder="Share your thoughts on this product..."
              ></textarea>
            </div>
            <div>
              <label htmlFor="review-username" className="block text-sm font-medium text-gray-700 mb-1">
                Your Name (Optional):
              </label>
              <input
                type="text"
                id="review-username"
                value={newReviewUserName}
                onChange={(e) => setNewReviewUserName(e.target.value)}
                className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md py-2 px-3"
                placeholder="e.g., John D."
              />
            </div>
            {reviewFormError && <p className="text-red-500 text-sm">{reviewFormError}</p>}
            <Button
              onClick={handleSubmitReview}
              className="w-full text-md py-2"
              loading={isSubmittingReview}
              disabled={isSubmittingReview || newReviewRating === 0 || !newReviewComment.trim()}
            >
              Submit Review
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ProductDetailModal;