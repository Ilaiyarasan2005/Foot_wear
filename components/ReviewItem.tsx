// components/ReviewItem.tsx
import React from 'react';
import { Review } from '../types';
import StarRating from './StarRating';

interface ReviewItemProps {
  review: Review;
}

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const reviewDate = new Date(review.date).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="border-b border-gray-200 pb-4 mb-4 last:border-b-0 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <p className="font-semibold text-gray-900">{review.userName}</p>
          <StarRating rating={review.rating} size="sm" />
        </div>
        <p className="text-sm text-gray-500">{reviewDate}</p>
      </div>
      <p className="text-gray-700">{review.comment}</p>
    </div>
  );
};

export default ReviewItem;