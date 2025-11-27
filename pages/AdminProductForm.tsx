// pages/AdminProductForm.tsx
import React, { useState, useEffect, FormEvent } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppContext } from '../contexts/AppContext';
import { Product } from '../types';
import Button from '../components/Button';
import { geminiService } from '../services/geminiService';

const AdminProductForm: React.FC = () => {
  const { id } = useParams<{ id?: string }>(); // Product ID for editing
  const navigate = useNavigate();
  const { products, addProduct, updateProduct } = useAppContext();

  const [formData, setFormData] = useState<Omit<Product, 'id' | 'dateAdded'>>({
    title: '',
    imageUrl: '',
    price: 0,
    availableSizes: [],
    description: '',
    stockQuantity: 0, // Initialize stockQuantity
  });
  const [currentSizeInput, setCurrentSizeInput] = useState('');
  const [loadingAI, setLoadingAI] = useState(false);
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const isEditing = !!id;

  useEffect(() => {
    if (isEditing) {
      const productToEdit = products.find((p) => p.id === id);
      if (productToEdit) {
        setFormData({
          title: productToEdit.title,
          imageUrl: productToEdit.imageUrl,
          price: productToEdit.price,
          availableSizes: productToEdit.availableSizes,
          description: productToEdit.description,
          stockQuantity: productToEdit.stockQuantity, // Load stockQuantity
        });
      } else {
        navigate('/admin'); // Redirect if product not found
      }
    }
  }, [id, isEditing, products, navigate]);

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    if (!formData.title.trim()) errors.title = 'Title is required.';
    if (!formData.imageUrl.trim()) errors.imageUrl = 'Image URL is required.';
    if (formData.price <= 0) errors.price = 'Price must be greater than 0.';
    if (formData.availableSizes.length === 0) errors.availableSizes = 'At least one size is required.';
    if (!formData.description.trim()) errors.description = 'Description is required.';
    if (formData.stockQuantity < 0) errors.stockQuantity = 'Stock quantity cannot be negative.'; // Validate stockQuantity
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        name === 'price' || name === 'stockQuantity' // Handle stockQuantity as number
          ? parseFloat(value) || 0
          : value,
    }));
  };

  const handleAddSize = () => {
    const trimmedSize = currentSizeInput.trim().toUpperCase();
    if (trimmedSize && !formData.availableSizes.includes(trimmedSize)) {
      setFormData((prev) => ({
        ...prev,
        availableSizes: [...prev.availableSizes, trimmedSize],
      }));
      setCurrentSizeInput('');
    }
  };

  const handleRemoveSize = (sizeToRemove: string) => {
    setFormData((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.filter((size) => size !== sizeToRemove),
    }));
  };

  const handleGenerateDescription = async () => {
    setLoadingAI(true);
    const generatedDescription = await geminiService.generateProductDescription({
      title: formData.title,
      price: formData.price,
      availableSizes: formData.availableSizes,
    });
    if (generatedDescription) {
      setFormData((prev) => ({ ...prev, description: generatedDescription }));
    }
    setLoadingAI(false);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }

    if (isEditing) {
      // When editing, retain the original dateAdded
      const existingProduct = products.find(p => p.id === id);
      if (existingProduct) {
        updateProduct({ ...formData, id: id!, dateAdded: existingProduct.dateAdded });
        alert('Product updated successfully!');
      }
    } else {
      const newProduct: Product = {
        ...formData,
        id: `prod-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
        dateAdded: new Date().toISOString(), // Automatically set for new products
      };
      addProduct(newProduct);
      alert('Product added successfully!');
    }
    navigate('/admin');
  };

  return (
    <div className="py-8 max-w-3xl mx-auto">
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center">
        {isEditing ? 'Edit Product' : 'Add New Product'}
      </h1>

      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Product Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={formErrors.title ? "true" : "false"}
            aria-describedby={formErrors.title ? "title-error" : undefined}
          />
          {formErrors.title && <p id="title-error" className="mt-1 text-sm text-red-600">{formErrors.title}</p>}
        </div>

        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
            Image URL
          </label>
          <input
            type="text"
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={formErrors.imageUrl ? "true" : "false"}
            aria-describedby={formErrors.imageUrl ? "imageUrl-error" : undefined}
          />
          {formErrors.imageUrl && <p id="imageUrl-error" className="mt-1 text-sm text-red-600">{formErrors.imageUrl}</p>}
          {formData.imageUrl && (
            <img src={formData.imageUrl} alt="Product Preview" className="mt-4 w-32 h-32 object-cover rounded-md border border-gray-200" />
          )}
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price (₹)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            min="0.01"
            step="0.01"
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={formErrors.price ? "true" : "false"}
            aria-describedby={formErrors.price ? "price-error" : undefined}
          />
          {formErrors.price && <p id="price-error" className="mt-1 text-sm text-red-600">{formErrors.price}</p>}
        </div>

        <div>
          <label htmlFor="stockQuantity" className="block text-sm font-medium text-gray-700">
            Stock Quantity
          </label>
          <input
            type="number"
            id="stockQuantity"
            name="stockQuantity"
            value={formData.stockQuantity}
            onChange={handleChange}
            min="0"
            step="1"
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={formErrors.stockQuantity ? "true" : "false"}
            aria-describedby={formErrors.stockQuantity ? "stockQuantity-error" : undefined}
          />
          {formErrors.stockQuantity && <p id="stockQuantity-error" className="mt-1 text-sm text-red-600">{formErrors.stockQuantity}</p>}
        </div>

        <div>
          <label htmlFor="sizes" className="block text-sm font-medium text-gray-700">
            Available Sizes (e.g., US8, EU40)
          </label>
          <div className="flex items-center mt-1">
            <input
              type="text"
              id="sizes"
              value={currentSizeInput}
              onChange={(e) => setCurrentSizeInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddSize())}
              className="block w-full shadow-sm sm:text-sm border-gray-300 rounded-l-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Add size..."
            />
            <Button type="button" onClick={handleAddSize} className="rounded-l-none">
              Add
            </Button>
          </div>
          {formErrors.availableSizes && <p className="mt-1 text-sm text-red-600">{formErrors.availableSizes}</p>}
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.availableSizes.map((size) => (
              <span
                key={size}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-100 text-indigo-800"
              >
                {size}
                <button
                  type="button"
                  onClick={() => handleRemoveSize(size)}
                  className="ml-2 -mr-0.5 h-4 w-4 inline-flex items-center justify-center rounded-full text-indigo-500 hover:text-indigo-700 focus:outline-none"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    ></path>
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Product Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={5}
            value={formData.description}
            onChange={handleChange}
            className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md py-2 px-3 focus:ring-indigo-500 focus:border-indigo-500"
            required
            aria-invalid={formErrors.description ? "true" : "false"}
            aria-describedby={formErrors.description ? "description-error" : undefined}
          />
          {formErrors.description && <p id="description-error" className="mt-1 text-sm text-red-600">{formErrors.description}</p>}
          <Button
            type="button"
            onClick={handleGenerateDescription}
            disabled={loadingAI || !formData.title || formData.price <= 0 || formData.availableSizes.length === 0}
            variant="secondary"
            className="mt-2 text-sm"
            loading={loadingAI}
          >
            {loadingAI ? 'Generating...' : 'Generate Description with AI'}
          </Button>
          {loadingAI && <p className="mt-1 text-sm text-gray-500">Generating description, this may take a moment...</p>}
        </div>

        <div className="flex justify-end gap-4 mt-8">
          <Button type="button" variant="secondary" onClick={() => navigate('/admin')}>
            Cancel
          </Button>
          <Button type="submit">
            {isEditing ? 'Update Product' : 'Add Product'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AdminProductForm;