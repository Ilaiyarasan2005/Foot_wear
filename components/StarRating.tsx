// components/StarRating.tsx
import React, { useState } from 'react';

interface StarRatingProps {
  rating: number; // Current rating to display (e.g., 3.5)
  maxStars?: number; // Total number of stars (default: 5)
  onRate?: (rating: number) => void; // Callback for when a user selects a rating
  size?: 'sm' | 'md' | 'lg'; // Size of the stars
}

const StarRating: React.FC<StarRatingProps> = ({
  rating,
  maxStars = 5,
  onRate,
  size = 'md',
}) => {
  const [hoverRating, setHoverRating] = useState(0);

  const starSizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-5 w-5',
    lg: 'h-6 w-6',
  };

  const starColorClass = onRate ? 'text-yellow-400' : 'text-yellow-500'; // Interactive vs display color
  const emptyStarColorClass = 'text-gray-300';

  const handleClick = (index: number) => {
    if (onRate) {
      onRate(index + 1);
    }
  };

  return (
    <div className="flex items-center" onMouseLeave={() => setHoverRating(0)}>
      {Array.from({ length: maxStars }, (_, index) => {
        const currentRating = hoverRating || rating;
        const isFilled = index < Math.floor(currentRating);
        const isHalfFilled = !isFilled && index < currentRating && currentRating % 1 !== 0;

        return (
          <svg
            key={index}
            className={`${starSizeClasses[size]} ${onRate ? 'cursor-pointer' : ''}`}
            fill={isFilled || isHalfFilled ? starColorClass : emptyStarColorClass}
            stroke={starColorClass}
            strokeWidth="0"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            onMouseEnter={() => onRate && setHoverRating(index + 1)}
            onClick={() => handleClick(index)}
            aria-label={`${index + 1} star${index + 1 === 1 ? '' : 's'}`}
          >
            {isHalfFilled ? (
              // Half star path
              <defs>
                <linearGradient id={`half-fill-${index}`}>
                  <stop offset="50%" stopColor={starColorClass} />
                  <stop offset="50%" stopColor={emptyStarColorClass} />
                </linearGradient>
              </defs>
            ) : null}
            <path
              d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.691h4.915c.971 0 1.371 1.24.588 1.81l-3.975 2.888a1 1 0 00-.363 1.118l1.519 4.674c.3.921-.755 1.688-1.538 1.118l-3.975-2.888a1 1 0 00-1.176 0l-3.975 2.888c-.783.57-1.838-.197-1.538-1.118l1.519-4.674a1 1 0 00-.363-1.118l-3.975-2.888c-.783-.57-.383-1.81.588-1.81h4.915a1 1 0 00.95-.691l1.519-4.674z"
              fill={isHalfFilled ? `url(#half-fill-${index})` : (isFilled ? starColorClass : emptyStarColorClass)}
            />
          </svg>
        );
      })}
    </div>
  );
};

export default StarRating;