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
  }, [farmerId]);

  const fetchStats = async () => {
    if (!farmerId) return;
    
    try {
      // Fetch financial data for earnings and orders
      const [financialResponse, productsResponse] = await Promise.all([
        fetch(`/api/farmer/financial-tracking?days=all&farmerId=${farmerId}`),
        fetch(`/api/farmer/products?farmerId=${farmerId}`)
      ]);

      if (financialResponse.ok && productsResponse.ok) {
        const [financialData, productsData] = await Promise.all([
          financialResponse.json(),
          productsResponse.json()
        ]);

        const newStats = {
          productsListed: productsData.products?.length || 0,
          totalOrders: financialData.totalOrders || 0,
          totalEarnings: financialData.totalRevenue || 0
        };

        setStats(newStats);
      }
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
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
