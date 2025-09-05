"use client";

import { useState, useEffect } from 'react';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  createdAt: string;
  product: {
    id: string;
    name: string;
    unit: string;
    category: string;
  };
}

interface Order {
  id: string;
  total: number;
  status: string;
  createdAt: string;
  items: OrderItem[];
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface FinancialData {
  totalRevenue: number;
  totalOrders: number;
  averageOrderValue: number;
  revenueGrowth: number;
  topProducts: Array<{
    productName: string;
    revenue: number;
    quantity: number;
  }>;
  monthlyRevenue: Array<{
    month: string;
    revenue: number;
    orders: number;
  }>;
  orders: Order[];
}

interface FinancialTrackingProps {
  farmerId: string;
}

export default function FinancialTrackingComponent({ farmerId }: FinancialTrackingProps) {
  const [financialData, setFinancialData] = useState<FinancialData | null>(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30');
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (farmerId) {
      fetchFinancialData();
    }
  }, [dateRange, farmerId]);

  const fetchFinancialData = async () => {
    if (!farmerId) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/farmer/financial-tracking?days=${dateRange}&farmerId=${farmerId}`);
      if (response.ok) {
        const data = await response.json();
        setFinancialData(data);
      }
    } catch (error) {
      console.error('Error fetching financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const exportFinancialReport = async () => {
    if (!farmerId) return;
    
    try {
      const response = await fetch(`/api/farmer/financial-tracking/export?days=${dateRange}&farmerId=${farmerId}`);
      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `financial-report-${dateRange}days.csv`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
      }
    } catch (error) {
      console.error('Error exporting report:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    );
  }

  if (!financialData) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No financial data available</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
        <h2 className="text-2xl font-bold text-gray-900">Financial Tracking & Reports</h2>
        <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 text-gray-800"
          >
            <option value="all" className="text-gray-800">All Time</option>
            <option value="7" className="text-gray-800">Last 7 Days</option>
            <option value="30" className="text-gray-800">Last 30 Days</option>
            <option value="90" className="text-gray-800">Last 3 Months</option>
            <option value="365" className="text-gray-800">Last Year</option>
          </select>
          <button
            onClick={exportFinancialReport}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            Export Report
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'products', label: 'Product Performance' },
            { id: 'orders', label: 'Recent Orders' },
            { id: 'trends', label: 'Trends' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === tab.id
                  ? 'border-green-500 text-green-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialData.totalRevenue)}
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                  </svg>
                </div>
              </div>
              <div className="mt-4">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                  financialData.revenueGrowth >= 0 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {financialData.revenueGrowth >= 0 ? '+' : ''}{financialData.revenueGrowth.toFixed(1)}%
                </span>
                <span className="text-sm text-gray-500 ml-2">vs previous period</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Orders</p>
                  <p className="text-2xl font-bold text-gray-900">{financialData.totalOrders}</p>
                </div>
                <div className="p-3 bg-blue-100 rounded-full">
                  <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {formatCurrency(financialData.averageOrderValue)}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-full">
                  <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Top Product</p>
                  <p className="text-lg font-bold text-gray-900 truncate">
                    {financialData.topProducts[0]?.productName || 'N/A'}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Monthly Revenue Chart */}
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Trends</h3>
            <div className="space-y-4">
              {financialData.monthlyRevenue.map((month, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-800">{month.month}</span>
                      <span className="text-sm text-gray-700">{formatCurrency(month.revenue)}</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{
                          width: `${(month.revenue / Math.max(...financialData.monthlyRevenue.map(m => m.revenue))) * 100}%`
                        }}
                      ></div>
                    </div>
                    <div className="text-xs text-gray-700 mt-1">{month.orders} orders</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Product Performance Tab */}
      {activeTab === 'products' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Performing Products</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Product Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Revenue
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Quantity Sold
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Avg Price
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.topProducts.map((product, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.productName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.revenue)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {product.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatCurrency(product.revenue / product.quantity)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Orders Tab */}
      {activeTab === 'orders' && (
        <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Orders</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {financialData.orders.slice(0, 10).map((order) => (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      #{order.id.slice(-8)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {order.user.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        order.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : order.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatCurrency(order.total)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Trends Tab */}
      {activeTab === 'trends' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenue Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Peak Sales Month:</span>
                <span className="text-sm font-medium text-gray-900">
                  {financialData.monthlyRevenue.reduce((max, month) => 
                    month.revenue > max.revenue ? month : max, financialData.monthlyRevenue[0]
                  )?.month || 'N/A'}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total Revenue Growth:</span>
                <span className={`text-sm font-medium ${
                  financialData.revenueGrowth >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  {financialData.revenueGrowth >= 0 ? '+' : ''}{financialData.revenueGrowth.toFixed(1)}%
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Best Performing Product:</span>
                <span className="text-sm font-medium text-gray-900">
                  {financialData.topProducts[0]?.productName || 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Sales Insights</h3>
            <div className="space-y-3">
              <div className="p-4 bg-blue-50 rounded-lg">
                <p className="text-sm text-blue-800">
                  Your average order value is {formatCurrency(financialData.averageOrderValue)}. 
                  Consider bundling products to increase this metric.
                </p>
              </div>
              {financialData.revenueGrowth > 0 && (
                <div className="p-4 bg-green-50 rounded-lg">
                  <p className="text-sm text-green-800">
                    Great job! Your revenue has grown by {financialData.revenueGrowth.toFixed(1)}% 
                    compared to the previous period.
                  </p>
                </div>
              )}
              {financialData.topProducts.length > 0 && (
                <div className="p-4 bg-yellow-50 rounded-lg">
                  <p className="text-sm text-yellow-800">
                    "{financialData.topProducts[0].productName}" is your top seller with 
                    {formatCurrency(financialData.topProducts[0].revenue)} in revenue.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
