// components/ProductCard.tsx
import React from 'react';
import { Product } from '../types';
import Button from './Button';

interface ProductCardProps {
  product: Product;
  onViewDetails: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onViewDetails }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden flex flex-col h-full transform hover:scale-105 transition-transform duration-200">
      <img
        src={product.imageUrl}
        alt={product.title}
        className="w-full h-48 object-cover object-center"
      />
      <div className="p-4 flex flex-col flex-grow">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">{product.title}</h3>
        <p className="text-gray-700 text-lg font-medium mb-4">₹{product.price.toFixed(2)}</p>
        <div className="mt-auto">
          <Button onClick={() => onViewDetails(product)} className="w-full">
            View Details
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;