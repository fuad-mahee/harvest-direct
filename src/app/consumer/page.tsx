"use client";

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import ProductBrowsing from '@/components/ProductBrowsing';
import CartComponent from '@/components/CartComponent';
import OrdersComponent from '@/components/OrdersComponent';
import NotificationsComponent from '@/components/NotificationsComponent';
import EventsBrowsing from '@/components/EventsBrowsing';
import ClientOnly from '@/components/ClientOnly';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function ConsumerDashboard() {
  const { user, loading, authorized } = useAuth('CONSUMER');
  const [activeTab, setActiveTab] = useState('products');
  const [cartItemCount, setCartItemCount] = useState(0);
  const [mounted, setMounted] = useState(false);
  const [cartKey, setCartKey] = useState(0); // Add this to force cart refresh

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  };

  const handleCartUpdate = (itemCount: number) => {
    setCartItemCount(itemCount);
  };

  // Show loading screen while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  // If not authorized, the useAuth hook will handle redirection
  if (!authorized) {
    return null;
  }

  const handleAddToCart = () => {
    // Force cart component to refresh by incrementing the key
    setCartKey(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!mounted ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <>
          {/* Header */}
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <h1 className="text-3xl font-bold text-gray-900">Consumer Dashboard</h1>
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <ClientOnly>
                    {user && <NotificationsComponent userId={user.id} />}
                  </ClientOnly>
                  
                  {/* Cart */}
                  <ClientOnly>
                    {user && (
                      <CartComponent 
                        key={cartKey}
                        userId={user.id} 
                        onCartUpdate={handleCartUpdate}
                      />
                    )}
                  </ClientOnly>
                  
                  <div className="text-sm text-gray-500">
                    Welcome, {user?.name || 'Consumer'}
                  </div>
                  <button
                    onClick={handleLogout}
                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <div className="border-b border-gray-200">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('products')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'products'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Browse Products
                </button>
                <button
                  onClick={() => setActiveTab('events')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'events'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Events & Workshops
                </button>
                <button
                  onClick={() => setActiveTab('orders')}
                  className={`py-2 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'orders'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  My Orders
                </button>
              </nav>
            </div>
          </div>
      
          <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
            <div className="px-4 py-6 sm:px-0">
              {activeTab === 'products' && (
                <>
                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Items in Cart
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                {cartItemCount}
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Fresh Products
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                Available
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white overflow-hidden shadow rounded-lg">
                      <div className="p-5">
                        <div className="flex items-center">
                          <div className="flex-shrink-0">
                            <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                              <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                              </svg>
                            </div>
                          </div>
                          <div className="ml-5 w-0 flex-1">
                            <dl>
                              <dt className="text-sm font-medium text-gray-500 truncate">
                                Local Farmers
                              </dt>
                              <dd className="text-lg font-medium text-gray-900">
                                Direct Trade
                              </dd>
                            </dl>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Browsing */}
                  <ClientOnly>
                    {user && (
                      <ProductBrowsing 
                        consumerId={user.id} 
                        onAddToCart={handleAddToCart}
                      />
                    )}
                  </ClientOnly>
                </>
              )}

              {activeTab === 'events' && (
                <EventsBrowsing userId={user?.id} />
              )}

              {activeTab === 'orders' && (
                <ClientOnly>
                  {user && (
                    <OrdersComponent 
                      userId={user.id} 
                      userRole="CONSUMER"
                    />
                  )}
                </ClientOnly>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
