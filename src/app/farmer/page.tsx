"use client";

import { useState, useEffect } from 'react';
import ProductListing from '@/components/ProductListing';
import FarmerProfile from '@/components/FarmerProfile';
import OrdersComponent from '@/components/OrdersComponent';
import NotificationsComponent from '@/components/NotificationsComponent';
import EducationalResourcesFarmer from '@/components/EducationalResourcesFarmer';
import FinancialTrackingComponent from '@/components/FinancialTrackingComponent';
import DashboardStats from '@/components/DashboardStats';
import ClientOnly from '@/components/ClientOnly';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export default function FarmerDashboard() {
  const [farmerId, setFarmerId] = useState<string>('');
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState<'products' | 'profile' | 'orders' | 'financial' | 'resources'>('products');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    
    // Get user data from localStorage only after component mounts
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('currentUser');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFarmerId(parsedUser.id);
        setLoading(false);
      } else {
        // If no user data in localStorage, redirect to login
        window.location.href = '/login';
      }
    }
  }, []);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('currentUser');
      window.location.href = '/login';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {!mounted || loading ? (
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-lg">Loading...</div>
        </div>
      ) : (
        <>
          <div className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center py-6">
                <h1 className="text-3xl font-bold text-gray-900">Farmer Dashboard</h1>
                <div className="flex items-center space-x-4">
                  {/* Notifications */}
                  <ClientOnly>
                    {user && <NotificationsComponent userId={user.id} />}
                  </ClientOnly>
                  
                  <div className="text-sm text-gray-500">
                    Welcome, {user?.name || 'Farmer'}
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
      
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="flex gap-6">
            {/* Left Submenu */}
            <aside className="hidden md:block w-64 flex-shrink-0">
              <nav className="bg-white shadow rounded-lg p-4 sticky top-24">
                <h2 className="text-sm font-semibold text-gray-700 mb-3">Menu</h2>
                <ul className="space-y-1">
                  <li>
                    <button
                      onClick={() => setActiveSection('products')}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                        activeSection === 'products'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Product Listings
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('orders')}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                        activeSection === 'orders'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Orders Received
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('financial')}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                        activeSection === 'financial'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Financial Tracking
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('profile')}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                        activeSection === 'profile'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Profile & Certification
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveSection('resources')}
                      className={`w-full text-left flex items-center px-3 py-2 rounded-md font-medium transition-colors ${
                        activeSection === 'resources'
                          ? 'bg-green-50 text-green-700'
                          : 'text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      Educational Resources
                    </button>
                  </li>
                </ul>
              </nav>
            </aside>

            {/* Main Content */}
            <main className="flex-1">
              {/* Quick Stats */}
              <DashboardStats farmerId={farmerId} />

              {/* Product Listing Section */}
              {activeSection === 'products' && (
                <section id="product-listings">
                  <ProductListing farmerId={farmerId} />
                </section>
              )}

              {/* Orders Section */}
              {activeSection === 'orders' && (
                <section id="orders">
                  <OrdersComponent 
                    farmerId={farmerId} 
                    userRole="FARMER"
                  />
                </section>
              )}

              {/* Financial Tracking Section */}
              {activeSection === 'financial' && (
                <section id="financial-tracking">
                  <FinancialTrackingComponent farmerId={farmerId} />
                </section>
              )}

              {/* Profile & Certification Section */}
              {activeSection === 'profile' && (
                <section id="farmer-profile">
                  <FarmerProfile farmerId={farmerId} />
                </section>
              )}

              {/* Educational Resources Section */}
              {activeSection === 'resources' && (
                <section id="educational-resources">
                  <EducationalResourcesFarmer />
                </section>
              )}
            </main>
          </div>
        </div>
      </div>
        </>
      )}
    </div>
  );
}
