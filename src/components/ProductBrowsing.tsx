"use client";

import { useState, useEffect } from 'react';
import ProductReviews from './ProductReviews';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  quantity: number;
  unit: string;
  imageUrl?: string;
  inStock: boolean;
  farmer: {
    id: string;
    name: string;
    email: string;
    farmerProfile?: {
      id: string;
      farmName: string;
      farmAddress: string;
      farmSize: string;
      farmingPractices: string[];
      certifications: string[];
      aboutFarm: string | null;
      contactPhone: string | null;
      website: string | null;
      specialization: string[];
      experience: number | null;
      status: string;
      certificationBadge: string | null;
      approvedAt: string | null;
    } | null;
  };
  // Rating information
  averageRating?: number;
  totalReviews?: number;
  createdAt: string;
}

interface ProductBrowsingProps {
  consumerId?: string;
  onAddToCart?: (productId: string) => void;
}

export default function ProductBrowsing({ consumerId, onAddToCart }: ProductBrowsingProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [addingToCart, setAddingToCart] = useState<string | null>(null);
  const [addedToCart, setAddedToCart] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showProductDetails, setShowProductDetails] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => {
      setMounted(false);
    };
  }, []);

  useEffect(() => {
    if (mounted) {
      fetchProducts();
    }
  }, [selectedCategory, minPrice, maxPrice, searchTerm, mounted]);

  async function fetchProducts() {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (selectedCategory !== 'all') {
        params.append('category', selectedCategory);
      }
      if (minPrice) {
        params.append('minPrice', minPrice);
      }
      if (maxPrice) {
        params.append('maxPrice', maxPrice);
      }
      if (searchTerm) {
        params.append('search', searchTerm);
      }

      const response = await fetch(`/api/products?${params.toString()}`);
      const data = await response.json();
      
      if (data.success) {
        setProducts(data.products);
        setCategories(data.categories);
      } else {
        console.error('Failed to fetch products:', data.error);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  }

  function clearFilters() {
    setSelectedCategory('all');
    setMinPrice('');
    setMaxPrice('');
    setSearchTerm('');
  }

  function handleMouseEnter(productId: string, event: React.MouseEvent) {
    setHoveredProduct(productId);
    setMousePosition({ x: event.clientX, y: event.clientY });
  }

  function handleMouseMove(event: React.MouseEvent) {
    setMousePosition({ x: event.clientX, y: event.clientY });
  }

  function handleMouseLeave() {
    setHoveredProduct(null);
  }

  async function addToCart(productId: string) {
    if (!consumerId || !mounted) {
      alert('Please log in to add items to cart');
      return;
    }

    setAddingToCart(productId);
    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: consumerId, 
          productId, 
          quantity: 1 
        })
      });

      const data = await response.json();
      if (data.success && mounted) {
        if (onAddToCart) {
          onAddToCart(productId);
        }
        // Show success feedback using state
        setAddedToCart(productId);
        setTimeout(() => {
          if (mounted) {
            setAddedToCart(null);
          }
        }, 2000);
      } else if (mounted) {
        alert(data.error || 'Failed to add to cart');
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      if (mounted) {
        alert('Failed to add to cart');
      }
    } finally {
      if (mounted) {
        setAddingToCart(null);
      }
    }
  }

  const renderStars = (rating: number, totalReviews: number = 0) => {
    return (
      <div className="flex items-center space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
        <span className="text-sm text-gray-600 ml-1">
          {rating > 0 ? `${rating.toFixed(1)} (${totalReviews})` : 'No reviews'}
        </span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center animate-fade-in">
          <div className="w-16 h-16 bg-gradient-green rounded-full mx-auto mb-4 animate-pulse-glow"></div>
          <div className="text-lg text-gray-600 loading-dots">Loading fresh products</div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      <div className="bg-gradient-cards rounded-2xl p-6 card-shadow hover-lift">
        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
          <svg className="w-6 h-6 mr-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          Search & Filter Products
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Search */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Search Products
            </label>
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by name or description..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
              />
              <svg className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
            >
              <option value="all">All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          {/* Price Range */}
          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Min Price ($)
            </label>
            <input
              type="number"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
              placeholder="0.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
            />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-semibold text-gray-700">
              Max Price ($)
            </label>
            <input
              type="number"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
              placeholder="100.00"
              min="0"
              step="0.01"
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-4 focus:ring-green-200 focus:border-green-400 transition-all duration-300"
            />
          </div>
        </div>

        <div className="mt-6 flex flex-col sm:flex-row justify-between items-center gap-4">
          <button
            onClick={clearFilters}
            className="btn-secondary text-sm flex items-center"
          >
            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Clear Filters
          </button>
          <div className="flex items-center bg-green-50 px-4 py-2 rounded-xl">
            <svg className="w-5 h-5 mr-2 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <span className="text-sm font-semibold text-green-700">
              {products.length} fresh product{products.length !== 1 ? 's' : ''} available
            </span>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      {products.length === 0 ? (
        <div className="bg-gradient-cards rounded-2xl p-12 card-shadow text-center animate-fade-in">
          <div className="text-gray-500">
            <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <svg className="w-12 h-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-500 mb-6">Try adjusting your search or filter criteria to discover fresh produce.</p>
            <button 
              onClick={clearFilters}
              className="btn-primary"
            >
              Reset Filters
            </button>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product, index) => (
            <div 
              key={product.id} 
              className="bg-gradient-cards rounded-2xl card-shadow overflow-hidden hover-lift group relative animate-fade-in"
              style={{animationDelay: `${index * 0.1}s`}}
            >
              {/* Product Image */}
              <div className="h-56 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center relative overflow-hidden">
                {product.imageUrl ? (
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                ) : (
                  <div className="text-gray-400 text-center">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-3 flex items-center justify-center">
                      <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-sm font-medium">No image available</span>
                  </div>
                )}
                
                {/* Category Badge */}
                <div className="absolute top-4 right-4">
                  <span className="glass text-xs text-gray-700 px-3 py-2 rounded-full font-semibold shadow-lg">
                    {product.category}
                  </span>
                </div>

                {/* Stock Status */}
                <div className="absolute top-4 left-4">
                  <span className={`text-xs px-3 py-2 rounded-full font-semibold shadow-lg ${
                    product.inStock && product.quantity > 0 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {product.inStock && product.quantity > 0 ? '✓ In Stock' : '✗ Out of Stock'}
                  </span>
                </div>
              </div>

              {/* Product Info */}
              <div className="p-6 space-y-4">
                {/* Product Name */}
                <div>
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-2 leading-tight group-hover:text-green-600 transition-colors duration-300">
                    {product.name}
                  </h3>
                </div>

                {/* Description */}
                {product.description && (
                  <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed">
                    {product.description}
                  </p>
                )}

                {/* Price and Availability */}
                <div className="flex justify-between items-center bg-green-50 rounded-xl p-4">
                  <div>
                    <div className="text-2xl font-bold text-green-600">
                      ${product.price.toFixed(2)}
                    </div>
                    <div className="text-sm text-green-700 font-medium">
                      per {product.unit}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-lg font-bold text-gray-900">
                      {product.quantity}
                    </div>
                    <div className="text-sm text-gray-600">
                      {product.unit} available
                    </div>
                  </div>
                </div>

                {/* Farmer Information */}
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl">
                  <div className="w-10 h-10 bg-gradient-green rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-sm font-bold text-white">
                      {product.farmer.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-semibold text-gray-900">
                        {product.farmer.name}
                      </span>
                      {product.farmer.farmerProfile?.status === 'APPROVED' && product.farmer.farmerProfile.certificationBadge && (
                        <span className="inline-flex items-center text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full border border-green-200 flex-shrink-0">
                          <span className="mr-1">🏆</span>
                          <span className="font-semibold">Verified</span>
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-gray-500 font-medium">
                      Local Farmer
                    </div>
                  </div>
                </div>

                {/* Product Rating */}
                <div className="py-2">
                  {renderStars(product.averageRating || 0, product.totalReviews || 0)}
                </div>

                {/* Reviews and Details Button */}
                <button
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowProductDetails(true);
                  }}
                  className="w-full py-3 px-4 text-sm border-2 border-green-200 text-green-700 rounded-xl hover:bg-green-50 hover:border-green-300 transition-all duration-300 flex items-center justify-center space-x-2 group/btn"
                >
                  <svg className="w-5 h-5 group-hover/btn:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span className="font-semibold">View Reviews & Details</span>
                </button>

                {/* Hover Area for Profile Details */}
                {product.farmer.farmerProfile?.status === 'APPROVED' && (
                  <div 
                    className="border-2 border-dashed border-blue-200 rounded-xl p-4 cursor-pointer group/profile hover:border-blue-400 hover:bg-blue-50 transition-all duration-300"
                    onMouseEnter={(e) => handleMouseEnter(product.id, e)}
                    onMouseMove={handleMouseMove}
                    onMouseLeave={handleMouseLeave}
                  >
                    <div className="flex items-center justify-center text-center">
                      <div className="text-sm text-blue-600 group-hover/profile:text-blue-700 font-semibold flex items-center">
                        <svg className="w-5 h-5 mr-2 group-hover/profile:scale-110 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Hover for farm details & certifications</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Add to Cart Button */}
                <button 
                  onClick={() => addToCart(product.id)}
                  disabled={addingToCart === product.id || !product.inStock || product.quantity === 0}
                  className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-300 transform focus:outline-none focus:ring-4 focus:ring-offset-2 shadow-lg disabled:cursor-not-allowed disabled:transform-none ${
                    addedToCart === product.id
                      ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white animate-pulse-glow'
                      : addingToCart === product.id || !product.inStock || product.quantity === 0
                      ? 'bg-gray-400 text-white cursor-not-allowed'
                      : 'bg-gradient-green hover:scale-105 hover-glow text-white focus:ring-green-200'
                  }`}
                >
                  {addingToCart === product.id ? (
                    <div className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding to Cart...
                    </div>
                  ) : addedToCart === product.id ? (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Added to Cart!
                    </div>
                  ) : !product.inStock || product.quantity === 0 ? (
                    'Out of Stock'
                  ) : (
                    <div className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6.5-5l2.5 5M17 13l2.5 5" />
                      </svg>
                      Add to Cart
                    </div>
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Farmer Profile Tooltip */}
      {hoveredProduct && (
        (() => {
          const product = products.find(p => p.id === hoveredProduct);
          const profile = product?.farmer.farmerProfile;
          
          if (!profile || profile.status !== 'APPROVED') return null;
          
          return (
            <div 
              className="fixed z-50 bg-white border border-gray-200 rounded-xl shadow-xl p-5 max-w-sm pointer-events-none backdrop-blur-sm"
              style={{
                left: mousePosition.x + 15,
                top: mousePosition.y - 10,
                transform: 'translateY(-100%)',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
              }}
            >
              <div className="space-y-4">
                {/* Farm Header */}
                <div className="border-b border-gray-100 pb-3">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-base leading-tight">{profile.farmName}</h4>
                      <p className="text-sm text-gray-600 mt-1">{profile.farmAddress}</p>
                    </div>
                    {profile.certificationBadge && (
                      <span className="ml-3 text-xs bg-green-100 text-green-800 px-3 py-1 rounded-full font-medium border border-green-200 flex items-center flex-shrink-0">
                        <span className="mr-1">🏆</span>
                        {profile.certificationBadge}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center space-x-4 text-xs text-gray-500">
                    {profile.experience && (
                      <span className="flex items-center">
                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                        </svg>
                        {profile.experience} years exp.
                      </span>
                    )}
                    <span className="flex items-center">
                      <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                      </svg>
                      {profile.farmSize}
                    </span>
                  </div>
                </div>

                {/* Specialization */}
                {profile.specialization.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Specialization</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.specialization.slice(0, 3).map((spec, index) => (
                        <span key={index} className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded-md font-medium border border-green-100">
                          {spec}
                        </span>
                      ))}
                      {profile.specialization.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">+{profile.specialization.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Farming Practices */}
                {profile.farmingPractices.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Farming Practices</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.farmingPractices.slice(0, 3).map((practice, index) => (
                        <span key={index} className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-medium border border-blue-100">
                          {practice}
                        </span>
                      ))}
                      {profile.farmingPractices.length > 3 && (
                        <span className="text-xs text-gray-500 px-2 py-1">+{profile.farmingPractices.length - 3} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* Certifications */}
                {profile.certifications.length > 0 && (
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">Certifications</p>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {profile.certifications.slice(0, 2).map((cert, index) => (
                        <span key={index} className="text-xs bg-purple-50 text-purple-700 px-2 py-1 rounded-md font-medium border border-purple-100">
                          {cert}
                        </span>
                      ))}
                      {profile.certifications.length > 2 && (
                        <span className="text-xs text-gray-500 px-2 py-1">+{profile.certifications.length - 2} more</span>
                      )}
                    </div>
                  </div>
                )}

                {/* About Farm */}
                {profile.aboutFarm && (
                  <div>
                    <div className="flex items-center mb-2">
                      <div className="w-2 h-2 bg-gray-500 rounded-full mr-2"></div>
                      <p className="text-xs font-semibold text-gray-700 uppercase tracking-wider">About</p>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-3 leading-relaxed">{profile.aboutFarm}</p>
                  </div>
                )}

                {/* Contact Info */}
                {(profile.contactPhone || profile.website) && (
                  <div className="border-t border-gray-100 pt-3">
                    <div className="text-xs text-gray-600 space-y-2">
                      {profile.contactPhone && (
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                          </svg>
                          <span className="font-medium">{profile.contactPhone}</span>
                        </div>
                      )}
                      {profile.website && (
                        <div className="flex items-center">
                          <svg className="w-3 h-3 mr-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M4.083 9h1.946c.089-1.546.383-2.97.837-4.118A6.004 6.004 0 004.083 9zM10 2a8 8 0 100 16 8 8 0 000-16zm0 2c-.076 0-.232.032-.465.262-.238.234-.497.623-.737 1.182-.389.907-.673 2.142-.766 3.556h3.936c-.093-1.414-.377-2.649-.766-3.556-.24-.559-.5-.948-.737-1.182C10.232 4.032 10.076 4 10 4zm3.971 5c-.089-1.546-.383-2.97-.837-4.118A6.004 6.004 0 0115.917 9h-1.946zm-2.003 2H8.032c.093 1.414.377 2.649.766 3.556.24.559.5.948.737 1.182.233.23.389.262.465.262.076 0 .232-.032.465-.262.238-.234.498-.623.737-1.182.389-.907.673-2.142.766-3.556zm1.166 4.118c.454-1.147.748-2.572.837-4.118h1.946a6.004 6.004 0 01-2.783 4.118zm-6.268 0C6.412 13.97 6.118 12.546 6.03 11H4.083a6.004 6.004 0 002.783 4.118z" clipRule="evenodd" />
                          </svg>
                          <a href={profile.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-800 font-medium">
                            {profile.website.replace(/^https?:\/\//, '')}
                          </a>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          );
        })()
      )}

      {/* Product Details Modal */}
      {showProductDetails && selectedProduct && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div>
                  <h2 className="text-xl font-semibold text-gray-900">{selectedProduct.name}</h2>
                  <p className="text-sm text-gray-600">by {selectedProduct.farmer.name}</p>
                </div>
              </div>
              <button
                onClick={() => {
                  setShowProductDetails(false);
                  setSelectedProduct(null);
                }}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="flex-1 overflow-y-auto">
              <div className="p-6">
                {/* Product Summary */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* Product Image */}
                  <div className="bg-gray-100 rounded-lg overflow-hidden h-64">
                    {selectedProduct.imageUrl ? (
                      <img
                        src={selectedProduct.imageUrl}
                        alt={selectedProduct.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-16 h-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Product Info */}
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Product Details</h3>
                      {selectedProduct.description && (
                        <p className="text-gray-700 leading-relaxed mb-4">
                          {selectedProduct.description}
                        </p>
                      )}
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Price:</span>
                          <span className="text-xl font-bold text-green-600">
                            ${selectedProduct.price.toFixed(2)} per {selectedProduct.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Available:</span>
                          <span className="text-gray-900">
                            {selectedProduct.quantity} {selectedProduct.unit}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-gray-600">Category:</span>
                          <span className="text-gray-900">{selectedProduct.category}</span>
                        </div>
                      </div>
                    </div>

                    {/* Rating Summary */}
                    <div className="border-t pt-4">
                      <h4 className="text-md font-medium text-gray-900 mb-2">Customer Rating</h4>
                      {renderStars(selectedProduct.averageRating || 0, selectedProduct.totalReviews || 0)}
                    </div>

                    {/* Add to Cart */}
                    <div className="border-t pt-4">
                      <button 
                        onClick={() => {
                          addToCart(selectedProduct.id);
                          setShowProductDetails(false);
                          setSelectedProduct(null);
                        }}
                        disabled={addingToCart === selectedProduct.id || !selectedProduct.inStock || selectedProduct.quantity === 0}
                        className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${
                          addingToCart === selectedProduct.id || !selectedProduct.inStock || selectedProduct.quantity === 0
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-600 hover:bg-blue-700 text-white'
                        }`}
                      >
                        {addingToCart === selectedProduct.id ? 'Adding...' : 
                         !selectedProduct.inStock || selectedProduct.quantity === 0 ? 'Out of Stock' : 
                         'Add to Cart'}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Reviews Section */}
                <ProductReviews 
                  productId={selectedProduct.id}
                  currentUserId={consumerId}
                  isConsumer={true}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
