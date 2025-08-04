"use client";

import { useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface PendingUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
  createdAt: string;
}

interface PendingProduct {
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

export default function AdminDashboard() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [pendingProducts, setPendingProducts] = useState<PendingProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('currentUser');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
    } else {
      // If no user data in localStorage, redirect to login
      window.location.href = '/login';
    }
    
    fetchPendingUsers();
    fetchPendingProducts();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
  };

  async function fetchPendingUsers() {
    try {
      const response = await fetch('/api/admin/users');
      const data = await response.json();
      if (data.success) {
        setPendingUsers(data.users);
      }
    } catch (error) {
      console.error('Error fetching pending users:', error);
    } finally {
      setLoading(false);
    }
  }

  async function fetchPendingProducts() {
    try {
      const response = await fetch('/api/admin/products');
      const data = await response.json();
      if (data.success) {
        setPendingProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching pending products:', error);
    }
  }

  async function updateProductStatus(productId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      const response = await fetch('/api/admin/products', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId, status })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`Product ${status.toLowerCase()} successfully`);
        // Remove the product from pending list
        setPendingProducts(prev => prev.filter(product => product.id !== productId));
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to update product status');
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      console.error('Error updating product status:', error);
      setMessage('An error occurred. Please try again.');
      setTimeout(() => setMessage(''), 3000);
    }
  }

  async function updateUserStatus(userId: string, status: 'APPROVED' | 'REJECTED') {
    try {
      const response = await fetch('/api/admin/users', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, status })
      });

      const data = await response.json();
      if (data.success) {
        setMessage(`User ${status.toLowerCase()} successfully`);
        // Remove the user from pending list
        setPendingUsers(prev => prev.filter(user => user.id !== userId));
        // Clear message after 3 seconds
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage(data.error || 'Failed to update user status');
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setMessage('An error occurred');
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-500">
                Welcome, {user?.name || 'Admin'}
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
          
          {/* Account Approval Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Account Approval</h2>
              <p className="text-sm text-gray-600">Manage pending user registrations</p>
            </div>
            
            <div className="p-6">
              {message && (
                <div className={`mb-4 p-3 rounded ${message.includes('success') ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {message}
                </div>
              )}
              
              {loading ? (
                <div className="text-center py-4">Loading pending users...</div>
              ) : pendingUsers.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending user registrations
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Name
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Email
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Role
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Registered
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {pendingUsers.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {user.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {user.email}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              user.role === 'FARMER' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {user.role}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(user.createdAt).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                            <button
                              onClick={() => updateUserStatus(user.id, 'APPROVED')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateUserStatus(user.id, 'REJECTED')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                            >
                              Reject
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Product Listing Approval Section */}
          <div className="bg-white shadow rounded-lg mb-6">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">Product Listing Approval</h2>
              <p className="text-sm text-gray-600">Review and approve farmer product listings</p>
            </div>
            
            <div className="p-6">
              {pendingProducts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  No pending product listings
                </div>
              ) : (
                <div className="grid gap-6">
                  {pendingProducts.map((product) => (
                    <div key={product.id} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                        {product.imageUrl && (
                          <img 
                            src={product.imageUrl} 
                            alt={product.name}
                            className="w-full lg:w-32 h-32 object-cover rounded-md"
                          />
                        )}
                        
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-medium text-gray-900">{product.name}</h3>
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                              PENDING
                            </span>
                          </div>
                          
                          <div className="text-sm text-gray-600 mb-3">
                            <p><span className="font-medium">Farmer:</span> {product.farmer.name} ({product.farmer.email})</p>
                            <p><span className="font-medium">Category:</span> {product.category}</p>
                            <p><span className="font-medium">Price:</span> ${product.price}/{product.unit}</p>
                            <p><span className="font-medium">Quantity:</span> {product.quantity} {product.unit}</p>
                            <p><span className="font-medium">Submitted:</span> {new Date(product.createdAt).toLocaleDateString()}</p>
                          </div>
                          
                          {product.description && (
                            <p className="text-sm text-gray-700 mb-3">{product.description}</p>
                          )}
                          
                          <div className="flex space-x-2">
                            <button
                              onClick={() => updateProductStatus(product.id, 'APPROVED')}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => updateProductStatus(product.id, 'REJECTED')}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm font-medium"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Placeholder for other admin features */}
          <div className="border-4 border-dashed border-gray-200 rounded-lg h-64 flex items-center justify-center">
            <div className="text-center">
              <h2 className="text-xl font-semibold text-gray-600 mb-2">Additional Admin Features</h2>
              <p className="text-gray-500">Other admin functionality will be added here</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
