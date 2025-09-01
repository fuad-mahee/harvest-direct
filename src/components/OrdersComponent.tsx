"use client";

import { useState, useEffect } from 'react';
import FarmerRatingComponent from './FarmerRatingComponent';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    unit: string;
    imageUrl?: string;
    farmer?: {
      id: string;
      name: string;
      email: string;
    };
  };
  farmer?: {
    id: string;
    name: string;
    email: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

interface OrdersComponentProps {
  userId?: string;
  farmerId?: string;
  userRole: 'CONSUMER' | 'FARMER';
}

export default function OrdersComponent({ userId, farmerId, userRole }: OrdersComponentProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingOrder, setUpdatingOrder] = useState<string | null>(null);
  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrderForRating, setSelectedOrderForRating] = useState<Order | null>(null);
  const [selectedFarmerForRating, setSelectedFarmerForRating] = useState<{ id: string; name: string } | null>(null);

  useEffect(() => {
    fetchOrders();
  }, [userId, farmerId]);

  const fetchOrders = async () => {
    try {
      const queryParam = userId ? `userId=${userId}` : `farmerId=${farmerId}`;
      const response = await fetch(`/api/orders?${queryParam}`);
      const data = await response.json();
      if (data.success) {
        setOrders(data.orders);
      }
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string) => {
    if (!farmerId) return;

    setUpdatingOrder(orderId);
    try {
      const response = await fetch('/api/orders', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId, status, farmerId })
      });
      const data = await response.json();
      
      if (data.success) {
        setOrders(orders.map(order => 
          order.id === orderId ? { ...order, status } : order
        ));
      } else {
        alert(data.error || 'Failed to update order');
      }
    } catch (error) {
      console.error('Error updating order:', error);
      alert('Failed to update order');
    } finally {
      setUpdatingOrder(null);
    }
  };

  const openRatingModal = (order: Order, farmer: { id: string; name: string }) => {
    setSelectedOrderForRating(order);
    setSelectedFarmerForRating(farmer);
    setShowRatingModal(true);
  };

  const closeRatingModal = () => {
    setShowRatingModal(false);
    setSelectedOrderForRating(null);
    setSelectedFarmerForRating(null);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'CONFIRMED':
        return 'bg-blue-100 text-blue-800';
      case 'SHIPPED':
        return 'bg-purple-100 text-purple-800';
      case 'DELIVERED':
        return 'bg-green-100 text-green-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-6 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-900">
          {userRole === 'FARMER' ? 'Received Orders' : 'My Orders'}
        </h2>
      </div>

      <div className="divide-y divide-gray-200">
        {orders.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p>No orders found</p>
          </div>
        ) : (
          orders.map((order) => (
            <div key={order.id} className="p-6">
              {/* Order Header */}
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    Order #{order.id.slice(-8)}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {formatDate(order.createdAt)}
                  </p>
                  {userRole === 'FARMER' && order.user && (
                    <p className="text-sm text-gray-600 mt-1">
                      Customer: {order.user.name} ({order.user.email})
                    </p>
                  )}
                </div>
                <div className="text-right">
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                  <p className="text-lg font-semibold text-gray-900 mt-1">
                    ${order.total.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* Order Items */}
              <div className="space-y-3 mb-4">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-3 bg-gray-50 rounded-lg p-3">
                    <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center flex-shrink-0">
                      {item.product.imageUrl ? (
                        <img
                          src={item.product.imageUrl}
                          alt={item.product.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <svg className="w-6 h-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-gray-900">
                        {item.product.name}
                      </h4>
                      {userRole === 'CONSUMER' && item.product.farmer && (
                        <p className="text-xs text-gray-500">
                          by {item.product.farmer.name}
                        </p>
                      )}
                      <p className="text-xs text-gray-600">
                        {item.quantity} {item.product.unit} × ${item.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-medium text-gray-900">
                        ${(item.quantity * item.price).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Actions (for farmers) */}
              {userRole === 'FARMER' && order.status !== 'DELIVERED' && order.status !== 'CANCELLED' && (
                <div className="flex space-x-2">
                  {order.status === 'PENDING' && (
                    <>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CONFIRMED')}
                        disabled={updatingOrder === order.id}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 text-sm font-medium transition-colors"
                      >
                        {updatingOrder === order.id ? 'Updating...' : 'Confirm Order'}
                      </button>
                      <button
                        onClick={() => updateOrderStatus(order.id, 'CANCELLED')}
                        disabled={updatingOrder === order.id}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:bg-gray-400 text-sm font-medium transition-colors"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {order.status === 'CONFIRMED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'SHIPPED')}
                      disabled={updatingOrder === order.id}
                      className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:bg-gray-400 text-sm font-medium transition-colors"
                    >
                      {updatingOrder === order.id ? 'Updating...' : 'Mark as Shipped'}
                    </button>
                  )}
                  {order.status === 'SHIPPED' && (
                    <button
                      onClick={() => updateOrderStatus(order.id, 'DELIVERED')}
                      disabled={updatingOrder === order.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 text-sm font-medium transition-colors"
                    >
                      {updatingOrder === order.id ? 'Updating...' : 'Mark as Delivered'}
                    </button>
                  )}
                </div>
              )}

              {/* Consumer Rating Actions */}
              {userRole === 'CONSUMER' && order.status === 'DELIVERED' && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="text-sm font-medium text-green-900 mb-3">Rate Your Experience</h4>
                  <div className="space-y-2">
                    {/* Get unique farmers from order items */}
                    {Array.from(new Set(order.items.map(item => JSON.stringify({ 
                      id: item.product.farmer?.id || item.farmer?.id, 
                      name: item.product.farmer?.name || item.farmer?.name 
                    }))))
                      .map(farmerJson => JSON.parse(farmerJson))
                      .filter(farmer => farmer.id)
                      .map((farmer) => (
                        <button
                          key={farmer.id}
                          onClick={() => openRatingModal(order, farmer)}
                          className="w-full text-left px-4 py-2 bg-white border border-green-300 rounded-lg hover:bg-green-100 transition-colors flex items-center justify-between"
                        >
                          <span className="text-sm text-gray-700">
                            Rate {farmer.name}
                          </span>
                          <div className="flex items-center space-x-1 text-xs text-gray-500">
                            <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span>Rate Farmer</span>
                          </div>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Rating Modal */}
      {showRatingModal && selectedOrderForRating && selectedFarmerForRating && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Rate Your Experience with {selectedFarmerForRating.name}
              </h2>
              <button
                onClick={closeRatingModal}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Modal Body */}
            <div className="overflow-y-auto max-h-[80vh]">
              <FarmerRatingComponent
                farmerId={selectedFarmerForRating.id}
                farmerName={selectedFarmerForRating.name}
                currentUserId={userId}
                isConsumer={true}
                showRatingForm={true}
                orderId={selectedOrderForRating.id}
                onRatingAdded={closeRatingModal}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
