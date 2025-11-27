// components/ProductCardSkeleton.tsx
import React from 'react';

const ProductCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full animate-pulse">
      {/* Image Placeholder */}
      <div className="w-full h-48 bg-gray-200"></div>
      
      <div className="p-4 flex flex-col flex-grow">
        {/* Title Placeholder */}
        <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
        {/* Price Placeholder */}
        <div className="h-5 bg-gray-200 rounded w-1/2 mb-4"></div>
        <div className="mt-auto">
          {/* Button Placeholder */}
          <div className="h-10 bg-gray-200 rounded w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;