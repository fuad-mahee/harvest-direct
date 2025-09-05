"use client";

import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  imageUrl: string | null;
  status: string;
  createdAt: string;
  farmer: {
    id: string;
    name: string;
    email: string;
  };
}

interface ProductListingProps {
  farmerId: string;
}

export default function ProductListing({ farmerId }: ProductListingProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    quantity: '',
    unit: 'kg',
    imageUrl: ''
  });

  const categories = [
    'Vegetables',
    'Fruits',
    'Grains',
    'Herbs',
    'Dairy',
    'Meat',
    'Poultry',
    'Eggs',
    'Other'
  ];

  const units = [
    'kg',
    'lbs',
    'tons',
    'pieces',
    'bunches',
    'boxes',
    'bags',
    'liters',
    'gallons'
  ];

  useEffect(() => {
    fetchFarmerProducts();
  }, [farmerId]);

  async function fetchFarmerProducts() {
    try {
      const response = await fetch(`/api/farmer/products?farmerId=${farmerId}`);
      const data = await response.json();
      if (data.success) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    }
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  }

  function resetForm() {
    setFormData({
      name: '',
      description: '',
      price: '',
      category: '',
      quantity: '',
      unit: 'kg',
      imageUrl: ''
    });
    setEditingProduct(null);
    setShowForm(false);
  }

  function handleEdit(product: Product) {
    setFormData({
      name: product.name,
      description: product.description || '',
      price: product.price.toString(),
      category: product.category,
      quantity: product.quantity.toString(),
      unit: product.unit,
      imageUrl: product.imageUrl || ''
    });
    setEditingProduct(product);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const url = editingProduct 
        ? '/api/farmer/products' 
        : '/api/farmer/products';
      
      const method = editingProduct ? 'PUT' : 'POST';
      
      const payload = editingProduct 
        ? { ...formData, farmerId, productId: editingProduct.id }
        : { ...formData, farmerId };

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      if (data.success) {
        setMessage(data.message || 'Product listing submitted for review!');
        resetForm();
        fetchFarmerProducts(); // Refresh the list
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to submit product listing');
      }
    } catch (error) {
      setMessage('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  function getStatusBadge(status: string) {
    const baseClasses = "px-2 py-1 text-xs font-medium rounded-full";
    switch (status) {
      case 'PENDING':
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      case 'APPROVED':
        return `${baseClasses} bg-green-100 text-green-800`;
      case 'REJECTED':
        return `${baseClasses} bg-red-100 text-red-800`;
      default:
        return `${baseClasses} bg-gray-100 text-gray-800`;
    }
  }

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Product Listings</h2>
            <p className="text-sm text-gray-600">Manage your crop and product listings</p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            {showForm ? 'Cancel' : 'Add New Product'}
          </button>
        </div>
      </div>

      {message && (
        <div className="mx-6 mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
          <p className="text-blue-700 text-sm">{message}</p>
        </div>
      )}

      {showForm && (
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingProduct ? 'Edit Product Listing' : 'Add New Product Listing'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Product Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800 placeholder-gray-500"
                  placeholder="e.g., Organic Tomatoes"
                />
              </div>

              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                  Category *
                </label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  required
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                >
                  <option value="">Select a category</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                  Price per Unit ($) *
                </label>
                <input
                  type="number"
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  required
                  min="0"
                  step="0.01"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800 placeholder-gray-500"
                  placeholder="0.00"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label htmlFor="quantity" className="block text-sm font-medium text-gray-700">
                    Quantity *
                  </label>
                  <input
                    type="number"
                    id="quantity"
                    name="quantity"
                    value={formData.quantity}
                    onChange={handleInputChange}
                    required
                    min="0"
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800 placeholder-gray-500"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
                    Unit *
                  </label>
                  <select
                    id="unit"
                    name="unit"
                    value={formData.unit}
                    onChange={handleInputChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800"
                  >
                    {units.map(unit => (
                      <option key={unit} value={unit}>{unit}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">
                  Image URL (optional)
                </label>
                <input
                  type="url"
                  id="imageUrl"
                  name="imageUrl"
                  value={formData.imageUrl}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800 placeholder-gray-500"
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                Description (optional)
              </label>
              <textarea
                id="description"
                name="description"
                rows={3}
                value={formData.description}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 text-gray-800 placeholder-gray-500"
                placeholder="Describe your product, growing methods, quality, etc."
              />
            </div>

            <div className="flex justify-end space-x-3">
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 bg-green-600 text-white rounded-md text-sm font-medium hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Submitting...' : (editingProduct ? 'Update Product' : 'Submit for Review')}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="p-6">
        {products.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No product listings yet.</p>
            <p className="text-sm">Click "Add New Product" to create your first listing.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                    <p className="text-sm text-gray-600">{product.category}</p>
                  </div>
                  <span className={getStatusBadge(product.status)}>
                    {product.status}
                  </span>
                </div>

                {product.imageUrl && (
                  <img 
                    src={product.imageUrl} 
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-md mb-3"
                  />
                )}

                {product.description && (
                  <p className="text-sm text-gray-600 mb-3">{product.description}</p>
                )}

                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-gray-800">
                    <span className="font-medium">Price:</span> ${product.price}/{product.unit}
                  </div>
                  <div className="text-gray-800">
                    <span className="font-medium">Quantity:</span> {product.quantity} {product.unit}
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center">
                  <span className="text-xs text-gray-500">
                    Created {new Date(product.createdAt).toLocaleDateString()}
                  </span>
                  {product.status === 'PENDING' && (
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-green-600 hover:text-green-800 text-sm font-medium"
                    >
                      Edit
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
