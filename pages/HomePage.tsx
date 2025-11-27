// pages/HomePage.tsx
import React, { useState } from 'react';
import { useAppContext } from '../contexts/AppContext';
import ProductCard from '../components/ProductCard';
import ProductDetailModal from '../components/ProductDetailModal';
import ProductCardSkeleton from '../components/ProductCardSkeleton'; // Import skeleton component
import { Product } from '../types';

const HomePage: React.FC = () => {
  const { products, addToCart, loadingProducts } = useAppContext(); // Get loadingProducts
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const handleViewDetails = (product: Product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const handleAddToCartFromModal = (product: Product, selectedSize: string, quantity: number) => {
    addToCart(product, selectedSize, quantity);
    alert(`${quantity}x ${product.title} (Size: ${selectedSize}) added to cart!`);
  };

  const renderProductCards = () => {
    if (loadingProducts) {
      // Render skeleton cards while loading
      return Array.from({ length: 8 }).map((_, index) => (
        <ProductCardSkeleton key={index} />
      ));
    }

    if (products.length === 0) {
      return (
        <p className="text-center text-gray-600 text-lg col-span-full">No products available yet. Check back soon!</p>
      );
    }

    return products.map((product) => (
      <ProductCard key={product.id} product={product} onViewDetails={handleViewDetails} />
    ));
  };

  return (
    <div className="py-8">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">Our Footwear Collection</h1>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {renderProductCards()}
      </div>

      {selectedProduct && (
        <ProductDetailModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onAddToCart={handleAddToCartFromModal}
        />
      )}
    </div>
  );
};

export default HomePage;