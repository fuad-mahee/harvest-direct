"use client";

import { useState, useEffect } from 'react';

interface DashboardStats {
  productsListed: number;
  totalOrders: number;
  totalEarnings: number;
}

interface DashboardStatsProps {
  farmerId: string;
}

export default function DashboardStats({ farmerId }: DashboardStatsProps) {
  const [stats, setStats] = useState<DashboardStats>({
    productsListed: 0,
    totalOrders: 0,
    totalEarnings: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    
    // Set up interval to refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    
    return () => clearInterval(interval);
  }, [farmerId]);

  const fetchStats = async () => {
    if (!farmerId) return;
    
    try {
      setLoading(true);
      
      // Fetch products and orders data
      const [productsResponse, ordersResponse] = await Promise.all([
        fetch(`/api/farmer/products?farmerId=${farmerId}`),
        fetch(`/api/orders?farmerId=${farmerId}`)
      ]);

      let newStats = {
        productsListed: 0,
        totalOrders: 0,
        totalEarnings: 0
      };

      // Get products count
      if (productsResponse.ok) {
        const productsData = await productsResponse.json();
        newStats.productsListed = productsData.products?.length || 0;
      }

      // Get orders and calculate earnings
      if (ordersResponse.ok) {
        const ordersData = await ordersResponse.json();
        const orders = ordersData.orders || [];
        
        // Count all orders that include farmer's products
        newStats.totalOrders = orders.length;
        
        // Calculate total earnings from all orders (including pending ones)
        let totalEarnings = 0;
        orders.forEach((order: any) => {
          if (order.items) {
            order.items.forEach((item: any) => {
              if (item.farmerId === farmerId) {
                totalEarnings += item.price * item.quantity;
              }
            });
          }
        });
        
        newStats.totalEarnings = totalEarnings;
      }

      setStats(newStats);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      
      // Fallback to financial tracking API if orders API fails
      try {
        const financialResponse = await fetch(`/api/farmer/financial-tracking?days=all&farmerId=${farmerId}`);
        if (financialResponse.ok) {
          const financialData = await financialResponse.json();
          setStats(prev => ({
            ...prev,
            totalOrders: financialData.totalOrders || 0,
            totalEarnings: financialData.totalRevenue || 0
          }));
        }
      } catch (fallbackError) {
        console.error('Fallback financial API also failed:', fallbackError);
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
      {/* Products Listed */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">P</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Products Listed
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : stats.productsListed}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Orders Received */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">O</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Orders Received
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : stats.totalOrders}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>

      {/* Total Earnings */}
      <div className="bg-white overflow-hidden shadow rounded-lg">
        <div className="p-5">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold">$</span>
              </div>
            </div>
            <div className="ml-5 w-0 flex-1">
              <dl>
                <dt className="text-sm font-medium text-gray-500 truncate">
                  Total Earnings
                </dt>
                <dd className="text-lg font-medium text-gray-900">
                  {loading ? '...' : formatCurrency(stats.totalEarnings)}
                </dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
